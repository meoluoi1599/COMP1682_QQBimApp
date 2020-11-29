import React from 'react';
import { 
  StyleSheet, Dimensions, View, TouchableOpacity, Text, 
  FlatList, Share,Modal, Image, TextInput, 
  ToastAndroid, StatusBar,
  TouchableWithoutFeedback} from 'react-native';
import {SplashScreen} from '../../ScreemFolder/OtherScreen';
import { MaterialCommunityIcons,Ionicons, AntDesign} from '@expo/vector-icons';
import { AsyncStorage } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

function ReadingScreen(props) {
  const [dataSource, setDataSource ]= React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [vote, setVote] = React.useState();
  const [voting, setVoting] = React.useState(false);
  const [chapterId, setChapterId] =  React.useState(0);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalVisible2, setModalVisible2] = React.useState(false);
  const [modalVisible3, setModalVisible3] = React.useState(false);
  const [comment, setComment ]= React.useState([]);
  const [contentComent, setContentComent] = React.useState('');
  const [userData, setUserData] = React.useState([]);
  const [send, setSend] = React.useState(true);
  const [fontSize, setFontSize]  = React.useState(16);
  const [fontColor, setFontColor]  = React.useState('black');
  const [background, setBackground] = React.useState('#f2f2f2');
  let url1 = 'http://192.168.0.101:19000/default_chapter/' + props.route.params.story.story_id;
  let url2 = 'http://192.168.0.101:19000/chapter/' + props.route.params.story.story_id + '/' + props.route.params.item.chapter_id;

  const getData = async () => {
    try {
      AsyncStorage.getItem('user').then((value) => {
        const jsonValue = JSON.parse(value);
        setUserData(jsonValue);
      })
    } catch(e) {
      console.log(e)
    }
  }

  React.useEffect(()=>{
    setVote(voting?vote+1:vote-1);
  },[voting]);
  
  React.useEffect(()=>{
      sendVote();
  },[vote]);

  // const getMyData=async ()=>{
  //   const req=await fetch("");
  //   const data=await req.json();
  //   console.log(data);
  // }
  let fetchData=(url)=> {
    fetch(url)
    .then ((response) => response.json())
    .then ( (res) => { 
      setDataSource(res);
      setChapterId(res[0].chapter_id);
    })
    .catch ((error) => {
      console.log(error);
    })
    .finally(() => {
      setLoading(false); 
    });
  }
  useFocusEffect(
    React.useCallback(() => {
      props.navigation.dangerouslyGetParent().setOptions({
        tabBarVisible: false
      });
      setVote(props.route.params.story.vote);
      getData();
      if (props.route.params.chapter == 'default_chapter') {
        fetchData(url1)
      } else {
        fetchData(url2)
      }      
      // Do something when the screen is focused
      return () => {
        console.log('un')
      };
    }, [])
  );

  const getPrevChapter = () => {
    fetch('http://192.168.0.101:19000/prev_chapter/' + props.route.params.story.story_id + '/' + chapterId)
    .then ((response) => response.json())
    .then ( (res) => { 
      if (res == '') {
        ToastAndroid.show("You are in the first of chapter.", ToastAndroid.SHORT);
      } else {
        setDataSource(res);
        setChapterId(res[0].chapter_id);
      }
    })
    .catch ((error) => {
      console.log(error);
    })
    .finally(() => {
      setLoading(false); 
    });
  }

  const getNextChapter = () => {
    fetch('http://192.168.0.101:19000/next_chapter/' + props.route.params.story.story_id + '/' + chapterId)
    .then ((response) => response.json())
    .then ( (res) => { 
      if (res == '') {
        ToastAndroid.show("You are in the last of chapter.", ToastAndroid.SHORT);
      } else {
        setDataSource(res);
        setChapterId(res[0].chapter_id);
      }
    })
    .catch ((error) => {
      console.log(error);
    })
    .finally(() => {
      setLoading(false); 
    });
  }

  function sendVote() {
    fetch('http://192.168.0.101:19000/vote/' + props.route.params.story.story_id + '/' + vote)
    .then ((response) => response.json())
    .then ( (res) => { 
      console.log(res)
    })
    .catch ((error) => {
        console.log(error);
    })
  }

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'This story is very good',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const getComment = () => {
    fetch('http://192.168.0.101:19000/get_comment/' + props.route.params.story.story_id)
    .then ((response) => response.json())
    .then ( (res) => { 
      setComment(res);
    })
    .catch ((error) => {
      console.log(error);
    })
    .finally(() => {
      setLoading(false) 
    });
  }

  const submitComment=()=> {
    fetch('http://192.168.0.101:19000/add_comment' , {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'user_id': userData.user_id,
            'comment_content': contentComent,
            'story_id': props.route.params.story.story_id
          })
      })
      .then ((response) => response.json())
      .then ( (res) => { 
        setContentComent('');
        getComment();
      })
      .catch ((error) => {
        console.log(error);
      })
  } 
  function onChangeText(text){
    setContentComent(text);
    if (text.length > 0) {
      setSend(false);
    } else {
      setSend(true);
    }
  }
  return (
    <View style={styles.container}>
      <StatusBar hidden/>
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
            <View style={{flex: 2, flexDirection: 'row'}} >
                <TouchableOpacity style={{flex:1}} onPress={() => {
                        setModalVisible2(true);
                    }}>
                        <MaterialCommunityIcons name="format-letter-case" size={40} color="white" />
                    </TouchableOpacity>
                <TouchableOpacity style={{flex:1}} onPress={() => {
                    setModalVisible(true);
                }}>
                    <Ionicons name='md-menu' size={40} color={'white'}/>
                </TouchableOpacity>
            </View>
        </View>

        <TouchableWithoutFeedback onPress={() => setModalVisible(!modalVisible)}>
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {setModalVisible(!modalVisible);}}
        >
            <View style={style.centeredView}>
            <View style={style.modalView}>        
                <View style={{alignItems: "center"}}>
                    <Image style={style.imageModal}
                        source={{uri: props.route.params.story.story_img}} 
                    />
                    <Text style={style.titleModal} numberOfLines={2}>{props.route.params.story.story_title}</Text>
                </View>
                <FlatList
                    data={dataSource}
                    keyExtractor= {item => item.chapter_id.toString()}
                    renderItem={({ item }) => (
                    <TouchableOpacity 
                        onPress={() => props.navigation.navigate('Reading', {chapter_id: item.chapter_id, item: item, story: props.route.params.story}, 
                        setModalVisible(!modalVisible)
                        )} style={style.chapter}>         
                        <Text numberOfLines={1}>{item.chapter_name}</Text>
                    </TouchableOpacity>
                    )}
                    showsHorizontalScrollIndicator={false}
                    ListEmptyComponent={ListEmpty}
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

        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible2}
            onRequestClose={() => {setModalVisible2(!modalVisible2);}}
        >
            <View style={style.centeredView2}>
            <View style={style.modalView2}>        
            <TouchableOpacity
                style={{alignItems: 'flex-end', backgroundColor: '#EEEEEE'}}
                onPress={() => {
                    setModalVisible2(!modalVisible2);
                }}
                >
                    <AntDesign name="close" size={24} color="black" /></TouchableOpacity>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>Font-size: </Text>
                    <TouchableOpacity onPress={()=>{setFontSize(fontSize-1)}} >
                        <MaterialCommunityIcons name="format-annotation-minus" size={30} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>{setFontSize(fontSize+1)}}>
                        <MaterialCommunityIcons name="format-annotation-plus" size={30} color="black" />
                    </TouchableOpacity>
                </View>
                <View>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>Themes: </Text>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                      <TouchableOpacity 
                        onPress={()=>{setBackground('#f2f2f2'), setFontColor('black')}} 
                        style={[style.background, {backgroundColor:'#f2f2f2' }]}>
                      </TouchableOpacity>
                      <TouchableOpacity
                      onPress={()=>{setBackground('black'), setFontColor('white')}} 
                      style={[style.background, {backgroundColor: 'black' }]}>
                      </TouchableOpacity>
                      <TouchableOpacity 
                      onPress={()=>{setBackground('#ffffe6'), setFontColor('black')}}
                      style={[style.background, {backgroundColor: '#ffffe6'}]}>
                      </TouchableOpacity>
                    </View>
                </View>
            </View>
            </View>
        </Modal> 
      </View>
      <View style={{flex: 1, width: '100%', backgroundColor: background}}>
        {isLoading? <SplashScreen/>:(
          <FlatList
            data={dataSource}
            keyExtractor= {item => item.chapter_id.toString()}
            renderItem={({ item }) => (
              <View>         
                  <Text style={{ padding: 20, fontSize: fontSize, textAlign: 'justify', color: fontColor}}>{item.chapter_content}</Text>
              </View>
            )}  
            showsHorizontalScrollIndicator={false}
          /> 
        )}
      </View>
      <View style={styles.tabView}>
        <View style={styles.tabContainer}>
          <TouchableOpacity onPress={()=> getPrevChapter()}>
            <AntDesign name="arrowleft" size={24} color={'#aa4fff'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {setVoting(!voting);}}>
              <Ionicons 
                  name= {voting?'md-star':'md-star-outline'}
                  size={24} 
                  color={'#aa4fff'} 
              />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => {
              setModalVisible3(true);
              getComment();
            }}>
              <MaterialCommunityIcons 
                  name="comment-outline" 
                  size={24} 
                  color={'#aa4fff'} 
              />
          </TouchableOpacity>
          <TouchableOpacity onPress={onShare}>
              <MaterialCommunityIcons name="share-variant" size={24} color={'#aa4fff'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> getNextChapter()}>
            <AntDesign name="arrowright" size={24} color={'#aa4fff'} />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible3}
        onRequestClose={() => {
          setModalVisible3(!modalVisible3);
        }}
      >
          <View style={styles.modalView}>
            <View style={styles.HeaderModal}>
              <Text style={styles.HeaderText}>Comment</Text>
              <TouchableOpacity
                  style={styles.close}
                  onPress={() => {
                    setModalVisible3(!modalVisible3);
                  }}
                >
                  <AntDesign name="close" size={24} color="black" />
              </TouchableOpacity>
            </View>
            <View style={styles.comment}>
              <FlatList
                data={comment}
                keyExtractor= {item => item.comment_id.toString()}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={styles.commentContent}>         
                        <Image 
                          style={styles.commentImg}
                          source={{ uri: item.user_avatar }}
                        />
                        <View>
                          <Text style={{fontWeight: 'bold'}}>{item.fullname}</Text>
                          <Text>{item.comment_content}</Text>
                        </View>
                    </View>
                )}  
                ListEmptyComponent={ListEmpty}
              /> 
            </View>
            <View style={styles.inputComment}>
              <TextInput
                style={{ height: 40, margin: 5, backgroundColor: 'white', width: '80%'}}
                autoCorrect={false}
                value={contentComent}
                onSubmitEditing={() => submitComment()}
                onChangeText={text =>  {onChangeText(text)}}
              />
              <TouchableOpacity 
                disabled = {send}
                onPress={() => submitComment()}>
                <Ionicons name="md-send" size={45} color="white" style={{ marginLeft: 10, marginRight: 10}} />
              </TouchableOpacity>
            </View>
          </View>
      </Modal>
    </View>
  );
  function ListEmpty() {
    return (
      //View to show when list is empty
      <View style={{justifyContent: 'center', alignItems: 'center'}}>  
          <View>
            <Text style={{fontSize: 18, color: 'black', marginTop: 20, marginBottom: 20}}>There are no comment.</Text>
          </View>
      </View>
    );
  }; 
} export {ReadingScreen};
 
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
    modalView: {
      backgroundColor: "white",
      shadowColor: "#000",
      width: Dimensions.get('window').width, 
      height: Dimensions.get('window').height,
    },
    HeaderModal: {
      justifyContent: 'flex-start',
      alignItems: 'center',
      flexDirection: 'row',
      backgroundColor: '#EEEEEE',
      height: 40,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    HeaderText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 10,
      flex: 1
    },
    close: {
      flex: -1,
      marginRight: 10
    },
    comment: {
      padding: 5,
      flex: 3
    },
    commentImg: {
      width: 60,
      height: 60,
      borderRadius: 50,
      marginLeft: 10,
      marginRight: 10
    },
    commentContent: {
      flexDirection: 'row',
      margin: 5
    },
    inputComment: {
      justifyContent: 'flex-end', 
      backgroundColor: '#aa4fff', 
      width: '100%', 
      height: 50, 
      flexDirection: 'row', 
      paddingRight: 5, 
      marginBottom: 30
    }
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