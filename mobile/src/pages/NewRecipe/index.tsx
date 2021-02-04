import React, { useEffect, useState } from 'react';
import {View, Text, TouchableOpacity, ScrollView} from 'react-native'
// import { FiArrowLeft, FiTrash2 } from 'react-icons/fi';
// import fixString from '../../assets/functions/utils'

// import logoImg from '../../assets/random_foods.png';

import api from '../../services/api';


interface IngredientType  {
    tipo: string,
    image_url: string,
    ingredientes:[{
        id: number,
        nome: string,
        id_tipo_unidade: number,
        id_tipo_ingrediente: number,
        sem_medida: boolean,
        derivado_leite : boolean,
        glutem: boolean
    }]
}

interface IngredientsCart {
    ingredient:{
        id: number,
        name: string
    }
}


export default function NewRecipe() {
    const [ ingredientsCart, setIngredientsCart ] = useState<IngredientsCart[]>([]);
    const [ ingredientTypes, setIngredientTypes] = useState<IngredientType[]>([]);
    const [ selectedItems, setSelectedItems ] = useState<number[]>([]);
    



    useEffect(() => {
        // api.get('ingrediente')
        //     .then(response => {
        //         setIngredient(response.data);
        //     });
        api.get('ingredientetype')
            .then(response => {
                setIngredientTypes(response.data);
            })
    }, []);

    function handleSelectItem(id:number, name:string){
        const alredySelected = selectedItems.findIndex(item => item === id);

        if(alredySelected >= 0){
            const filteredItems = selectedItems.filter(item => item !== id);
            const filteredNames = ingredientsCart.filter(item => item.ingredient.id !== id);

            setSelectedItems(filteredItems);
            setIngredientsCart(filteredNames);
        }else{
            setSelectedItems([...selectedItems, id]);

            const ingredient = {ingredient:{id:id,name:name}}

            setIngredientsCart([...ingredientsCart, ingredient]);
        }
    }

    return (
        <View>
            <View>
                <View>
                        <Text>Ingredientes</Text>
                    {ingredientsCart.map(ingrediente =>{
                        return(
                            <View key={ingrediente.ingredient.id}>
                                     <Text>{ingrediente.ingredient.name}</Text>
                                <TouchableOpacity onPress={() => handleSelectItem( ingrediente.ingredient.id, ingrediente.ingredient.name )}>
                                    <Text>Lixo</Text>
                                </TouchableOpacity>
                            </View> 
                        )})}       
                </View>
                {/* <section>
                    <img src={logoImg} alt="Random Foods" className="random-foods" />

                    <h1>Cadastrar nova receita</h1>
                    <p>De um titulo, liste os ingredientes e faça o passo-a-passo para ajudar quem está querendo cozinhar.</p>
                </section> */}
                <ScrollView>
                    <Text>Nome da Receita</Text>
                    {ingredientTypes.map(ingredientTypes =>{
                        return(
                            <View key={ingredientTypes.tipo}>
                                <View>
                                    <Text>{ingredientTypes.tipo}</Text>
                                    {/* <img
                                        src={ingredientTypes.image_url + fixString(ingredientTypes.tipo) + `-colored.svg`}
                                        alt={ingredientTypes.tipo}></img> */}
                                    <View>
                                        {ingredientTypes.ingredientes.map(ingrediente =>{
                                            return(
                                            <TouchableOpacity
                                                onPress={() => handleSelectItem( ingrediente.id, ingrediente.nome )}                                                
                                                key={ingrediente.id}
                                            >
                                                <Text>{ingrediente.nome}</Text>
                                            </TouchableOpacity>  
                                        )})}   
                                </View>     
                                </View>  
                            </View>    
                        )
                    })}                 
                </ScrollView>
                {/* <button className="button" type="submit">Cadastrar</button>  */}
            </View>
        </View>
    );
}