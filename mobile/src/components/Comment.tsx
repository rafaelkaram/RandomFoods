import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment-timezone';

import { IComentarioProps } from '../constants/interfaces';
import styles from '../styles/components/Comment';
import globalStyles from '../styles/Global';

import SubComment from './SubComment';

const Comment = ({ comentario, lista, isLogado, setNew, setIdPai } : IComentarioProps) => {
    moment.tz.setDefault("America/Sao_paulo");
    return (
        <View style={ styles.comments }>
            <View style={ styles.commentContainer }>
                <View>
                    <View style={ styles.commentTitle }>
                        <View style={ styles.dataContainer }>
                            <Text style={ styles.commentUser }>{ comentario.usuario.nome }</Text>
                            <Text style={ styles.commentDate }> - { moment(comentario.data).startOf('second').fromNow() }</Text>
                        </View>
                    </View>
                </View>

                <Text style={ globalStyles.regularText }>{ comentario.conteudo }</Text>
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
                            key={ subComentario.id }
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