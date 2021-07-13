import { StyleSheet } from "react-native";

import colors from "../../constants/colors";
import { WIDTH, HEIGHT } from '../../constants/dimensions';

export default StyleSheet.create({
    add: {
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.primary,
        borderRadius: 8,
        height: 40,
        padding: 5,
        margin: 10,
        justifyContent: 'center',
        flexDirection: 'row',
    },

    component: {

    },

    nonBlurredContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    divider: {
        width: '100%',
        height: 1,
        backgroundColor: 'lightgray'
    },

    modalFooter: {
    },

    actions: {
        borderRadius: 5,
        marginHorizontal: 10,
        paddingVertical: 10,
        paddingHorizontal: 20
    },
});