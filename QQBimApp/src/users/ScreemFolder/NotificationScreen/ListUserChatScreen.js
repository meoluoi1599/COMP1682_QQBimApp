import * as React from 'react';
import { View, Text, Image,TouchableOpacity, StyleSheet, AsyncStorage, FlatList, StatusBar } from 'react-native';
import {SplashScreen} from '../OtherScreen';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 

function ListUserChatScreen(props) {
  const [chatList, setChatList] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  const getData = async () => {
    try {
      AsyncStorage.getItem('user').then((value) => {
        const jsonValue = JSON.parse(value);
        getChatList(jsonValue);
      })
    } catch(e) {
      console.log(e)
    }
  }

  const getChatList = (jsonValue) => {
    fetch('http://192.168.0.101:19000/get_chat_list/' + jsonValue.user_id)
    .then ((response) => response.json())
    .then ( (res) => { 
      console.log(res)
      setChatList(res);
    })
    .catch ((error) => {
      console.log(error);
    })
    .finally(() => {
      setLoading(false); 
    });
  }

    return (
      <View 
       style={{flex: 1}}>
         <StatusBar hidden/>
          {isLoading? <SplashScreen/>:(
          <FlatList
            data={chatList}
            keyExtractor= {item => item.a.toString()}
            renderItem={({ item }) => (
              <View  style={ styles.container}>
                <TouchableOpacity style={{flexDirection: 'row', margin: 10,}} onPress={() =>props.navigation.navigate('Comunication', {item: item})}>
                  <Image
                    style={styles.img}
                    source= {{uri: item.user_avatar}}
                  />
                  <Text style={styles.textName}>{item.fullname}</Text>
                </TouchableOpacity>
              </View>
            )}  
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={ListEmpty}
          /> 
        )}
        <View style={{flex:1}}>
        <TouchableOpacity onPress={()=> props.navigation.navigate('SearchUser')}
          style={styles.search}>
          <Ionicons name="md-search" size={30} color="white" />
        </TouchableOpacity>
      </View>
      </View>
    );

    function ListEmpty() {
      return(
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>You don't communicate with anyone!!</Text>
        </View>
      )
    }

    
}
export {ListUserChatScreen};

var styles = StyleSheet.create({
  container: {
    margin: 5,
    backgroundColor: 'white',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  img: {
    width: 50, 
    height: 50, 
    borderRadius: 50
  },
  textName: {
    fontSize: 18, 
    fontWeight: 'bold', 
    marginLeft: 20
  },
  search: {
    position:'absolute',
    bottom: 20,
    right: 20, 
    alignSelf:'flex-end',  
    borderRadius: 50,
    width: 50,
    height: 50, 
    backgroundColor: '#9370db',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
})