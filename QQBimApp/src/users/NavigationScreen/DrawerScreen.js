import React from 'react';
import { createDrawerNavigator } from "@react-navigation/drawer";
import  Ionicons  from 'react-native-vector-icons/Ionicons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {TabsScreen, LibaryStackScreen, WriteStackScreen,ChatStackScreen} from '../NavigationScreen';
import {DrawerContent, SearchComponent} from '../Components/HomeScreen';
import { SettingsScreen } from '../ScreemFolder/OtherScreen';


const Drawer = createDrawerNavigator();
const DrawerScreen =(props)=> (
<Drawer.Navigator 
  drawerContent={props => <DrawerContent {...props}/>} 
  mode="modal"
>
    <Drawer.Screen 
      name="Home" 
      component={TabsScreen} 
      options={{
        drawerLabel: 'Home',
        drawerIcon: ({ size, focused}) => (
          <Ionicons name="ios-home"  size={size} color={focused ? '#aa4fff' : 'gray'} />
        ),
      }}
    />
    {/* <Drawer.Screen 
      name="comunity" 
      component={NewsFeedScreen}
      options={{
        drawerLabel: 'Profile',
        drawerIcon: ({ size, focused}) => (
          <Ionicons name="ios-person"  size={size} color={focused ? '#aa4fff' : 'gray'} />
        ),
      }}
    /> */}
    <Drawer.Screen 
      name="write" 
      component={WriteStackScreen}
      options={{
        drawerLabel: 'Your stories',
        drawerIcon: ({ size, focused}) => (
          <MaterialCommunityIcons name="pencil"  size={size} color={focused ? '#aa4fff' : 'gray'} />
        ),
      }}
    />
    <Drawer.Screen 
      name="libary" 
      component={LibaryStackScreen}
      options={{
        drawerLabel: 'Libary',
        drawerIcon: ({ size, focused}) => (
          <MaterialCommunityIcons name="library-shelves"   size={size} color={focused ? '#aa4fff' : 'gray'} />
        ),
      }}
    />
    <Drawer.Screen 
      name="notification" 
      component={ChatStackScreen}
      options={{
        drawerLabel: 'Notification',
        drawerIcon: ({ size, focused}) => (
          <Ionicons name="ios-notifications" size={size} color={focused ? '#aa4fff' : 'gray'} />
        ),
      }}
    />
    <Drawer.Screen 
      name="Settings" 
      component={SettingsScreen}
      options={{
        drawerLabel: 'Settings',
        drawerIcon: ({ size, focused}) => (
          <Ionicons name="ios-settings" size={size} color={focused ? '#aa4fff' : 'gray'} />
        ),
      }}
    />
    
    
  </Drawer.Navigator>
)
export {DrawerScreen}