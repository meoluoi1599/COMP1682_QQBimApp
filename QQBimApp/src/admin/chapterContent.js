import React from 'react';
import { StyleSheet, Dimensions, View, TouchableOpacity, Text, Alert, ScrollView, Modal, Image, FlatList, ToastAndroid} from 'react-native';
import { MaterialCommunityIcons,Ionicons, AntDesign} from '@expo/vector-icons';

function chapterContent(props) {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [dataSource, setDataSource ]= React.useState([]);

  const sendWarning=()=> {
    Alert.alert(
      "Do you want to send warning for this story?",
      "If you choose OK, story's warning times will update. If warning times over three time the account can be deleted.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          fetch('http://192.168.0.101:19000/warning_email', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'user_email': props.route.params.story.user_email,
                'story_id': props.route.params.story.story_id,
                'story_title': props.route.params.story.story_title,
                'warning_times': props.route.params.warning_times + 1,
                'status': 'Done',
                'report_id': props.route.params.item.report_id
            })
            })
            .then ((response) => response.json())
            .then ( (res) => { 
                ToastAndroid.show("Send warning  sucucess!", ToastAndroid.SHORT);
            })
            .catch ((error) => {
                console.log(error);
          })
        } }
      ],
      { cancelable: false }
    ); 
  }

  React.useEffect(()=>{
    setDataSource(props.route.params.dataSource)
  }, [])

  const deleteStory=()=> {
    Alert.alert(
      "Do you want to delete this story?",
      "If you choose OK, the story will delete forever on this app.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          fetch('http://192.168.0.101:19000/delete_story', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              'user_email': props.route.params.story.user_email,
              'story_id': props.route.params.story.story_id,
              'story_title': props.route.params.story.story_title,
            })
            })
            .then ((response) => response.json())
            .then ( (res) => { 
              ToastAndroid.show("Delete story  sucucess!", ToastAndroid.SHORT);
              props.navigation.navigate('homeAdmin')
            })
            .catch ((error) => {
                console.log(error);
          })
        } }
      ],
      { cancelable: false }
    );
  }
  const deleteAccount=()=> {
    Alert.alert(
      "Do you want to delete this account?",
      "If you choose OK, the account will delete forever in this app.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          fetch('http://192.168.0.101:19000/delete_account', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'user_email': props.route.params.story.user_email,
                'story_id': props.route.params.story.story_id,
                'story_title': props.route.params.story.story_title,
                'user_id': props.route.params.story.author_id,
            })
            })
            .then ((response) => response.json())
            .then ( (res) => { 
                ToastAndroid.show("Delete account  sucucess!", ToastAndroid.SHORT);
                props.navigation.navigate('homeAdmin')
            })
            .catch ((error) => {
                console.log(error);
          })
        } }
      ],
      { cancelable: false }
    );
  }

  const pass=()=> {
    Alert.alert(
      "Do you want to pass this report?",
      "Make sure your decision is in line with the rules.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          fetch('http://192.168.0.101:19000/pass_report', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'status': 'Done',
                'report_id': props.route.params.item.report_id
            })
            })
            .then ((response) => response.json())
            .then ( (res) => { 
                getWarning();
                showToast();
            })
            .catch ((error) => {
                console.log(error);
          })
        } }
      ],
      { cancelable: false }
    ); 
  } 
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer} {...props}>
        <View style={{marginTop: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <View style={{flex: 1}}>
                <TouchableOpacity onPress={() => {
                    props.navigation.goBack(); 
                    props.navigation.dangerouslyGetParent().setOptions({
                     tabBarVisible: true
                    });
                }}>
                    <AntDesign name="left" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <View style={{flex: 5}}><Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}} numberOfLines={1}>{props.route.params.story.story_title}</Text></View>
            <View style={{flex: 1, flexDirection: 'row'}} >
                <TouchableOpacity style={{flex:1}} onPress={() => {
                    setModalVisible(true);
                }}>
                    <Ionicons name='md-menu' size={40} color={'white'}/>
                </TouchableOpacity>
            </View>
        </View>

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {setModalVisible(!modalVisible);}}
        >
            <View style={style.centeredView}>
            <View style={style.modalView}>        
                <FlatList
                    data={dataSource}
                    ListHeaderComponent={headerComponent}
                    keyExtractor= {item => item.chapter_id.toString()}
                    renderItem={({ item }) => (
                      <TouchableOpacity 
                        onPress={() => props.navigation.navigate('chapterContent', {item: item, story: props.route.params.story, warning_times: props.route.params.warningTimes}, 
                        setModalVisible(!modalVisible)
                        )} style={style.chapter}>         
                        <Text numberOfLines={1}>{item.chapter_name}</Text>
                      </TouchableOpacity>
                    )}
                    showsHorizontalScrollIndicator={false}
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
      </View>
        <ScrollView style={{flex:1}}>
            <Text style={{ padding: 20, fontSize: 15, textAlign: 'justify'}}>{props.route.params.item.chapter_content}</Text>
        </ScrollView>
        <View style={styles.tabView}>
            <View style={styles.tabContainer}>
              <TouchableOpacity onPress={()=> sendWarning()}>
                  <AntDesign name="warning" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> deleteStory()}>
                  <AntDesign name="delete" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> deleteAccount()}>
                  <MaterialCommunityIcons name="account-remove-outline" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> pass()}>
                 <AntDesign name="check" size={24} color="black" />
              </TouchableOpacity>
            </View>
        </View>
    </View>
  )   

  function headerComponent () {
    return (
        <View style={{alignItems: "center"}}>
            <Image style={style.imageModal}
                source={{uri: props.route.params.story.story_img}} 
            />
            <Text style={style.titleModal} numberOfLines={2}>{props.route.params.story.story_title}</Text>
        </View>
    )
}
} export {chapterContent};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    borderColor: '#8a2be2',
},
headerContainer: { 
  flex: -2, 
  backgroundColor: '#8a2be2', 
  height: 80, 
  width: '100%', 
  justifyContent: 'center', 
  alignItems: 'center'
},
    tabView: {
      justifyContent: 'flex-end', 
      backgroundColor: '#aa4fff', 
      width: '100%', 
      height: 40, 
      paddingRight: 5
    },
    tabContainer: {
      flex: 1, 
      height: 40,  
      width: Dimensions.get('window').width,  
      backgroundColor: 'white', 
      alignItems: 'center', 
      justifyContent: 'space-around', 
      flexDirection: 'row'
    },
});

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
  textStyle2: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
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
  centeredView2: {
      flex: 1,
      alignItems: "center",
      marginTop: 22
  },
  modalView2: {
      margin: 10,
      backgroundColor: "white",
      width: '80%',
      height: 200,
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
      backgroundColor: "#ba68c8",
      borderRadius: 20,
      padding: 10,
      elevation: 2,
  },
  background: {
    width: 40, 
    height: 40, 
    borderWidth: 1,
    margin: 10
  }
});