import { StyleSheet } from "react-native";

export default StyleSheet.create({
    commentContainer: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
    },

    dataContainer: {
        flexDirection:'row',
    },

    commentTitle: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        fontFamily: 'Ubuntu_400Regular'
    },

    commentUser: {
        fontFamily: 'Ubuntu_700Bold'
    },

    commentDate: {
        color:'#999999',
        fontFamily: 'Ubuntu_400Regular'
    },

    commentHour: {
        paddingTop:10,
        alignItems:'flex-end',
    },

    commentButton: {

    },
});