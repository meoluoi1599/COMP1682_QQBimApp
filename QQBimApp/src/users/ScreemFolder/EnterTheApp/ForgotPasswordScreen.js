import * as React from 'react';
import { 
    View, 
    Text, 
    StyleSheet,
    Alert,
    StatusBar,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
    Modal,
    ToastAndroid
} from 'react-native';
import { FontAwesome, AntDesign } from '@expo/vector-icons';

function ForgotPasswordScreen ({navigation}) {
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalVisible2, setModalVisible2] = React.useState(false);
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [code, setCode] = React.useState('');
    const [data, setData] = React.useState('');

    const check_username =() => {
        if (username.length == 0) {
            ToastAndroid.show("Username isn't empty.", ToastAndroid.SHORT);
        } else {
            fetch('http://192.168.0.101:19000/code_password/' + username)
            .then ((response) => response.json())
            .then ( (res) => { 
            if (res != 0) {
                setModalVisible(!modalVisible);
            } else {
                ToastAndroid.show("Plase check your username", ToastAndroid.SHORT);
            }
            })
            .catch ((error) => {
            console.log(error);
            })
        }
    }

    const check_code =() => {
        fetch('http://192.168.0.101:19000/check_code/' + code)
        .then ((response) => response.json())
        .then ( (res) => { 
            if (res != 0) {
                setModalVisible(!modalVisible);
                setModalVisible2(!modalVisible2);
                setData(res);
            } else {
                ToastAndroid.show("Plase check the code", ToastAndroid.SHORT);
            }
        })
        .catch ((error) => {
            console.log(error);
        })
    }

    const change_password =() => {
        fetch('http://192.168.0.101:19000/reset_password', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'password': password,
                'username': data.username,
                'code': data.current_code
            })
        })
        .then ((response) => response.json())
        .then ( (res) => { 
            if (res.new_account != 0 ) {
                setModalVisible2(!modalVisible2)
                Alert.alert(
                "Your password changed",
                "Do you want to access your account?",
                [
                  {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                  },
                  { text: "OK", onPress: () => navigation.navigate('SignIn') }
                ],
                { cancelable: false }
            );} else {
                alert("There are some error. Please change again.");
            }
        })
        .catch ((error) => {
            console.log(error);
        })
    }

    return (
      <View style={[styles.container]}>
            <View style={{alignItems: 'center', margin: 20}}>
                <Text style={styles.header}>Please Enter Your Username</Text>
                <View style={styles.action}>
                    <TextInput
                        placeholder='Your username...'
                        style={styles.textInput}
                        onChangeText={uName => setUsername(uName)}
                    />
                </View>
            </View>
          <TouchableOpacity style={{alignItems: 'flex-end', marginTop: 10, marginRight: 20}} onPress={()=> check_username()}>
            <AntDesign name="rightcircle" size={50} color="#9370db" />
          </TouchableOpacity>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible)
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TouchableHighlight
                onPress={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <FontAwesome name="close" size={24} color="#93278f" />
              </TouchableHighlight>
              <Text style={styles.header}>Please enter the code</Text>
              <View style={styles.action}>
                    <TextInput
                        placeholder='The code...'
                        style={styles.textInput}
                        onChangeText={code => setCode(code)}
                        onSubmitEditing={check_code}
                    />
                </View>
            </View>
          </View>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible2}
          onRequestClose={() => {
            setModalVisible2(!modalVisible2)
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
                <TouchableHighlight
                    onPress={() => {
                    setModalVisible2(!modalVisible2);
                    }}
                >
                    <FontAwesome name="close" size={24} color="#93278f" />
                </TouchableHighlight>
              <Text style={styles.header}>Please enter new password</Text>
              <View style={styles.action}>
                    <TextInput
                        placeholder='The code...'
                        style={styles.textInput}
                        secureTextEntry
                        onChangeText={pw => setPassword(pw)}
                        onSubmitEditing={change_password}
                    />
                </View>
            </View>
          </View>
        </Modal>
      </View>
    );
}
export {ForgotPasswordScreen};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
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
        color: "black",
    },
    header: {
        fontWeight: 'bold',
        fontSize: 18
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
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
});