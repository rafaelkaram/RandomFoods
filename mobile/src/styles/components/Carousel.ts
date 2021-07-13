import { StyleSheet } from "react-native";

import { WIDTH } from '../../constants/dimensions';

export const SLIDER_WIDTH = WIDTH + 80;
export const ITEM_WIDTH = Math.round((SLIDER_WIDTH) * 0.7);

export default StyleSheet.create({
    carouselContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        width: ITEM_WIDTH,
        shadowColor: 'black',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
        elevation: 7,
        marginVertical: 10,
    },

    carouselHeader: {
        color: '#222',
        fontSize: 28,
        fontWeight: 'bold',
        paddingLeft: 20,
        paddingTop: 20
    },

    carouselBody: {
        color: '#222',
        fontSize: 18,
        paddingLeft: 20,
        paddingRight: 20
    },

    carouselImage: {
        width: ITEM_WIDTH,
        height: 300,
    },

    carouselVideo: {
        alignSelf: 'center',
        width: ITEM_WIDTH,
        height: 300,
    },
});