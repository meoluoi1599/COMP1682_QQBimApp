import * as React from 'react';
import { View, ActivityIndicator, StyleSheet} from 'react-native';

function SplashScreen () {
    return (
      <View style={[styles.container, styles.horizontal]}>
        <ActivityIndicator size="large" color="#C031C7" />
      </View>
    );
}
export {SplashScreen};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});