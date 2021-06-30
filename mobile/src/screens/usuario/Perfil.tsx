import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import api from '../../services/api';

import { IPainelTipoReceita, IReceitaSimples, IUsuarioSimples } from '../../constants/interfaces';
import screens from '../../constants/screens';
import colors from '../../constants/colors';

import Loading from '../../components/Loading';
import RecipeList from '../../components/RecipeList';
import UserHeader from '../../components/UserHeader';

const Perfil = ({ route }: { route: any }) => {
    const navigation = useNavigation();
    const [recipeType, setRecipeType] = useState<IPainelTipoReceita[]>([]);
    const [recipesUser, setRecipesUser] = useState<IReceitaSimples[]>([]);
    const [user, setUser] = useState<IUsuarioSimples>();
    const [title, setTitle] = useState('');
    const [load, setLoad] = useState<boolean>(false);

    const idUser = route.params.id;

    const handleNavigateToRecipe = (id: number) => {
        navigation.navigate(screens.receita2, { id: id });
    }

    useEffect(() => {
        api.get(`/busca/usuario/${idUser}`)
           .then(response => {
                console.log(response.data)
                setUser(response.data)
            });
    }, []);

    useEffect(() => {
        if (user) {
            api.get(`/busca/receita-usuario/${user.id}`)
               .then(response => { setRecipesUser(response.data.receitas) });

            api.get(`/dashboard/tipos-receita/${user.id}`)
               .then(response => { setRecipeType(response.data) });

            setTitle(`Receitas de ${ user.nome }`);
        } else {
            navigation.navigate(screens.login);
        }
        setLoad(true);
    }, [ user ]);

    const pieTypeData = recipeType.map((item) => {
        return { x: item.tipo, y: Number(item.count) }
    });

    const totalRecipes: number = pieTypeData.reduce(function (a, b) { return a + b.y }, 0)

    if (!load || !user) {
        return <Loading />
    }

    return (
        <SafeAreaView style={{ flex:1 }}>
            <ScrollView>
                <UserHeader
                    usuario={ user }
                    totalReceitas={ totalRecipes }
                    isPainel={ false }
                />
                <ScrollView style={{ backgroundColor: colors.background, marginTop:10 }}>
                    { recipesUser.length > 0 &&
                     <RecipeList titulo={ title } receitas={ recipesUser } navegar={ (id: number) => handleNavigateToRecipe(id) } />
                    }
                </ScrollView>
                {/* <Button title="Sign Out" onPress={() => handleSignOut()} /> */}
            </ScrollView>
        </SafeAreaView>
    )
}

export default Perfil;