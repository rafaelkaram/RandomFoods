import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView } from 'react-native'
import api from '../../services/api'
import { SafeAreaView } from 'react-native-safe-area-context';

interface Ingredient {
    id: number,
    nome: string,
    id_tipo_unidade: number,
    id_tipo_ingrediente: number,
    sem_medida: boolean,
    derivado_leite: boolean,
    glutem: boolean
}


const Home = () => {

    const [ingredients, setIngredients] = useState<Ingredient[]>([])

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