import { StyleSheet } from "react-native";

import { WIDTH } from '../../constants/dimensions';

export default StyleSheet.create({
    item: {
        padding: 10,
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 10,
    },

    checkBox: {
        flexDirection: 'row',
        marginLeft: 20,
    },

    toTaste: {
        fontSize: 16,
        alignSelf: 'center',
        paddingTop: 30
    },

    plusMinusContainer: {
        flexDirection: 'column',
        paddingBottom: 10
    },

    plus: {
        paddingBottom: 15
    },

    campos: {
        marginTop: 15,
        flexDirection: "row",
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    comboBox: {
        width: WIDTH / 1.8,
        height: 30,
    },
});