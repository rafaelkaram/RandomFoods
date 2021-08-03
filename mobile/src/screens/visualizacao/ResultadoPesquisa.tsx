import React, { useEffect, useState, useCallback } from 'react';
import { ScrollView, Text, View, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context'
import { Picker } from '@react-native-picker/picker';

import { IReceitaSimples } from '../../constants/interfaces';

import api from '../../services/api';

import screens from '../../constants/screens';
import styles from '../../styles/screens/ResultadoPesquisa';
import globalStyles from '../../styles/Global';

import Loading from '../../components/Loading';
import RecipeList from '../../components/RecipeList';

const Recipe = ({ route }: { route: any }) => {

    const navigation = useNavigation();
    const [matchesPerfeitos, setMatchesPerfeitos] = useState<IReceitaSimples[]>([])
    const [matchesParciais, setMatchesParciais] = useState<IReceitaSimples[]>([])
    const [receitas, setReceitas] = useState<IReceitaSimples[]>([])
    const [orderBy, setOrderBy] = useState<number>(0)
    const [load, setLoad] = useState(false)
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (route.params) {
            const { ingredientes } = route.params
            const { derivadoLeite } = route.params
            const { gluten } = route.params
            const { categorias } = route.params
            const { tipos } = route.params
            const { tempoDePreparo } = route.params

            const params = {
                ids: ingredientes,
                derivadoLeite: derivadoLeite,
                gluten: gluten,
                categorias: categorias,
                tipos: tipos,
                tempoPreparo: tempoDePreparo[0],
            }

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

    }, [refreshing])

    useEffect(() => {
    }, [orderBy])

    const handleNavigateToRecipe = (id: number) => {
        navigation.navigate(screens.receita, { id: id });
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    if (!load) {
        return <Loading />
    }

    function orderArray(value: any) {
        const newArrayParciais = matchesParciais
        const newArrayPerfeitas = matchesPerfeitos
        switch (value) {
            case 1: {
                newArrayParciais.sort((a, b) => b.tempoPreparo - a.tempoPreparo)
                newArrayPerfeitas.sort((a, b) => b.tempoPreparo - a.tempoPreparo)
                break
            }
            case 2: {
                newArrayParciais.sort((a, b) => a.tempoPreparo - b.tempoPreparo)
                newArrayPerfeitas.sort((a, b) => a.tempoPreparo - b.tempoPreparo)
                break
            }
            default: {
                newArrayParciais.sort((a, b) => a.id - b.id)
                newArrayPerfeitas.sort((a, b) => a.id - b.id)
            }
        }
        setMatchesParciais(newArrayParciais)
        setMatchesPerfeitos(newArrayPerfeitas)
    }

    return (
        <SafeAreaView>
            <ScrollView
                style={globalStyles.background}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}
            >
                {(matchesParciais.length > 0 || matchesPerfeitos.length > 0) && (
                    <Picker
                        selectedValue={orderBy}
                        mode='dropdown'
                        style={styles.comboBox}
                        onValueChange={(itemPosition) => {
                            orderArray(itemPosition)
                            setOrderBy(itemPosition)
                        }}
                    >
                        <Picker.Item label={'Ordenar Por'} value={0} />
                        <Picker.Item key={1} label={'Maior Tempo'} value={1} />
                        <Picker.Item key={2} label={'Menor Tempo'} value={2} />
                    </Picker>
                )}
                {receitas.length === 0 ? (
                    <View>
                        {matchesPerfeitos.length > 0 &&
                            <RecipeList titulo='Receitas Perfeitas para suas escolhas' receitas={matchesPerfeitos} navegar={(id: number) => handleNavigateToRecipe(id)} />
                        }
                        {matchesParciais.length > 0 && matchesPerfeitos.length > 0 &&
                            <RecipeList titulo='Outras Receitas com suas escolhas' receitas={matchesParciais} navegar={(id: number) => handleNavigateToRecipe(id)} />
                        }
                        {matchesParciais.length > 0 && matchesPerfeitos.length === 0 &&
                            <RecipeList titulo='Não encontramos receitas perfeitas para suas escolhas, mas sugerimos essas' receitas={matchesParciais} navegar={(id: number) => handleNavigateToRecipe(id)} />
                        }
                        {matchesParciais.length === 0 && matchesPerfeitos.length === 0 &&
                            <Text style={[globalStyles.subTitleText, globalStyles.recipeListSubTitle]}>Não encontramos receitas com os ingredientes selecionados</Text>
                        }
                    </View>
                ) : <RecipeList titulo='Receitas' receitas={receitas} navegar={(id: number) => handleNavigateToRecipe(id)} />
                }
            </ScrollView>
        </SafeAreaView>
    )
}

export default Recipe;