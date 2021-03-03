import React from 'react';
import { StyleSheet, Text } from 'react-native';

const BoldText = (props : any) => {
  return (
    <Text style={{ ...styles.fontText, ...props.styles }}>
      { props.children }
    </Text>
  )
}

const styles = StyleSheet.create({
  fontText: {
    fontFamily: 'Ubuntu_700Bold'
  }
});

export default BoldText;