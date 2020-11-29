import React from 'react';
import { StyleSheet, Dimensions, View,Text, FlatList, StatusBar } from 'react-native';
import {HeaderUserPages, AboutComponent} from '../../Components/UserPageScreen'

function ProfileScreen(props) {
    const data = [
        {id:"1"}
      ]
    return (
        <View style={styles.container}>  
          <StatusBar hidden/> 
            <FlatList
            data={data}
            renderItem={(item) => (
            <>
              <HeaderUserPages {...props}/>
              <AboutComponent {...props}/>
            </>
          )}
          showsVerticalScrollIndicator = {false}
          keyExtractor={item => item.id}
          />
        </View>
    )
} export {ProfileScreen};
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white'
    },

});