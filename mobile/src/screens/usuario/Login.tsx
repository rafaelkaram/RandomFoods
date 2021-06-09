import React, { useEffect, useState, useContext } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Input } from 'react-native-elements';
import * as Facebook from 'expo-facebook';
import { Ionicons } from '@expo/vector-icons';
import AuthContext from '../../contexts/auth'
import Config from '../../constants/config';
import MainButton from '../../components/MainButton';
import SmallButton from '../../components/SmallButton';
import screens from './../../constants/screens';
import api from '../../services/api';
import { IUsuario } from '../../constants/interfaces';

const facebookLogo = require('../../assets/facebook.png');
const { width, height } = Dimensions.get('window');

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
            // ???
            return { type, token }
        }
    } catch ({ message }) {
        Alert.alert(`Falha no Login pelo Facebook: ${message}`);
    }
};

const Login = () => {
    const navigation = useNavigation();
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [eye, setEye] = useState(false)
    const [usuario, setUsuario] = useState<IUsuario>()

    const { signIn, signed, user } = useContext(AuthContext);

    const initFacebookLogin = async () => {
        try {
            await Facebook.initializeAsync({ appId: Config.FB_APP_ID, appName: Config.FB_APP_NAME });
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
                    [
                        { text: 'OK' }
                    ]
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
                            signIn(usuario);
                            //navigation.navigate(screens.cadastroIngredientes);
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

    return (
        <SafeAreaView>
            <ScrollView >
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logoImage}
                        source={require('../../assets/acesso-conta.png')}
                    />
                </View>
                <View style={styles.container}>
                    <Input
                        autoCapitalize='none'
                        placeholder='Login'
                        onChangeText={(value) => setLogin(value)}
                        value={login}
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
                        onChangeText={(value) => setSenha(value)}
                        value={senha}
                        secureTextEntry={!eye}
                        leftIcon={
                            <Ionicons
                                name='lock-closed-outline'
                                size={24}
                                color='black'
                            />
                        }
                        rightIcon={
                            <TouchableOpacity onPress={() => { setEye(!eye) }}>
                                <Ionicons name={eye ? 'eye' : 'eye-off'} size={24} color='black' />
                            </TouchableOpacity>
                        }
                    />
                    <View style={styles.buttons}>
                        <View style={styles.singleButt}>
                            <SmallButton onPress={() => { handleNavigateCreateUser() }}>Cadastrar</SmallButton>
                        </View>
                        <View style={styles.singleButt}>
                            <SmallButton onPress={() => handleLogin(login, senha)}>Entrar</SmallButton>
                        </View>
                    </View>
                    <View style={styles.socialButtonsView}>
                        <MainButton style={styles.facebookButton} onPress={handleFBLogin} image={facebookLogo}>Facebook</MainButton>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({

    logoContainer: {
        alignItems: 'center',
        paddingBottom: 10,
    },

    logoImage: {
        width: width - 10,
        height: (width - 10) / 1.3,
        // Utilizar proporção de x por x : 1.3 para garantir que fique bonito em todos os tamanhos de tela
    },

    container: {
        alignContent: 'center',
        margin: 15,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 15
    },

    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },

    singleButt: {
        width: '50%'
    },

    socialButtonsView: {
        paddingVertical: 10
    },

    facebookButton: {
        backgroundColor: '#3B5998'
    },

})

export default Login;