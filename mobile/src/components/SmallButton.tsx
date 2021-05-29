import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import Colors from '../constants/colors';

const MainButton = (props : any) => {
  return (
  <TouchableOpacity activeOpacity={ 0.75 } onPress={ props.onPress } style={{ ...styles.button, ...props.style }}>
      <Text style={ styles.buttonText }>{ props.children }</Text>
  </TouchableOpacity>
)
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.dimmedBackground,
    margin: 5,
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25
  },

  buttonText: {
    color: Colors.background,
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 14
  }
});

export default MainButton;