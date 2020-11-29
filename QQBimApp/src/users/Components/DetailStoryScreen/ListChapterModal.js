import React, { useState } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import Icon from 'react-native-vector-icons/Ionicons'

const ListChapterModal = (props) => {
    const [isLoading, setLoading] = React.useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const [dataSource, setDataSource] = React.useState([]);
    const data = [
        {id:"1"}
    ]

  React.useEffect(() => {
    // fetch('http://10.0.2.2:5000/')
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
  }, []);

  function ListEmpty() {
    return (
      //View to show when list is empty
      <View style={style.MainContainer}>  
          <View>
            <Text style={{fontSize: 20, color: 'black', marginTop: 20, marginBottom: 20}}>Sorry! There are no chapter.</Text>
          </View>
      </View>
    );
  };

  return (
    <View>
        <TouchableOpacity      
        onPress={() => {
            setModalVisible(true);
        }}
        style={style.parts}
        >
            <Text style={style.openChapterList}>Chapter of storys</Text>
            <Text style={{color: '#ff9200'}}>{props.route.params.item.story_status}</Text>
        </TouchableOpacity>  
        <TouchableWithoutFeedback onPress={() => setModalVisible(!modalVisible)}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {setModalVisible(!modalVisible);}}
        >
            <View style={style.centeredView}>
            <View style={style.modalView}>
                <FlatList
                data={data}
                renderItem={(item) => (
                    <>
                    <View style={{alignItems: "center"}}>
                        <Image style={style.imageModal}
                            source={{uri: props.route.params.item.story_img}} 
                        />
                        <Text style={style.titleModal} numberOfLines={2}>{props.route.params.item.story_title}</Text>
                    </View>
                    <FlatList
                        data={dataSource}
                        keyExtractor= {item => item.chapter_id.toString()}
                        renderItem={({ item }) => (
                        <TouchableOpacity 
                            onPress={() => props.navigation.navigate('Reading', {chapter: 'chapter', item: item, story: props.route.params.item}, 
                            setModalVisible(!modalVisible)
                            )} style={style.chapter}>         
                            <Text numberOfLines={1}>{item.chapter_name}</Text>
                        </TouchableOpacity>
                        )}
                        showsHorizontalScrollIndicator={false}
                        ListEmptyComponent={ListEmpty}
                    />
                    </>
                )}
                />
                <TouchableOpacity
                style={style.closeButtom}
                onPress={() => {
                    setModalVisible(!modalVisible);
                }}
                >
                <Text style={style.textStyle}>Hide chapter list</Text>
                </TouchableOpacity>
            </View>
            </View>
        </Modal> 
        </TouchableWithoutFeedback>
    </View>
  );
};

const style = StyleSheet.create({
    parts: {
        padding: 10,
        borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
      },
    openChapterList: {
        fontSize: 18,
        color: '#aa4fff',
        fontWeight: 'bold'
      },
    
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 10,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 10,
        width: '80%',
        height: '90%',
        //alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
        width: 0,
        height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
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
    imageModal: {
        width: 150,
        height: 200,
        marginTop: 20,
    },
    titleModal: {
        fontSize: 15, 
        fontWeight: 'bold', 
        marginTop: 10, 
        marginBottom: 10
    },
    chapter: {
        padding: 10,
        borderBottomWidth: 0.5,
        borderBottomColor: 'grey'
    },
    closeButtom: {
        backgroundColor: "#aa4fff",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    }
});

export {ListChapterModal};