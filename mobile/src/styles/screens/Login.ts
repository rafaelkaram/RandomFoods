import { StyleSheet } from 'react-native';

import { WIDTH } from '../../constants/dimensions';

export default StyleSheet.create({
    logoContainer: {
        alignItems: 'center',
        paddingBottom: 10,
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

    socialButtonsView: {
        paddingVertical: 10
    },

    facebookButton: {
        backgroundColor: '#3B5998'
    },
});