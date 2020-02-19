import React from 'react';
import {View, Text} from 'react-native';
import Payment from './src/Payment';

const App = () => {
  return (
    // <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    //   <Text>Lets try</Text>
    //   <Text style={{fontSize: 20, margin: 10}}>
    //     HyperPay Support in React Native
    //   </Text>
    //   <Text style={{fontSize: 16, margin: 10, textAlign: 'center'}}>
    //     Great! Native Module for android is integrated. Cheers
    //   </Text>
    //   <Text style={{fontSize: 16, margin: 10, textAlign: 'center'}}>
    //     Great! Native Module for iOS also integrated. Cheers
    //   </Text>
    // </View>
    <Payment />
  );
};

export default App;
