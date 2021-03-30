import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView, Button } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { IIngredient } from '../constants/interfaces';
import api from '../services/api'

const Home = () => {

    const navigation = useNavigation();

    const [ingredients, setIngredients] = useState<IIngredient[]>([])

    useEffect(() => {
        api.get('busca/ingredientes').then(response => {
            setIngredients(response.data)
        })
    }, [])


    function handleNavigateToSearchRecipe() {
        navigation.navigate('Pesquisar Receitas');
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <Button
                    title="Pesquisar Receitas"
                    onPress={handleNavigateToSearchRecipe} />

                {ingredients.map((ingredient, index) => (
                    <Text key={index}>{ingredient.nome}</Text>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home