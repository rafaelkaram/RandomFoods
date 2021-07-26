import { StyleSheet } from 'react-native';

import colors from '../../constants/colors';
import { WIDTH } from '../../constants/dimensions';

export default StyleSheet.create({
    container: {
        flexDirection: 'row',
        maxWidth: WIDTH
    },

    imageSearch: {
        width: 320,
        height: 70,
        marginHorizontal: 10
    },

    imageNewRecipe: {
        width: 320,
        height: 60,
        marginHorizontal: 10
    },

    basketContainer: {
        alignSelf: 'flex-end',
        marginRight: 10,
        marginBottom: 10
    },

    basketCounter: {
        backgroundColor: colors.primary,
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center'
    },
});