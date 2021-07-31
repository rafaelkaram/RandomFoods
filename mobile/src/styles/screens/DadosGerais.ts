import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';

export default StyleSheet.create({
    newRecipeImageContainer: {
        marginHorizontal: 10,
        alignSelf: 'flex-start'
    },

    dadosDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    textContainer: {
        fontSize: 15,
        paddingLeft: 8,
        paddingTop: 10
    },

    comboBox: {
        margin: 20,
        minWidth: 130,
        height: 40,
        borderWidth: 1
    },

    midiaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingTop: 10
    },

    midia: {
        width: 64,
        height: 64,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.thirdary,
        marginBottom: 10,
        marginRight: 8
    },

    midiaInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderStyle: 'dashed',
        borderColor: colors.thirdary,
        borderWidth: 1.4,
        borderRadius: 20,
        height: 64,
        width: 64,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },

    midiaView: {
        position: 'relative'
    },

    midiaRemove: {
        position: 'absolute',
        top: 2,
        right: 11,
        backgroundColor: colors.dimmedBackground,
        borderColor: colors.primary,
        borderWidth: 0.5,
        borderRadius: 20,
        padding: 3
    },

    playIcon: {
        position: 'absolute',
        bottom: 12,
        margin: 0,
        padding: 0,
        left: 7,
    }
});