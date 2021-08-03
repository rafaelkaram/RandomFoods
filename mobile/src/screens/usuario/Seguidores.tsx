import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Alert, ScrollView, RefreshControl, TouchableOpacity, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';
import api from '../../services/api';

import { ISeguidor, IReceitaSimples, IUsuarioSimples } from '../../constants/interfaces';
import screens from '../../constants/screens';
import colors from '../../constants/colors';

import styles from '../../styles/screens/Receita';
import Loading from '../../components/Loading';
import RecipeList from '../../components/RecipeList';
import UserHeader from '../../components/UserHeader';
import UserHeaderFollow from '../../components/UserHeaderFollow';
import SeguidoresList from '../../components/SeguidoresList';

const Seguidores = ({ route }: { route: any }) => {
    const navigation = useNavigation();
    const [recipesUser, setRecipesUser] = useState<IReceitaSimples[]>([]);
    const [usuario, setUsuario] = useState<IUsuarioSimples>();
    const [title, setTitle] = useState('');
    const [load, setLoad] = useState<boolean>(false);
    const [seguindo, setSeguindo] = useState<boolean>(false);
    const [seguidores, setSeguidores] = useState<ISeguidor[]>([]);
    const [seguidos, setSeguidos] = useState<ISeguidor[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const idUser = route.params.id;
    const seguidor = route.params.seguidor;

    const { user } = useContext(AuthContext);


    const handleNavigateToPerfil = (id: number) => {
        navigation.navigate(screens.perfil, { id: id });
    }


    useEffect(() => {
        api.get(`/busca/usuario/${idUser}`)
            .then(response => {
                // console.log(response.data)
                setUsuario(response.data)
            });

        api.get(`/busca/seguidores/${idUser}`)
            .then(response => {
                //console.log(response.data)
                setSeguidores(response.data)
            });
        api.get(`/busca/seguidos/${idUser}`)
            .then(response => {
                console.log(response.data)
                setSeguidos(response.data)
            });
        setLoad(true);
    }, [refreshing, seguindo]);


    const deixarSeguir = (id:number) => {
       
            Alert.alert(
                'Deixar de seguir',
                '\nDeseja deixar de seguir?',
                [
                    { text: 'CANCELAR' },
                    {
                        text: 'OK',
                        onPress: () => {
                            api.post(`remove/seguidor/${id}`)
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
                            }
                            );
                        }

                     } ]);
                
           
                
        
    }

// useEffect(() => {
//     const seguidor: ISeguidor[] = seguidores.filter(seguidor2 => (seguidor2.id === user?.id));
//     if (seguidor && seguidor.length > 0)
//         setSeguindo(true);
// }, [seguidores]);



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
                />}
        >
            <ScrollView style={{ backgroundColor: colors.background, marginTop: 10 }}>
                {seguidor?
                    <SeguidoresList seguidores={seguidores} seguidor ={seguidor}  deixarSeguir={(id:number)=>deixarSeguir(id)} />
                    :
                    <SeguidoresList seguidores={seguidos} seguidor ={seguidor} deixarSeguir={(id:number)=>deixarSeguir(id)} />
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