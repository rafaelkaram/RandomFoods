import { StyleSheet } from 'react-native';

import { WIDTH } from '../../constants/dimensions';

export default StyleSheet.create({
    container: {
        margin: 20,
        backgroundColor: 'white',
        height: 120,
        borderRadius: 15,
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
        maxWidth: WIDTH,
    },

    nameContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: (WIDTH * 0.7),
    },

    name: {
        marginLeft: 20,
        fontSize: 18,
    },

    login: {
        marginLeft: 20,
        marginTop: 10,
        fontSize: 14,
    },

    segContainer: {
        flexDirection:'row',
        marginLeft:10,
    },

    textSeg: {
        marginLeft: 20,
        fontSize: 14,
    },

    seg:{
        alignItems:'center',
    },

    numberSeg:{
        marginLeft: 20,
        marginTop: 10,
        marginBottom:3,
        fontSize: 14,
    },

    totalRecipes: {
        alignItems: 'center',
        marginHorizontal: 15,
        backgroundColor: 'white',
        borderRadius: 20
    },

    totalRecipesTitle: {
        fontFamily: 'Oswald_300Light',
        fontSize: 20,
        margin: 5,
    },

    totalRecipesText: {
        fontFamily: 'Oswald_300Light',
        fontSize: 20,
        margin: 5,
        fontWeight: 'bold'
    },
});