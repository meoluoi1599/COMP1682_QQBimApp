import React, { useState, useEffect } from 'react';
import {
    View, 
    StyleSheet, 
    Text, StatusBar,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
    Platform,
    Image,
    AsyncStorage,
    Dimensions
} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown-v2';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';

function NewStory (props){
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [image, setImage] = useState(null);
    const [dataUser, setDataUser ] = React.useState([]);
    const [category, setCategory] = React.useState(1);

    let data = [
      {id: 1, value:	'Adventure'},
      {id: 2, value:	'LGBTQ+'},
      {id: 3, value:	'Humor'},
      {id: 4, value:	'Mystery'},
      {id: 5, value:	'Romance'},
      {id: 6, value:  'Short Story'},
      {id: 7, value:	'Teen Fiction'},
      {id: 8, value:	'New Adult'},
      {id: 9, value:	'Urban'},
      {id: 10, value:	'Historical Fiction'},
      {id: 11, value:	'Horror'},
      {id: 12, value:	'Poetry'}
    ];

    let formdata = new FormData();

    formdata.append("title_story", title)
    formdata.append("story_description", description)
    formdata.append("user_id", dataUser.user_id)
    formdata.append("category_id", category)
    
    const getData = async () => {
      try {
        AsyncStorage.getItem('user').then((value) => {
          const jsonValue = JSON.parse(value);
          setDataUser(jsonValue);
        })
      } catch(e) {
        console.log(e)
      }
    }
    const pickImage = async () => {
      (async () => {
        if (Platform.OS !== 'web') {
          const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          } else {
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All,
              allowsEditing: true,
              aspect: [4, 6],
              quality: 1,
            });
        
            console.log(result);
        
            if (!result.cancelled) {
              formdata.append("file", {name: 'quyendog.jpg' ,uri: result.uri, type:'image/jpeg'})
              setImage(result.uri);
            }
          }
        }
      })();   
    };
    
    const addNewNotification = () => {
      fetch('http://192.168.0.101:19000/newNotification', {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              'user_id': dataUser.user_id,
              'content': 'Add new story: '+ title,
          })
      })
      .then ((response) => response.json())
      .then ( (res) => { 
          console.log('susses')
      })
      .catch ((error) => {
          console.log(error);
      })
    }

    useFocusEffect(
      React.useCallback(() => {
        getData();
        return () => {
          props.navigation.dangerouslyGetParent().setOptions({
            tabBarVisible: true
          });
        };
      }, [])
    );

    const upload_story = () => {
      if (title.length == 0 || description.length == 0) {
        alert('Title and description is not empty.');
      }else{
        formdata.append("file", {name: 'quyendog.jpg' ,uri: image, type:'image/jpeg'})

        fetch('http://192.168.0.101:19000/create_story' , {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata
      })
      .then ((response) => response.json())
      .then ( (res) => { 
        Alert.alert(
          "Your story created",
          "Do you want to access your story list to create new chapter",
          [
            {
              text: "Cancel",
              onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { text: "OK", onPress: () => props.navigation.navigate('YourStory') }
          ],
          { cancelable: false }
        ); 
        addNewNotification();
      })
      .catch ((error) => {
        console.log(error);
      })
      }
    }

    return (               
        <ScrollView> 
          <StatusBar hidden/>
          <View style={styles.main}>
            <Text style={{  fontSize: 16, fontWeight: 'bold'}}>Select story image:</Text>
            <TouchableOpacity style={{alignItems: "center"}}  onPress={pickImage}>
              <View style={{
                  backgroundColor: 'white', 
                  width: '100%',
                  marginTop: 10, 
                  height: 200,
                  alignItems: "center",
                  justifyContent: 'center',
                  opacity: 0.5,
                  borderWidth: 1,
                  borderColor: 'grey'
              }}>
                {image && <Image source={{ uri: image }} style={{  width: '100%', height: '100%' }} />}
              </View>
            </TouchableOpacity>
            
            <Text style={{  fontSize: 16, fontWeight: 'bold'}}>Story title:</Text>
            <TextInput
              textAlignVertical={'top'}
              placeholder="Title of your story" 
              maxLength = {200}
              style={{ height: 40, backgroundColor: 'white' }}
              onChangeText={text => setTitle(text)}
            />
            <Dropdown
                label='Please slect type of story'
                data = {data}
                onChangeText={(value, index, data)=>{setCategory(data[index].id)}}   
                value = {data[0].value}
              />
            <Text style={{ marginTop: 10, fontSize: 16, fontWeight: 'bold'}}>Story description:</Text>  
            <View  style={{ marginTop: 10, backgroundColor: 'white'}} >
                <TextInput 
                  textAlignVertical={'top'}
                  multiline 
                  placeholder="Description for your story" 
                  numberOfLines={20}
                  scrollEnabled={true} 
                  onChangeText={text => setDescription(text)} 
                />
            </View>
            
            <TouchableOpacity style={styles.upload} onPress={()=> {upload_story();}}><Text style={{textAlign: 'center', color: 'white'}}>Upload your story</Text></TouchableOpacity>
          </View>
        </ScrollView>
    );
}
export {NewStory};


var styles = StyleSheet.create({
    main: {
        flex: 1,
        marginRight: 30,
        marginLeft: 30,
        paddingBottom: 1,
        alignItems: 'stretch',
    },
    upload:{
        marginTop: 20,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor:'#aa4fff',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#fff'
    },
    imgEmptyStory: {
      marginTop: 5,
      width: Dimensions.get('window').width, 
      height: 100, 
      backgroundColor: 'red',
    }
});


