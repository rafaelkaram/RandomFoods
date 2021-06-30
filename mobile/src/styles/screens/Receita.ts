import { StyleSheet } from "react-native";

import colors from "../../constants/colors";
import { WIDTH } from '../../constants/dimensions';

export default StyleSheet.create({
    itemListTitle: {
        backgroundColor: colors.primary,
        margin: 3,
        padding: 10,
    },

    titleText: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },

    autor: {
        margin: 10,
        padding: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
    },

    autorName: {
        marginLeft: 15,
    },

    container: {
        flex: 1,
        backgroundColor: colors.background
    },

    note: {
        flexDirection: 'row',
        padding: 3,
        alignItems: 'center',
    },

    type: {
        flexDirection: 'row',
        padding: 3,
        margin: 10,
    },

    category: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },

    ingredientList: {
        margin: 10,
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 15,
    },

    ingredient: {
        flexDirection: 'row',
        padding: 3,
    },

    itemList: {
        backgroundColor: 'lightgrey',
        margin: 15,
        padding: 10,
        width: WIDTH / 3,
        height: WIDTH / 3,
        flexDirection: 'column',
        borderRadius: 20
    },

    itemListImage: {
        borderWidth: 1,
        height: (WIDTH / 3) - 40,
        borderRadius: 20,
        textAlign: 'center',
    },

    itemListDescribe: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        padding: 5,
        backgroundColor: 'white',
        borderRadius: 15,
    },

    comentarios: {
        margin: 10,
        padding: 5,
    },

    singleComentario: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 10,
        margin: 5
    },

    commentTitle: {
        justifyContent: 'space-between',
        flexDirection: 'row',
    },

    commentUserDate: {
        flexDirection: 'row',
    },

    commentDate: {
        color: '#999'
    },

    commentBut: {
        paddingTop: 10,
        alignItems: 'flex-end',
    },

    identacao: {
        marginTop: -5,
        marginLeft: 15
    },

    rating: {
        backgroundColor: 'white',
        margin: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 15,
    },

    time: {
        backgroundColor: 'white',
        margin: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderRadius: 15,
    },

    commentInput: {
        borderBottomWidth: 0,
        borderRadius: 10,
        width: 300,
        height: 100,
        backgroundColor: 'white',
        marginVertical: 10,
        padding: 15
    },

    commentBox: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    buttonComentar: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 10,
        margin: 10,
        padding: 10,
    },

    buttonFavTrue: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 10,
        margin: 10,
        padding: 10,
    },

    buttonFavFalse: {
        backgroundColor: 'lightgrey',
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 10,
        margin: 10,
        padding: 10,
    },

    buttonActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    }
});