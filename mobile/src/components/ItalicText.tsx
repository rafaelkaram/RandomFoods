import React from 'react';
import { StyleSheet, Text } from 'react-native';

const ItalicText = (props : any) => {
  return (
    <Text style={{ ...styles.fontText, ...props.style }}>
      { props.children }
    </Text>
  )
}

const styles = StyleSheet.create({
  fontText: {
    fontFamily: "Ubuntu_500Medium_Italic",
        color: "#f87062",
        textShadowColor: 'black',
        textShadowRadius: 0.5,
        textShadowOffset: {
            width: 0.5,
            height: 0.5
        },
  }
});

export default ItalicText;