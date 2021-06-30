import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';

import 'moment/min/locales';

import SubComment from './SubComment';
import { IComentarioProps } from '../constants/interfaces';
import styles from '../styles/components/Comment';
import globalStyles from '../styles/Global';

const Comment = ({ comentario, lista, isLogado, setNew, setIdPai } : IComentarioProps) => {
    return (
        <View>
            <View style={ styles.commentContainer }>
                <View>
                    <View style={ styles.commentTitle }>
                        <View style={ styles.dataContainer }>
                            <Text style={ styles.commentUser }>{ comentario.usuario.nome }</Text>
                            <Text style={ styles.commentDate }> - { moment(comentario.data).startOf('day').fromNow() }</Text>
                        </View>
                    </View>
                </View>

                <Text style={ globalStyles.regularText }>{ comentario.conteudo }</Text>
                <View style={ styles.commentHour }>
                    <Text>{ moment(comentario.data).format('HH:mm') }</Text>
                </View>
                { isLogado &&
                    <TouchableOpacity style={ styles.commentButton }
                        onPress={() => {
                            setIdPai(comentario.id);
                            setNew();
                        }}
                    >
                        <MaterialCommunityIcons name='comment' size={20} color='black' />
                    </TouchableOpacity>
                }
            </View>
            {
                lista.filter(subComentario => (subComentario.comentarioPai === comentario.id)).map(subComentario => {
                    return (
                        <SubComment
                            key={ comentario.id }
                            comentario={ subComentario }
                            lista={ lista }
                            isLogado={ isLogado }
                            setNew={ setNew }
                            setIdPai={ setIdPai }
                        />
                    )
                })
            }
        </View>
    );
}

export default Comment;