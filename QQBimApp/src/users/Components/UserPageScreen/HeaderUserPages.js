import React, { useState } from 'react';
import { FlatList, StyleSheet, Image, View, Dimensions, Text, TouchableOpacity, AsyncStorage} from 'react-native';
import {SplashScreen} from '../../ScreemFolder/OtherScreen';
import { Feather, AntDesign,MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

function  HeaderUserPages(props) {
  const [isLoading, setLoading] = React.useState(false);
  const [dataSource, setDataSource ]= React.useState([]);
  const [followed, setFollowed] = React.useState(false);
  const [userData, setUserData] = React.useState([]);
  useFocusEffect(
    React.useCallback(() => {
      getInfotmation();
      getData();
      // Do something when the screen is focused
      return () => {
        console.log('un')
      };
    }, [])
  );

  const getData = async () => {
    try {
      AsyncStorage.getItem('user').then((value) => {
        const jsonValue = JSON.parse(value);
        setUserData(jsonValue);
        get_follow(jsonValue.user_id)
      })
    } catch(e) {
      console.log(e)
    }
  }

  const get_follow=(user_id)=> {
    fetch('http://192.168.0.101:19000/get_follow/'  + user_id + '/' + props.route.params.item.user_id )
    .then ((response) => response.json())
    .then ( (res) => { 
      if (res.length == 0) {
        setFollowed(false)
      } else {
        setFollowed(true);
      }
    })
    .catch ((error) => {
      console.log(error);
    })
  }

  const getInfotmation=()=>{
    fetch('http://192.168.0.101:19000/author/' + props.route.params.item.user_id)
    .then ((response) => response.json())
    .then ( (res) => { 
      setDataSource(res);
    })
    .catch ((error) => {
      console.log(error);
    })
    .finally(() => {
      setLoading(false) 
    });
  }

  const follow=(num_follower)=>{
    fetch('http://192.168.0.101:19000/follow', {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          'following_id': userData.user_id,
          'follower_id': props.route.params.item.user_id,
          'num_follower': num_follower + 1,
          'num_following': userData.num_following + 1
      })
    })
    .then ((response) => response.json())
    .then ( (res) => { 
      setFollowed(true);
    })
    .catch ((error) => {
        console.log(error);
    })
  }

  const unFollow=(num_follower)=> {
    fetch('http://192.168.0.101:19000/unfollow', {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          'following_id': userData.user_id,
          'follower_id': props.route.params.item.user_id,
          'num_follower': num_follower - 1,
          'num_following': userData.num_following - 1
      })
    })
    .then ((response) => response.json())
    .then ( (res) => { 
      setFollowed(false);
    })
    .catch ((error) => {
        console.log(error);
    })
  }

  return (
    <View>
      {isLoading? <SplashScreen/>: ( 
        <FlatList
          data={dataSource}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.user_id.toString()}
          renderItem={({item}) => (
            <View style={style.container}>
                <Image style={style.image}
                    source={{uri: item.user_avatar}} 
                />
                <Text style={{marginTop: 5, color: 'black', fontSize: 18, fontWeight: 'bold'}}>@{item.username}</Text>
                <View style={{flex:1}}> 
                  <View style={{flex:1, flexDirection: 'row'}}>
                    <Text style={{color: 'black'}}>{item.num_following} following</Text>
                    <Text style={{color: 'black', marginLeft: 10}}>{item.num_follower} follower</Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    {followed? 
                      <TouchableOpacity style={style.following} onPress={() => unFollow(item.num_follower)}>
                        <Text style={{color: 'white'}}> 
                          <Feather name="user-minus" size={20} color="white" /> Unfollowing
                        </Text>
                        </TouchableOpacity>: 
                      <TouchableOpacity style={style.following} onPress={() => follow(item.num_follower)}>
                        <Text style={{color: 'white'}}> 
                          <AntDesign name="adduser" size={20} color="white" /> Follow
                        </Text>
                      </TouchableOpacity>
                    }
                    <TouchableOpacity onPress={()=> props.navigation.navigate('chatting', {item: {'a': props.route.params.item.user_id}})} style={{marginLeft: 10}}>
                      <MaterialIcons name="message" size={35} color="#aa4fff" />
                    </TouchableOpacity>
                  </View>
                </View>  
            </View>
          )}
        />
      )}
    </View>
  );
} export {HeaderUserPages}

const style = StyleSheet.create({
    container: {
        padding: 5,
        width: Dimensions.get('window').width, 
        height: 230,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        marginTop: 20,
        width: 100, 
        height: 100, 
        borderRadius: 50
    },
    following: {
      alignItems: 'center',
      borderRadius: 10,
      justifyContent: 'center',
      backgroundColor: '#aa4fff',
      padding: 8,
      flexDirection: 'row'
    }
});
