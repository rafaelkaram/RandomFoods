import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import { WIDTH, HEIGHT } from '../../constants/dimensions';

export default StyleSheet.create({
    chartsTitle: {
        paddingTop: 10,
    },

    pieContainer: {
        justifyContent: 'center',
        margin: 15,
    },

    typePie: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        margin: 20
    },

    categoryPie: {
        minWidth: ((WIDTH / 2) - 20),
        minHeight: ((HEIGHT / 2) - 120),
        alignItems: 'center',
        alignContent: 'center',
        backgroundColor: 'white',
        borderRadius: 15
    },

    tableTitle: {
        textAlign: 'center',
    },

    topCurtidasTable: {
        marginHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 15,
    }
});