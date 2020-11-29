import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, AsyncStorage, Modal, Image, TextInput, FlatList, Alert } from 'react-native';
import {SplashScreen} from '../../ScreemFolder/OtherScreen'
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'; 

function ListStoryScreen(props) {
  const [data, setData] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [user, setUser] = React.useState([]);
  const [value, setValue] = React.useState('');
  
  function get_list(jsonValue) {
    fetch('http://192.168.0.101:19000/get_list/' + jsonValue.user_id)
    .then ((response) => response.json())
    .then ( (res) => { 
      setData(res);
    })
    .catch ((error) => {
      console.log(error);
    })
    .finally(() => {
      setLoading(false) 
    });
  }

  function create_list(){
    fetch('http://192.168.0.101:19000/create_list' , {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'user_id': user.user_id,
            'list_name': value
          })
      })
      .then ((response) => response.json())
      .then ( (res) => { 
        setModalVisible(false);
        get_list(user);
      })
      .catch ((error) => {
        console.log(error);
      })
  }
  const getData = async () => {
    try {
      AsyncStorage.getItem('user').then((value) => {
        const jsonValue = JSON.parse(value);
        setUser(jsonValue);
        get_list(jsonValue);   
      })
    } catch(e) {
      console.log(e)
    }
  }
  const deleteList=(list_id)=> {
    Alert.alert(
      "Do you want to delete your list?",
      "If you choose OK, your list will delete forever.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          fetch('http://192.168.0.101:19000/delete_list/' + user.user_id + '/' + list_id)
          .then ((response) => response.json())
          .then ( (res) => { 
            get_list(user);
          })
          .catch ((error) => {
            console.log(error);
          })
          .finally(() => {
            setLoading(false);
          });
        } }
      ],
      { cancelable: false }
    ); 
  }
  function ListEmpty() {
    return (
      //View to show when list is empty
      <View style={style.listContainer}>
        <TouchableOpacity style={{flexDirection: 'row', margin: 10}} onPress={() => setModalVisible(!modalVisible)}>
          <MaterialIcons name="note-add" size={24} color="grey"/>
          <Text style={style.textName}>There aren't lists.</Text>
        </TouchableOpacity>
      </View>
    );
  };
  React.useEffect(() => {
    getData();
  }, []);
    return (
      <View style={{flex: 1, backgroundColor: 'white'}}>
        {isLoading? <SplashScreen/>: (
          <FlatList
            data={data}
            keyExtractor= {item => item.list_id.toString()}
            renderItem={({ item }) =>(
              <View style={style.listContainer}>
                <TouchableOpacity style={{flexDirection: 'row', margin: 10, flex: 1}} onPress={() =>props.navigation.navigate('DetailUserList', {item: item})}>
                  <Image 
                    source={require("../../Images/list.png")}
                    style={style.imgList}
                  />
                  <Text style={style.textName}>{item.list_name}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ margin: 10}} onPress={()=> {deleteList(item.list_id);}}>
                  <FontAwesome
                    name="remove"
                    color={'#c0c0c0'}
                    style={{fontSize: 20, marginLeft: 10, marginRight: 10}}
                  />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={ListEmpty}
          />
        )}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
            get_list(user.user_id)
          }}
        >
          <View style={style.centeredView}>
            <View style={style.modalView}>
              <Text style={{fontSize: 18, fontWeight: 'bold'}}>Create New List</Text>
              <TextInput placeholder='Enter name of list'
                onChangeText={text => setValue(text)}
                onSubmitEditing={()=> create_list()}
                returnKeyType='done'
              />
            </View>
          </View>
        </Modal>
      </View>
      
    );
}
export {ListStoryScreen};

var style = StyleSheet.create({
  imgList: {
    width: 30, 
    height: 30,
  },
  listContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight:10,
    backgroundColor: 'white',
    borderColor: '#aa4fff',
    borderBottomWidth: 0.5,
    flexDirection: 'row'
  },
  textName: {
    fontSize: 18, 
    color: 'grey',
    marginLeft: 20
  },
  centeredView: {
    flex: 1,
    marginTop: 22,
    flexDirection: 'column',
    justifyContent: "flex-end"
  },
  modalView: {
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    //maxheight: Dimensions.get('window').height * 0.3
  },
})