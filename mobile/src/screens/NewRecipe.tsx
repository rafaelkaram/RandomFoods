import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Button, Image, StyleSheet, Dimensions } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BoldText from '../components/BoldText'
import RegularText from '../components/RegularText'
import fixString from '../assets/functions/utils'

// import logoImg from '../../assets/random_foods.png';
import { IIngredientType, IIngredientCart } from '../constants/interfaces';
import api from '../services/api';
import { block } from 'react-native-reanimated';


interface IngredientType {
    tipo: string,
    image_url: string,
    ingredientes: [{
        id: number,
        nome: string,
        id_tipo_unidade: number,
        id_tipo_ingrediente: number,
        sem_medida: boolean,
        derivado_leite: boolean,
        glutem: boolean
    }]
}

interface IngredientsCart {
    ingredient: {
        id: number,
        name: string
    }
}

const NewRecipe = () => {
    const navigation = useNavigation();

    const [ingredientsCart, setIngredientsCart] = useState<IIngredientCart[]>([]);
    const [ingredientTypes, setIngredientTypes] = useState<IIngredientType[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [load, setLoad] = useState(false)



    useEffect(() => {
        // api.get('ingrediente')
        //     .then(response => {
        //         setIngredient(response.data);
        //     });
        api.get('ingredientetype')
            .then(response => {
                setIngredientTypes(response.data);
                setLoad(true)
            })
    }, []);


    function handleNavigateToRecipe() {
        navigation.navigate('Receita');
    }

    function handleSelectItem(id: number, name: string) {
        const alredySelected = selectedItems.findIndex(item => item === id);

        if (alredySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            const filteredNames = ingredientsCart.filter(item => item.ingredient.id !== id);

            setSelectedItems(filteredItems);
            setIngredientsCart(filteredNames);
        } else {
            setSelectedItems([...selectedItems, id]);

            const ingredient = { ingredient: { id: id, name: name } }

            setIngredientsCart([...ingredientsCart, ingredient]);
        }
    }


    if (!load) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={require('../assets/giphy.gif')}
                    style={{ width: 200, height: 200, }}
                />
            </View>)
    }

    return (
        <SafeAreaView>
            <Button
                title="Abrir Receitas"
                onPress={handleNavigateToRecipe} />
            <View>
                {/* <View>
                    <Text>Ingredientes</Text>
                    {ingredientsCart.map(ingrediente => {
                        return (
                            <View key={ingrediente.ingredient.id}>
                                <Text>{ingrediente.ingredient.name}</Text>
                                <TouchableOpacity onPress={() => handleSelectItem(ingrediente.ingredient.id, ingrediente.ingredient.name)}>
                                    <Text>Lixo</Text>
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </View> */}
                {/* <section>
                    <Image src={logoImg} alt="Random Foods" className="random-foods" />

                    <h1>Cadastrar nova receita</h1>
                    <p>De um titulo, liste os ingredientes e faça o passo-a-passo para ajudar quem está querendo cozinhar.</p>
                </section> */}
                <ScrollView>
                    {ingredientTypes.map(ingredientTypes => {
                        const image_url = ingredientTypes.image_url.replace('localhost', '192.168.100.4') + fixString(ingredientTypes.tipo) + `-colored.png`

                        return (
                            <View key={ingredientTypes.tipo} style={styles.mainContainer}>
                                <View>
                                    <View style={styles.ingredientTypeNameImageContainer}>
                                        <BoldText style={styles.ingredientTypeName}>{ingredientTypes.tipo}</BoldText>
                                        <Image style={styles.ingredientTypeIcon}
                                            source={{
                                                uri: image_url
                                            }} />
                                    </View>
                                    <View style={styles.ingredietContainer}>
                                        {ingredientTypes.ingredientes.map(ingrediente => {
                                            return (
                                                <TouchableOpacity
                                                    style={selectedItems.includes(ingrediente.id) ? styles.ingredientSelected : styles.ingredient}
                                                    onPress={() => handleSelectItem(ingrediente.id, ingrediente.nome)}
                                                    key={ingrediente.id}
                                                >
                                                    <RegularText style={selectedItems.includes(ingrediente.id) ? styles.ingredientNameSelected : styles.ingredientName}>{ingrediente.nome}</RegularText>
                                                </TouchableOpacity>
                                            )
                                        })}
                                    </View>
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>
                {/* <button className="button" type="submit">Cadastrar</button>  */}
            </View>
        </SafeAreaView>
    );
}


const Height = Dimensions.get("window").height * 0.5;
const Width = Dimensions.get("window").width;

const styles = StyleSheet.create({

    mainContainer: {
        margin: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 20,
    },

    ingredientTypeNameImageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    ingredientTypeName: {
        fontSize: 18,
        paddingLeft: 8,
        paddingTop: 20
    },

    ingredientTypeIcon: {
        margin: 10,
        width: 50,
        height: 50
    },

    ingredietContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        padding: 5
    },

    ingredient: {
        backgroundColor: '#EAEAEA',
        borderRadius: 8,
        height: 40,
        padding: 5,
        margin: 5,
        justifyContent: 'center'
    },

    ingredientSelected: {
        backgroundColor: '#e02041',
        borderRadius: 8,
        height: 40,
        padding: 5,
        margin: 5,
        justifyContent: 'center'
    },

    ingredientName: {
        color: 'black'
    },

    ingredientNameSelected: {
        color: 'white'
    }

})

export default NewRecipe