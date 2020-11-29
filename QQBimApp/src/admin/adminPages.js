import * as React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, ToastAndroid} from 'react-native';
import { SplashScreen } from '../users/ScreemFolder/OtherScreen';
import { useFocusEffect } from '@react-navigation/native';
import { AntDesign } from '@expo/vector-icons'; 

function adminPages (props) {
    const [isLoading, setLoading] = React.useState(false);
    const [dataSource, setDataSource ]= React.useState([]);

    useFocusEffect(
      React.useCallback(() => {
      getData();
    },[]));
    const getData=()=> {
      fetch('http://192.168.0.101:19000/get_report')
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

    const deleteReport=(item)=> {
      fetch('http://192.168.0.101:19000/delete_report/' + item)
      .then ((response) => response.json())
      .then ( (res) => { 
        ToastAndroid.show("Delete Report sucucess!", ToastAndroid.SHORT);
        getData();
      })
      .catch ((error) => {
          console.log(error);
      })
      .finally(() => {
          setLoading(false) 
      });
    }
    return (
      <View style={{flex: 1, justifyContent: 'center'}}>
        {isLoading? <SplashScreen/> : (
            <FlatList
                data={dataSource}
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.report_id.toString()}
                renderItem={({item}) => (
                <TouchableOpacity style={styles.container} onPress={() => props.navigation.navigate('detailReport', {item: item})}>
                    <View style={{margin: 10}}>
                      <View style={{backgroundColor: item.report_status == 'Wait'?'#9370db': 'skyblue', padding: 10, flex: 1, flexDirection: 'row'}}>
                        <Text style={styles.header}>{item.report_title}</Text>
                        <TouchableOpacity style={{alignItems: 'flex-end', width: 40}} onPress={()=> deleteReport(item.report_id)}>
                          <AntDesign name="close" size={24} color="black"/>
                        </TouchableOpacity>
                      </View>
                      <View>
                          <Text style={styles.textStyle}>Story Title: <Text style={[styles.textStyle, {fontWeight: 'normal'}]}>{item.story_title}</Text></Text>
                          <Text style={styles.textStyle} numberOfLines={8}>Content report: <Text style={[styles.textStyle, {fontWeight: 'normal', textAlign: 'justify'}]}>{item.report_content}</Text></Text>
                      </View>
                    </View>
                </TouchableOpacity>        
            )}
        />
        )}
      </View>
    );
}
export {adminPages};

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    width: Dimensions.get('window').width,
  },
  header: {
    color: 'white',
    fontSize: 18,
    flex: 1,
  },
  textStyle: {
    fontSize: 15,
    fontWeight: 'bold',
  }
});