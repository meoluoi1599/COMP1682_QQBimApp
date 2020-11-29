import React from 'react';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import  Ionicons  from 'react-native-vector-icons/Ionicons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

import {ListStoryStack, HomeStackScreen, WriteStackScreen, SearchStackScreen,NotificationStackScreen} from '../NavigationScreen';
import { ChatStackScreen } from './ChatStackScreen';

const Tabs = createBottomTabNavigator();
const TabsScreen = ({ navigation }) => (
    <Tabs.Navigator 
          tabBarOptions={{
            activeTintColor: '#aa4fff',
          }} 
          mode="modal"
        >
        <Tabs.Screen 
          name="Home"
          component={HomeStackScreen}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ size, focused}) => (
              <Ionicons name="ios-home"  size={size} color={focused ? '#aa4fff' : 'gray'} />
            ),
          }}
        />
        <Tabs.Screen 
          name="Libaries" 
          component={ListStoryStack} 
          options={{
            tabBarLabel: '',
            tabBarIcon: ({focused, size }) => (
              <MaterialCommunityIcons name="library-shelves" color={focused ? '#aa4fff' : 'gray'} size={size} />
            ),
          }}
        />
        <Tabs.Screen 
          name="YourStory" 
          component={WriteStackScreen} 
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ focused, size }) => (
              <MaterialCommunityIcons name="pencil" color={focused ? '#aa4fff' : 'gray'} size={size} />
            ),
          }}
        />
        <Tabs.Screen 
          name="Ring" 
          component={ChatStackScreen}
          options={{
            tabBarLabel: '',
            tabBarIcon: ({ focused, size }) => (
              <Ionicons name="ios-notifications" color={focused ? '#aa4fff' : 'gray'} size={size} />
            ),
          }}
        />
        </Tabs.Navigator>
  )
  export {TabsScreen};