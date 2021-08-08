import React, { useState, useEffect, useContext } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';

import api from '../../services/api';

import { IMidiaPicker, IUsuario } from '../../constants/interfaces';
import colors from '../../constants/colors';
import styles from '../../styles/screens/Usuario';
import globalStyles from '../../styles/Global';

import AuthContext from '../../contexts/auth';

import SmallButton from '../../components/SmallButton';
import InputSignUp from '../../components/InputSignUp';
import Loading from '../../components/Loading';

const Usuario = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState<IUsuario>()
    const [midia, setMidia] = useState<IMidiaPicker>();
    const [load, setLoad] = useState(true)

    const { signIn, signed } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            signIn(user);
        }
    }, [user]);


    const handleSubmit = async () => {

        const usuario = {
            nome: name,
            login: username,
            email,
            senha: password
        }

        if (usuario.nome == '' || usuario.login == '' || usuario.email == '' || usuario.senha == '') {
            Alert.alert(
                'Campos incorretos',
                'Todos os campos devem ser preenchidos corretamente',
                [ { text: 'OK', onPress: () => console.log('OK Pressed') } ]
            );
        } else {

            setLoad(false);

            const data = new FormData();

            data.append('nome', usuario.nome);
            data.append('login', usuario.login.toLowerCase());
            data.append('email', usuario.email.toLowerCase());
            data.append('senha', usuario.senha);

            if (midia) data.append('image', {
                name: 'image.png',
                type: 'image/png',
                uri: midia.uri
            } as any);

            await api.post('cadastro/usuario', data).then(response => {
                setUser(response.data);
            });
        }
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

    if (!load) {
        return <Loading />
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={ styles.logoContainer }>
                    <Image
                        style={ styles.logoImage }
                        source={ require('../../assets/cadastro-conta.png') }
                    />
                </View>

                <View style={ styles.container }>
                    <View style={ styles.midiaContainer }>
                        { midia?.uri ?
                            <View style={ styles.midiaView }>
                                <Image
                                    source={{ uri: midia?.uri }}
                                    style={ styles.midia }
                                />
                                <TouchableOpacity style={ styles.midiaRemove } onPress={() => handleRemoveMidia()} >
                                    <Text style={{ ...globalStyles.regularText, color: colors.primary }}>X</Text>
                                </TouchableOpacity>

                            </View>
                            :
                            <TouchableOpacity style={ styles.midiaInput } onPress={ handleAddMidia } >
                                <Image source={ require('./../../assets/user-foto.png') } style={ styles.midiaIcon } />
                                <AntDesign style={ styles.editIcon } name='edit' size={30} color='black' />
                                <Text style={{ ...globalStyles.regularText, bottom: 20 }}>Escolha sua foto</Text>
                            </TouchableOpacity>
                        }
                    </View>

                    <InputSignUp tipo='username' placeholder='username' icon='person-outline' security={ false } setState={ setUsername } ></InputSignUp>
                    <InputSignUp tipo='email' placeholder='Email' icon='mail-outline' security={ false } setState={ setEmail } ></InputSignUp>
                    <InputSignUp tipo='name' placeholder='Nome' icon='person-outline' security={ false } setState={ setName } ></InputSignUp>
                    <InputSignUp tipo='password' placeholder='Senha' icon='lock-closed-outline' security={ true } setState={ setPassword } ></InputSignUp>

                    <View style={ styles.buttons }>
                        <View style={ styles.singleButt }>
                            <SmallButton onPress={() => { navigation.goBack() }}>Voltar</SmallButton>
                        </View>
                        <View style={ styles.singleButt }>
                            <SmallButton onPress={() => { handleSubmit() }}>Cadastrar</SmallButton>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Usuario;