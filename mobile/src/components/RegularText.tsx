import React from 'react';
import { StyleSheet, Text } from 'react-native';

const RegularText = (props : any) => {
  return (
    <Text style={{ ...styles.fontText, ...props.style }}>
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