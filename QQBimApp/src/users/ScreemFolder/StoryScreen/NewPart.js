import React from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, AsyncStorage, ToastAndroid, StatusBar} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Dropdown } from 'react-native-material-dropdown-v2';
import { useFocusEffect } from '@react-navigation/native';
 
function NewPart(props) {
    const [title, setTitle] = React.useState('');
    const [chapterContent, setChapterContent] = React.useState('');
    const [storyStatus, setStoryStatus] = React.useState('On Writing');
    const [newPart, setNewPart] = React.useState([]);
    const [dataUser, setDataUser ]= React.useState([]);

    let data = [{
        value: 'On Writing',
        }, {
        value: 'Drop',
      }, {
        value: 'Full',
    }];
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

      useFocusEffect(
        React.useCallback(() => {
        props.navigation.dangerouslyGetParent().setOptions({
          tabBarVisible: false
        });
        getData();
        fetch('http://192.168.0.101:19000/get_story/' + props.route.params.item.story_id)
        .then ((response) => response.json())
        .then ( (res) => { 
            const newPart = res[0].parts + 1;
            setNewPart(newPart);
            setChapterContent('');
            setTitle('');
        })
        .catch ((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false) 
        });
        return () => {
          props.navigation.dangerouslyGetParent().setOptions({
            tabBarVisible: true
        })}
      },[]));

    const addNewNotification = () => {
        fetch('http://192.168.0.101:19000/newNotification', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'user_id': dataUser.user_id,
                'content': 'Add new chapter of '+ props.route.params.item.story_title,
            })
        })
        .then ((response) => response.json())
        .then ( (res) => { 
            console.log('susses');
        })
        .catch ((error) => {
            console.log(error);
        })
    }

    const upload_chapter = () => {
        
        if(title.length == 0 || chapterContent.length == 0){
            alert('Title and content must have content.');
        } else {
           
            fetch('http://192.168.0.101:19000/upload_chapter', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'story_id': props.route.params.item.story_id,
                    'chapter_name': title,
                    'chapter_content': chapterContent,
                    'story_status': storyStatus,
                    'parts': newPart
                })
            })
            .then ((response) => response.json())
            .then ( (res) => { 
                ToastAndroid.show("Upload sucessfull!", ToastAndroid.SHORT);
                setTitle('');
                setChapterContent('');
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
                <Text style={{  fontSize: 16, fontWeight: 'bold'}}>Chapter title:</Text>
                <TextInput
                    style={{ height: 40, backgroundColor: 'white' }}
                    value={title}
                    placeholder="Enter your chapter's title"
                    onChangeText={text => setTitle(text)}
                />
                <Text style={{ marginTop: 10, fontSize: 16, fontWeight: 'bold'}}>Content of chapter:</Text>  
                <View scrollEnabled  style={{ marginTop: 10, backgroundColor: 'white'}} >
                    <TextInput 
                        multiline 
                        placeholder="Chapter's content of your story" 
                        textAlignVertical={'top'}
                        numberOfLines={20} 
                        value={chapterContent}
                        scrollEnabled={true} 
                        onChangeText={text => setChapterContent(text)} 
                    />
                </View>
                <Dropdown
                    label='Please slect status of story'
                    data = {data}
                    onChangeText={(value)=>{setStoryStatus(value)}}   
                    value = {data[0].value}
                />
                <TouchableOpacity style={styles.upload} onPress={()=> {upload_chapter();}}><Text style={{textAlign: 'center', color: 'white'}}>Upload your chapter</Text></TouchableOpacity>
            </View>
        </ScrollView>
    )
} export {NewPart};
 
var styles = StyleSheet.create({
    main: {
        paddingLeft: 30,
        paddingRight: 30,
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
});
