import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { LibaryStackScreen } from '../NavigationScreen';
import {DetailListStory, DetailUserList} from '../ScreemFolder/ListStoryScreen'

const ListStory = createStackNavigator();

function ListStoryStack(props) {
  return (
    <ListStory.Navigator>
      <ListStory.Screen name="Libary" component={LibaryStackScreen}
        options = {{
          title: 'Libary',
          headerStyle: {
            backgroundColor: '#8a2be2',
          },
          headerTintColor: '#fff',
         }} 
      />
      <ListStory.Screen name="DetailList" component={DetailListStory} 
        options = {{
            title: 'Detail List Story',
            headerStyle: {
              backgroundColor: '#8a2be2',
            },
            headerTintColor: '#fff',
        }} 
      />
      <ListStory.Screen name="DetailUserList" component={DetailUserList} 
        options = {{
            title: 'Detail List Story',
            headerStyle: {
              backgroundColor: '#8a2be2',
            },
            headerTintColor: '#fff',
        }} 
      />
    </ListStory.Navigator>
  );
} export {ListStoryStack}
