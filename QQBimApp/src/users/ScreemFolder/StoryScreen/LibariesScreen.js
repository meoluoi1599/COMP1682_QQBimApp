import React, { useState } from 'react';
import {StyleSheet, Text, StatusBar, TouchableOpacity, View } from 'react-native';
import Constants from 'expo-constants';

function LibariesScreen() {
  const [items, setItems] = React.useState([]);

  React.useEffect(() => {
    db.transaction(tx => {
      tx.executeSql(
        `select * from story`,
        (_, { rows: { _array } }) => setItems(_array)
      );
    });
  }, []);


  return (
    <View style={styles.sectionContainer}>
      <StatusBar hidden/>
      {items.map(({ id, value }) => (
        <TouchableOpacity>
          <Text style={{ color: done ? "#fff" : "#000" }}>{value}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

} export {LibariesScreen}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: Constants.statusBarHeight
  },
  
});