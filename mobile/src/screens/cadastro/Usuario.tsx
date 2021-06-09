import React, { useState, useContext } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { IMidiaPicker, IUsuario } from '../../constants/interfaces';
import SmallButton from '../../components/SmallButton';
import colors from '../../constants/colors';
import api from '../../services/api';
import InputSignUp from '../../components/InputSignUp'
import RegularText from '../../components/RegularText';

const { width, height } = Dimensions.get('window');

const Usuario = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user, setUser] = useState<IUsuario>()
    const [midia, setMidia] = useState<IMidiaPicker>();


    const handleSubmit = async () => {

        const usuario = {
            nome: name,
            login: username,
            email,
            senha: password
        }

        if (usuario.nome == '' || usuario.login == '' || usuario.email == '' || usuario.senha == '') {
            Alert.alert(
                "Campos incorretos",
                'Todos os campos devem ser preenchidos corretamente',
                [
                    { text: "OK", onPress: () => console.log("OK Pressed") }
                ]
            );
        } else {

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
            console.log(data);

            await api.post('cadastro/usuario', data).then(response => {
                console.log({ msg: 'Recebemos resposta!', response: response.data })
                setUser(response.data)
            });
            console.log(user);

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

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logoImage}
                        source={require('../../assets/criar-conta.png')}
                    />
                </View>

                <View style={styles.container}>
                    <View style={ styles.midiaContainer }>
                    { midia?.uri ?
                        <View style={styles.midiaView}>
                            <Image
                                source={{ uri: midia?.uri }}
                                style={styles.midia}
                            />
                            <TouchableOpacity style={styles.midiaRemove} onPress={() => handleRemoveMidia()} >
                                {/* <Feather name='minus' size={16} color={colors.dimmedBackground} /> */}
                                <RegularText style={{ color: colors.dimmedBackground }}>X</RegularText>
                            </TouchableOpacity>

                        </View>
                        :
                        <TouchableOpacity style={styles.midiaInput} onPress={handleAddMidia} >
                            <Feather name='plus' size={24} color={colors.dimmedBackground} />
                        </TouchableOpacity>
                    }
                    </View>

                    <InputSignUp tipo='username' placeholder='Username' icon='person-outline' security={false} setState={setUsername} ></InputSignUp>
                    <InputSignUp tipo='email' placeholder='Email' icon='mail-outline' security={false} setState={setEmail} ></InputSignUp>
                    <InputSignUp tipo='name' placeholder='Nome' icon='person-outline' security={false} setState={setName} ></InputSignUp>
                    <InputSignUp tipo='password' placeholder='Senha' icon='lock-closed-outline' security={true} setState={setPassword} ></InputSignUp>

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
    logoContainer: {
        alignItems: 'center',
        paddingBottom: 10
    },

    logoImage: {
        width: width - 10,
        height: (width - 10) / 5,
        // Utilizar proporção de x por x : 5 para garantir que fique bonito em todos os tamanhos de tela
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

    icons: {
        paddingRight: 10
    },

    midiaContainer: {
        alignItems: 'center',
        paddingBottom: 10,
    },

    midia: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 1,
        borderColor: colors.dimmedBackground,
        justifyContent: 'center',
        alignItems: 'center',

    },

    midiaInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderStyle: 'dashed',
        borderColor: colors.dimmedBackground,
        borderWidth: 1,
        borderRadius: 40,
        height: 80,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },

    midiaView: {
        position: 'relative'
    },

    midiaRemove: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: colors.backgroundDimmed,
        borderColor: colors.dimmedBackground,
        borderWidth: 0.5,
        borderRadius: 20,
        width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',

    },
})

export default Usuario;