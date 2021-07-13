import { StyleSheet } from 'react-native';

import { WIDTH } from '../../constants/dimensions';

export default StyleSheet.create({
    component: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 10,
        marginRight: 10,
        padding: 10,
    },

    column: {
        marginLeft: 20,
        flexDirection: 'row'
    },

    newRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    title: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        backgroundColor: '#634A96',
        padding: 10,
        margin: 10,
        marginBottom: 0,
    },

    inputTitle: {
        backgroundColor: 'white',
        margin: 10,
        padding: 10,
        borderWidth: 1,
    },

    inputDesc: {
        backgroundColor: 'white',
        padding: 10,
        margin: 10,
        marginTop: 1,
        borderWidth: 1,
        height: 250,
    },

    options: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',

    },

    op: {
        borderWidth: 1,
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#634A96',
        borderColor: '#2D0320',
        width: 140,
        marginHorizontal: 10,
        marginTop: 20,
        textAlign: 'center'
    },

    recipeStep: {
        borderRadius: 2,
        padding: 10,
        backgroundColor: '#EBE399',
        marginHorizontal: 10,
        marginVertical: 4,
        borderWidth: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#D8A931',

    },

    divider: {
        width: '100%',
        height: 1,
        backgroundColor: 'lightgray'
    },

    modalHeader: {
        borderBottomWidth: 1,
        borderColor: 'lightgray',
        width: WIDTH * 0.8,
        alignItems: 'center'

    },

    modalFooter: {
        borderTopWidth: 1,
        borderColor: 'lightgray',
        width: WIDTH * 0.8,

    },

    actions: {
        borderRadius: 5,
        marginHorizontal: 10,
        paddingVertical: 10,
        width: 60,
        alignItems: 'center'
    },
});