import React, { useEffect, useState, useContext } from 'react';
import { Alert, Image, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Input } from 'react-native-elements';
import * as Facebook from 'expo-facebook';
import { Ionicons } from '@expo/vector-icons';
import AuthContext from '../../contexts/auth';

import api from '../../services/api';

import { IUsuario } from '../../constants/interfaces';
import config from '../../constants/config';
import screens from './../../constants/screens';
import styles from '../../styles/screens/Login';

import Loading from '../../components/Loading';
import MainButton from '../../components/MainButton';
import SmallButton from '../../components/SmallButton';

const facebookLogo = require('../../assets/facebook.png');

export const fbLogin = async () => {
    try {
        const {
            token,
            type,
            expirationDate,
            permissions,
            declinedPermissions
        }: Facebook.FacebookLoginResult = await Facebook.logInWithReadPermissionsAsync({ permissions: ['public_profile'] });

        if (type === 'success') {
            const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);

            const user = await response.json();
            Alert.alert('Usuário logado!', `Bem-vindo ${user.name}!`);

            const pictureResponse = await fetch(`https://graph.facebook.com/v8.0/${user.id}/picture?width=500&redirect=false&access_token=${token}`);
            const pictureObject = await pictureResponse.json();
            const userObject = {
                ...user,
                photoUrl: pictureObject.data.url,
            };
            return { type, token, user: userObject };
        } else {
            return { type, token };
        }
    } catch ({ message }) {
        Alert.alert(`Falha no Login pelo Facebook: ${message}`);
    }
};

const Login = () => {
    const navigation = useNavigation();
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [eye, setEye] = useState(false);
    const [usuario, setUsuario] = useState<IUsuario>();
    const [load, setLoad] = useState(true);

    const { signIn, signed, user } = useContext(AuthContext);

    const initFacebookLogin = async () => {
        try {
            await Facebook.initializeAsync({ appId: config.FB_APP_ID, appName: config.FB_APP_NAME });
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        initFacebookLogin();
    }, []);

    useEffect(() => {
        if (usuario) {
            signIn(usuario)
        }
    }, [usuario]);

    const handleNavigateCreateUser = () => {
        navigation.navigate(screens.cadastroUsuario);
    }

    async function handleLogin(login: string, senha: string) {
        const params = {
            login,
            senha
        };
        await api.post('/login', params)
            .then(response => {
                setUsuario(response.data);
            }).catch(error => {
                Alert.alert(
                    'Falha no Login',
                    '\nLogin ou senha incorretos',
                    [ { text: 'OK' } ]
                );

            });
    }

    const handleFBLogin = async () => {
        const { type, token, user, error }: any = await fbLogin();
        if (type && token) {
            if (type === 'success') {
                await api.post('/fb-login', user)
                    .then(response => {
                        const usuario: IUsuario = response.data;
                        usuario.path = user.photoUrl;
                        if (usuario) {
                            setUsuario(usuario);
                        }
                        else {
                            Alert.alert(`Falha no Login pelo Facebook: ${response.data}`);
                            console.log(response.data);
                        }
                    });
            }
        } else if (error) {
            console.log('Login falhou!');
        }
    }

    if (!load) {
        return <Loading />
    }

    return (
        <SafeAreaView>
            <ScrollView >
                <View style={ styles.logoContainer }>
                    <Image
                        style={ styles.logoImage }
                        source={ require('../../assets/acesso-conta.png') }
                    />
                </View>
                <View style={ styles.container }>
                    <Input
                        autoCapitalize='none'
                        placeholder='Login'
                        onChangeText={ (value) => setLogin(value) }
                        value={ login }
                        leftIcon={
                            <Ionicons
                                name='person-outline'
                                size={24}
                                color='black'
                            />
                        }
                    />
                    <Input
                        autoCapitalize='none'
                        placeholder='Senha'
                        onChangeText={ (value) => setSenha(value) }
                        value={ senha }
                        secureTextEntry={ !eye }
                        leftIcon={
                            <Ionicons
                                name='lock-closed-outline'
                                size={24}
                                color='black'
                            />
                        }
                        rightIcon={
                            <TouchableOpacity onPress={() => { setEye(!eye) }}>
                                <Ionicons name={ eye ? 'eye' : 'eye-off' } size={24} color='black' />
                            </TouchableOpacity>
                        }
                    />
                    <View style={ styles.buttons }>
                        <View style={ styles.singleButt }>
                            <SmallButton onPress={ () => { handleNavigateCreateUser()} }>Cadastrar</SmallButton>
                        </View>
                        <View style={ styles.singleButt }>
                            <SmallButton onPress={ () => handleLogin(login, senha) }>Entrar</SmallButton>
                        </View>
                    </View>
                    <View style={ styles.socialButtonsView }>
                        <MainButton style={ styles.facebookButton } onPress={ handleFBLogin } image={ facebookLogo }>Facebook</MainButton>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Login;