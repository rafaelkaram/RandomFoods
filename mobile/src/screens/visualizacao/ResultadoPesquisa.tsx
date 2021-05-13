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

import ItalicText from '../../components/ItalicText';

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
                if (response.data) {
                    setMatchesPerfeitos(response.data.matchesPerfeitos)
                    setMatchesParciais(response.data.matchesParciais)
                } else {
                    api.get('busca/receita').then(response => {
                        setReceitas(response.data)
                        setLoad(true)
                    })
                }

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
                <ScrollView style={styles.body}>
                    {receitas.length === 0 ? (
                        <View>
                            {matchesPerfeitos.length > 0 ? (
                                <RecipeList titulo='Receitas Perfeitas para suas escolhas' receitas={matchesPerfeitos} navegar={(id: number) => handleNavigateToRecipe(id)} />
                            ) : <></>}
                            {matchesParciais.length > 0 ? (
                                <RecipeList titulo='Outras Receitas com suas escolhas' receitas={matchesParciais} navegar={(id: number) => handleNavigateToRecipe(id)} />
                            ) : <></>}
                            {matchesParciais.length === 0 && matchesPerfeitos.length === 0 ? (
                                <ItalicText style={styles.subTitle}>Não encontramos receitas com os ingredientes selecionados</ItalicText>
                            ): <></>}
                        </View>
                    ) : <RecipeList titulo='Receitas' receitas={receitas} navegar={(id: number) => handleNavigateToRecipe(id)} />
                    }
                </ScrollView>
            </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: colors.background,
    },
    subTitle: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 20,
        margin: 3,
    },
})

export default Recipe;