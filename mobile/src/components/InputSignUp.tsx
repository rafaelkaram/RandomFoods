import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native'
import { Input } from "react-native-elements";
import { Ionicons } from '@expo/vector-icons';
import api from '../services/api';

const InputSignUp = (props: {
    tipo: any
    placeholder: string
    icon: any
    security: boolean
    setState: Function
}) => {

    const [data, setData] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [eye, setEye] = useState(false)

    const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

    const validateField = (value: string) => {

        if (value == '' || value === undefined) {
            setErrorMessage('Campo Obrigatório')
            setTimeout(() => { setErrorMessage('') }, 2000)
            props.setState('')
        } else {
            props.setState(data)
        }
        if (props.tipo == 'username') {
            if (value.length < 6) {
                setErrorMessage('Username deve ter pelo menos 6 caracteres')
                setTimeout(() => { setErrorMessage('') }, 2000)
                props.setState('')
            } else {
                api.post('validate/usuario', { value: value }).then(response => {
                    if (response.status === 203) {
                        setErrorMessage('Usuario já cadastrado')
                        setTimeout(() => { setErrorMessage('') }, 2000)
                        props.setState('')
                    } else if (response.status === 204) {
                        props.setState(data)
                    }
                })
            }

        }
        else
            if (props.tipo == 'email') {
                if (reg.test(value) === false) {
                    setErrorMessage('Insira um Email Válido')
                    setTimeout(() => { setErrorMessage('') }, 2000)
                    props.setState('')
                } else {
                    api.post('validate/usuario', { value: value }).then(response => {
                        if (response.status === 203) {
                            setErrorMessage('Email já cadastrado')
                            setTimeout(() => { setErrorMessage('') }, 2000)
                            props.setState('')
                        } else if (response.status === 204) {
                            props.setState(data)
                        }
                    })
                }

            } else
                if (props.tipo == 'password' && value.length < 6) {
                    setErrorMessage('Senha deve ter pelo menos 6 caracteres')
                    setTimeout(() => { setErrorMessage('') }, 2000)
                    props.setState('')
                } else {
                    props.setState(data)
                }
    }


    if (props.security) {
        return (
            <Input
                autoCapitalize='none'
                onEndEditing={() => { validateField(data) }}
                placeholder={props.placeholder}
                errorMessage={errorMessage}
                autoCompleteType={props.tipo}
                secureTextEntry={!eye}
                onChangeText={(value) => setData(value)}
                value={data}
                leftIcon={
                    <Ionicons name={props.icon} style={{ paddingRight: 10 }} size={24} color='black' />
                }
                rightIcon={
                    <TouchableOpacity onPress={() => { setEye(!eye) }}>
                        <Ionicons name={eye ? 'eye' : 'eye-off'} size={24} color="black" />
                    </TouchableOpacity>
                }
            />
        );
    } else {
        return (
            <Input
                autoCapitalize={ props.tipo === 'name' ? 'words' : 'none' }
                onEndEditing={() => { validateField(data) }}
                placeholder={props.placeholder}
                errorMessage={errorMessage}
                autoCompleteType={props.tipo}
                onChangeText={(value) => setData(value)}
                value={data}
                leftIcon={
                    <Ionicons name={props.icon} style={{ paddingRight: 10 }} size={24} color='black' />
                }
            />
        );
    }


}

export default InputSignUp;