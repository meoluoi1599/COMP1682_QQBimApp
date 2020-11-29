import * as React from 'react';
import { 
  View, 
  FlatList,
  TouchableOpacity, 
  Text, StatusBar,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  Modal,
  ToastAndroid
} from 'react-native';
import {SplashScreen} from '../OtherScreen';
import { DetailStoryScreen } from './DetailStoryScreen';
import { Ionicons } from '@expo/vector-icons'; 

function ListChapterScreen(props) {
  const [dataSource, setDataSource ]= React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [modalVisible, setModalVisible] = React.useState(false);
  const story_id = props.route.params.item.story_id;
  const [story, setStory] = React.useState([]);
  const data = [
    {id:"1"}
  ]

  React.useEffect(() => {
    // fetch('http://10.0.2.2:5000/')
    fetch('http://192.168.0.101:19000/chapter/' + story_id)
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
  }, []);

  function deleteChapter() {
    Alert.alert(
      "Do you want to delete your story's chapter?",
      "If you choose OK, story's chapter will delete forever.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          fetch('http://192.168.0.101:19000/delete_chapter/' + story.story_id + '/' + story.chapter_id)
          .then ((response) => response.json())
          .then ( (res) => { 
            ToastAndroid.show("Delete sucessfull!", ToastAndroid.SHORT);
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
    <View style={{ flex: 1, backgroundColor: 'white'}}>
      <StatusBar hidden/>
      {isLoading ? <SplashScreen/> : (
        <View>
          <FlatList
              data={data}
              renderItem={(item) => (
                  <>
                  <View style={{alignItems: "center"}}>
                      <Image style={style.imageModal}
                          source={{uri: props.route.params.item.story_img}} 
                      />
                      <Text style={style.title} numberOfLines={2}>{props.route.params.item.story_title}</Text>
                      <TouchableOpacity style={style.createBotton} onPress={() => {props.navigation.navigate('NewPart', {item: props.route.params.item}); setModalVisible(false)}}>
                          <Text style={{color:'white', fontWeight: 'bold', fontSize: 18}}>Create new chapter</Text>
                      </TouchableOpacity>
                  </View>
                  <FlatList
                      data={dataSource}
                      keyExtractor= {item => item.chapter_id.toString()}
                      renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => {setModalVisible(!modalVisible), setStory(item);}} style={style.chapter}> 
                          <Image 
                            source={require("../../Images/readingList.jpg")}
                            style={style.imgList}
                          />        
                          <Text numberOfLines={1}>{item.chapter_name}</Text>
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
                          <TouchableOpacity style={style.modalbutton} onPress={() => {props.navigation.navigate('EditPart', {item: story, story: props.route.params.item}); setModalVisible(false)}}>
                              <Text>Edit Chapter</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={style.modalbutton} onPress={()=> {deleteChapter();}}>
                              <Text>Delete Chapter</Text>
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
                  </>
              )}
              ListEmptyComponent={ListEmpty}
          />
        </View>
      )}
  </View>
  );

  function ListEmpty() {
    return (
      //View to show when list is empty
      <View style={style.MainContainer}>  
          <View>
            <Text style={{fontSize: 20, color: 'black', marginTop: 20, marginBottom: 20}}>You don't have any chapter</Text>
          </View>
      </View>
    );
  }; 
}
export {ListChapterScreen}

var style = StyleSheet.create({
    MainContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        margin: 10,
    },
    imageModal: {
        width: 150,
        height: 200,
        marginTop: 20,
    },
    createBotton: {
        borderRadius: 40,
        backgroundColor: '#aa4fff',
        padding: 10,
        marginTop: 10
    },
    title: {
        fontSize: 20, 
        fontWeight: 'bold', 
        marginTop: 10, 
        marginBottom: 10
    },
    chapter: {
        padding: 5,
        flexDirection: 'row',        
        borderBottomWidth: 0.5,
        alignItems: 'center',
        borderBottomColor: 'grey'
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 20,
      width: Dimensions.get('window').width *0.7,
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
    modalbutton: {
      padding: 10,
      borderBottomWidth: 1,
    },
    imgList: {
      width: 40, 
      height: 40,
    },
})

