import * as React from 'react';
import { FlatList, View, Text, TouchableOpacity, Image, Dimensions, StyleSheet, Alert, AsyncStorage} from 'react-native';
import {SplashScreen} from '../OtherScreen';
import { FontAwesome } from '@expo/vector-icons'; 
import { Ionicons } from '@expo/vector-icons'; 

function DetailUserList(props) {
  const [dataSource, setDataSource] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);

  const getStory =()=> {
    fetch('http://192.168.0.101:19000/get_story_list/' + props.route.params.item.list_id)
    .then ((response) => response.json())
    .then ( (res) => { 
      console.log('kq:' + res); 
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
    getStory();
  }, []);

  function ListEmpty() {
    return (
      //View to show when list is empty
      <View style={style.MainContainer}>  
          <View>
            <Text style={{fontSize: 20, color: 'black', marginTop: 20, marginBottom: 20}}>There aren't any story in this list</Text>
          </View>
          <TouchableOpacity>
          <View style={style.newStory}>
            <Text style={style.newStoryText}>Please add new story</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  
  function deleteStory(story_id) {
    Alert.alert(
      "Do you want to delete your story?",
      "If you choose OK, your story will delete forever.",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => {
          fetch('http://192.168.0.101:19000/remove_story_list/' + props.route.params.item.list_id + '/' + story_id)
          .then ((response) => response.json())
          .then ( (res) => { 
            console.log('kq:' + res);
            getStory();
          })
          .catch ((error) => {
            console.log(error);
          })
          .finally(() => {
            setLoading(false);
          });
        } }
      ],
      { cancelable: false }
    ); 
  };
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      {isLoading ? <SplashScreen/> : (
        <View>   
          <FlatList
            data={dataSource}
            keyExtractor= {item => item.story_id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() =>props.navigation.navigate('DetailStory', {item: item})}>         
                <View style={style.container}>
                  <View style={{flex: 1}}>
                    <Image style={{width: 100, height: 120}}
                      source={{uri: item.story_img}} 
                    />
                  </View>
                  <View style={{flex: 2}}>
                  <View style={style.header}>
                      <Text  numberOfLines={1} style={{fontWeight: 'bold', fontSize: 18, flex:1}}>{item.story_title}</Text> 
                      <TouchableOpacity onPress={()=> {deleteStory(item.story_id);}}>
                        <FontAwesome
                            name="remove"
                            color={'#c0c0c0'}
                            style={{fontSize: 20, marginLeft: 10, marginRight: 10}}
                        />
                        </TouchableOpacity> 
                    </View>
                    <Text numberOfLines={3}>{item.story_description} </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={ListEmpty}
          />     
        </View>
      )}
    </View>  
  );
}
export {DetailUserList};

var style = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'row', 
    padding: 10,
    backgroundColor: 'white',
    width: Dimensions.get('window').width, 
    margin: 5, 
    height: 140
  },
  header: {
    flexDirection: 'row'
  },
  MainContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    margin: 10,
  },
})