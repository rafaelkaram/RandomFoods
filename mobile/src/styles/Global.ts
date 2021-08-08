import { StyleSheet } from "react-native";

import colors from '../constants/colors';
import { WIDTH, HEIGHT } from '../constants/dimensions';

export default StyleSheet.create({
    // RegularText
    regularText: {
        fontFamily: 'Ubuntu_400Regular',
        color: 'black'
    },

    // BoldText
    boldText: {
        fontFamily: 'Ubuntu_700Bold',
        color: 'black'
    },

    // ItalicText
    subTitleText: {
        fontFamily: 'Ubuntu_500Medium_Italic',
        color: colors.secondary,
        textShadowColor: 'black',
        textShadowRadius: 0.5,
        textShadowOffset: {
            width: 0.5,
            height: 0.5
        },
    },

    background: {
        backgroundColor: colors.background
    },

    container: {
        margin: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 20,
    },

    closeButton: {
        position: 'absolute',
        top: 5,
        right: 5,
        zIndex: 999,
    },

    subTitle: {
        marginBottom: 10,
        textAlign: 'center',
    },

    recipeListSubTitle: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 20,
        margin: 3,
    },

    recipeImage: {
        width: 320,
        height: 70,
        marginHorizontal: 10,
        alignSelf: 'center'
    },

    resultImage: {
        width: 375,
        height: 102,
        alignSelf: 'center'
    },

    arrow: {
        width: 60,
        height: 60,
        borderRadius: 80,
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: colors.primary,
        justifyContent: 'center',
    },

    modalContainer: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: '#E5EAFA',
        borderWidth: 3,
        width: WIDTH * 0.9,
        maxHeight: HEIGHT * 0.6,
    },

    modalList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5
    },

    modalX: {
        backgroundColor: colors.primary,
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignSelf: 'flex-end'
    },

    filterBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.button,
        borderRadius: 15,
        height: 30,
        paddingHorizontal: 10,
        margin: 5,
    },

    filterBoxSelected: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: 15,
        height: 30,
        paddingHorizontal: 10,
        margin: 5
    },

    filterNameSelected: {
        color: 'white'
    },

    inputPesquisa: {
        borderWidth: 1,
        paddingLeft: 5,
        borderRadius: 10,
        borderColor: 'gray',
        marginBottom: -20,
        backgroundColor:'white',
    },

});