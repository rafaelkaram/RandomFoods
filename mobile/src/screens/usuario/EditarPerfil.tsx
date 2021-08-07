import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Alert, ScrollView, RefreshControl, View, Image, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';
import api from '../../services/api';
import * as ImagePicker from 'expo-image-picker';
import { AntDesign } from '@expo/vector-icons';


import {  IMidiaPicker, IUsuarioSimples , IUsuario} from '../../constants/interfaces';
import screens from '../../constants/screens';
import colors from '../../constants/colors';
import styles from '../../styles/screens/Usuario';
import globalStyles from '../../styles/Global';
import InputEdit from '../../components/InputEdit';
import SmallButton from '../../components/SmallButton';

import Loading from '../../components/Loading';


const EditarPerfil = ({ route }: { route: any }) => {
    const navigation = useNavigation();

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState<string>('');
    const [usuario, setUsuario] = useState<IUsuarioSimples>();
    const [userSub, setUserSub] = useState<IUsuario>()
    const [load, setLoad] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState(false);
    const [midia, setMidia] = useState<IMidiaPicker>();

    //const idUser = route.params.id;

    const { user } = useContext(AuthContext);
    // if (user){
    //     setName(user?.nome);
    //     setEmail(user.email)
    //     setUsername(user.login)
    // }
    


    // const handleNavigateToRecipe = (id: number) => {
    //     navigation.navigate(screens.receita, { id: id });
    // }

    useEffect(() => {

        api.get(`/busca/usuario/${user?.id}`)
            .then(response => { setUsuario(response.data) });
            setLoad(true);

            console.log(usuario)
            if (usuario){
                setName(usuario.nome);
               // setEmail(usuario.email)
                setUsername(usuario.login)
            }
            console.log(name)

    }, [refreshing]);

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
                [ { text: 'OK', onPress: () => console.log('OK Pressed') } ]
            );
        } else {

            setLoad(false);
            
            const data = new FormData();

            data.append('nome', usuario.nome);
            //data.append('login', usuario.login.toLowerCase());
            data.append('email', usuario.email.toLowerCase());
            

            if (midia) data.append('image', {
                name: 'image.png',
                type: 'image/png',
                uri: midia.uri
            } as any);

            // await api.post('cadastro/usuario', data).then(response => {
            //     console.log({ msg: 'Recebemos resposta!', response: response.data });
            //     setUserSub(response.data);
            // });
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
   

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setLoad(false);
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    if (!load || !usuario) {
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
                        <InputEdit tipo='username' placeholder='username' icon='person-outline' security={ false } setState={ setUsername } value={username}></InputEdit>
                        <InputEdit tipo='email' placeholder='Email' icon='mail-outline' security={ false } setState={ setEmail } value={email} ></InputEdit>
                        <InputEdit tipo='name' placeholder='Nome' icon='person-outline' security={ false } setState={ setName } value={name}></InputEdit>

                        <View style={ styles.buttons }>
                        <View style={ styles.singleButt }>
                            <SmallButton onPress={() => { navigation.goBack() }}>Voltar</SmallButton>
                        </View>
                        <View style={ styles.singleButt }>
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