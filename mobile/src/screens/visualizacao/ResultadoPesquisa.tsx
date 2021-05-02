import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IReceitaSimples } from '../../constants/interfaces';

import api from '../../services/api';

import colors from '../../constants/colors';
import screens from '../../constants/screens';

import Loading from '../../components/Loading';
import RecipeList from '../../components/RecipeList';

const Recipe = ({ route }: { route: any }) => {

    const navigation = useNavigation();
    const [matchesPerfeitos, setMatchesPerfeitos] = useState<IReceitaSimples[]>([])
    const [matchesParciais, setMatchesParciais] = useState<IReceitaSimples[]>([])
    const [receitas, setReceitas] = useState<IReceitaSimples[]>([])
    const [load, setLoad] = useState(false)

    useEffect(() => {
        if (route.params) {
            const { ingredientes } = route.params
            const { derivadoLeite } = route.params
            const { gluten } = route.params

            const params = { ids: ingredientes, derivadoLeite: derivadoLeite, gluten: gluten }

            api.get('/busca/combinacoes', { params }
            ).then(response => {
                setMatchesPerfeitos(response.data.matchesPerfeitos)
                setMatchesParciais(response.data.matchesParciais)

                setLoad(true)
            })
        } else {
            api.get('busca/receita').then(response => {
                setReceitas(response.data)
                setLoad(true)
            })
        }

    }, [])

    const handleNavigateToRecipe = (id: number) => {
        navigation.navigate(screens.receita, { id: id });
    }

    if (!load) {
        return <Loading />
    }

    return (
        <SafeAreaView>
            <ScrollView style={ styles.body }>
                { receitas ? (
                        <View>
                            <RecipeList titulo='Receitas Perfeitas para suas escolhas' receitas={ matchesPerfeitos } navegar={(id: number) => handleNavigateToRecipe(id)} />
                            <RecipeList titulo='Outras Receitas que podem te interessar' receitas={ matchesParciais } navegar={(id: number) => handleNavigateToRecipe(id)} />
                        </View>
                    ) : <RecipeList titulo='Receitas' receitas={ receitas } navegar={(id: number) => handleNavigateToRecipe(id)} />
                }
            </ScrollView>
        </SafeAreaView>
        )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: colors.background,
    },
})

export default Recipe;