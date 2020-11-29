import * as React from 'react';
import { StyleSheet, View, Text, FlatList,TouchableOpacity, Image, AsyncStorage, Modal, TextInput, Alert, ToastAndroid} from 'react-native';
import {SplashScreen} from '../../ScreemFolder/OtherScreen'
import { MaterialIcons, FontAwesome } from '@expo/vector-icons'; 
import { useFocusEffect } from '@react-navigation/native';

function BodyAboutComponent(props) {
  const [dataSource, setDataSource ] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [followingUser, setFollowingUser ] = React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [user, setUser] = React.useState([]);
  const [data, setData] = React.useState([]);
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
  const getData = async () => {
    try {
      AsyncStorage.getItem('user').then((value) => {
        const jsonValue = JSON.parse(value);
        get_list(jsonValue);
        getUerBook(jsonValue);
        setUser(jsonValue);
        getFollowing(jsonValue)
      })
    } catch(e) {
      console.log(e)
    }
  }

  const getUerBook=(jsonValue)=> {
    fetch('http://192.168.0.101:19000/book_author/' + jsonValue.user_id)
    .then ((response) => response.json())
    .then ( (res) => { 
      console.log('kq:' + res); 
      setDataSource(res);
    })
    .catch ((error) => {
      console.log(error);
    })
    .finally(() => {
      setLoading(false) 
    });
  }
  
  const getFollowing=(jsonValue)=> {
    fetch('http://192.168.0.101:19000/get_following/' + jsonValue.user_id)
    .then ((response) => response.json())
    .then ( (res) => { 
      setFollowingUser(res);
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
        ToastAndroid.show("Sucessfull!", ToastAndroid.SHORT);
        get_list(user);
      })
      .catch ((error) => {
        console.log(error);
      })
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
            ToastAndroid.show("Sucessfull!", ToastAndroid.SHORT);
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

  useFocusEffect(
    React.useCallback(() => {
      getData();
      // Do something when the screen is focused
      return () => {
        console.log('un')
      };
    }, [])
  );

  const footerList=()=> {
    return(
      <View>
        <TouchableOpacity style={style.listContainer} onPress={()=> setModalVisible(!modalVisible)}>      
          <MaterialIcons name="playlist-add" size={40} color="black" style={{marginLeft: 5}} />
          <Text style={style.textName}>Add new list</Text>
        </TouchableOpacity>
      </View>
    )
  }
  const followingEmpty=() => {
    return (
      <View>
        <Text>You don't follow any one.</Text>
      </View>
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
  
  const EmptyStory=()=> {
    return(
      <TouchableOpacity style={style.imgEmptyStory} onPress={()=> props.navigation.navigate('NewStory')}>
        <MaterialIcons name="add" size={50} style={{opacity: 0.3}} />
      </TouchableOpacity>
    );
  }
    return (
      <View>
        {isLoading? <SplashScreen/>:(
        <View>
          <View>
            <View>
              <Text style={style.text}>Your story</Text>
            </View>
            <FlatList
              data={dataSource}
              keyExtractor= {item => item.story_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => props.navigation.navigate('DetailStory', {item: item})}>         
                    <View style={style.container}>
                        <View style={{flex: 1}}>
                          <Image style={{width: 100, height: 120}}
                            source={{uri: item.story_img}}
                          />
                        </View>
                        <View style={{flex: -4}}>
                          <Text  numberOfLines={1} style={{ fontSize: 15}}>{item.story_title}</Text>
                        </View>
                      </View>
                </TouchableOpacity>
              )}
              horizontal
              ListFooterComponent={EmptyStory}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View>
            {isLoading? <SplashScreen/>: (
              <View>
                <View><Text style={style.text}>Following</Text></View>
                <FlatList
                  data={followingUser}
                  style={{marginLeft: 10}}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={item => item.user_id.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity onPress={() => props.navigation.navigate('DetailUser', {item: item})}>
                        <Image style={style.image}
                            source={{uri: item.user_avatar}} 
                        />
                    </TouchableOpacity>        
                  )}
                  ListEmptyComponent={followingEmpty}
                />
              </View>
            )}
          </View>
          <View>
            {isLoading? <SplashScreen/>:(
              <View>
                <View style={{flexDirection: 'row'}}>
                  <Text style={style.text}>Your reaing list</Text>
                </View>
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
                  ListFooterComponent={footerList}
                />
              </View>
            )}
          </View>
        </View>
      )}
      <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
            get_list(user)
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
export {BodyAboutComponent};

var style = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column', 
    alignItems:'center', 
    padding: 5,
    flex: 1, 
    backgroundColor: 'white',
    width: 115,
    margin: 5, 
    height: 160,
  },
  text: {
    margin: 10,
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1
  },
  listContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight:10,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: '#aa4fff',
    borderBottomWidth: 0.5
  },
  img: {
    width: 80, 
    height: 80, 
    borderRadius: 50
  },
  imgList: {
    width: 30, 
    height: 30,
  },
  textName: {
    fontSize: 18, 
    color: 'grey',
    marginLeft: 10
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
  imgEmptyStory: {
    width: 100, 
    height: 120, 
    backgroundColor: '#f2f2f2',
    alignItems: "center",
    justifyContent: 'center',
    marginLeft: 10,
    marginTop: 10
  },
  image: {
    marginRight: 10,
    width: 70, 
    height: 70, 
    borderRadius: 50
  },
})