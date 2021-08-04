import { StyleSheet } from "react-native";

import colors from "./../../constants/colors";

export default StyleSheet.create({
    categoryContainer: {
        backgroundColor: 'white',
        margin: 5,
        marginLeft: 10,
        paddingHorizontal: 5,
        borderRadius: 5,
        flexDirection: 'row',
        alignSelf: 'flex-end'
    },

    categoryText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center'
    }
});