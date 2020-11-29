import React from 'react';
import { 
  View, 
  Text,
  FlatList, 
  StyleSheet, StatusBar,
  Image, 
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { FamousReader} from '../../Components/HomeScreen';
import {Category} from '../../Components/CategoryComponent';
import  Ionicons  from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';

function HomeScreen(props) {
  const [dataSource, setDataSource ]= React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [page, setPages] = React.useState(1);
  const [endData, setEndData]  = React.useState(false);
  const [value, setValue] = React.useState('');
  const data = [
    {id:"1"}
  ]
  
  React.useEffect(() => {
    // fetch('http://10.0.2.2:5000/')
    fetch('http://192.168.0.101:19000/' + page)
    .then ((response) => response.json())
    .then ( (res) => { 
      setDataSource([...dataSource, ...res]);
      setPages(page+1);
    })
    .catch ((error) => {
      console.log(error);
    })
    .finally(() => {
      setLoading(false) 
    });
  },[]);

  useFocusEffect(
    React.useCallback(() => {
      loadMoreData()
      return () => {
        console.log('un')
      };
    }, [])
  );

  function loadMoreData(){
    fetch('http://192.168.0.101:19000/' + page)
    .then ((response) => response.json())
    .then ( (res) => { 
      if(res.length != 0){
        setDataSource([...dataSource, ...res]);
        setPages(page+1);

      } else {
        setEndData(true);
      }
    })
    .catch ((error) => {
      console.log(error);
    })
    .finally(() => setLoading(false));
  }
  const rederFooter=()=> {
    return(
      isLoading? 
      <View style={{alignItems: "center"}}>
        {endData? <Text>The end of data</Text>:<ActivityIndicator size="large" color="#C031C7" />}
      </View>: null
    )
  }
  const rederHeader=()=> {
    return(
      <View><Text style={style.text}>List Story</Text></View>
    )
  }
  
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}> 
    <StatusBar hidden/>
      <View style={{flex: 10}}>
        <View style={{height:80, padding: 10, alignItems:'center', backgroundColor:'#8a2be2', flexDirection:'row', justifyContent: 'center'}}>    
            <TouchableOpacity style={{flex:1}} onPress={()=> props.navigation.toggleDrawer()}>
                <Ionicons name='md-menu' size={50} color={'white'}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> props.navigation.navigate('SearchScreen')}
            style={{backgroundColor: 'white', alignItems:'center',flexDirection:'row', flex: 5, borderRadius:40}}>
                <Ionicons name='md-search' size={30} style={{marginLeft:10}}/>
                <Text>Search</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1}} onPress={()=> props.navigation.navigate('AboutUser')}>
                <Ionicons name='ios-person' size={40} color={'white'} style={{marginLeft:10}}/>
            </TouchableOpacity>
        </View>
        <FlatList
          data={data}
          renderItem={(item) => (
            <>
              <Category {...props}/> 
              <FamousReader {...props}/>
              <View>
                <FlatList
                  data={dataSource}
                  keyExtractor= {item => item.story_id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => props.navigation.navigate('DetailStory', {item: item})}>         
                        <View style={style.container}>
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
                  showsHorizontalScrollIndicator={false}
                  onEndReachedThreshold={0}
                  ListHeaderComponent={rederHeader}
                />
              </View>
            </>
          )}
          onEndReached={loadMoreData}
          ListFooterComponent={rederFooter}
          showsVerticalScrollIndicator = {false}
          keyExtractor={item => item.id}
          />
      </View>
    </View>
  )
  
}
export {HomeScreen};
var style = StyleSheet.create({
  container: {
    flex:1,
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
  text: {
    margin: 10,
    fontSize: 20,
    fontWeight: 'bold',
  }
})

