import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, View, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Input } from "react-native-elements";
import * as ImagePicker from 'expo-image-picker';
import { Ionicons, Feather } from '@expo/vector-icons';
import { IMidiaPicker, IUsuario } from '../../constants/interfaces';
import SmallButton from '../../components/SmallButton';
import BoldText from '../../components/BoldText';
import ItalicText from '../../components/ItalicText';
import colors from '../../constants/colors';
import api from '../../services/api';

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
    const [usuario, setUsuario] = useState<IUsuario>()
    const [errorNome, setErrorName] = useState('')
    const [errorUsername, setErrorUserName] = useState('')
    const [errorEmail, setErrorEmail] = useState('')
    const [errorSenha, setErrorSenha] = useState('')
    const [midia, setMidia] = useState<IMidiaPicker>();
    
    //usuario
    useEffect(() =>{},[usuario])


    const handleSubmit = async () => {     

        const usuario = {
            nome,
            login,
            email,
            senha
        }
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

        if (usuario.login == '') {
            setErrorUserName('Campo Obrigatório')
            setTimeout(() => { setErrorUserName('') }, 2000)
        } else
            if (usuario.login.length < 6) {
                setErrorUserName('Deve ter pelo menos 6 caracteres')
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
                setErrorSenha('Deve ter pelo menos 8 caracteres')
                setTimeout(() => { setErrorSenha('') }, 2000)
            } else
                if (usuario.senha !== confirmaSenha) {
                    setErrorSenha('Senhas não conferem')
                    setTimeout(() => { setErrorSenha('') }, 2000)
                }
        setUser(usuario)

        const data = new FormData();

        data.append('nome', usuario.nome);
        data.append('login', usuario.login);
        data.append('email', usuario.email);
        data.append('senha', usuario.senha);

        if (midia) data.append('image', {
            name: 'image.png',
            type: 'image/png',
            uri: midia.uri
        } as any);

       await api.post('cadastro/usuario', data).then(response => {  
            console.log({ msg: 'Recebemos resposta!', response: response.data })
            setUsuario(response.data)
        });

      
        console.log(user);

    }

    const handleAddMidia = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
        });

        if (!result.cancelled) {
            const midia: IMidiaPicker = result as IMidiaPicker;
            setMidia(midia);
        }
    }

    const handleRemoveMidia = async () => {
        setMidia({} as IMidiaPicker);
    }

    const validateField = (value: string, isEmail: boolean) => {
        console.log(value);

        api.post('validate/usuario', { value: value }).then(response => {
            if (response.status === 203) {
                if (isEmail) {
                    setErrorEmail('Email já Existe')
                    setTimeout(() => { setErrorEmail('') }, 2000)
                } else {
                    setErrorUserName('Usuario Já existe')
                    setTimeout(() => { setErrorUserName('') }, 2000)
                }

            } else if (response.status === 204) {

            }
        })
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
                        onEndEditing={() => { validateField(login, false) }}
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
                        onEndEditing={() => { validateField(email, true) }}
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

                    <View style={styles.midiaView}>
                        <Image
                            source={{ uri: midia?.uri }}
                            style={styles.midia}
                        />
                        <TouchableOpacity style={styles.midiaRemove} onPress={() => handleRemoveMidia()} >
                            <Feather name='minus' size={16} color={colors.dimmedBackground} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.midiaInput} onPress={handleAddMidia} >
                        <Feather name='plus' size={24} color={colors.dimmedBackground} />
                    </TouchableOpacity>

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

    midia: {
        width: 64,
        height: 64,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.primary,
        marginBottom: 10,
        marginRight: 8
    },

    midiaInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderStyle: 'dashed',
        borderColor: colors.dimmedBackground,
        borderWidth: 1.4,
        borderRadius: 20,
        height: 64,
        width: 64,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },

    midiaView: {
        position: 'relative'
    },

    midiaRemove: {
        position: 'absolute',
        top: 2,
        right: 11,
        backgroundColor: colors.backgroundDimmed,
        borderColor: colors.dimmedBackground,
        borderWidth: 0.5,
        borderRadius: 20,
        padding: 3
    },
})

export default Usuario;