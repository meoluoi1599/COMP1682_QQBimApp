import * as React from 'react';
import { View, FlatList, TouchableOpacity, Image, Text, StyleSheet, Dimensions, StatusBar, AsyncStorage} from 'react-native';
import { Searchbar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

function SearchUser (props) {
    const [searchValue, setSearchValue] = React.useState([]);
    const [dataSearch, setDataSearch] = React.useState([]);
    const [userData, setUserData] = React.useState([]);

    const searchUserFunction=()=> {
      fetch('http://192.168.0.101:19000/search_user/' + searchValue)
      .then ((response) => response.json())
      .then ( (res) => { 
        setDataSearch(res);
      })
      .catch ((error) => {
        console.log(error);
      })
    } 
    React.useEffect(()=>{
      getData();
    },[]);
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
      <View style={{flex: 1}}>
        <StatusBar hidden/>
        <Searchbar
          lightTheme
          placeholder="Search..."
          onSubmitEditing={() => searchUserFunction()}
          onKeyPress={()=> searchUserFunction()}
          onChangeText={(text)=> setSearchValue(text)}
          value={searchValue}
        />
        <FlatList
          data={dataSearch}
          keyExtractor= {item => item.user_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.user}>
              <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', flex: 1}} onPress={() => {
                if(item.user_id != userData.user_id){
                  props.navigation.navigate('DetailUser', {item: item});
                }else {
                  props.navigation.navigate('AboutUser');
                }}
              }>
                <Image style={styles.imageUser}
                    source={{uri: item.user_avatar}} 
                />
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                @{item.username}
                </Text>
              </TouchableOpacity>
              <TouchableWithoutFeedback onPress={()=> props.navigation.navigate('Comunication', {item: {'a': item.user_id}})}>
                <MaterialCommunityIcons name="message-reply-text" size={30} color="#9370db" />
              </TouchableWithoutFeedback>
            </View>
          )}  
          showsHorizontalScrollIndicator={false}
        /> 
      </View>
    );
}
export {SearchUser};

const styles = StyleSheet.create({
    user: {
        padding: 10,
        alignItems: 'center',
        flexDirection: 'row', 
        backgroundColor: 'white',
        width: Dimensions.get('window').width,
        borderBottomWidth: 1,
        borderColor: '#f2f2f2'
      },
      imageUser: {
        marginRight: 10,
        width: 50, 
        height: 50, 
        borderRadius: 50
      },
});