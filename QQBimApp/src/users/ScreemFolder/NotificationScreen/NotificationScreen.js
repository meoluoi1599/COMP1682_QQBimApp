import React from 'react';
import { StyleSheet, StatusBar, View, Image, Text, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import {SplashScreen} from '../OtherScreen'
function NotificationScreen() {
  const [dataSource, setDataSource ]= React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  
  const getUserData = async () => {
    try {
      AsyncStorage.getItem('user').then((value) => {
        const jsonValue = JSON.parse(value);
        getNotification(jsonValue);
      })
    } catch(e) {
      console.log(e)
    }
  }
  const getNotification =(jsonValue)=> {
    fetch('http://192.168.0.101:19000/notification/' + jsonValue.user_id)
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

  function ListEmpty() {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center'}}>  
        <Text style={{fontSize: 20, color: 'black', marginTop: 20, marginBottom: 20}}>You don't have any notification</Text>
      </View>
    );
  };

  React.useEffect(() => {
    getUserData();
  }, []);
  return (
    <View style={{ flex: 1, backgroundColor: 'white'}}>
      <StatusBar hidden/>
      {isLoading ? <SplashScreen/> : (
          <FlatList
            data={dataSource}
            keyExtractor= {item => item.follow_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.content}>
                  <View style={{flex: 1}}>
                    <Image style={{ width: 60, height: 60, borderRadius: 50}}
                        source={{uri: item.user_avatar}} 
                    />
                  </View>
                  <Text style={{flex:3, marginLeft: 5, fontSize: 15}} numberOfLines={3}><Text style={{fontWeight: 'bold', fontSize: 15}}>{item.fullname}</Text> {item.notification_content}</Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={ListEmpty}
          />    
      )}
    </View>
  )   
} export {NotificationScreen};
 
const styles = StyleSheet.create({
    content: {
      flexDirection: 'row',
      padding: 10,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.00,
      elevation: 1,
    }
});