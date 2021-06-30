import { StyleSheet } from "react-native";

import { colors } from "react-native-elements";

export default StyleSheet.create({
    categoryContainer: {
        backgroundColor: colors.primary,
        margin: 5,
        padding: 8,
        borderRadius: 5,
    },

    categoryText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center'
    }
});