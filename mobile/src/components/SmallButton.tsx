import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

import colors from '../constants/colors';

const MainButton = (props : any) => {
  return (
  <TouchableOpacity activeOpacity={ 0.75 } onPress={ props.onPress } style={{ ...styles.button, ...props.style }}>
      <Text style={ styles.buttonText }>{ props.children }</Text>
  </TouchableOpacity>
)
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.dimmedBackground,
    margin: 5,
    alignItems: 'center',
    padding: 12,
    borderRadius: 25
  },

  buttonText: {
    color: colors.background,
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 14
  }
});

export default MainButton;