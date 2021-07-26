import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import { WIDTH, HEIGHT } from '../../constants/dimensions';

export default StyleSheet.create({
    chartsTitle: {
        paddingTop: 5,
        paddingLeft: 5,
        fontFamily: 'Ubuntu_500Medium_Italic',
        color: colors.secondary,
        alignSelf: 'flex-start',
        textShadowColor: 'black',
        textShadowRadius: 0.5,
        textShadowOffset: {
            width: 0.5,
            height: 0.5
        },
    },

    pieContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        margin: 15,
    },

    typePie: {
        minWidth: ((WIDTH / 2) - 20),
        minHeight: ((HEIGHT / 2) - 120),
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        marginRight: 10
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

    topVotedTable: {
        marginHorizontal: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 15,
    }
});