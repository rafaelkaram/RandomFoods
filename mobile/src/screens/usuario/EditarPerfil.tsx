import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Alert, ScrollView, RefreshControl, View, Image, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';
import api from '../../services/api';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign, Feather } from '@expo/vector-icons';


import { IMidiaPicker, IUsuario } from '../../constants/interfaces';
import colors from '../../constants/colors';
import styles from '../../styles/screens/Usuario';
import globalStyles from '../../styles/Global';
import InputEdit from '../../components/InputEdit';
import SmallButton from '../../components/SmallButton';

import Loading from '../../components/Loading';
import { WIDTH } from '../../constants/dimensions';


const EditarPerfil = ({ route }: { route: any }) => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [load, setLoad] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState(false);
    const [midia, setMidia] = useState<IMidiaPicker>();
    const [midiaCarregada, setMidiaCarregada] = useState<string>();

    const { user, headers } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            setName(user.nome);
            setEmail(user.email)
            setUsername(user.login)
            setMidiaCarregada(user.path)
        }
        setLoad(true);
    }, [refreshing, user]);

    const handleSubmit = async () => {

        const usuario = {
            nome: name,
            login: username,
            email,
        }

        if (usuario.nome == '' || usuario.login == '' || usuario.email == '' ) {
            Alert.alert(
                'Campos incorretos',
                'Todos os campos devem ser preenchidos corretamente',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
            );
        } else {
            const data = new FormData();

            data.append('nome', name);
            data.append('login', username.toLowerCase());
            data.append('email', email.toLowerCase());
            data.append('nomeUsuario', username.toLowerCase());

            if (midia) data.append('image', {
                name: 'image.png',
                type: 'image/png',
                uri: midia.uri
            } as any);

            await api.post('edicao/usuario', data, { headers })
                .then(response => {
                // Colocar navigate aqui
            }).catch((error) => {
                Alert.alert(
                    'Erro na atualização dos dados.',
                    `${ error.error }`,
                    [ { text: 'OK' } ]
                );
            });
        }
    }


    const loadMidia = async (path: string) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            uri: path
        });

        if (!result.cancelled) {
            const midia: IMidiaPicker = result as IMidiaPicker;
            setMidia(midia);
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
        setMidiaCarregada('');
    }

    const toggleDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setLoad(false);
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    if (!load || !user) {
        return <Loading />
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}
            >
                <View style={styles.headerContainer}>
                    <Image
                        source={require('./../../assets/editar-perfil.png')}
                        style={{ width: 348, height: 90 }}
                    />
                    <TouchableOpacity style={{ position: 'absolute', left: WIDTH - 40, top: 20 }} onPress={() => toggleDrawer()}>
                        <Feather name="menu" size={30} color="black" />
                    </TouchableOpacity>
                </View>

                <View style={styles.container}>
                    <View style={styles.midiaContainer}>
                        {midiaCarregada ?
                            <View style={styles.midiaView}>
                                <Image
                                    source={{ uri: midiaCarregada }}
                                    style={styles.midia}
                                />
                                <TouchableOpacity style={styles.midiaRemove} onPress={() => handleRemoveMidia()} >
                                    <Text style={{ ...globalStyles.regularText, color: colors.primary }}>X</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            midia?.uri ?
                                <View style={styles.midiaView}>
                                    <Image
                                        source={{ uri: midia?.uri }}
                                        style={styles.midia}
                                    />
                                    <TouchableOpacity style={styles.midiaRemove} onPress={() => handleRemoveMidia()} >
                                        <Text style={{ ...globalStyles.regularText, color: colors.primary }}>X</Text>
                                    </TouchableOpacity>

                                </View>
                                :
                                <TouchableOpacity style={styles.midiaInput} onPress={handleAddMidia} >
                                    <Image source={require('./../../assets/user-foto.png')} style={styles.midiaIcon} />
                                    <AntDesign style={styles.editIcon} name='edit' size={30} color='black' />
                                    <Text style={{ ...globalStyles.regularText, bottom: 20 }}>Escolha sua foto</Text>
                                </TouchableOpacity>


                        }

                        <InputEdit tipo='username' placeholder='username' icon='person-outline' security={false} setState={setUsername} value={username}></InputEdit>
                        <InputEdit tipo='email' placeholder='Email' icon='mail-outline' security={false} setState={setEmail} value={email} ></InputEdit>
                        <InputEdit tipo='name' placeholder='Nome' icon='person-outline' security={false} setState={setName} value={name}></InputEdit>

                        <View style={styles.buttons}>
                            <View style={styles.singleButt}>
                                <SmallButton onPress={() => { navigation.goBack() }}>Voltar</SmallButton>
                            </View>
                            <View style={styles.singleButt}>
                                <SmallButton onPress={() => { handleSubmit() }}>Confirmar</SmallButton>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default EditarPerfil;