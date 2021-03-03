import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';

const Category = (props: any) => {
    return (
        <View style={styles.container}>
            <Text style={{color:'white',fontSize:15,textAlign:'center',fontFamily: 'Ubuntu_400Regular'}}>{props.nome}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e02041',
        //width:100,
        margin:5,
        padding:8,
        borderRadius:5,

        },
})

export default Category;