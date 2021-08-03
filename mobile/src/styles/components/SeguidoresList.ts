import { StyleSheet } from "react-native";

import colors from '../../constants/colors';

import { WIDTH, HEIGHT } from '../../constants/dimensions';

export default StyleSheet.create({
    seguidor: {
        margin: 10,
        padding: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
    },

    seguidorName: {
        marginLeft: 15,
    },
    seguidorUsername:{
        marginLeft: 15,
        marginTop:5,
        fontSize: 14,
    },
    botaoUnfollow:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderRadius: 10,
        height: 30,
        paddingHorizontal: 10,
        margin: 5,
        width: 50
    },


    container:{
        flex:1,
       flexDirection:"row" ,
       justifyContent:"space-between",
    },


});