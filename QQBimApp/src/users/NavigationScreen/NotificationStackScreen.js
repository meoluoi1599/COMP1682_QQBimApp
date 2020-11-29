import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NotificationScreen, ListUserChatScreen } from '../ScreemFolder/NotificationScreen';

const Tab = createMaterialTopTabNavigator();

function NotificationStackScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Notification" component={NotificationScreen} />
      <Tab.Screen name="Chatting" component={ListUserChatScreen} />
    </Tab.Navigator>
  );
} export {NotificationStackScreen}
