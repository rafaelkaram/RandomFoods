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
        maxWidth: WIDTH- 65,
    },

    nameContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: ((WIDTH-60) * 0.7),
    },

    name: {
        marginLeft: 20,
        fontSize: 16,
    },

    login: {
        marginLeft: 20,
        marginTop: 10,
        fontSize: 14,
    },

    bigLogin: {
        marginLeft: 20,
        marginTop: 5,
        fontSize: 12,
    },

    segContainer: {
        flexDirection:'row',
        marginLeft:10,
    },

    textSeg: {
        marginLeft: 20,
        fontSize: 14,
    },

    bigTextSeg: {
        marginLeft: 20,
        fontSize: 12,
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

    bigNumberSeg:{
        marginLeft: 20,
        marginTop: 10,
        marginBottom:3,
        fontSize: 12,
    },

    totalRecipes: {
        alignItems: 'center',
        marginHorizontal: 15,
        backgroundColor: 'white',
        borderRadius: 20,
        justifyContent: 'space-between'
    },

    totalAndNewRecipes: {
        alignItems: 'center',
        marginHorizontal: 15,
        backgroundColor: 'white',
        borderRadius: 20,
        width:(WIDTH/2)-30,
        justifyContent: 'center'
    },

    totalRecipesTitle: {
        fontFamily: 'Oswald_300Light',
        fontSize: 20,
        margin: 5,
        textAlign: 'center',
    },

    totalRecipesText: {
        fontFamily: 'Oswald_300Light',
        fontSize: 20,
        margin: 5,
        fontWeight: 'bold'
    },
});