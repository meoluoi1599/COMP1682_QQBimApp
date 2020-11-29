import React from 'react';
import { StyleSheet, Dimensions, View, TextInput, Text, TouchableOpacity, FlatList, Image, AsyncStorage} from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import {SplashScreen} from '../OtherScreen';
import { useFocusEffect } from '@react-navigation/native';

function ChatScreen(props) {
    const [chatMessage, setChatMessage] = React.useState([]);
    const [contentMassage, setContentMassage] = React.useState('');
    const [isLoading, setLoading] = React.useState(true);
    const [dataUser, setDataUser] = React.useState([]);
    const [send, setSend] = React.useState(true);

    useFocusEffect(
      React.useCallback(() => {
      props.navigation.dangerouslyGetParent().setOptions({
        tabBarVisible: false
      });
      getData();
      return () => {
        props.navigation.dangerouslyGetParent().setOptions({
          tabBarVisible: true
      })}
    },[]));
    const getData = async () => {
      try {
        AsyncStorage.getItem('user').then((value) => {
          const jsonValue = JSON.parse(value);
          setDataUser(jsonValue);
          getMessage(jsonValue.user_id);
        })
      } catch(e) {
        console.log(e)
      }
    }

    const getMessage=(user_id)=> {
      fetch('http://192.168.0.101:19000/get_messages/' + user_id +'/'+ props.route.params.item.a)
      .then ((response) => response.json())
      .then ( (res) => { 
        setChatMessage(res);
      })
      .catch ((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false) 
      });
    }

    function submitChatMessage() {
      fetch('http://192.168.0.101:19000/send_message', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'sender_id': dataUser.user_id,
            'messages_content': contentMassage,
            'receiver_id' : props.route.params.item.a
        })
    })
    .then ((response) => response.json())
    .then ( (res) => { 
        getMessage(dataUser.user_id);
        setContentMassage('');
    })
    .catch ((error) => {
        console.log(error);
    })
    }

    function onChangeValue(text) {
      setContentMassage(text);
      if (text.length > 0) {
        setSend(false);
      } else {
        setSend(true);
      }
    }
    return (
      <View style={styles.container}>
        <View style={{flex: 1}}>
          {isLoading? <SplashScreen/>:(
            <FlatList
              data={chatMessage}
              keyExtractor= {item => item.message_id.toString()}
              renderItem={({ item }) => (
                <View style={{flex: 1, flexDirection: 'column'}}>
                  {item.sender_id != dataUser.user_id ? (
                    <View style={{flex: 1, flexDirection: 'row', marginTop: 10, marginRight: '20%', marginLeft: 10}}>
                      <Image
                         style={styles.img}
                         source= {{uri: item.user_avatar}}
                       />
                     <View style={[styles.chatmessage, {backgroundColor: 'white', marginLeft: 10}]}>
                       <Text style={styles.textName}>{item.massage_content}</Text>
                     </View>
                   </View>
                  ): (
                    <View style={{flex: 1, flexDirection: 'row', marginTop: 10, marginLeft: '20%'}}>
                      <View style={[styles.chatmessage, {backgroundColor: 'lightblue', marginRight: 10}]}>
                        <Text style={styles.textName}>{item.massage_content}</Text>
                      </View>
                      <Image
                          style={styles.img}
                          source= {{uri: dataUser.user_avatar}}
                        />
                    </View>
                  )}
                </View>
              )}  
              showsHorizontalScrollIndicator={false}
              ListEmptyComponent={ListEmpty}
            /> 
          )}
        </View>
        <View style={styles.chatInput}>
          <TextInput
            style={{ height: 40, margin: 5, backgroundColor: '#f2f2f2', width: '80%'}}
            autoCorrect={false}
            placeholder= 'Enter message....'
            value={contentMassage}
            onSubmitEditing={() => submitChatMessage()}
            onChangeText={text =>  onChangeValue(text)}
          />
          <TouchableOpacity disabled = {send} onPress={()=> submitChatMessage()}>
            <Ionicons name="md-send" size={45} color="#aa4fff" style={{ marginLeft: 10, marginRight: 10}} />
          </TouchableOpacity>
        </View>
      </View>
    )   

    function ListEmpty() {
      return(
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>Send message to start communication!!!</Text>
        </View>
      )
    }
} export {ChatScreen};
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        marginTop: 10,
        borderColor: '#8a2be2',
    },
    chatmessage: {
      width: '80%',
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      padding: 10,
      borderRadius: 20
    },
    img: {
      width: 40, 
      height: 40, 
      borderRadius: 50
    },
    textName: {
      fontSize: 18, 
      marginLeft: 10
    },
    chatInput: {
      justifyContent: 'flex-end', 
      alignItems: 'flex-end', 
      backgroundColor: 'white', 
      width: '100%', 
      height: 50, 
      flexDirection: 'row', 
      paddingRight: 5
    }
});