import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';

export default StyleSheet.create({
    ingredientTypeNameImageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    ingredientTypeName: {
        fontSize: 18,
        paddingLeft: 8,
        paddingTop: 20
    },

    ingredientTypeIcon: {
        margin: 10,
        width: 50,
        height: 50
    },

    ingredientContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        padding: 5
    },

    nonBlurredContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    filterListTitle: {
        color: "#f87062",
        textShadowColor: 'black',
        textShadowRadius: 0.5,
        textShadowOffset: {
            width: 0.5,
            height: 0.5,
        },
        margin: 10,
    },

    filterBubble: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 20,
        width: 20,
        borderRadius: 10,
        backgroundColor: 'white'
    },

    bubbleText: {
        color: colors.primary
    },

    inputIngredient: {
        borderWidth: 1,
        paddingLeft: 5,
        borderRadius: 10,
        borderColor: 'gray',
        marginBottom: -20,
    },

    modalFilter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 5
    },

    filterContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});