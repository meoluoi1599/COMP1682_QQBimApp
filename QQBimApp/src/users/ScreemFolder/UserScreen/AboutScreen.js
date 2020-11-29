import React from 'react';
import { StyleSheet, Dimensions, View,Text, FlatList, StatusBar } from 'react-native';
import {BodyAboutComponent, HeaderAboutPages} from '../../Components/UserPageScreen'

function AboutScreen(props) {
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
              <HeaderAboutPages {...props}/>
              <BodyAboutComponent {...props}/>
            </>
          )}
          showsVerticalScrollIndicator = {false}
          keyExtractor={item => item.id}
          />
        </View>
    )
} export {AboutScreen};
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white'
    },

});