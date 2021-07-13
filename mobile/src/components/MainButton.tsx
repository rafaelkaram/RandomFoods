import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import colors from '../constants/colors';

const MainButton = (props : any) => {
    const { image, onPress, style, textStyle, children } = props;

    let logo;

    if (image) {
        logo = (
            <Image style={ styles.imgSize } source={ image } />
        );
    }

    return (
        <TouchableOpacity activeOpacity={ 0.75 } onPress={ onPress } style={{ ...styles.button, ...style }}>
            <View style={ styles.buttonContainer }>
                { logo }
                <Text style={{ ...styles.buttonText, ...textStyle }}>{ children }</Text>
            </View>
        </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.primary,
        margin: 10,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 25,

        elevation: 5
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingHorizontal: 10
    },

    buttonText: {
        color: colors.background,
        fontFamily: 'Ubuntu_400Regular',
        fontSize: 18
    },

    imgSize: {
        width: 30,
        height: 30,
    }
});

export default MainButton;