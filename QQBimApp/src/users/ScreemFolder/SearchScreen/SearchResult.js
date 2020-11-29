import * as React from 'react';
import { View, StyleSheet, Dimensions, Text, FlatList,TouchableOpacity,Image, StatusBar } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import {SplashScreen} from '../../ScreemFolder/OtherScreen';

const initialLayout = { width: Dimensions.get('window').width };

function SearchResult(props) {
  const [index, setIndex] = React.useState(0);
  const [user, setUser] = React.useState([]);
  const [story, setStory] = React.useState([]);
  const [list, setList] = React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [routes] = React.useState([
    { key: '1', title: 'Story' },
    { key: '2', title: 'User' },
    { key: '3', title: 'Story List' },
  ]);

  const getUser =() => {
    fetch('http://192.168.0.101:19000/search_user/' + props.route.params.search)
    .then ((response) => response.json())
    .then ( (res) => { 
      console.log(res)
      setUser(res);
    })
    .catch ((error) => {
      console.log(error);
    })
    .finally(() => setLoading(false));
  }

  const getStory =() => {
    fetch('http://192.168.0.101:19000/search_story/' + props.route.params.search)
    .then ((response) => response.json())
    .then ( (res) => { 
      setStory(res);
    })
    .catch ((error) => {
      console.log(error);
    })
    .finally(() => setLoading(false));
  }

  const getList =() => {
    fetch('http://192.168.0.101:19000/search_story_list/' + props.route.params.search)
    .then ((response) => response.json())
    .then ( (res) => {
      setList(res);
    })
    .catch ((error) => {
      console.log(error);
    })
    .finally(() => setLoading(false));
  }
  function ListEmpty() {
    return (
      //View to show when list is empty
      <View style={styles.MainContainer}>
        <Text style={{ textAlign: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 'bold'}}>No Data Found</Text>
      </View>
    );
  };

  React.useEffect(() => {
    getStory();
    getUser();
    getList();
  },[]);

  const StoryRoute = () => (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar hidden/>
      {isLoading ? <SplashScreen/> : (
        <View>
          <FlatList
            data={story}
            horizontal
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={ListEmpty}
            keyExtractor= {item => item.story_id.toString()}
            renderItem={({item}) => (
              <TouchableOpacity onPress={() => props.navigation.navigate('DetailStory', {item: item})}>         
                <View style={styles.story}>
                  <View style={{flex: 1}}>
                    <Image style={{width: 100, height: 120}}
                      source= {{uri: item.story_img}}
                    />
                  </View>
                  <View style={{flex: 2}}>
                    <Text  numberOfLines={1} style={{fontWeight: 'bold', fontSize: 18}}>{item.story_title}</Text>
                    <Text numberOfLines={1} style={{fontWeight: 'bold'}}>Status: <Text style={{fontWeight: 'normal'}}>{item.story_status}</Text></Text>
                    <Text numberOfLines={1} style={{fontWeight: 'bold'}}>Parts: <Text style={{fontWeight: 'normal'}}>{item.parts}</Text></Text>
                    <Text numberOfLines={3}>{item.story_description} </Text>
                  </View>
                </View>
          </TouchableOpacity>
            )}
          />  
        </View>
      )}
  </View>
  );
  
  const UserRoute = () => (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar hidden/>
      {isLoading ? <SplashScreen/> : (
        <View>
          <FlatList
            data={user}
            horizontal
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={ListEmpty}
            keyExtractor= {item => item.user_id.toString()}
            renderItem={({item}) => (
            <TouchableOpacity  style={styles.user} onPress={() => props.navigation.navigate('DetailUser', {item: item})}>
                <Image style={styles.imageUser}
                      source={{uri: item.user_avatar}} 
                />
                <Text style={{fontSize: 18, fontWeight: 'bold'}}>
                  @{item.username}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
  
  const StoryListRoute = () => (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <StatusBar hidden/>
      {isLoading ? <SplashScreen/> : (
        <View>
          <FlatList
            data={list}
            keyExtractor= {item => item.list_id.toString()}
            renderItem={({ item }) =>(
              <View style={styles.listContainer}>
                <TouchableOpacity style={{ flexDirection: 'row', margin: 10, flex: 1}} onPress={() =>props.navigation.navigate('DetailListStory', {item: item})}>
                  <Image 
                    source={require("../../Images/list.png")}
                    style={styles.imgList}
                  />
                  <Text style={styles.textName}>{item.list_name}</Text>
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={ListEmpty}
          />
        </View>
      )}
    </View>
  );
  const renderScene = SceneMap({
    1: StoryRoute,
    2: UserRoute,
    3: StoryListRoute
  });

  return ( 
    <TabView
      style={{backgroundColor: 'white'}}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
} export {SearchResult};

const styles = StyleSheet.create({
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    margin: 10,
  },
  story: {
    flexDirection: 'row', 
    padding: 10,
    backgroundColor: 'white',
    width: Dimensions.get('window').width, 
    marginTop: 10,
    height: 140,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
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
  listContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight:10,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: '#f2f2f2',
    borderBottomWidth: 0.5
  },
  imgList: {
    width: 30, 
    height: 30,
  },
  textName: {
    fontSize: 18, 
    color: 'grey',
    marginLeft: 10
  },
  search: {
    position:'absolute',
    bottom: 20,
    right: 20, 
    alignSelf:'flex-end',  
    borderRadius: 50,
    width: 50,
    height: 50, 
    backgroundColor: '#9370db',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }
});
