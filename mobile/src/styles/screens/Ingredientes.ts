import { StyleSheet } from "react-native";

import colors from "../../constants/colors";

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

    ingredietContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        padding: 5
    },

    ingredient: {
        backgroundColor: colors.button,
        borderRadius: 8,
        height: 40,
        padding: 5,
        margin: 5,
        justifyContent: 'center',
        alignItems:'center',
        minWidth:50
    },

    ingredientSelected: {
        backgroundColor: colors.primary,
        borderRadius: 8,
        height: 40,
        padding: 5,
        margin: 5,
        justifyContent: 'center',
        alignItems:'center',
        minWidth:50
    },

    ingredientName: {
        color: 'black'
    },

    ingredientNameSelected: {
        color: 'white'
    },

    nonBlurredContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    recipeName: {
        margin: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        height: 120,
    },

    recipeNameText: {
        fontSize: 15,
        paddingLeft: 8,
        paddingTop: 10
    },
});