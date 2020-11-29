import * as React from 'react';
import { StyleSheet, View, Text, FlatList,TouchableOpacity, Image, AsyncStorage} from 'react-native';
import {SplashScreen} from '../../ScreemFolder/OtherScreen'
import { MaterialIcons } from '@expo/vector-icons'; 
import { useFocusEffect } from '@react-navigation/native';

function AboutComponent(props) {
  const [dataSource, setDataSource ] = React.useState([]);
  const [followingUser, setFollowingUser ] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);

  function get_list() {
    fetch('http://192.168.0.101:19000/get_list/' + props.route.params.item.user_id)
    .then ((response) => response.json())
    .then ( (res) => { 
      setData(res);
    })
    .catch ((error) => {
      console.log(error);
    })
    .finally(() => {
      setLoading(false) 
    });
  }

  const getUerBook=()=> {
    fetch('http://192.168.0.101:19000/book_author/' + props.route.params.item.user_id)
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

  const getFollowing=()=> {
    fetch('http://192.168.0.101:19000/get_following/' + props.route.params.item.user_id)
    .then ((response) => response.json())
    .then ( (res) => { 
      setFollowingUser(res);
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
      //View to show when list is empty
      <View style={style.listContainer}>
        <View style={{flexDirection: 'row', margin: 10}}>
          <MaterialIcons name="note-add" size={24} color="grey"/>
          <Text style={style.textName}>There aren't lists.</Text>
        </View>
      </View>
    );
  };
  
  const EmptyStory=()=> {
    return(
      <View style={style.imgEmptyStory}>
        <MaterialIcons name="add" size={50} style={{opacity: 0.3}} />
      </View>
    );
  }

  const followingEmpty=() => {
    return (
      <View>
        <Text>The user don't follow any one.</Text>
      </View>
    );
  }

  useFocusEffect(
    React.useCallback(() => {
      getUerBook();
      get_list();
      getFollowing();
      // Do something when the screen is focused
      return () => {
        console.log('un')
      };
    }, [])
  );

    return (
      <View>
        {isLoading? <SplashScreen/>:(
        <View>
          <View>
            <View><Text style={style.text}>Story of {props.route.params.item.username}</Text></View>
            <FlatList
              data={dataSource}
              keyExtractor= {item => item.story_id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => props.navigation.navigate('DetailStory', {item: item})}>         
                    <View style={style.container}>
                        <View style={{flex: 1}}>
                          <Image style={{width: 100, height: 120}}
                            source={{uri: item.story_img}}
                          />
                        </View>
                        <View style={{flex: -4}}>
                          <Text  numberOfLines={1} style={{ fontSize: 15}}>{item.story_title}</Text>
                        </View>
                      </View>
                </TouchableOpacity>
              )}
              horizontal
              ListEmptyComponent={EmptyStory}
              showsHorizontalScrollIndicator={false}
            />
          </View>
          <View>
            {isLoading? <SplashScreen/>: (
              <View>
                <View><Text style={style.text}>Following</Text></View>
                <FlatList
                  data={followingUser}
                  style={{marginLeft: 10}}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={item => item.user_id.toString()}
                  renderItem={({item}) => (
                    <TouchableOpacity onPress={() => props.navigation.navigate('DetailUser', {item: item})}>
                        <Image style={style.image}
                            source={{uri: item.user_avatar}} 
                        />
                    </TouchableOpacity>        
                  )}
                  ListEmptyComponent={followingEmpty}
                />
              </View>
            )}
          </View>
          <View>
            {isLoading? <SplashScreen/>:(
              <View>
                <View><Text style={style.text}>List story of {props.route.params.item.username}</Text></View>
                <FlatList
                  data={data}
                  keyExtractor= {item => item.list_id.toString()}
                  renderItem={({ item }) =>(
                    <View style={style.listContainer}>
                      <TouchableOpacity style={{flexDirection: 'row', margin: 10}} onPress={() =>props.navigation.navigate('DetailList', {item: item})}>
                        <Image 
                          source={require("../../Images/list.png")}
                          style={style.imgList}
                        />
                        <Text style={style.textName}>{item.list_name}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  ListEmptyComponent={ListEmpty}
                />
              </View>
            )}
          </View>
        </View>
      )}
      </View>
    );
}
export {AboutComponent};

var style = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column', 
    alignItems:'center', 
    padding: 5,
    flex: 1, 
    backgroundColor: 'white',
    width: 115,
    margin: 5, 
    height: 160,
  },
  text: {
    margin: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight:10,
    backgroundColor: 'white',
    borderColor: '#aa4fff',
    borderBottomWidth: 0.5
  },
  img: {
    width: 80, 
    height: 80, 
    borderRadius: 50
  },
  textName: {
    fontSize: 18, 
    color: 'grey',
    marginLeft: 10
  },
  imgList: {
    width: 30, 
    height: 30,
  },
  imgEmptyStory: {
    width: 100, 
    height: 120, 
    backgroundColor: '#f2f2f2',
    alignItems: "center",
    justifyContent: 'center',
    marginLeft: 10
  },
  image: {
    marginRight: 10,
    width: 70, 
    height: 70, 
    borderRadius: 50
  },
})