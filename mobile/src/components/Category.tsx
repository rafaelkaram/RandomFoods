import React from 'react';
import { StyleSheet, View } from 'react-native';

import RegularText from './RegularText';

const Category = (props: { nome: string }) => {
    return (
        <View style={ styles.container }>
            <RegularText style={ styles.text }>{ props.nome }</RegularText>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e02041',
        //width:100,
        margin: 5,
        padding: 8,
        borderRadius: 5,

    },

    text: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center'
    }
})

export default Category;