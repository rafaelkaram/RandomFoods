import { StyleSheet } from "react-native";

import colors from "../../constants/colors";
import { WIDTH } from '../../constants/dimensions';

export default StyleSheet.create({
    inputPesquisa: {
        marginTop: 20,
        borderWidth: 1,
        paddingLeft: 5,
        borderRadius: 10,
        borderColor: 'gray',
        marginBottom: -20,
        backgroundColor: 'white',
    },

    imageSeguidores: {
        width: 377,
        height: 101,
        alignSelf: 'center'
    },

    imageSeguindo: {
        width: 340,
        height: 110,
        alignSelf: 'center'
    }

});