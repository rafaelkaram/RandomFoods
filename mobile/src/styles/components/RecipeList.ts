import { StyleSheet } from "react-native";

import { WIDTH, HEIGHT } from '../../constants/dimensions';

export default StyleSheet.create({
    recipeListColumns: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },

    recipeListContainer: {
        backgroundColor: 'white',
        margin: 15,
        padding: 10,
        width: WIDTH / 3,

        flexDirection: 'column',
        borderRadius: 20,
    },

    recipeListImage: {
        height: HEIGHT * 0.15,
        width: '100%',
        borderRadius: 20,
        textAlign: 'center',
        alignSelf: 'center'
    },

    recipeListTitle: {
        marginTop: 5,
        fontSize: 15,
        textAlign: 'center',
    },

    likeHeart: {
        margin: 5,
    },

});