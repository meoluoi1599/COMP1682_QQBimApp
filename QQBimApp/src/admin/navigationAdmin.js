import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";

import {adminPages, reportDetail, chapterContent} from '../admin'
import {TouchableOpacity, Text} from 'react-native'
import { AuthContext } from '../../App';

const Stack = createStackNavigator();

function navigationAdmin (props){
  const { signOut } = React.useContext(AuthContext);
  return (
    <Stack.Navigator mode="modal">
      <Stack.Screen name="homeAdmin" component={adminPages} 
       options = {{
        title: 'QQBim Manager',
          headerStyle: {
            backgroundColor: '#8a2be2',
          },
          headerTintColor: '#fff',
          headerRight: () => (<TouchableOpacity onPress={() => {signOut()}}><Text style={{color: 'white', marginRight: 10}}>Sign out</Text></TouchableOpacity>)
        }}
      />
      <Stack.Screen name="detailReport" component={reportDetail} 
       options = {{
        title: 'Report',
          headerStyle: {
            backgroundColor: '#8a2be2',
          },
          headerTintColor: '#fff',
        }}
      />
      <Stack.Screen name="chapterContent" component={chapterContent} 
       options = {{
        title: 'Content',
          headerStyle: {
            backgroundColor: '#8a2be2',
          },
          headerTintColor: '#fff',
          headerShown:false
        }}
      />
    </Stack.Navigator>
  )
} 
export {navigationAdmin};