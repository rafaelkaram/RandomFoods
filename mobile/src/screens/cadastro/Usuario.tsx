import React, { useState, useEffect, useContext } from 'react';
import { Alert, Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';
import { IMidiaPicker, IUsuario } from '../../constants/interfaces';
import SmallButton from '../../components/SmallButton';
import colors from '../../constants/colors';
import api from '../../services/api';
import InputSignUp from '../../components/InputSignUp'
import RegularText from '../../components/RegularText';
import AuthContext from '../../contexts/auth'
import Loading from '../../components/Loading';

const { width, height } = Dimensions.get('window');

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
            signIn(user)
        }
    }, [user]);


    const handleSubmit = async () => {

        setLoad(false)

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

            await api.post('cadastro/usuario', data).then(response => {
                console.log({ msg: 'Recebemos resposta!', response: response.data })
                setUser(response.data)
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
                <View style={styles.logoContainer}>
                    <Image
                        style={styles.logoImage}
                        source={require('../../assets/cadastro-conta.png')}
                    />
                </View>

                <View style={styles.container}>
                    <View style={styles.midiaContainer}>
                        {midia?.uri ?
                            <View style={styles.midiaView}>
                                <Image
                                    source={{ uri: midia?.uri }}
                                    style={styles.midia}
                                />
                                <TouchableOpacity style={styles.midiaRemove} onPress={() => handleRemoveMidia()} >
                                    <RegularText style={{ color: colors.dimmedBackground }}>X</RegularText>
                                </TouchableOpacity>

                            </View>
                            :
                            <TouchableOpacity style={styles.midiaInput} onPress={handleAddMidia} >
                                <Image source={require('./../../assets/user-foto.png')} style={styles.midiaIcon} />
                                <AntDesign style={styles.editIcon} name="edit" size={30} color="black" />
                                <RegularText style={{ bottom: 20 }}>Escolha sua foto</RegularText>
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

    icons: {
        paddingRight: 10
    },

    midiaContainer: {
        alignItems: 'center',
        paddingBottom: 10,
    },

    midia: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 1,
        borderColor: colors.dimmedBackground,
        justifyContent: 'center',
        alignItems: 'center',

    },

    midiaInput: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    midiaView: {
        position: 'relative'
    },

    midiaIcon: {
        width: 150,
        height: 150
    },

    editIcon: {
        left: 50,
        bottom: 25
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