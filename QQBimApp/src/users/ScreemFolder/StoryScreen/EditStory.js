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
    ToastAndroid,
    Dimensions
} from 'react-native';
import { Dropdown } from 'react-native-material-dropdown-v2';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';

function EditStory (props){
    const [title, setTitle] = React.useState('');
    const [description, setDescription] = React.useState('');
    const [image, setImage] = useState(null);
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
    formdata.append("story_id", props.route.params.item.author_id)
    formdata.append("category_id", category)
    
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
              'user_id': props.route.params.item.author_id,
              'content': 'Update story: '+ title,
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
        setTitle(props.route.params.item.story_title);
        setCategory(props.route.params.item.category_id);
        setDescription(props.route.params.item.story_description);
        setImage(props.route.params.item.story_img);
        props.navigation.dangerouslyGetParent().setOptions({
            tabBarVisible: false
          });
        return () => {
          props.navigation.dangerouslyGetParent().setOptions({
            tabBarVisible: true
          });
        };
      }, [])
    );

    const update_story = () => {
      if (title.length == 0 || description.length == 0) {
        alert('Title and description is not empty');
      }else{
        formdata.append("file", {name: 'quyendog.jpg' ,uri: image, type:'image/jpeg'})

        fetch('http://192.168.0.101:19000/edit_story' , {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata
      })
      .then ((response) => response.json())
      .then ( (res) => { 
        ToastAndroid.show("Upload sucessfull!", ToastAndroid.SHORT);
        setTitle('');
        setCategory('');
        setDescription('');
        setImage('');
        props.navigation.goBack()
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
            <TouchableOpacity style={{alignItems: "center"}}  onPress={pickImage}>
                <View 
                  style={{
                    width: Dimensions.get('window').width,
                    marginTop: 10, 
                    justifyContent: "center", 
                    alignItems: 'center',
                    height: 280}}>
                  {image && <Image source={{ uri: image }} style={{  width: '80%', height: 280 }} />}
                </View>
            </TouchableOpacity>
            
            <Text style={{  fontSize: 16, fontWeight: 'bold'}}>Story title:</Text>
            <TextInput
              textAlignVertical={'top'}
              value={title}
              maxLength = {200}
              style={{ height: 40, backgroundColor: 'white' }}
              onChangeText={text => setTitle(text)}
            />
            <Dropdown
                label='Please slect type of story'
                data = {data}
                onChangeText={(value, index, data)=>{setCategory(data[index].id)}}   
              />
            <Text style={{ marginTop: 10, fontSize: 16, fontWeight: 'bold'}}>Story description:</Text>  
            <View  style={{ marginTop: 10, backgroundColor: 'white'}} >
                <TextInput 
                  textAlignVertical={'top'}
                  multiline 
                  value={description}
                  numberOfLines={20}
                  scrollEnabled={true} 
                  onChangeText={text => setDescription(text)} 
                />
            </View>
            
            <TouchableOpacity style={styles.upload} onPress={()=> {update_story();}}>
              <Text style={{textAlign: 'center', color: 'white'}}>Update your story</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
    );
}
export {EditStory};


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


