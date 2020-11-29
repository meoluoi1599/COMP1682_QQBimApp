import * as React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, AsyncStorage, ToastAndroid, StatusBar} from 'react-native';

function ReportStoryScreen (props) {
    const [title, setTitle] = React.useState('');
    const [reportContent, setReportContent] = React.useState('');
    const [dataUser, setDataUser ]= React.useState([]);
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
    React.useEffect(() => {
        getData();
    }, []);

    const upload_report = () => {
        
        if(title.length == 0 || reportContent.length == 0){
            alert('Title and content is not empty');
        } else {
            fetch('http://192.168.0.101:19000/report_story', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    'story_id': props.route.params.item.story_id,
                    'report_title': title,
                    'report_content': reportContent,
                    'reporter': dataUser.user_id
                })
            })
            .then ((response) => response.json())
            .then ( (res) => { 
                showToast();
                setTitle('');
                setReportContent('');
                addNewNotification();
            })
            .catch ((error) => {
                console.log(error);
            })
        }
    }
    const showToast = () => {
        ToastAndroid.show("Successfull!", ToastAndroid.SHORT);
    };
    return (
        <ScrollView>
        <StatusBar hidden/>
        <View style={styles.main}>
            <Text style={{  fontSize: 16, fontWeight: 'bold'}}>Report title:</Text>
            <TextInput
                style={{ height: 40, backgroundColor: 'white' }}
                placeholder="Enter your report's title"
                value={title}
                onChangeText={text => setTitle(text)}
            />
            <Text style={{ marginTop: 10, fontSize: 16, fontWeight: 'bold'}}>Content of report:</Text>  
            <View scrollEnabled  style={{ marginTop: 10, backgroundColor: 'white'}} >
                <TextInput 
                    multiline 
                    placeholder="Write the reason of your report" 
                    textAlignVertical={'top'}
                    numberOfLines={20} 
                    scrollEnabled={true}
                    value = {reportContent} 
                    onChangeText={text => setReportContent(text)} 
                />
            </View>
            <TouchableOpacity style={styles.upload} onPress={()=> {upload_report();}}><Text style={{textAlign: 'center', color: 'white'}}>Upload your report</Text></TouchableOpacity>
        </View>
    </ScrollView>
    );
}
export {ReportStoryScreen};

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