import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';

const RegularText = (props : any) => {
  return (
    <Text style={{ ...styles.fontText, ...props.styles }}>
      { props.children }
    </Text>
  )
}

const styles = StyleSheet.create({
  fontText: {
    fontFamily: 'Ubuntu_400Regular'
  }
});

export default RegularText;