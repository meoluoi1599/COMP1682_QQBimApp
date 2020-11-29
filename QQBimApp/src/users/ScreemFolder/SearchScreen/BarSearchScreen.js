import * as React from 'react';
import { View, StatusBar, ImageBackground} from 'react-native';
import { Searchbar } from 'react-native-paper';

function BarSearchScreen(props) {
  const [value, setValue] = React.useState('');
    return (
      <View style={{backgroundColor: 'white'}}>
        <StatusBar hidden/>
        <Searchbar
          lightTheme
          placeholder="Search..."
          onSubmitEditing={()=> {props.navigation.navigate('result', {search: value}); setValue('')}}
          onChangeText={text => setValue(text)}
          value={value}
        />
       
      </View>
    )
} export {BarSearchScreen};

