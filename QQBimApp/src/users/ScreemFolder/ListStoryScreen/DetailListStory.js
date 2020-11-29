import * as React from 'react';
import { 
  View, 
  Text,
  FlatList, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  Dimensions
} from 'react-native';
import {SplashScreen} from '../OtherScreen';

function DetailListStory(props) {
  const [dataSource, setDataSource ]= React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    // fetch('http://10.0.2.2:5000/')
    fetch('http://192.168.0.101:19000/get_story_list/' + props.route.params.item.list_id)
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
  },[]);

  return (  
    <View>
      {isLoading? <SplashScreen/>:(
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
            ListEmptyComponent={ListEmpty}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  )
  function ListEmpty() {
    return(
      <View style={{justifyContent: 'center'}}> 
        <Text style={{fontSize: 18, fontWeight: 'bold', textAlign: 'center'}}>There aren't any story in this list</Text>
      </View>
    )
  }
}
export {DetailListStory}

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
