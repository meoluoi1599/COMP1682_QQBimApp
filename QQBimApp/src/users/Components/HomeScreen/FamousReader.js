import React, { useState } from 'react';
import { FlatList, StyleSheet, Image, View, TouchableOpacity, Text, AsyncStorage} from 'react-native';
import {SplashScreen} from '../../ScreemFolder/OtherScreen';
import { useFocusEffect } from '@react-navigation/native';

function  FamousReader(props) {
  const [isLoading, setLoading] = React.useState(false);
  const [dataSource, setDataSource ]= React.useState([]);
  const [userData, setUserData] = React.useState([]);

  useFocusEffect(
    React.useCallback(() => {
      getData();
      fetch('http://192.168.0.101:19000/famous')
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
      })
    } catch(e) {
      console.log(e)
    }
  }
  return (
    <View>
      {isLoading? <SplashScreen/>: (
        <View>
          <Text style={style.text}> Top 10 Famous Reader</Text>
          <View style={style.container}>
            <FlatList
              data={dataSource}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={item => item.user_id.toString()}
              renderItem={({item}) => (
                <TouchableOpacity onPress={() => {
                  if(item.user_id != userData.user_id){
                    props.navigation.navigate('DetailUser', {item: item});
                  }else {
                    props.navigation.navigate('AboutUser');
                  }
                }}>
                    <Image style={style.image}
                        source={{uri: item.user_avatar}} 
                    />
                </TouchableOpacity>        
              )}
            />
        </View>
        </View>
      )}
    </View>
  );
} export {FamousReader}

const style = StyleSheet.create({
    container: {
        padding: 5,
        
    },
    image: {
        marginRight: 10,
        width: 70, 
        height: 70, 
        borderRadius: 50
    },
    text: {
      margin: 5,
      fontSize: 20,
      fontWeight: 'bold',
    }
});
