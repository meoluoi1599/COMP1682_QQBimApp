import * as React from 'react';
import { 
  View, 
  Text,
  FlatList, 
  StyleSheet, 
  Image, 
  TouchableOpacity,
  StatusBar,
  Dimensions
} from 'react-native';
import {SplashScreen} from '../../ScreemFolder/OtherScreen';


function CategoryDetail(props) {
  const [dataSource, setDataSource ]= React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  
  React.useEffect(() => {
    // fetch('http://10.0.2.2:5000/')
    fetch('http://192.168.0.101:19000/category_story/' + props.route.params.category_id)
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
  }, []);

  function ListEmpty() {
    return (
      //View to show when list is empty
      <View style={style.MainContainer}>
        <Text style={{ textAlign: 'center', justifyContent: 'center' }}>No Data Found</Text>
      </View>
    );
  };

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
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={ListEmpty}
          />
        </View>
      )}
    </View>
  );
  
}
export {CategoryDetail};

var style = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'row', 
    padding: 10,
    backgroundColor: 'white',
    width: Dimensions.get('window').width, 
    marginBottom: 5,
    borderTopWidth: 0.5,
    borderTopColor: 'grey',
    borderBottomWidth: 0.5,
    borderBottomColor:'grey',
    height: 140
  },
  MainContainer: {
    justifyContent: 'center',
    flex: 1,
    margin: 10,
  },
  text: {
    margin: 10,
    fontSize: 20,
    fontWeight: 'bold',
  }
})

