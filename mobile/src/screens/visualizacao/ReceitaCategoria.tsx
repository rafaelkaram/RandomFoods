import React, { useEffect, useState, useContext, useCallback } from 'react';
import { ScrollView, Image, TouchableOpacity, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Loading from '../../components/Loading';
import api from '../../services/api';
import screens from '../../constants/screens';
import { IReceitaSimples } from '../../constants/interfaces';
import RecipeList from '../../components/RecipeList';

const ReceitaCategoria = ({ route }: { route: any }) => {
    const navigation = useNavigation();
    const [receitas, setReceitas] = useState<IReceitaSimples[]>([])
    const [load, setLoad] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        const params = {
            id: route.params.id,
            categoria: route.params.categoria
        }
        api.get('/busca/receita-categoria', { params })
            .then(response => {
                setReceitas(response.data)
                console.log(receitas);
                setLoad(true)
            })
    }, [refreshing])

    const handleNavigateToRecipe = (id: number) => {
        navigation.navigate(screens.receita, { id: id });
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setLoad(false);
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    if (!load) {
        return <Loading />
    }
    return (
        <SafeAreaView>
            <Image source={require('./../../assets/resultados.png')} style={{ width: 375, height: 102, alignSelf: 'center' }} />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}>
                <RecipeList titulo='' receitas={receitas} navegar={(id: number) => handleNavigateToRecipe(id)} />
            </ScrollView>
        </SafeAreaView>
    )
}

export default ReceitaCategoria