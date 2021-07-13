import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
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
    const [orderBy, setOrderBy] = useState<number>()
    const [load, setLoad] = useState(false)

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
                tempoDePreparo: tempoDePreparo,
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

    }, [])

    useEffect(() => {
    }, [orderBy])

    const handleNavigateToRecipe = (id: number) => {
        navigation.navigate(screens.receita, { id: id });
    }

    if (!load) {
        return <Loading />
    }

    function orderArray(value: any){
        if (value === 1) {
            const newArrayParciais = matchesParciais;
            const newArrayPerfeitas = matchesPerfeitos;
            newArrayParciais.sort((a, b) => b.tempoPreparo - a.tempoPreparo);
            newArrayPerfeitas.sort((a, b) => b.tempoPreparo - a.tempoPreparo);
            setMatchesParciais(newArrayParciais);
            setMatchesPerfeitos(newArrayPerfeitas);
        } else if (value === 2) {
            const newArrayParciais = matchesParciais;
            const newArrayPerfeitas = matchesPerfeitos;
            newArrayParciais.sort((a, b) => a.tempoPreparo - b.tempoPreparo);
            newArrayPerfeitas.sort((a, b) => a.tempoPreparo - b.tempoPreparo);
            setMatchesParciais(newArrayParciais);
            setMatchesPerfeitos(newArrayPerfeitas);
        } else {
            const newArrayParciais = matchesParciais;
            const newArrayPerfeitas = matchesPerfeitos;
            newArrayParciais.sort((a, b) => a.id - b.id);
            newArrayPerfeitas.sort((a, b) => a.id - b.id);
            setMatchesParciais(newArrayParciais);
            setMatchesPerfeitos(newArrayPerfeitas);
        }
    }

    return (
        <SafeAreaView>
            <ScrollView style={ globalStyles.background }>
                { matchesParciais.length > 0 || matchesPerfeitos.length > 0 && (
                    <Picker
                        selectedValue={ orderBy }
                        mode='dropdown'
                        style={ styles.comboBox }
                        onValueChange={ (itemPosition) =>{
                            orderArray(itemPosition)
                            setOrderBy(itemPosition)
                        }}
                    >
                        <Picker.Item label={ 'Ordenar Por' } value={0} />
                        <Picker.Item key={1} label={ 'Maior Tempo' } value={1} />
                        <Picker.Item key={2} label={ 'Menor Tempo' } value={2} />
                    </Picker>
                )}
                { receitas.length === 0 ? (
                    <View>
                        { matchesPerfeitos.length > 0 &&
                            <RecipeList titulo='Receitas Perfeitas para suas escolhas' receitas={ matchesPerfeitos } navegar={ (id: number) => handleNavigateToRecipe(id) } />
                        }
                        { matchesParciais.length > 0 &&
                            <RecipeList titulo='Outras Receitas com suas escolhas' receitas={ matchesParciais } navegar={ (id: number) => handleNavigateToRecipe(id) } />
                        }
                        { matchesParciais.length === 0 && matchesPerfeitos.length === 0 &&
                            <Text style={[ globalStyles.subTitleText, globalStyles.subTitle ]}>Não encontramos receitas com os ingredientes selecionados</Text>
                        }
                    </View>
                ) : <RecipeList titulo='Receitas' receitas={ receitas } navegar={ (id: number) => handleNavigateToRecipe(id) } />
                }
            </ScrollView>
        </SafeAreaView>
    )
}

export default Recipe;