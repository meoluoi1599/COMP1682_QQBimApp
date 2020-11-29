/**
 * @format
 */
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  ImageBackground,
  StatusBar,
  Alert,
  TouchableHighlight,
  TouchableOpacity
} from 'react-native';
import { ScrollView, TextInput } from 'react-native-gesture-handler';
import { AuthContext } from '../../../../App';
import { Feather} from '@expo/vector-icons'; 

const SignUpScreen = ({navigation}) => {
  const [display, setDisplay] = React.useState(true);
  const [data, setData] = React.useState({
    fullname: '',
    username: '',
    password: '',
    pw1: '',
    email: '',
    // dataSource: [],
    isValidName: true,
    isValidUser: true,
    isValidPassword: true,
    isValidEmail: true
  });

  const { signUp } = React.useContext(AuthContext);

  const handleNameChange = (fName) => {
    if( fName.trim().length >= 4 ) {
        setData({
            ...data,
            fullname: fName,
            isValidName: true
        });
    } else {
        setData({
            ...data,
            fullname: fName,
            isValidName: false
        });
    }
  }

  const textInputChange = (uName) => {
    if( uName.trim().length >= 4 ) {
        setData({
            ...data,
            username: uName,
            check_textInputChange: true,
            isValidUser: true
        });
    } else {
        setData({
            ...data,
            username: uName,
            check_textInputChange: false,
            isValidUser: false
        });
    }
  }

  const handlePasswordChange = (pw) => {
   if( pw.trim().length >= 8) {
        setData({
            ...data,
            password: pw,
            isValidPassword: true
        });
    } else {
        setData({
            ...data,
            password: pw,
            isValidPassword: false
        });
    }
  }

  const handlePassword1Change = (pw1) => {
    if( pw1.trim().length >= 8) {
         setData({
             ...data,
             pw1: pw1,
         });
     } else {
         setData({
             ...data,
             pw1: pw1,
         });
     }
   }

  const handleEmailChange = (Email) => {
    if( Email.trim().length >= 8) {
        setData({
            ...data,
            email: Email,
            isValidEmail: true
        });
    } else {
        setData({
            ...data,
            email: Email,
            isValidEmail: false
        });
    }
  }

  const loginHandle = (fullname, username, password, email) => {
    if ( data.fullname.length == 0 || data.username.length == 0 || data.password.length == 0 || data.email.length == 0 ) {
      alert( ' All of field cannot be empty.');
    } else if (data.username.length < 4){
      alert( 'Username >= 4 character.');
    } else if (data.password.length < 6){
      alert( 'Password >= 6 character.');
    } else if (data.pw1 != data.password){
      alert( 'Password and confirm password is defferent.');
    }
    else{
      fetch('http://192.168.0.101:19000/signup' , {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'nick_name': data.fullname,
            'username': data.username,
            'password': data.password,
            'email': data.email
          })
      })
      .then ((response) => response.json())
      .then ( (res) => { 
        if (res.new_account != 0 ) {
          data.fullname='';
          data.username='';
          data.password='';
          data.email='';
          data.pw1 ='';
          Alert.alert(
            "Your accout created ",
            "Do you want to access your new account?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => navigation.navigate('SignIn') }
            ],
            { cancelable: false }
          ); 
        } else {
          alert("Username or Gmail is available.");
        }           
      })
      .catch ((error) => {
        console.log(error);
      })
    }
  }
    return (
      <View style={styles.container}>
        <StatusBar hidden/>
        <View style={styles.header}>
          <ImageBackground
            source={require("../../Images/header.png")}
            style={styles.imagebackground}
          >
            <Text style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: 30
            }}>Sign up an account</Text>
            <Text style={{color: 'yellow'}}>Fill the blanks to continue </Text>
          </ImageBackground>
        </View>
  
        <View style={styles.footer}>
          <ScrollView
            showsHorizontalScrollIndicator={false}>
            <Text style={styles.title}      
              >Full Name</Text>
            <View style={styles.action}>
              <TextInput
              placeholder='Your name...'
              value= {data.fullname}
              style={styles.textInput}
              onChangeText={(fName) => handleNameChange(fName)}
              />
            </View>
            <Text style={[styles.title, {
              marginTop: 10
            }]}      
            >Username</Text>
            <View style={styles.action}>
              <TextInput
              placeholder='Your username...'
              maxLength = {50}
              value= {data.username}
              style={styles.textInput}
              onChangeText={(uName) => textInputChange(uName)}
              />
            </View>
            <Text style={[styles.title, {
              marginTop: 10
            }]}>Password</Text>
            <View style={styles.action}>
              <TextInput
                placeholder='Your password...'
                secureTextEntry={display}
                value={data.password}
                style={styles.textInput}
                onChangeText={ (pw) =>handlePasswordChange(pw)}
              />
              <TouchableOpacity onPress={()=> setDisplay(!display)} style={{marginLeft: 10}}>
                <Feather name={display? "eye-off":"eye"} size={24} color="black" />
              </TouchableOpacity>
            </View>
            <Text style={[styles.title, {
              marginTop: 10
            }]}>Confirm Password</Text>
            <View style={styles.action}>
              <TextInput
                placeholder='Your password...'
                secureTextEntry
                value={data.pw1}
                style={styles.textInput}
                onChangeText={ (pw1) =>handlePassword1Change(pw1)}
              /> 
            </View>
            <Text style={[styles.title, {
              marginTop: 10
            }]}      
            >Email</Text>
            <View style={styles.action}>
              <TextInput
              placeholder='Your email...'
              value={data.email}
              style={styles.textInput}
              onChangeText={(Email) => handleEmailChange(Email)}
              />
            </View>
            <TouchableHighlight
              style={styles.logIn}
              underlayColor='#fff'
              onPress={() => {loginHandle(data.fullname, data.username, data.password, data.email)}}
              >
                <Text style={[styles.logInText]}>Sign Up</Text>
            </TouchableHighlight>
          </ScrollView>
        </View>
      </View>
    );
} 
export {SignUpScreen};

var styles = StyleSheet.create ({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center"
    },

    header: {
        flex:1,
    },

    footer: {
        flex: 2,
        padding: 20,
        fontSize: 20
    },

    imagebackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%"
    },

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

    logIn:{
        marginTop: 20,
        paddingTop: 15,
        paddingBottom: 15,
        backgroundColor:'#93278f',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#fff'
    },

    logInText:{
        color:'#fff',
        textAlign:'center'
    }
});
