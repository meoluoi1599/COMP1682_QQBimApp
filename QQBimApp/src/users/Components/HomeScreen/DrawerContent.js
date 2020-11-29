import * as React from 'react';
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList
} from '@react-navigation/drawer';
import  Ionicons  from 'react-native-vector-icons/Ionicons'; 
import AsyncStorage from '@react-native-community/async-storage';
import { View , Image, StyleSheet, Text, ImageBackground} from 'react-native';

import { AuthContext } from '../../../../App';

function DrawerContent(props) {
    const { signOut } = React.useContext(AuthContext);
    const [dataSource, setDataSource ]= React.useState([]);
    const [isLoading, setLoading] = React.useState(true);
    const getData = async () => {
      try {
        AsyncStorage.getItem('user').then((value) => {
          const jsonValue = JSON.parse(value);
          setDataSource(jsonValue);
        })
      } catch(e) {
        console.log(e)
      }
    }
    React.useEffect(() => {
      getData();
    }, []);
    return (
      <DrawerContentScrollView {...props}>
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}>
            <Image 
                style={styles.profileIcon}
                source={{ uri: dataSource.user_avatar }}
            />
            <View>
              <Text style={styles.title}>{dataSource.name}</Text>
              <Text style={styles.caption}>@{dataSource.username}</Text>
            </View>
        </View>
        <View style={styles.itemList}> 
          <DrawerItemList {...props} />            
          <DrawerItem 
              icon={({color, size}) => (
                  <Ionicons 
                      name="ios-exit" 
                      color={color}
                      size={size}
                  />
              )}
              label="Sign Out"
              drawerContentOptions={{
                  activeBackgroundColor: '#93278f',
              }}
              onPress={() => {signOut()}}
          />
        </View>
      </DrawerContentScrollView>
    );
  } export {DrawerContent}

  const styles = StyleSheet.create({
    profileIcon: {
        width: 100, 
        height: 100, 
        borderRadius: 50, 
        marginTop: 20,
        backgroundColor: 'grey'
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
        color: 'black'
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
        color: 'black'
    },
    itemList: {
        marginTop: 50,
    }
  });