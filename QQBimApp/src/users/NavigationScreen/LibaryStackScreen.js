import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {LibariesScreen} from '../ScreemFolder/StoryScreen';
import {ListStoryScreen} from '../ScreemFolder/ListStoryScreen'

const Tab = createMaterialTopTabNavigator();

function LibaryStackScreen() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Libary" component={LibariesScreen} />
      <Tab.Screen name="List story" component={ListStoryScreen} />
    </Tab.Navigator>
  );
} export {LibaryStackScreen}
