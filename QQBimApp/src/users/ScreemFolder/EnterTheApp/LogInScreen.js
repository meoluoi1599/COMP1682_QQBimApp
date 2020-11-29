import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  ImageBackground,
  StatusBar,
  TouchableHighlight,
  TouchableOpacity,
  Button
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Feather} from '@expo/vector-icons'; 
import { AuthContext } from '../../../../App';

const LogInScreen = ({navigation}) => {
  const [display, setDisplay] = React.useState(true);
  const [data, setData] = React.useState({
    username: '',
    password: '',
    // dataSource: [],
    check_textInputChange: false,
    isValidUser: true,
    isValidPassword: true
  });

  const { signIn } = React.useContext(AuthContext);
  const { signOut } = React.useContext(AuthContext);

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
    if( pw.trim().length >= 8 ) {
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

  const loginHandle = (username, password) => {
    if ( data.username.length == 0 || data.password.length == 0 ) {
      alert( 'Username or password field cannot be empty.');
      return;
    } else {
      fetch('http://192.168.0.101:19000/login' , {
          method: 'POST',
          headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            'username': data.username,
            'password': data.password
          })
      })
      .then ((response) => response.json())
      .then ( (res) => { 
        console.log(res)
        if (res.token.length != 0 ) {
          signIn(res);
        } else {
          alert("Username or password is incorrect");
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
            }}>Wellcome back</Text>
            <Text style={{color: 'yellow'}}>Sign in to continute</Text>
          </ImageBackground>
        </View>
  
        <View style={styles.footer}>
          <Text style={[styles.title, {
            marginTop: 40
          }]}      
          >Username</Text>
          <View style={styles.action}>
            <TextInput
            placeholder='Your username...'
            style={styles.textInput}
            onChangeText={(uName) => textInputChange(uName)}
            />
          </View>
          <Text style={[styles.title, {
            marginTop: 20
          }]}>Password</Text>
          <View style={[styles.action, {flexDirection: 'row'}]}>
            <TextInput
            placeholder='Your password...'
            secureTextEntry= {display}
            style={styles.textInput}
            onChangeText={ (pw) =>handlePasswordChange(pw)}
            />
            <TouchableOpacity onPress={()=> setDisplay(!display)} style={{marginLeft: 10}}>
              <Feather name={display? "eye-off":"eye"} size={24} color="black" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Reset Password')} style={{ alignItems: 'flex-end', marginTop: 5}}><Text>Forgot password?</Text></TouchableOpacity>
          <TouchableHighlight
            style={styles.logIn}
            underlayColor='#fff'
            onPress={() => {loginHandle( data.username, data.password )}}
            >
              <Text style={[styles.logInText]}>Log in</Text>
          </TouchableHighlight>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={{marginTop: 50, justifyContent: "center", alignItems: "center"}}> 
            <Text>
              Do you have account? 
              <Text style={{fontWeight: 'bold'}}>SignUp</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
} 
export {LogInScreen};

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
        padding: 20
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
        marginTop: 40,
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
