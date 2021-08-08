import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import { WIDTH } from '../../constants/dimensions';

export default StyleSheet.create({
    usuarioCurtida: {
        margin: 10,
        padding: 10,
        backgroundColor: colors.dimmedBackground,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
    },

    usuarioCurtidaName: {
        marginLeft: 15,
    },
    usuarioCurtidaUsername: {
        marginLeft: 15,
        marginTop: 5,
        fontSize: 14,
    },
  
    containerCurtidas: {
        justifyContent: "space-between",
    },
});