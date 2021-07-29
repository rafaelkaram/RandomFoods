import React, { useEffect, useState, useContext, useCallback } from 'react';
import { ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AuthContext from '../../contexts/auth';
import api from '../../services/api';

import { IPainelTipoReceita, IReceitaSimples, IUsuarioSimples } from '../../constants/interfaces';
import screens from '../../constants/screens';
import colors from '../../constants/colors';

import Loading from '../../components/Loading';
import RecipeList from '../../components/RecipeList';
import UserHeader from '../../components/UserHeader';
import UserHeaderFollow from '../../components/UserHeaderFollow';

const Perfil = ({ route }: { route: any }) => {
    const navigation = useNavigation();
    const [recipeType, setRecipeType] = useState<IPainelTipoReceita[]>([]);
    const [recipesUser, setRecipesUser] = useState<IReceitaSimples[]>([]);
    const [usuario, setUsuario] = useState<IUsuarioSimples>();
    const [title, setTitle] = useState('');
    const [load, setLoad] = useState<boolean>(false);
    const [seguindo, setSeguindo] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState(false);

    const idUser = route.params.id;

    const { user } = useContext(AuthContext);

    const handleNavigateToRecipe = (id: number) => {
        navigation.navigate(screens.receita2, { id: id });
    }

    useEffect(() => {
        api.get(`/busca/usuario/${idUser}`)
            .then(response => {
                console.log(response.data)
                setUsuario(response.data)
            });
    }, [refreshing]);

    useEffect(() => {
        if (user) {
            api.get(`/busca/receita-usuario/${usuario?.id}`)
                .then(response => { setRecipesUser(response.data.receitas) });

            api.get(`/dashboard/tipos-receita/${usuario?.id}`)
                .then(response => { setRecipeType(response.data) });

            setTitle(`Receitas de ${usuario?.nome}`);
        }
        setLoad(true);
    }, [usuario]);

    const pieTypeData = recipeType.map((item) => {
        return { x: item.tipo, y: Number(item.count) }
    });

    const totalRecipes: number = pieTypeData.reduce(function (a, b) { return a + b.y }, 0)

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
                        totalReceitas={totalRecipes}
                        isPainel={false}
                        seguidor={seguindo}
                        setSeguindo={setSeguindo}
                    />
                    :
                    <UserHeader
                        usuario={usuario}
                        totalReceitas={totalRecipes}
                        isPainel={false}
                    />
                }
                <ScrollView style={{ backgroundColor: colors.background, marginTop: 10 }}>
                    {recipesUser.length > 0 &&
                        <RecipeList titulo={title} receitas={recipesUser} navegar={(id: number) => handleNavigateToRecipe(id)} />
                    }
                </ScrollView>
                {/* <Button title="Sign Out" onPress={() => handleSignOut()} /> */}
            </ScrollView>
        </SafeAreaView>
    )
}

export default Perfil;