import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import {ListUserChatScreen, ChatScreen} from '../ScreemFolder/NotificationScreen'
import { NotificationStackScreen } from '../NavigationScreen/NotificationStackScreen';

const Chat = createStackNavigator();

function ChatStackScreen(props) {
  return (
    <Chat.Navigator>
      <Chat.Screen name="Notification" component={NotificationStackScreen} 
        options = {{
          title: 'Notification',
          headerStyle: {
            backgroundColor: '#8a2be2',
          },
          headerTintColor: '#fff',
         }} 
      />
      <Chat.Screen name="Comunication" component={ChatScreen} />
    </Chat.Navigator>
  );
} export {ChatStackScreen}
