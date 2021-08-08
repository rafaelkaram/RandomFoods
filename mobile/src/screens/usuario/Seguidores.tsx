import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Alert, ScrollView, RefreshControl, Image } from 'react-native';
import { Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';
import api from '../../services/api';

import { ISeguidor, IUsuarioSimples } from '../../constants/interfaces';
import screens from '../../constants/screens';
import colors from '../../constants/colors';

import styles from '../../styles/screens/Seguidores';
import fixString from '../../assets/functions/utils';

import Loading from '../../components/Loading';
import SeguidoresList from '../../components/SeguidoresList';


const Seguidores = ({ route }: { route: any }) => {
    const navigation = useNavigation();
    const [usuario, setUsuario] = useState<IUsuarioSimples>();
    const [nomeSeguidor, setNomeSeguidor] = useState<string>('');
    const [load, setLoad] = useState<boolean>(false);
    const [seguindo, setSeguindo] = useState<boolean>(false);
    const [seguidores, setSeguidores] = useState<ISeguidor[]>([]);
    const [seguidos, setSeguidos] = useState<ISeguidor[]>([]);
    const [seguidoresFilter, setSeguidoresFilter] = useState<ISeguidor[]>([]);
    const [seguidosFilter, setSeguidosFilter] = useState<ISeguidor[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const idUser = route.params.id;
    const seguidor = route.params.seguidor;

    const { user } = useContext(AuthContext);


    const handleNavigateToPerfil = (id: number) => {
        navigation.navigate(screens.perfil, { id: id });
    }


    useEffect(() => {
        api.get(`busca/usuario/${idUser}`)
            .then(response => { setUsuario(response.data); });
        api.get(`busca/seguidores/${idUser}`)
            .then(response => {
                setSeguidores(response.data)
                setSeguidoresFilter(response.data)
            });
        api.get(`busca/seguidos/${idUser}`)
            .then(response => {
                setSeguidos(response.data)
                setSeguidosFilter(response.data)
            });
        setLoad(true);
    }, [refreshing, seguindo, idUser]);

    useEffect(() => {
        filterSeguidores()
    }, [nomeSeguidor]);

    const deixarSeguir = (id: number, name: string) => {
        Alert.alert(
            'Deixar de seguir',
            '\nDeseja deixar de seguir ' + name + ' ?',
            [
                { text: 'CANCELAR' },
                {
                    text: 'OK',
                    onPress: () => {
                        api.delete(`remove/seguidor/${id}`)
                            .then(response => {
                                setSeguindo(false);
                            }).catch(error => {
                                Alert.alert(
                                    'Falha na remoção de seguidor',
                                    '\nFalha na remoção de seguidor',
                                    [
                                        { text: 'OK' }
                                    ]
                                );
                                setSeguindo(true);
                            });
                    }
                }]);
    }

    const filterSeguidores = () => {
        let list: ISeguidor[] = [];
        if (nomeSeguidor !== '') {
            if (seguidor) {
                list = seguidores.filter(user => fixString(user.usuario.login.toLowerCase()).match(nomeSeguidor.toLowerCase()));
                setSeguidoresFilter(list)
            } else {
                list = seguidos.filter(user => fixString(user.usuario.login.toLowerCase()).match(nomeSeguidor.toLowerCase()));
                setSeguidosFilter(list)
            }
        } else {
            if (seguidor) {
                setSeguidoresFilter(seguidores)
            } else {
                setSeguidosFilter(seguidos)
            }
        }
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
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
                    />
                }
            >
                <Image
                    source={!seguidor ? require('./../../assets/seguindo.png') : require('./../../assets/seguidores.png')}
                    style={!seguidor ? styles.imageSeguindo : styles.imageSeguidores}
                />

                <Input
                    placeholder='Pesquisar'
                    onChangeText={(value) => setNomeSeguidor(value)}
                    value={nomeSeguidor}
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    style={styles.inputPesquisa}
                />

                <ScrollView style={{ backgroundColor: colors.background, marginTop: 10 }}>
                    {seguidor ?
                        <SeguidoresList seguidores={seguidoresFilter} seguidor={seguidor} deixarSeguir={(id: number, name: string) => deixarSeguir(id, name)} contextUser={user} user={usuario} />
                        :
                        <SeguidoresList seguidores={seguidosFilter} seguidor={seguidor} deixarSeguir={(id: number, name: string) => deixarSeguir(id, name)} contextUser={user} user={usuario} />
                    }
                    {/* {seguidores.length > 0 &&
                    <SeguidoresList seguidores={seguidores} seguidor ={seguidor} />
                } */}
                </ScrollView>

            </ScrollView>
        </SafeAreaView>
    )
}

export default Seguidores;