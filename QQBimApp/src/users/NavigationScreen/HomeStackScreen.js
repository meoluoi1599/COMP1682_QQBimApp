import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text } from 'react-native';
import {HomeScreen, SettingsScreen} from '../ScreemFolder/OtherScreen';
import {ProfileScreen, AboutScreen} from '../ScreemFolder/UserScreen';
import {ReadingScreen, DetailStoryScreen, NewStory, ReportStoryScreen} from '../ScreemFolder/StoryScreen';
import {DetailListStory,DetailUserList} from '../ScreemFolder/ListStoryScreen';
import { CategoryDetail } from '../Components/CategoryComponent';
import { SearchResult, BarSearchScreen, SearchUser } from '../ScreemFolder/SearchScreen'
import { ChatScreen } from '../ScreemFolder/NotificationScreen';

const HomeStack = createStackNavigator();
const HomeStackScreen = (props) => (
<HomeStack.Navigator mode="modal">
    <HomeStack.Screen 
      name="Home" 
      component={HomeScreen}
      options = {{
        title: 'Home',
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#8a2be2',
        },
        headerShown: false,
        headrTintColor: '#fff',
       }}
    />  
    <HomeStack.Screen 
      name="DetailStory" 
      options = {{
        title: 'Detail story',
        headerStyle: {
          backgroundColor: '#8a2be2',
        },
        headerTintColor: '#fff'
       }}
      component={DetailStoryScreen}
    />
    <HomeStack.Screen 
      name="Reading" 
      label= 'Reading' 
      component={ReadingScreen} 
      options={{
        headerShown: false,
        tabBarVisible: false,
        headerStyle: {
          backgroundColor: '#8a2be2',
        },
        headerTintColor: '#fff',
        headerRight: ()=> (
          <TouchableOpacity>
            <Ionicons name="md-menu" size={40} color="white" style={{marginRight: 20}}/>
          </TouchableOpacity>
        )
      }}
    />
    <HomeStack.Screen name="result" component={SearchResult} 
      options = {(props) => ({
          title: 'Result search',
          headerStyle: {
            backgroundColor: '#8a2be2',
          },
          headerTintColor: 'white',
          headerTitle: () => (<TouchableOpacity onPress={()=> props.navigation.navigate('SearchScreen')}
                          style={{backgroundColor: 'white', alignItems:'center',flexDirection:'row', flex: 5, borderRadius:40}}>
                            <Ionicons name='md-search' size={30} style={{marginLeft:10}}/>
                          <Text>{props.route.params.search}</Text>
                        </TouchableOpacity> )
      })}
      
    />
    <HomeStack.Screen name="SearchScreen" component={BarSearchScreen} 
      options = {{
        title: '',
      }} 
    />
    <HomeStack.Screen
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
    <HomeStack.Screen 
      name="DetailCategory" 
      options = {{
        title: 'Category story',
        headerStyle: {
          backgroundColor: '#8a2be2',
        },
        headerTintColor: '#fff',
       }} 
      component={CategoryDetail}/>
    <HomeStack.Screen 
      name="DetailUser" 
      options = {{
        title: '',
        headerStyle: {
          backgroundColor: '#8a2be2',
        },
        headerTintColor: '#fff',
       }}  
      component={ProfileScreen} 
    />
    <HomeStack.Screen 
      name="AboutUser" 
      options = {{
        title: '',
        headerStyle: {
          backgroundColor: '#8a2be2',
        },
        headerTintColor: '#fff',
       }}  
      component={AboutScreen} 
    />
    <HomeStack.Screen name="DetailListStory" component={DetailListStory} 
        options = {{
            title: 'Detail List Story',
            headerStyle: {
              backgroundColor: '#8a2be2',
            },
            headerTintColor: '#fff',
        }} 
      />
    <HomeStack.Screen name="DetailUserList" component={DetailUserList} 
        options = {{
            title: 'Detail List Story',
            headerStyle: {
              backgroundColor: '#8a2be2',
            },
            headerTintColor: '#fff',
        }} 
      />
    <HomeStack.Screen name="Report" component={ReportStoryScreen} 
      options = {{
        title: 'Upload new report',
        headerStyle: {
          backgroundColor: '#8a2be2',
        },
        headerTintColor: '#fff',
       }} 
    />
    <HomeStack.Screen
      name="chatting"
      component={ChatScreen} 
      options = {{
        title: 'Comunication',
        }}
    />
    <HomeStack.Screen name="settings" component={SettingsScreen} 
      options = {{
        title: 'Settings',
        headerShown: false
       }}  
    />

    <HomeStack.Screen name="SearchUser" component={SearchUser} 
      options = {{
        title: '',
        headerStyle: {
          backgroundColor: '#8a2be2',
        },
        headerTintColor: '#fff',
       }} 
    />
  </HomeStack.Navigator>
)
export {HomeStackScreen};


