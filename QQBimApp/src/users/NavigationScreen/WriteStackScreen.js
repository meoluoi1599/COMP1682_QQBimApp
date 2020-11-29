import React from 'react';
import { createStackNavigator, HeaderBackground } from "@react-navigation/stack";
import { AntDesign } from '@expo/vector-icons'

import {UserStoryScreen, NewStory, NewPart, ListChapterScreen, EditStory, EditPart} from '../ScreemFolder/StoryScreen';
import { TouchableOpacity } from 'react-native-gesture-handler';

const WriteStack = createStackNavigator();
const WriteStackScreen = ({ navigation }) => (
  <WriteStack.Navigator mode="modal">
    <WriteStack.Screen
      name="YourStory"
      component={UserStoryScreen} 
      options = {{
        title: 'Your story',
        headerStyle: {
          backgroundColor: '#8a2be2',
        },
        headerTintColor: '#fff',
        headerRight: () => (
          <TouchableOpacity onPress={()=> navigation.navigate('NewStory')}>
            <AntDesign name="addfile" size={24} color="white" style={{marginRight: 10}} />
          </TouchableOpacity>
        ),
      }}

    />
    <WriteStack.Screen
      name="NewStory"
      component={NewStory} 
      options = {{
        title: 'Write your story',
          headerStyle: {
            backgroundColor: '#8a2be2',
          },
          headerTintColor: '#fff',
        }}
    />
    <WriteStack.Screen
      name="NewPart"
      component={NewPart} 
      options = {{
        title: 'Write your chapter',
          headerStyle: {
            backgroundColor: '#8a2be2',
          },
          headerTintColor: '#fff',
        }}
    />
    <WriteStack.Screen
      name="ListChapter"
      component={ListChapterScreen} 
      options = {{
        title: 'Write your chapter',
          headerStyle: {
            backgroundColor: '#8a2be2',
          },
          headerTintColor: '#fff',
        }}
    />
    <WriteStack.Screen
      name="EditStory"
      component={EditStory} 
      options = {{
        title: 'Change your story',
          headerStyle: {
            backgroundColor: '#8a2be2',
          },
          headerTintColor: '#fff',
        }}
    />

    <WriteStack.Screen
      name="EditPart"
      component={EditPart} 
      options = {{
        title: 'Change chapter',
          headerStyle: {
            backgroundColor: '#8a2be2',
          },
          headerTintColor: '#fff',
        }}
    />
  </WriteStack.Navigator>
)
export  {WriteStackScreen};