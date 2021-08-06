import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';

import { WIDTH } from '../../constants/dimensions';

export default StyleSheet.create({
    container: {
        margin: 20,
        backgroundColor: 'white',
        height: 130,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: WIDTH,
    },

    nameContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: ((WIDTH-60) * 0.7),
    },

    name: {
        fontSize: 18,
    },

    login: {
        marginTop: 10,
        marginRight: 10,
        fontSize: 14,
    },

    following: {
        color: 'white'
    },

    filterBoxSelected: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderRadius: 15,
        height: 30,
        paddingHorizontal: 10,
        margin: 5,
        width: 115
    },

    filterBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.button,
        borderRadius: 15,
        height: 30,
        paddingHorizontal: 10,
        margin: 5,
        width: 115
    },

    segContainer: {
        flexDirection: 'row',
        marginLeft: 10,
    },

    textSeg: {
        marginLeft: 20,
        fontSize: 14,
    },

    seg: {
        alignItems: 'center',
    },

    numberSeg: {
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 3,
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

    bigNumberSeg: {
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 3,
        fontSize: 12,
    },

    bigTextSeg: {
        marginLeft: 20,
        fontSize: 12,
    },

    bigLogin: {
        marginLeft: 20,
        marginTop: 5,
        fontSize: 12,
    },

});