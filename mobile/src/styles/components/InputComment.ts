import { StyleSheet } from "react-native";

import colors from "../../constants/colors";

export default StyleSheet.create({
    inputCommentContainer: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: '#EEE',
        alignItems: 'center',
        paddingLeft: 15,
    },

    inputComment: {
        flex: 1,
        minHeight: 60,
        lineHeight: 22,
        fontSize: 15,
        paddingVertical: 5,
    },

    inputCommentButton: {
        height: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    inputCommentInactive: {
        color: '#CCC',
    },

    inputCommentText: {
        color: colors.primary,
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 15,
    },
});