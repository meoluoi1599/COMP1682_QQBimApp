import React from 'react';
import { StyleSheet, Image, View, Dimensions, Text, AsyncStorage, FlatList} from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { TouchableOpacity } from 'react-native-gesture-handler';
import {SplashScreen} from '../../ScreemFolder/OtherScreen'

function  HeaderAboutPages(props) {
  const [dataSource, setDataSource ]= React.useState([]);
  const [isLoading, setLoading] = React.useState(true);

  const getData = async () => {
    try {
      AsyncStorage.getItem('user').then((value) => {
        const jsonValue = JSON.parse(value);
        getUerBook(jsonValue);
      })
    } catch(e) {
      console.log(e)
    }
  }

  const getUerBook=(jsonValue)=> {
    fetch('http://192.168.0.101:19000/author/' + jsonValue.user_id)
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

  React.useEffect(() => {
    getData();
  },[]);
 
  return (
    <View>
        {isLoading? <SplashScreen/>: ( 
        <View>
          <TouchableOpacity  style={{justifyContent: 'flex-end', alignItems: 'flex-end', marginRight:5, marginTop: 5}} onPress={()=> props.navigation.navigate('settings')}>
            <AntDesign name="setting" size={30} color="black"/>
          </TouchableOpacity>
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
                  </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
} export {HeaderAboutPages}

const style = StyleSheet.create({
    container: {
        padding: 5,
        width: Dimensions.get('window').width, 
        height: 160,
        justifyContent: 'center',
        alignItems: 'center'
    },
    image: {
        width: 100, 
        height: 100, 
        borderRadius: 50
    },
});
