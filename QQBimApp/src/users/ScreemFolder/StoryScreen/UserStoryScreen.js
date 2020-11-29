import * as React from 'react';
import { FlatList, View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, Modal, Alert, AsyncStorage, StatusBar, ToastAndroid} from 'react-native';
import {SplashScreen} from '../OtherScreen';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 
import { useFocusEffect } from '@react-navigation/native';

function UserStoryScreen(props) {
  const [dataSource, setDataSource] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [story, setStory] = React.useState([]);
  const [userData, setUserData] = React.useState([]);
  const getData = async () => {
    try {
      AsyncStorage.getItem('user').then((value) => {
        const jsonValue = JSON.parse(value);
        getUserStory(jsonValue);
        setUserData(jsonValue);
      })
    } catch(e) {
      console.log(e)
    }
  }
  const getUserStory =(jsonValue)=> {
    fetch('http://192.168.0.101:19000/book_author/' + jsonValue.user_id)
    .then ((response) => response.json())
    .then ( (res) => { 
      setDataSource(res);
    })
    .catch ((error) => {
      console.log(error);
    })
    .finally(() => {
      setLoading(false) 
    });
  }
  useFocusEffect(
    React.useCallback(() => {
      getData();
      
      return () => {
        console.log('un')
      };
    }, [])
  );
  
  function ListEmpty() {
    return (
      //View to show when list is empty
      <View style={style.MainContainer}>  
          <View>
            <Text style={{fontSize: 20, color: 'black', marginTop: 20, marginBottom: 20}}>You don't have any story</Text>
          </View>
          <TouchableOpacity onPress={()=> props.navigation.navigate('NewStory')}>
          <View style={style.newStory}>
            <Text style={style.newStoryText}>Create new story</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  
  function deleteStory() {
    Alert.alert(
      "Do you want to delete your story?",
      "If you choose OK, your story will delete forever.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          fetch('http://192.168.0.101:19000/delete_story/' + story.story_id)
          .then ((response) => response.json())
          .then ( (res) => { 
            ToastAndroid.show("Delete Successful!", ToastAndroid.SHORT);
            getUserStory(userData);
          })
          .catch ((error) => {
            console.log(error);
          })
          .finally(() => {
            setLoading(false);
            setModalVisible(false);
            
          });
        } }
      ],
      { cancelable: false }
    ); 
  };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <StatusBar hidden/>
      {isLoading ? <SplashScreen/> : (
        <View>   
          <FlatList
            data={dataSource}
            keyExtractor= {item => item.story_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() =>props.navigation.navigate('DetailStory', {item: item})}>         
                <View style={style.container}>
                  <View style={{flex: 1}}>
                    <Image style={{width: 100, height: 120}}
                      source={{uri: item.story_img}} 
                    />
                  </View>
                  <View style={{flex: 2}}>
                  <View style={style.header}>
                      <Text  numberOfLines={1} style={{fontWeight: 'bold', fontSize: 18, flex:1}}>{item.story_title}</Text>  
                        <TouchableOpacity
                            onPress={() => {
                            setModalVisible(true);
                            setStory(item);
                          }}
                         
                        >
                          <FontAwesome5
                            name="ellipsis-v"
                            color={'#c0c0c0'}
                            style={{fontSize: 20, marginLeft: 10, marginRight: 10}}
                          />
                        </TouchableOpacity>
                    </View>
                    <Text numberOfLines={1} style={{fontWeight: 'bold'}}>Status: <Text style={{fontWeight: 'normal'}}>{item.story_status}</Text></Text>
                    <Text numberOfLines={1} style={{fontWeight: 'bold'}}>Votes: <Text style={{fontWeight: 'normal'}}>{item.vote}</Text></Text>
                    <Text numberOfLines={3}>{item.story_description} </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={ListEmpty}
          />    
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {setModalVisible(!modalVisible);}}
          >
            <View style={style.centeredView}>
              <View style={style.modalView}>
                <TouchableOpacity style={style.modalbutton} onPress={() => {props.navigation.navigate('NewPart', {item: story}); setModalVisible(false)}}>
                  <Text>Create new chapter</Text>
                </TouchableOpacity>
                <TouchableOpacity style={style.modalbutton} style={style.modalbutton} onPress={() => {props.navigation.navigate('ListChapter', {item: story}); setModalVisible(false)}}>
                  <Text>List story's chapter</Text>
                </TouchableOpacity>
                <TouchableOpacity style={style.modalbutton} onPress={() => {props.navigation.navigate('EditStory', {item: story}); setModalVisible(false)}}>
                  <Text>Edit story</Text>
                </TouchableOpacity>
                <TouchableOpacity style={style.modalbutton} onPress={()=> {deleteStory();}}>
                  <Text>Delete story</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginTop: 10, alignItems: 'center'}}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}
                >
                  <Ionicons name="ios-close-circle-outline" size={50} color="#aa4fff" />
                </TouchableOpacity>
              </View>
            </View>
          </Modal>    
        </View>
      )}
    </View>  
  );
}
export {UserStoryScreen};

var style = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'row', 
    padding: 10,
    backgroundColor: 'white',
    width: Dimensions.get('window').width, 
    margin: 5, 
    height: 140
  },
  header: {
    flexDirection: 'row'
  },
  MainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    margin: 10,
  },
  newStory: {
    height: 40, width: 200, 
    backgroundColor: '#aa4fff', 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  newStoryText: {
    marginLeft: 5, 
    fontWeight: 'bold', 
    fontSize: 20, 
    color: 'white' 
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    width: Dimensions.get('window').width *0.9,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalbutton: {
    padding: 10,
    borderBottomWidth: 1,
  }
})