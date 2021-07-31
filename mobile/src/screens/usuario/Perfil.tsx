import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Alert, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';
import api from '../../services/api';

import { ISeguidoresSimples, IReceitaSimples, IUsuarioSimples } from '../../constants/interfaces';
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
    const [seguindo, setSeguindo] = useState<boolean>(false);
    const [seguidores, setSeguidores] = useState<ISeguidoresSimples[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const idUser = route.params.id;

    const { user } = useContext(AuthContext);

    const handleNavigateToRecipe = (id: number) => {
        navigation.navigate(screens.receita2, { id: id });
    }

    useEffect(() => {
        api.get(`/busca/usuario/${idUser}`)
            .then(response => {
                // console.log(response.data)
                setUsuario(response.data)
            });

        api.get(`/busca/seguidores/${idUser}`)
            .then(response => {
                // console.log(response.data)
                setSeguidores(response.data)
            });

    }, [refreshing, seguindo]);

    useEffect(() => {
        if (user) {
            api.get(`/busca/receita-usuario/${usuario?.id}`)
                .then(response => { setRecipesUser(response.data.receitas) });

            setTitle(`Receitas de ${usuario?.nome}`);
        }
        setLoad(true);
    }, [usuario]);

    useEffect(() => {
        const seguidor: ISeguidoresSimples[] = seguidores.filter(seguidor2 => (seguidor2.seguidor.id === user?.id));
        if (seguidor && seguidor.length > 0)
            setSeguindo(true);
    }, [seguidores]);

    const seguirUsuario = () => {
        if (!seguindo) {
            api.post('cadastro/seguidor', { idSeguidor: user?.id, idUsuario: usuario?.id })
                .then(response => {
                    setSeguindo(true);
                }).catch(error => {
                    Alert.alert(
                        'Falha no resgistro de seguidor',
                        '\nFalha no resgistro de seguidor',
                        [
                            { text: 'OK' }
                        ]
                    );
                    setSeguindo(false);
                }
                );
        } else {
            const seguidor: ISeguidoresSimples[] = seguidores.filter(seguidor2 => (seguidor2.seguidor.id === user?.id));
            api.post(`remove/seguidor/${seguidor[0].id}`)
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
                        seguidor={seguindo}
                        seguirUsuario={seguirUsuario}
                    />
                    :
                    <UserHeader
                        usuario={usuario}
                        seguidores={seguidores.length}
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