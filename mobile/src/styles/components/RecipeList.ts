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

    main: {
        flexDirection: 'row',
        margin: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 20,
    },

    textContainer: {
        padding: 5,
        marginVertical: 10,
        flexDirection:'row',
        justifyContent:'space-between',
        

    },

    image: {
        width: 100,
        height: 100,
        borderRadius: 50
    },

    likeComment: {
        flexDirection: 'row', 
        alignItems: 'center',
    },

});