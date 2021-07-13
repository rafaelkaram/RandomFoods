
import React, { useState } from 'react';
import { KeyboardAvoidingView, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import colors from '../constants/colors';
import styles from '../styles/components/InputComment';

const InputComment = (props: {
    idPai: number | null
    idReceita: number
    submit: Function
    setNew: Function
}) => {
    const [newComment, setNewComment] = useState('');
    const idPai = props.idPai;
    const idReceita = props.idReceita;
    const submit = props.submit;
    const setNew = props.setNew;

    return (
        <View >
            <KeyboardAvoidingView behavior='position'>
                <View style={ styles.inputCommentContainer }>
                    <TextInput
                        placeholder='Adicione seu comentário..'
                        multiline
                        autoFocus={ true }
                        style={ styles.inputComment }
                        value={ newComment }
                        onChangeText={ (value) => setNewComment(value) }
                    />
                    <TouchableOpacity
                        style={ styles.inputCommentButton }
                        onPress={() => {
                            if(newComment){
                                submit(idReceita,idPai,newComment);
                                setNewComment('');
                                setNew();
                            }
                        }}
                    >
                        <Feather style={{ ...styles.inputCommentText, ...(!newComment && styles.inputCommentInactive) }} name='send' size={24} color={ colors.primary } />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

export default InputComment;