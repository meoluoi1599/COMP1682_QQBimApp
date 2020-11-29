import React, {useEffect, useMemo, useReducer} from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from '@react-native-community/async-storage';
import {StackScreen, DrawerScreen} from './src/users/NavigationScreen';
import {SplashScreen} from './src/users/ScreemFolder/OtherScreen';
import * as SQLite from 'expo-sqlite';
import { navigationAdmin } from "./src/admin";
export const AuthContext = React.createContext();

global.db = SQLite.openDatabase(
  {
    name: 'SQLite',
    location: 'default',
    createFromLocation: '~SQLite.db',
  },
  () => { },
  error => {
    console.log("ERROR: " + error);
  }
);

const RootStack = createStackNavigator();
function App(props) {
  const initialState = {
    isLoading: true,
    isSignout: false,
    userToken: null,
    userRole: null,
    user: []
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case 'RESTORE_TOKEN':
        return {
          ...state,
          userRole: action.userRole,
          userToken: action.userToken,
          user: action.user,
          isLoading: false,
        };
      case 'SIGN_IN':
        return {
          ...state,
          userRole: action.userRole,
          user: action.user,
          isSignout: false,
          userToken: action.userToken,
        };
      case 'SIGN_OUT':
        return {
          ...state,
          userRole: null,
          isSignout: true,
          userToken: null,
          user: null
        };
      default:
        return state;
     }
  }
 
  const [state, dispatch] = useReducer(reducer, initialState);
  const authContext = useMemo(() => ({
    signIn: async(res) => {
      const userToken = String(res.token);
      const userRole = res.role;
      const user = JSON.stringify(res);
      // console.log(res);
      try {
        await AsyncStorage.setItem('userToken', userToken);
        await AsyncStorage.setItem('user', user);
        await AsyncStorage.setItem('userRole', userRole);
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'SIGN_IN', userRole: userRole, userToken: userToken, user: user});
    },
    signOut: async() => {
      // setUserToken(null);
      // setIsLoading(false);
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('userRole');
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'SIGN_OUT', userRole: null, userToken: null, user: null });
    },
    signUp: async(res) => {
      const userToken = String(res.token);
      const userRole = String(res.role);
      try {
        await AsyncStorage.setItem('userToken', userToken);
      } catch(e) {
        console.log(e);
      }
      dispatch({ type: 'SIGN_IN', userRole: userRole, userToken: userToken });
    },
  }), []);

  useEffect(() => {
    setTimeout(async() => {
      // setIsLoading(false);
      let userToken;
      userToken = null;
      let userRole = null;
      try {
        userToken = await AsyncStorage.getItem('userToken');
        userRole = await AsyncStorage.getItem('userRole');
      } catch(e) {
        console.log(e);
      }
      // console.log('user token: ', userToken);
      dispatch({ type: 'RESTORE_TOKEN', userToken: userToken, userRole: userRole });
    }, 1000);
  }, []);

  if( state.isLoading ) {
    return(
      <SplashScreen/>
    );
  }
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <RootStack.Navigator>
          {state.userToken == null ? (  
              // No token found, user isn't signed in
              <RootStack.Screen
                name="SignIn"
                component={StackScreen}
                options={{
                  title: 'Sign in',
                  headerShown: false,
              // When logging out, a pop animation feels intuitive
                  animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                }}
              />
            ) :  state.userRole == 'user'? (
              // User is signed in
              <RootStack.Screen name="Home" component={DrawerScreen}  options={{
                title: 'Home',
                headerShown: false}}/>
            ) : state.userRole == 'manager'? (
              <RootStack.Screen
                name="admin"
                component={navigationAdmin}
                options={{
                  title: 'admin',
                  headerShown: false,
                }}
              />
            ): (
              <RootStack.Screen
                name="SignIn"
                component={StackScreen}
                options={{
                  title: 'Sign in',
                  headerShown: false,
              // When logging out, a pop animation feels intuitive
                  animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                }}
              />
            )}
        </RootStack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>

  );
}
export default App;