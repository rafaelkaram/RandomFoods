import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';

import { IIngredient } from '../constants/interfaces';
import api from '../services/api'

const Home = () => {

    const [ingredients, setIngredients] = useState<IIngredient[]>([])

    useEffect(() => {
        api.get('ingrediente').then(response => {
            setIngredients(response.data)
        })
    }, [])

    return (
        <SafeAreaView>
            <ScrollView>
                {ingredients.map((ingredient, index) => (
                    <Text key={index}>{ingredient.nome}</Text>
                ))}
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home