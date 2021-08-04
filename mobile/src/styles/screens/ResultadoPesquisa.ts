import { StyleSheet } from 'react-native';
import { WIDTH } from '../../constants/dimensions';

export default StyleSheet.create({
    text: {
        fontSize: 20,
        margin: 3,
    },

    container: {
        margin: 10,
        width: WIDTH-175,
        backgroundColor: 'white',
        borderRadius: 20,
        alignSelf: 'flex-end'
    },

    comboBox: {
        width: WIDTH-175,
        height: 40,
        alignSelf: 'center',
        justifyContent: 'flex-end'
    },
});