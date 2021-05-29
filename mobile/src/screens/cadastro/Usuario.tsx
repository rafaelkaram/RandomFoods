import React, { useState, useContext } from 'react';
import { ScrollView, View, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import { IMidiaPicker, IUsuario } from '../../constants/interfaces';
import SmallButton from '../../components/SmallButton';
import ItalicText from '../../components/ItalicText';
import colors from '../../constants/colors';
import api from '../../services/api';
import InputSignUp from '../../components/InputSignUp'


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
            <ScrollView >
                <View style={styles.createuserImageContainer}>
                    <Image
                        style={styles.createUserImage}
                        source={require('../../assets/criar-conta.png')}
                    />
                    <ItalicText style={styles.subTitle}>Dados Gerais</ItalicText>
                </View>

                <View style={styles.inputsContainer}>

                    <InputSignUp tipo='username' placeholder='Username' icon='person-outline' security={false} setState={setUsername} ></InputSignUp>
                    <InputSignUp tipo='email' placeholder='Email' icon='mail-outline' security={false} setState={setEmail} ></InputSignUp>
                    <InputSignUp tipo='name' placeholder='Nome' icon='person-outline' security={false} setState={setName} ></InputSignUp>
                    <InputSignUp tipo='password' placeholder='Senha' icon='lock-closed-outline' security={true} setState={setPassword} ></InputSignUp>

                    <View style={styles.midiaView}>
                        <Image
                            source={{ uri: midia?.uri }}
                            style={styles.midia}
                        />

                        <TouchableOpacity style={styles.midiaInput} onPress={handleAddMidia} >
                            <Feather name='plus' size={24} color={colors.dimmedBackground} />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.midiaRemove} onPress={() => handleRemoveMidia()} >
                            <Feather name='minus' size={16} color={colors.dimmedBackground} />
                        </TouchableOpacity>

                    </View>

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
        borderColor: colors.dimmedBackground,
        marginRight: 20,

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
        marginRight: 20,
    },

    midiaView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 10
    },

    midiaRemove: {
        backgroundColor: colors.backgroundDimmed,
        borderColor: colors.dimmedBackground,
        borderWidth: 0.5,
        borderRadius: 20,
        padding: 3,
        maxHeight: 25,
        maxWidth: 25,
        alignSelf: 'center'
    },
})

export default Usuario;