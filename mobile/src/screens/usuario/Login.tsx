import React, { useEffect, useState, useContext } from 'react';
import { ScrollView, View, StyleSheet, Alert, Button } from 'react-native';
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
            // ???
            return { type, token }
        }
    } catch ({ message }) {
        Alert.alert(`Falha no Login pelo Facebook: ${message}`);
    }
};

const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    //const history = useHistory();
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




    async function handleLogin(e: any) {
        /* e.preventDefault();
 
         try {
             const response = await api.post('session',  { email, senha });
 
             localStorage.setItem('userId', response.data.id);
             localStorage.setItem('userEmail', email);
             localStorage.setItem('userName', response.data.nome);
             console.log(localStorage.userId)
 
             navigation.navigate('Profile');
 
             //history.push('/profile');
         } catch (error) {
             alert(error.response.data.error);
         }
 */
    }

    const { signIn, user } = useContext(AuthContext)

    function handleSignIn() {
        signIn()
    }

    const handleFBLogin = async () => {
        const { type, token, user, error } : any = await fbLogin();

        if (type && token) {
            if (type === 'success') {
                // Criar o context pra guardar os dados de login
                //dispatch({ type: 'FB_LOGIN', token, user });
            }
        } else if (error) {
            console.log('Login falhou!');
        }
    }

    return (
        <SafeAreaView>
            <ScrollView >
                <View style={styles.container}>
                    {/* <BoldText>{user.login}</BoldText> */}
                    <Input
                        placeholder="Email"
                        onChangeText={(value) => setEmail(value)}
                        value={email}
                        inputContainerStyle={{ borderBottomWidth: 0 }}
                        leftIcon={
                            <Ionicons
                                name='person-outline'
                                size={24}
                                color='black'
                            />
                        }
                    />
                    <Input
                        placeholder="Senha"
                        onChangeText={(value) => setSenha(value)}
                        value={senha}
                        secureTextEntry={true}
                        inputContainerStyle={{ borderBottomWidth: 0 }}
                        leftIcon={
                            <Ionicons
                                name='lock-closed-outline'
                                size={24}
                                color='black'
                            />
                        }
                    />
                    <View style={styles.buttons}>
                        <View style={styles.singleButt}>
                            <SmallButton onPress={() => handleLogin}>Entrar</SmallButton>
                        </View>
                        <View style={styles.singleButt}>
                            <SmallButton>Cadastrar</SmallButton>
                        </View>
                    </View>
                    <View style={styles.socialButtonsView}>
                        <MainButton style={styles.facebookButton} onPress={handleFBLogin} image={facebookLogo}>Facebook</MainButton>
                    </View>

                    <Button title="Sign In" onPress={() => handleSignIn()} />


                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
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

    facebookButton: {
        backgroundColor: '#3B5998'
    },

})

export default Login;