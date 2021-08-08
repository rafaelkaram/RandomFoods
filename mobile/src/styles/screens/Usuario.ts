import { StyleSheet } from "react-native";

import colors from '../../constants/colors';
import { WIDTH } from '../../constants/dimensions';

export default StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        paddingBottom: 10
    },

    logoImage: {
        width: WIDTH - 10,
        height: (WIDTH - 10) / 1.3,
        // Utilizar proporção de x por x : 1.3 para garantir que fique bonito em todos os tamanhos de tela
    },

    container: {
        alignContent: 'center',
        margin: 15,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 15
    },

    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },

    singleButt: {
        width: '50%'
    },

    icons: {
        paddingRight: 10
    },

    midiaContainer: {
        alignItems: 'center',
        paddingBottom: 10,
        marginTop: 20,
    },

    headerContainer:{
        flexDirection: "row",
        width: ((WIDTH-60) * 0.7),
    },

    midia: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 1,
        borderColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },

    midiaInput: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    midiaView: {
        position: 'relative'
    },

    midiaIcon: {
        width: 150,
        height: 150
    },

    editIcon: {
        left: 50,
        bottom: 25
    },

    midiaRemove: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: colors.dimmedBackground,
        borderColor: colors.primary,
        borderWidth: 0.5,
        borderRadius: 20,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});