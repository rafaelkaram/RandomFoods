import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, View, StyleSheet, Alert, Button, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Input } from "react-native-elements";
import * as Facebook from 'expo-facebook';
import { Ionicons } from '@expo/vector-icons';
import AuthContext from '../../contexts/auth'
import Config from '../../constants/config';
import MainButton from '../../components/MainButton';
import SmallButton from '../../components/SmallButton';
import BoldText from '../../components/BoldText';
import ItalicText from '../../components/ItalicText';

interface User {
    nome: string
    login: string
    email: string
    senha: string
}


const Usuario = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [nome, setNome] = useState('');
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmaSenha, setConfirmaSenha] = useState('');
    const [user, setUser] = useState<User>()
    const [errorNome, setErrorName] = useState('')
    const [errorUsername, setErrorUserName] = useState('')
    const [errorEmail, setErrorEmail] = useState('')
    const [errorSenha, setErrorSenha] = useState('')

    const handleSubmit = () => {
        const usuario = {
            nome,
            login,
            email,
            senha
        }
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

        if (usuario.login == '') {
            setErrorUserName('Campo Obrigatório')
            setTimeout(() => { setErrorUserName('') }, 2000)
        } else
            if (usuario.login.length < 12) {
                setErrorUserName('Deve ter pelo menos 12 caracteres')
                setTimeout(() => { setErrorUserName('') }, 2000)
            }

        if (usuario.nome == '') {
            setErrorName('Campo Obrigatório')
            setTimeout(() => { setErrorName('') }, 2000)
        }

        if (usuario.email == '') {
            setErrorEmail('Campo Obrigatório')
            setTimeout(() => { setErrorEmail('') }, 2000)
        } else
            if (reg.test(email) === false) {
                setErrorEmail('Insira um Email Válido')
                setTimeout(() => { setErrorEmail('') }, 2000)
            }

        if (usuario.senha == '') {
            setErrorSenha('Campo Obrigatório')
            setTimeout(() => { setErrorSenha('') }, 2000)
        } else
            if (usuario.senha.length < 8) {
                setErrorSenha('Deve ter pelo menos 12 caracteres')
                setTimeout(() => { setErrorSenha('') }, 2000)
            }else
            if (usuario.senha !== confirmaSenha){
                setErrorSenha('Senhas não conferem')
                setTimeout(() => { setErrorSenha('') }, 2000)
            }
        setUser(usuario)
        console.log(user);

    }

    return (
        <SafeAreaView>
            <ScrollView >
                <View style={styles.createuserImageContainer}>
                    <Image
                        style={styles.createUserImage}
                        source={require('../../assets/criar-conta.png')}
                    />
                    <ItalicText style={styles.subTitle}>Dados Gerais</ItalicText>
                </View>

                <View style={styles.inputsContainer}>
                    <Input
                        placeholder="Username"
                        errorMessage={errorUsername}
                        onChangeText={(value) => setLogin(value)}
                        value={login}
                        leftIcon={
                            <Ionicons name='person-outline' style={styles.icons} size={24} color='black' />
                        }
                    />
                    <Input
                        placeholder="Nome"
                        errorMessage={errorNome}
                        onChangeText={(value) => setNome(value)}
                        value={nome}
                        leftIcon={
                            <Ionicons name='person-outline' style={styles.icons} size={24} color='black' />
                        }
                    />
                    <Input
                        placeholder="Email"
                        errorMessage={errorEmail}
                        autoCompleteType={'email'}
                        onChangeText={(value) => setEmail(value)}
                        value={email}
                        leftIcon={
                            <Ionicons name="mail-outline" style={styles.icons} size={24} color="black" />
                        }
                    />
                    <Input
                        placeholder="Senha"
                        errorMessage={errorSenha}
                        onChangeText={(value) => setSenha(value)}
                        value={senha}
                        secureTextEntry={true}
                        leftIcon={
                            <Ionicons name='lock-closed-outline' style={styles.icons} size={24} color='black' />
                        }
                    />
                    <Input
                        placeholder="Confirmar Senha"
                        onChangeText={(value) => setConfirmaSenha(value)}
                        value={confirmaSenha}
                        secureTextEntry={true}
                        leftIcon={
                            <Ionicons name='lock-closed-outline' style={styles.icons} size={24} color='black' />
                        }
                    />
                    <View style={styles.buttons}>
                        <View style={styles.singleButt}>
                            <SmallButton onPress={() => { navigation.goBack() }}>Voltar</SmallButton>
                        </View>
                        <View style={styles.singleButt}>
                            <SmallButton onPress={() => { handleSubmit() }}>Cadastrar</SmallButton>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

    createuserImageContainer: {
        alignItems: 'center'
    },

    createUserImage: {
        width: 350,
        height: 70,
    },

    subTitle: {
        margin: 10,
        textAlign: 'center',
    },

    inputsContainer: {
        alignContent: 'center',
        margin: 30,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: 'white',
    },

    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 10,
    },

    singleButt: {
        padding: 10,
    },

    socialButtonsView: {
        paddingVertical: 10
    },

    icons: {
        paddingRight: 10
    },

})

export default Usuario;