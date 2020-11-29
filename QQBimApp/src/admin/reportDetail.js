import * as React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, Image, Modal, Alert, ToastAndroid} from 'react-native';
import { SplashScreen } from '../users/ScreemFolder/OtherScreen';

function reportDetail (props) {
    const [isLoading, setLoading] = React.useState(false);
    const [dataRepoter, setRepoterData ]= React.useState([]);
    const [warningTimes, setWarningTimes ]= React.useState(0);
    const [modalVisible, setModalVisible] = React.useState(false);
    const [dataSource, setDataSource] = React.useState([]);
    
    React.useEffect(() => {
        getReporter();
        getWarning();
      }, []);

      const getReporter =()=> {
        fetch('http://192.168.0.101:19000/author/' + props.route.params.item.reporter)
        .then ((response) => response.json())
        .then ( (res) => { 
            setRepoterData(res);
        })
        .catch ((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false) 
        });
      }

      const getWarning =()=> {
        fetch('http://192.168.0.101:19000/get_warning/' + props.route.params.item.story_id)
        .then ((response) => response.json())
        .then ( (res) => { 
            if (res != null) {
                setWarningTimes(res[0]);    
            }
        })
        .catch ((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false) 
        });
      }

      const getChapter=() => {
        // fetch('http://10.0.2.2:5000/')
        fetch('http://192.168.0.101:19000/chapter/' + props.route.params.item.story_id)
        .then ((response) => response.json())
        .then ( (res) => { 
          setDataSource(res);
          setModalVisible(!modalVisible);
        })
        .catch ((error) => {
          console.log(error);
        })
        .finally(() => {
          setLoading(false) 
        });
      }

      const showToast = () => {
        ToastAndroid.show("Successful!", ToastAndroid.SHORT);
      };

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
                    'user_email': props.route.params.item.user_email,
                    'story_id': props.route.params.item.story_id,
                    'story_title': props.route.params.item.story_title,
                    'warning_times': warningTimes + 1,
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
                    'user_email': props.route.params.item.user_email,
                    'story_id': props.route.params.item.story_id,
                    'story_title': props.route.params.item.story_title,
                })
                })
                .then ((response) => response.json())
                .then ( (res) => { 
                    showToast();
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
                    'user_email': props.route.params.item.user_email,
                    'user_id': props.route.params.item.author_id,
                })
                })
                .then ((response) => response.json())
                .then ( (res) => { 
                    showToast();
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
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        {isLoading? <SplashScreen/> : (     
            <FlatList
                data={dataRepoter}
                keyExtractor= {item => item.user_id.toString()}
                ListFooterComponent={footerComponent}
                ListEmptyComponent={emptyList}
                renderItem={({ item }) => (
                    <View style={{margin: 10}}> 
                        <Text style={style.header}>{item.report_title}</Text>
                        <View>
                            <View style={{flex: 1, flexDirection: 'row'}}>
                                <Image style={style.imageStory}
                                    source={{uri: props.route.params.item.story_img}} 
                                />
                                <View style={{marginLeft: 10}}>
                                    <Text style={style.textStyle}>Story Title: 
                                        <Text style={[style.textStyle, {fontWeight: 'normal'}]}>{props.route.params.item.story_title}</Text>
                                    </Text>
                                    <Text style={style.textStyle}>Author: 
                                        <Text style={[style.textStyle, {fontWeight: 'normal'}]}>{props.route.params.item.fullname}</Text>
                                    </Text>
                                    <Text style={style.textStyle}>Chapter: 
                                        <Text style={[style.textStyle, {fontWeight: 'normal'}]}>{props.route.params.item.parts}</Text>
                                    </Text>
                                    <Text style={style.textStyle}>Vote: 
                                        <Text style={[style.textStyle, {fontWeight: 'normal'}]}>{props.route.params.item.vote}</Text>
                                    </Text>
                                    <Text style={style.textStyle}>Status: 
                                        <Text style={[style.textStyle, {fontWeight: 'normal'}]}>{props.route.params.item.story_status}</Text>
                                    </Text>
                                    <Text style={style.textStyle}>Warning times: 
                                        <Text style={[style.textStyle, {fontWeight: 'normal'}]}>{warningTimes}</Text>
                                    </Text>
                                    <Text style={style.textStyle}>Reporter:
                                        <Text style={[style.textStyle, {fontWeight: 'normal'}]}>{item.fullname}</Text>
                                    </Text>
                                </View>
                            </View>
                            <Text style={style.textStyle}>Content report: <Text style={[style.textStyle, {fontWeight: 'normal', textAlign: 'justify'}]}>{props.route.params.item.report_content}</Text></Text>
                        </View>
                    </View>
                )}
                showsHorizontalScrollIndicator={false}
            />
        )}

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
                    keyExtractor= {item => item.chapter_id.toString()}
                    ListHeaderComponent={headerComponent}
                    renderItem={({ item }) => (
                    <TouchableOpacity 
                        onPress={() => props.navigation.navigate('chapterContent', {item: item, story: props.route.params.item, dataSource: dataSource, warning_times: warningTimes}, 
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
                <Text style={style.textStyle2}>Hide chapter list</Text>
                </TouchableOpacity>
            </View>
            </View>
        </Modal> 
      </View>
    );
    function headerComponent () {
        return (
            <View style={{alignItems: "center"}}>
                <Image style={style.imageModal}
                    source={{uri: props.route.params.item.story_img}} 
                />
                <Text style={style.titleModal} numberOfLines={2}>{props.route.params.item.story_title}</Text>
            </View>
        )
    }
    function footerComponent() {
        return (
            <View>
              <View style={{alignItems: "center", flexDirection: 'row', justifyContent: 'space-around'}}>
                <TouchableOpacity onPress={()=> sendWarning()}>
                    <Text style={style.button}>Send warning</Text>
                </TouchableOpacity>
                <TouchableOpacity  onPress={()=> deleteStory()}>
                    <Text style={style.button}>Delete story</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> deleteAccount()}>
                    <Text style={style.button}>Delete account</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>pass()}>
                    <Text style={[style.button, {paddingLeft: 15, paddingRight: 15}]}>Pass</Text>
                </TouchableOpacity>
              </View>
              <View style={{justifyContent: 'flex-end', alignItems: 'flex-end'}}>
                <TouchableOpacity onPress={()=>getChapter()}>
                  <Text style={style.button}>Check story</Text>
                </TouchableOpacity>
              </View>
            </View>
        )
    }
    function emptyList() {
      return(
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{fontSize: 20, fontWeight: 'bold'}}>The story is deleted!!</Text>
        </View>
      )
    };
}
export {reportDetail};

var style = StyleSheet.create({
    imageStory: {
        width: 100,
        height: 150,
    },
    button: {
        backgroundColor: '#aa4fff',
        borderRadius: 20,
        color:'white', 
        fontWeight: 'bold', 
        fontSize: 12, 
        padding: 5,
        marginTop: 20,
        marginLeft: 5
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
    imgList: {
      width: 40, 
      height: 40,
    },
    header: {
        color: 'white',
        fontSize: 18,
    },
    textStyle: {
        fontSize: 15,
        fontWeight: 'bold',
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
    textStyle2: {
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
})