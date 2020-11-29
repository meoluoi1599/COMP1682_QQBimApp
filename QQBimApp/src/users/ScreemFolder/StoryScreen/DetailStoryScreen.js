import * as React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity, FlatList, AsyncStorage, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {ButtonReadingAdd, ListChapterModal} from '../../Components/DetailStoryScreen';
import { PrivateValueStore, useFocusEffect } from '@react-navigation/native';
import { Category } from '../../Components/CategoryComponent';
import { SplashScreen } from '../OtherScreen';

function DetailStoryScreen(props) {
  const [isLoading, setLoading] = React.useState(false)
  const [categoryData, setCategoryData] = React.useState([])
  const [userData, setUserData] = React.useState([]);
  const [dataAuthor, setDataAuthor] = React.useState([]);
  const data = [
    {id:"1"}
  ]

  useFocusEffect(
    React.useCallback(() => {
      props.navigation.dangerouslyGetParent().setOptions({
        tabBarVisible: true
       });
      getData();
      getCategory();
      getUser();
    }, [])
  );

  const getCategory=()=> {
    fetch('http://192.168.0.101:19000/category/'+ props.route.params.item.category_id)
    .then ((response) => response.json())
    .then ( (res) => { 
      setCategoryData(res);
    })
    .catch ((error) => {
      console.log(error);
    })
    .finally(() => {
      setLoading(false) 
    });
  }
  
  const getData=()=>{
    fetch('http://192.168.0.101:19000/author/' + props.route.params.item.author_id)
    .then ((response) => response.json())
    .then ( (res) => { 
      setDataAuthor(res);
    })
    .catch ((error) => {
      console.log(error);
    })
    .finally(() => {
      setLoading(false) 
    });
  }

  const getUser=()=> {
    try {
      AsyncStorage.getItem('user').then((value) => {
        const jsonValue = JSON.parse(value);
        setUserData(jsonValue);
      })
    } catch(e) {
      console.log(e)
    }
  }
  
  return (
    <View style={{ flex: 1, backgroundColor: 'white'}}>
      <StatusBar hidden/>
      <FlatList 
        showsVerticalScrollIndicator = {false}
        data={data}
        renderItem={(item) => (
        <>
          <View style={style.container}>
            <TouchableOpacity>
              <Image style={style.image}
                  source={{uri: props.route.params.item.story_img}} 
              />
            </TouchableOpacity>
              <Text style={{fontSize: 30, marginTop: 10}}>{props.route.params.item.story_title}</Text>
            <View>
              <FlatList
                data={dataAuthor}
                keyExtractor= {item => item.user_id.toString()}
                renderItem={({ item }) =>(
                  <TouchableOpacity style={style.author} onPress={() => {item.user_id != userData.user_id? props.navigation.navigate('DetailUser', {item: item}): props.navigation.navigate('AboutUser')}}>
                    <Image style={style.avatar}
                        source={{uri: item.user_avatar}} 
                    />
                    <Text style={{marginLeft: 5}}>@{item.username}</Text>
                  </TouchableOpacity>
                )}
              />
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name='ios-star' size={14}/>
                <Text style={{marginLeft: 5}}> 
                  {props.route.params.item.vote} Votes</Text>
                <Icon name='ios-list' size={14} style={{marginLeft: 10}}/>
                <Text style={{marginLeft: 5}}>
                  {props.route.params.item.parts} Parts</Text>
              </View>
            </View>
          </View>
          <ButtonReadingAdd {...props}/>
          <View style={style.description}>
              <Text style={{fontSize: 16, fontStyle: 'italic'}}>{props.route.params.item.story_description}</Text>
          </View>
          {isLoading?<SplashScreen/>: (
            <FlatList
              data={categoryData}
              horizontal
              ListHeaderComponent={headerComponet()}
              keyExtractor= {item => item.category_id.toString()}
              renderItem={({ item }) =>(
                <TouchableOpacity 
                  style={{marginLeft: 10}}
                  onPress={()=> {props.navigation.navigate('DetailCategory', {category_id: item.category_id})}}
                >
                  <Text style={{fontSize: 15}}>
                    {item.category}
                  </Text>
                </TouchableOpacity>
              )}
            />
          )}
          <ListChapterModal {...props}/>
       </>
      )}
      />
    </View>
  );

  function headerComponet() {
    return(
      <View>
        <Text style={{fontWeight: 'bold', marginLeft: 10, fontSize: 18}}>Tags:</Text>
      </View>
    )
  }
}
export {DetailStoryScreen};

const style = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  image: {
    width: 150,
    height: 200
  },
  author: {
    flexDirection: 'row', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 50
  },
  
  description: {
    padding: 20,
  },
}) 