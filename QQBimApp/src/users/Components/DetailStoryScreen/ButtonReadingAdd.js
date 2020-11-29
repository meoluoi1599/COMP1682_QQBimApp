import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Dimensions,
  ToastAndroid,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  AsyncStorage
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'
import { MaterialIcons } from '@expo/vector-icons'; 
import { FlatList, TextInput } from "react-native-gesture-handler";
import { useFocusEffect } from '@react-navigation/native';


const ButtonReadingAdd = (props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [user, setUser] = React.useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [data, setData] = useState([]);
  const [value, setValue]= useState('');
  const [chapterData, setChapterData] = useState([]);

  function get_list() {
    fetch('http://192.168.0.101:19000/get_list/' + user.user_id)
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
        setUser(jsonValue);
      })
    } catch(e) {
      console.log(e)
    }
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
        setModalVisible2(false);
      })
      .catch ((error) => {
        console.log(error);
      })
  }

  function add_to_list(id){
    fetch('http://192.168.0.101:19000/add_to_list/' + id + '/' + props.route.params.item.story_id)
    .then ((response) => response.json())
    .then ( (res) => { 
      ToastAndroid.show("The story is added.", ToastAndroid.SHORT);
    })
    .catch ((error) => {
      console.log(error);
    })
    .finally(() => {
      setLoading(false) 
    });
  }
  const addLibary=()=> {
    fetch('http://192.168.0.101:19000/chapter/' + props.route.params.item.story_id)
    .then ((response) => response.json())
    .then ( (res) => { 
      setChapterData(res);
    })
    .catch ((error) => {
      console.log(error);
    })
    .finally(() => {
      db.transaction(
        tx => {
          tx.executeSql("insert into story (id, title) values (?, ?)", [props.route.params.item.story_id, props.route.params.item.story_title,]);
          tx.executeSql("insert into chapter (chapter_content, chapter_id, chapter_name, story_id) values (?, ?, ?, ?)", chapterData);
          tx.executeSql("select * from story", [], (_, { rows }) =>
            console.log('hádhaskjdha'+JSON.stringify(rows))
          );
        }
      );
      setModalVisible(false)
    });
  }

  useFocusEffect(
    React.useCallback(() => {
    getData();
    getChapter();
    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists story (story_id integer primary key not null, title text);"
      );
      tx.executeSql(
        "create table if not exists chapter (chapter_id integer primary key not null, chapter_name text,chapter_content text,story_id int, FOREIGN KEY(story_id) REFERENCES story(story_id) );"
      );
    });
    return () => {
      console.log('un')
    };
  }, [])
);

 const getChapter=()=> {
  fetch('http://192.168.0.101:19000/chapter/' + props.route.params.item.story_id)
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

  const readingFunction=()=> {
    if (dataSource == '') {
      ToastAndroid.show("The story don't have any chapter.", ToastAndroid.SHORT); 
    } else {
      props.navigation.navigate('Reading', {story: props.route.params.item, chapter: 'default_chapter', item: {chapter_id: ''}})
    }
  }
  
  return (
    <View {...props}>
      <View style={styles.button}>
        <TouchableOpacity onPress={() => props.navigation.navigate('Report', {item: props.route.params.item})}>
          <MaterialIcons name="report"style={styles.buttonIcon}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => readingFunction()}>
          <Text style={styles.readingText}>Reading</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setModalVisible(true);
            get_list();
          }}
        >
          <Icon name='ios-add-circle-outline' style={styles.buttonIcon}/>                
        </TouchableOpacity>
      </View>
      <TouchableWithoutFeedback
        onPressOut={() => {
          setModalVisible(false);
        }}
      >
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FlatList 
              data={data}
              keyExtractor={item => item.list_id}
              renderItem={({item}) => (
                <TouchableOpacity 
                onPress={()=> {
                  add_to_list(item.list_id);
                  setModalVisible(!modalVisible);
                }}>
                  <Text style={styles.modalText}>{item.list_name}</Text>
                </TouchableOpacity>
              )}
            />
            
            <TouchableHighlight
              onPress={() => {
                setModalVisible(!modalVisible);
                setModalVisible2(!modalVisible2);
              }}
            >
              <Text style={styles.modalText}>Create new list</Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => addLibary()}
            >
              <Text style={styles.modalText}>Add to libary</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>
      </TouchableWithoutFeedback>
      <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible2}
          onRequestClose={() => {
            setModalVisible2(!modalVisible2);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
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
};

const styles = StyleSheet.create({
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
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  button: {
    marginTop: 10, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  readingText: {
    fontWeight: 'bold', 
    fontSize: 18, 
    borderRadius: 20,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 25,
    paddingRight: 25,
    backgroundColor: '#aa4fff',
    color: 'white' 
  },
  buttonIcon: {
    color: '#aa4fff', 
    fontSize: 40, 
    marginLeft: 5
  }
});

export {ButtonReadingAdd};