import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Alert, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';
import api from '../../services/api';

import { ISeguidor, IReceitaSimples, IUsuarioSimples } from '../../constants/interfaces';
import screens from '../../constants/screens';
import colors from '../../constants/colors';

import Loading from '../../components/Loading';
import RecipeList from '../../components/RecipeList';
import UserHeader from '../../components/UserHeader';
import UserHeaderFollow from '../../components/UserHeaderFollow';

const Perfil = ({ route }: { route: any }) => {
    const navigation = useNavigation();
    const [recipesUser, setRecipesUser] = useState<IReceitaSimples[]>([]);
    const [usuario, setUsuario] = useState<IUsuarioSimples>();
    const [title, setTitle] = useState('');
    const [load, setLoad] = useState<boolean>(false);
    const [seguidor, setSeguidor] = useState<boolean>(false);
    const [seguidores, setSeguidores] = useState<ISeguidor[]>([]);
    const [seguindo, setSeguindo] = useState<ISeguidor[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const idUser = route.params.id;

    const { user } = useContext(AuthContext);


    const handleNavigateToRecipe = (id: number) => {
        navigation.navigate(screens.receita, { id: id });
    }

    useEffect(() => {

        api.get(`/busca/usuario/${idUser}`)
            .then(response => { setUsuario(response.data) });
        api.get(`/busca/seguidores/${idUser}`)
            .then(response => { setSeguidores(response.data) });
        api.get(`/busca/seguidos/${idUser}`)
            .then(response => { setSeguindo(response.data) });

    }, [refreshing, seguidor]);

    useEffect(() => {
        api.get(`/busca/receita-usuario/${idUser}`)
            .then(response => { setRecipesUser(response.data.receitas) });

        setTitle(`Receitas de ${usuario?.nome}`);
        setLoad(true);
    }, [usuario]);

    useEffect(() => {
        const seguidor: ISeguidor[] = seguidores.filter(seguidor2 => (seguidor2.usuario.id === user?.id));
        if (seguidor && seguidor.length > 0)
            setSeguidor(true);
    }, [seguidores]);

    const seguirUsuario = () => {
        if (!seguidor) {
            api.post('cadastro/seguidor', { idSeguidor: user?.id, idUsuario: usuario?.id })
                .then(response => {
                    setSeguidor(true);
                }).catch(error => {
                    Alert.alert(
                        'Falha no resgistro de seguidor',
                        '\nFalha no resgistro de seguidor',
                        [
                            { text: 'OK' }
                        ]
                    );
                    setSeguidor(false);
                }
                );
        } else {
            const seguidor: ISeguidor[] = seguidores.filter(seguidor2 => (seguidor2.usuario.id === user?.id));
            api.post(`remove/seguidor/${seguidor[0].id}`)
                .then(response => {
                    setSeguidor(false);
                }).catch(error => {
                    Alert.alert(
                        'Falha na remoção de seguidor',
                        '\nFalha na remoção de seguidor',
                        [
                            { text: 'OK' }
                        ]
                    );
                    setSeguidor(true);
                }
                );
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
                    />}
            >
                {usuario?.id != user?.id ?
                    <UserHeaderFollow
                        usuario={usuario}
                        totalReceitas={recipesUser.length}
                        isPainel={false}
                        seguidores={seguidores.length}
                        seguidos={seguindo.length}
                        seguidor={seguidor}
                        seguirUsuario={seguirUsuario}
                    />
                    :
                    <UserHeader
                        usuario={usuario}
                        seguidores={seguidores.length}
                        seguidos={seguidores.length}
                        totalReceitas={recipesUser.length}
                        isPainel={false}
                    />
                }
                <ScrollView style={{ backgroundColor: colors.background, marginTop: 10 }}>
                    {recipesUser.length > 0 &&
                        <RecipeList titulo={title} receitas={recipesUser} navegar={(id: number) => handleNavigateToRecipe(id)} />
                    }
                </ScrollView>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Perfil;