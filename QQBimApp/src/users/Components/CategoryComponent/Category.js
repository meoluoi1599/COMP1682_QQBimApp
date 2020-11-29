import * as React from 'react';
import { 
  View, 
  FlatList,
  TouchableOpacity, 
  Text
} from 'react-native';
import {SplashScreen} from '../../ScreemFolder/OtherScreen';


function Category(props) {
  const [dataSource, setDataSource ]= React.useState([]);
  const [isLoading, setLoading] = React.useState(true);
  const [onClick, setOnClick] = React.useState(true);

  React.useEffect(() => {
    // fetch('http://10.0.2.2:5000/')
    fetch('http://192.168.0.101:19000/category')
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
  return (
    <View>
    {isLoading ? <SplashScreen/> : (
      <View>
        <FlatList
          data={dataSource}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor= {item => item.category_id.toString()}
          renderItem={({item}) => (
           <TouchableOpacity  style={{padding: 5}} onPress={()=> {props.navigation.navigate('DetailCategory', {category_id: item.category_id, onClick: onClick})}}>
             <Text style={{
                backgroundColor: '#aa4fff', 
                borderRadius: 40,
                padding: 5,
                shadowColor: "#BA55D3",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}>
                {item.category}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    )}
  </View>

  );
  
}
export {Category}

