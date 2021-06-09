import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import moment from 'moment';

import "moment/min/locales";

import RegularText from './RegularText'
import SubComment from './SubComment';

const Comment = ({ comentarios }: { comentarios: any }) => {
    return (
        <View>
            <View style={styles.singleComment}>
                <View>
                    <View style={styles.commentTitle}>
                        <View style={styles.commentUserDate}>
                            <Text style={styles.commentUser}>{comentarios.usuario}</Text>
                            <Text style={styles.commentDate}> - {moment(comentarios.data).startOf('day').fromNow()}</Text>
                        </View>
                        <Text>NOTA: {comentarios.avaliacao}</Text>
                    </View>
                </View>

                <RegularText>{comentarios.valor}</RegularText>
                <View style={styles.commentHour}>
                    <Text>{moment(comentarios.data).format('HH:mm')}</Text>
                </View>
            </View>
            <SubComment id={comentarios.id} comments={ comentarios } />
        </View>
    );
}

const styles = StyleSheet.create({
    itemListTitle: {
        backgroundColor: '#e02041',

        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'Ubuntu_700Bold',

        margin: 3,
        padding: 10,
    },

    container: {
        flex: 1,
        backgroundColor: '#F0F0F5'
    },

    note: {
        flexDirection: 'row',
        padding: 3,
        margin: 10,
    },

    type: {
        flexDirection: 'row',
        padding: 3,
        margin: 10,
    },

    ingredientList: {
        margin: 10,
        padding: 5,
        backgroundColor: 'white',
    },

    ingredient: {
        flexDirection: 'row',
        padding: 3,
    },

    itemListDescribe: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        padding: 5,
        backgroundColor: 'white',
    },

    comments: {
        margin: 10,
        padding: 5,
    },

    singleComment: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
    },

    commentTitle: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        fontFamily: 'Ubuntu_400Regular'
    },

    commentUserDate:{
        flexDirection:'row',
    },

    commentUser: {
        fontFamily: 'Ubuntu_700Bold'
    },

    commentDate:{
        color:'#999999',
        fontFamily: 'Ubuntu_400Regular'
    },

    commentHour:{
        paddingTop:10,
        alignItems:'flex-end',
    },

    identacao: {
        marginTop: 10,
        backgroundColor:'red',
    },
});


export default Comment;