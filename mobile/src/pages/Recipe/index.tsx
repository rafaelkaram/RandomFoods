import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native'
import { Rating } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api'


const { width } = Dimensions.get('window')
const numberGrid = 3;
const itemWidth = width / numberGrid;

interface Recipe {
    id: number,
    id_usuario: number,
    receita: string,
    descricao: string,
    nota: number,
    num_notas: number,
    tipo: string,
    data_cadastro: Date,
    ativa: boolean
}



const Recipe = () => {

    const navigation = useNavigation();
    const [recipes, setRecipes] = useState<Recipe[]>([])
    const [load, setLoad] = useState(false)

    useEffect(() => {
        api.get('receita').then(response => {
            setRecipes(response.data)
            setLoad(true)
        })

    }, [])

    function handleNavigateToRecipeSelected(id: number) {
        navigation.navigate('RecipeSelected', { id: id });
    }

    if (!load) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={require('../../assets/giphy.gif')}
                    style={{ width: 200, height: 200, }}
                />
            </View>)
    }

    return (
        <>
            <ScrollView style={styles.body}>
                <Text style={styles.title}>Minhas receitas</Text>
                <View style={styles.columns}>
                    {recipes.map(item => {
                        return (
                            <View style={styles.itemList} key={item.id}>
                                <TouchableOpacity
                                    onPress={() => handleNavigateToRecipeSelected(item.id)}>
                                    <Text style={styles.itemListImage}>Imagem</Text>
                                    <Text style={styles.itemListTitle}>{item.receita}</Text>
                                    <Rating imageSize={20} readonly startingValue={item?.nota} />
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </View>
            </ScrollView>
        </>
    )
}
const styles = StyleSheet.create({
    body: {
        backgroundColor: '#F0F0F5'
    },
    title: {
        backgroundColor: '#e02041',
        color: 'white',

        fontSize: 20,
        textAlign: 'center',

        margin: 3,
        padding: 10,

    },
    container: {
        flex: 1,
    },
    columns: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly'
    },
    itemList: {
        backgroundColor: 'white',
        margin: 15,
        padding: 10,
        width: itemWidth,

        flexDirection: 'column',
        borderRadius: 20
    },
    itemListImage: {
        borderWidth: 1,
        height: itemWidth - 40,
        borderRadius: 20,
        textAlign: 'center',

    },
    itemListTitle: {
        marginLeft: 10,
        marginTop: 5,
        fontWeight: 'bold',
        textAlign: 'center',

    },


});

export default Recipe;