import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";

import {LogInScreen, SignUpScreen, ForgotPasswordScreen} from '../ScreemFolder/EnterTheApp';

const Stack = createStackNavigator();
function StackScreen ({ navigation }){
  return (
    <Stack.Navigator mode="modal">
      <Stack.Screen name="SignIn" component={LogInScreen} options={{
            headerShown: false
          }} />
      <Stack.Screen name="SignUp" component={SignUpScreen}  options={{
            headerShown: false
          }}/>
      <Stack.Screen name="Reset Password" component={ForgotPasswordScreen}  
        options = {{
          title: 'Reset Password',
          headerStyle: {
            backgroundColor: '#8a2be2',
          },
          headerTintColor: '#fff'
        }}
      />
    </Stack.Navigator>
  )
} 
export {StackScreen};