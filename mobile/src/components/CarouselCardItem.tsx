import React from 'react'
import { View, Text, StyleSheet, Dimensions, Image } from "react-native"
import { IMidia } from '../constants/interfaces';

export const SLIDER_WIDTH = Dimensions.get('window').width + 80
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7)

const CarouselCardItem = ({ item, index }: { item: IMidia, index: any }) => {

    if (item) {
        return (
            <View style={styles.container} key={index}>
                <Image
                    source={{ uri: item.path }}
                    style={styles.image}
                />
            </View>
        )
    }
    return(
        <View style={styles.container} key={index}>
            <Image
                    source={{  }}
                    style={styles.image}
                />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 8,
        width: ITEM_WIDTH,
        paddingBottom: 40,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        marginVertical: 10,
    },
    image: {
        width: ITEM_WIDTH,
        height: 300,
    },
    header: {
        color: "#222",
        fontSize: 28,
        fontWeight: "bold",
        paddingLeft: 20,
        paddingTop: 20
    },
    body: {
        color: "#222",
        fontSize: 18,
        paddingLeft: 20,
        paddingRight: 20
    }
})

export default CarouselCardItem