
import React from 'react';
import { View, Image } from 'react-native';

const BoldText = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image
          source={require('../assets/giphy.gif')}
          style={{ width: 200, height: 200, }}
      />
    </View>
  );
}

export default BoldText;