import * as React from 'react';
import { StyleSheet, View,
  Text, TouchableOpacity, Modal, Image, ToastAndroid, AsyncStorage, TextInput, 
  Dimensions, 
  KeyboardAvoidingView, 
  ScrollView,
  Alert,
  StatusBar
} from 'react-native';
import { AntDesign, Feather} from '@expo/vector-icons'; 
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../../../../App';

function SettingsScreen(props) {
  const [image, setImage] = React.useState(null);
  const [dataUser, setDataUser ]= React.useState([]);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalVisible2, setModalVisible2] = React.useState(false);
  const [password, setPassword] = React.useState(null);
  const [fullname, setFullname] = React.useState(null);
  const [username, setUsername] = React.useState(null);
  const [email, setEmail] = React.useState(null);
  const [display, setDisplay] = React.useState(true);
  const { signOut } = React.useContext(AuthContext);
  let formdata = new FormData();

  formdata.append("user_id", dataUser.user_id)
  formdata.append("email", email)
  formdata.append("fullname", fullname)
  formdata.append("username", username)
  
  const getData = async () => {
    try {
      AsyncStorage.getItem('user').then((value) => {
        const jsonValue = JSON.parse(value);
        setDataUser(jsonValue);
        setImage(jsonValue.user_avatar);
        setFullname(jsonValue.name);
        setEmail(jsonValue.email);
        setUsername(jsonValue.username);
        setPassword('123456');
      })
    } catch(e) {
      console.log(e)
    }
  }
  React.useEffect(() => {
    getData();
  }, []);
  const pickImage = async () => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        } else {
          let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 6],
            quality: 1,
          });
      
          console.log(result);
      
          if (!result.cancelled) {
            formdata.append("file", {name: 'bimdethuong.jpg' ,uri: result.uri, type:'image/jpeg'})
            setImage(result.uri);
          }
        }
      }
    })();   
  };
  const checkPassword=()=> {
    if (password.length == 0) {
      alert( 'Password field cannot be empty.');
    } else {
      fetch('http://192.168.0.101:19000/check_password', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            'user_id': dataUser.user_id,
            'password': password
        })
      })
      .then ((response) => response.json())
      .then ( (res) => { 
        if(res['password'] == 'true') {
          setModalVisible2(!modalVisible2);
          setModalVisible(false);
        } else {
          ToastAndroid.show("Please enter password again!", ToastAndroid.SHORT);
        }
      })
      .catch ((error) => {
        console.log(error);
      })
    }
  }
  const update=()=> {  
    if ( fullname.length == 0 || username.length == 0 || email.length == 0 ) {
      alert( ' All of field cannot be empty.');
    } else if (username.length < 4){
      alert( 'Username >= 4 charater.');
    } else{
      formdata.append("file", {name: 'bimdethuong.jpg' ,uri: image, type:'image/jpeg'})
      fetch('http://192.168.0.101:19000/profile_change' , {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formdata
      })
      .then ((response) => response.json())
      .then ( (res) => { 
        if (res.new_account != 0 ) {
          ToastAndroid.show("Change sucussefull!", ToastAndroid.SHORT);
          getUserData();
        } else {
          ToastAndroid.show("Username or gmail is avalible", ToastAndroid.SHORT);
        }           
      })
      .catch ((error) => {
        console.log(error);
      })
    }
  }

  const getUserData = async () => {
    const req=await fetch("http://192.168.0.101:19000/author/" + dataUser.user_id);
    const data=await req.json();
    console.log('hh'+data)
    await AsyncStorage.setItem('user', data);
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
                'user_email': email,
                'user_id': dataUser.user_id,
            })
            })
            .then ((response) => response.json())
            .then ( (res) => { 
                showToast();
                props.navigation.navigate('homeAdmin');
                signOut();
            })
            .catch ((error) => {
                console.log(error);
          })
        } }
      ],
      { cancelable: false }
    );
  }

  const changePassword=()=>{
    if ( password.length == 0) {
      alert( 'Password cannot be empty.');
    } else{
      fetch('http://192.168.0.101:19000/change_password', {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          'user_id': dataUser.user_id,
          'password': password
      })
    })
      .then ((response) => response.json())
      .then ( (res) => { 
          setModalVisible2(false);
          signOut();  
      })
      .catch ((error) => {
        console.log(error);
      })
    }
  }
    return (
      <KeyboardAvoidingView style={{ flex: 1}}>
        <StatusBar hidden/>
        <View style={{ backgroundColor: '#8a2be2', height: 80, width: '100%'}} {...props}>
              <View style={{marginTop: 35, flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate('Home'); 
                    }}>
                        <AntDesign name="left" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                <View style={{flex: 5}}><Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}} numberOfLines={1}>Settings</Text></View>
              </View>
          </View>
         <ScrollView
          showsHorizontalScrollIndicator={false}
         >
          <View style={{marginLeft: 30, marginRight: 30}}>
              <TouchableOpacity style={{justifyContent: "center", alignItems: 'center'}}  onPress={pickImage}>
                <View 
                  style={{
                    width: Dimensions.get('window').width,
                    marginTop: 10, 
                    justifyContent: "center", 
                    alignItems: 'center',
                    height: 280}}>
                  {image && <Image source={{ uri: image }} style={{  width: '80%', height: 280 }} />}
                </View>
              </TouchableOpacity>
              <Text style={[styles.title, {
                marginTop: 20
              }]}>Fullname:</Text>
              <View style={styles.action}>
                <TextInput
                  value = {fullname}
                  style={styles.textInput}
                  onChangeText={fullname=> setFullname(fullname)}
                /> 
              </View>
              <Text style={[styles.title, {
                marginTop: 20
              }]}>Username:</Text>
              <View style={styles.action}>
                <TextInput
                  value={username}
                  style={styles.textInput}
                  onChangeText={(username)=> setUsername(username)}
                /> 
              </View>
              <Text style={[styles.title, {
                marginTop: 20
              }]}>Password:</Text>
              <TouchableOpacity style={styles.action} onPress={()=> setModalVisible(!modalVisible)}>
                <TextInput
                    value={password}
                    secureTextEntry
                    editable={false}
                    style={styles.textInput}
                  /> 
              </TouchableOpacity>
              <Text style={[styles.title, {
                marginTop: 20
              }]}>Email:</Text>
              <View style={styles.action}>
                <TextInput
                  value={email}
                  onChangeText={email=> setEmail(email)}
                  style={styles.textInput}
                /> 
              </View>
              <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-around'}}>
                <TouchableOpacity onPress={()=> update()} style={styles.updateButton}>
                  <Text style={{color: 'white', fontSize: 15}}>Update profile</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=> deleteAccount()} style={styles.updateButton}>
                  <Text style={{color: 'white', fontSize: 15}}>Delete account</Text>
                </TouchableOpacity>
              </View>
          </View>
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
                <View style={styles.HeaderModal}>
                  <Text style={styles.HeaderText}>Confirm Password</Text>
                  <TouchableOpacity
                      style={styles.close}
                      onPress={() => {
                        setModalVisible(!modalVisible);
                      }}
                    >
                      <AntDesign name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <View style={{borderBottomWidth: 1, borderColor: 'grey', alignItems: "center", marginTop: 50}}>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>Enter your Password</Text>
                  <View style={{flexDirection: 'row'}}>
                    <TextInput 
                      secureTextEntry={display}
                      placeholder='Enter your password....'
                      onChangeText={text => setPassword(text)}
                      onSubmitEditing={()=> checkPassword()}
                      returnKeyType='done'
                    />
                    <TouchableOpacity onPress={()=> setDisplay(!display)} style={{marginLeft: 10}}>
                      <Feather name={display? "eye-off":"eye"} size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
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
                <View style={styles.HeaderModal}>
                  <Text style={styles.HeaderText}>Changing new password</Text>
                  <TouchableOpacity
                      style={styles.close}
                      onPress={() => {
                        setModalVisible2(!modalVisible2);
                      }}
                    >
                      <AntDesign name="close" size={24} color="black" />
                  </TouchableOpacity>
                </View>
                <View style={{borderBottomWidth: 1, borderColor: 'grey', alignItems: "center", marginTop: 50}}>
                  <Text style={{fontSize: 18, fontWeight: 'bold'}}>Enter new password</Text>
                  <View style={{flexDirection: 'row'}}>
                    <TextInput 
                      secureTextEntry={display}
                      placeholder='Enter your password....'
                      onChangeText={text => setPassword(text)}
                      onSubmitEditing={()=> changePassword()}
                      returnKeyType='done'
                    />
                    <TouchableOpacity onPress={()=> setDisplay(!display)}>
                      <Feather name={display?"eye-off":"eye"} size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Modal>
         </ScrollView>
      </KeyboardAvoidingView>
    );
}
export {SettingsScreen};

var styles = StyleSheet.create ({
  title: {
    color: "black",
    fontWeight: 'bold'
  },

  action: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: 'grey'
  },
  textInput: {
      flex: 1,
      marginTop: 5,
      paddingBottom: 5,
      color: "grey"
  },
  centeredView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: "center"
  },
  modalView: {
    backgroundColor: "white",
    alignItems: "center",
    height: 200,
    width: '90%',
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
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    flex: 1
  },
  close: {
    flex: -1,
    marginRight: 10
  },
  updateButton: {
    backgroundColor: '#8a2be2', 
    margin: 5, 
    padding: 10, 
    justifyContent: 'center', 
    alignItems: "center", 
    borderRadius: 10
  }
});
