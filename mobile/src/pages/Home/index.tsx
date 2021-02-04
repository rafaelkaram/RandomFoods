import React, {useEffect,useState} from 'react'
import {Text,View, ScrollView} from 'react-native'
import api from '../../services/api'

interface Ingredient  {
    id: number,
    nome: string,
    id_tipo_unidade: number,
    id_tipo_ingrediente: number,
    sem_medida: boolean,
    derivado_leite : boolean,
    glutem: boolean
}


const Home = () =>{

    const [ingredients, setIngredients] = useState<Ingredient[]>([])

    useEffect(() =>{
        api.get('ingrediente').then(response =>{
            setIngredients(response.data)
            console.log(response.data);
            
        })
    },[])

    return(
        <>
             <ScrollView>
                {ingredients.map((ingredient,index) =>(
                    <Text key={index}>{ingredient.nome}</Text>
                ))}
            </ScrollView>
        </>
    )
}

export default Home