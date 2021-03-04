import React, { useEffect, useState } from 'react'
import { Text, ScrollView, TouchableOpacity, View, StyleSheet, ImageBackgroundComponent } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Link, useHistory } from 'react-router-dom';
import { Input } from "react-native-elements";
import Icon from 'react-native-vector-icons/Ionicons';

import api from '../services/api'
import Colors from '../constants/colors';


const Login = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    //const history = useHistory();


    useEffect(() => {

    }, [])

    async function handleLogin(e:any) {
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

    return (
        <SafeAreaView>
            <ScrollView >
                <View style={styles.container}>
                    <Input
                        placeholder="Email"
                        onChangeText={(value) => setEmail(value)}
                        value={email}
                        inputContainerStyle={{ borderBottomWidth: 0 }}
                        leftIcon={
                            <Icon
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
                            <Icon
                                name='lock-closed-outline'
                                size={24}
                                color='black'
                            />
                        }
                    />
                    <View style={styles.buttons}>
                        <View style={styles.singleButt}>
                        <TouchableOpacity  onPress={() => handleLogin}>
                            <Text style={{color:'white'}}>
                                Entrar
                            </Text>
                        </TouchableOpacity>
                        </View>
                        <View style={styles.singleButt}>
                        <TouchableOpacity >
                            <Text style={{color:'white'}}>
                                Cadastrar
                             </Text>
                        </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 55,
        alignContent: 'center',
        padding: 20,
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        
        padding:10,

    },
    singleButt:{
        backgroundColor: Colors.dimmedBackground,
        padding:10,
       
    }
})

export default Login