
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    StyleSheet,
    TextInput,
    Text,
    View, TouchableOpacity
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from '../constants/colors';


const InputComment = (props: {
    resposta: boolean
    idPai: number | null
    idReceita: any
    submit: Function
    setNew: Function
}) => {
    const [newComment, setNewComment] = useState('')
    const resposta = props.resposta
    var idPai = props.idPai
    const idReceita = props.idReceita
    const submit = props.submit
    const setNew = props.setNew

    // if (idPai = 0){
    //     idPai = null
    // }else{
    //      idPai = props.idPai
    // }
    return (
        <View >
            <KeyboardAvoidingView
                behavior='position'
            >
                <View style={styles.container}>
                    {/* Comment input field */}
                    <TextInput
                        placeholder="Adicione seu comentário.."
                        multiline
                        autoFocus={true} // focus and show the keyboard
                        style={styles.input}
                        value={newComment}
                        onChangeText={(value) => setNewComment(value)} // handle input changes
                    // onSubmitEditing={this.onSubmitEditing} // handle submit event
                    />
                 
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            if(newComment){
                                submit(idReceita,idPai,newComment)
                                setNewComment('')
                                setNew()
                            }
                           
                        }}>
                    
                        <TouchableOpacity
                        >
                            <Feather style={[styles.text, !newComment ? styles.inactive : []]} name="send" size={24} color={colors.dimmedBackground} />
                        </TouchableOpacity>

                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </View>
    );

}
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: '#EEE',
        alignItems: 'center',
        paddingLeft: 15,
    },
    input: {
        flex: 1,
        minHeight: 60,
        lineHeight: 22,
        fontSize: 15,
        paddingVertical: 5,
    },
    button: {
        height: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inactive: {
        color: '#CCC',
    },
    text: {
        color: colors.dimmedBackground,
        fontWeight: 'bold',
        //fontFamily: 'Avenir',
        textAlign: 'center',
        fontSize: 15,
    },
});

export default InputComment;