import React, { useEffect, useState } from 'react'
import { Text, ScrollView, TouchableOpacity, View, StyleSheet, ImageBackgroundComponent } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from "react-native-elements";
import Icon from 'react-native-vector-icons/Ionicons';

import api from '../services/api'
import Colors from '../constants/colors';


const Login = () => {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    useEffect(() => {

    }, [])

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
                        <TouchableOpacity >
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