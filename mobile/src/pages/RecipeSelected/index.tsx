import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native'


import { useNavigation } from '@react-navigation/native';
import api from '../../services/api'

const { width } = Dimensions.get('window')
const numberGrid = 2;
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



function RecipeSelected({ route }) {
   

    const idRecipe = route.params.id;
    const [recipe, setRecipe] = useState<Recipe>();



    useEffect(() => {
        api.get(`receita/${idRecipe}`).then(response => {
            setRecipe(response.data);
            console.log(response.data);
        });
    }, []);

    return (
        <>
            <ScrollView>
                <View style={styles.title}>
                    <Text> Minhas receitas</Text>
                </View>
                <View style={styles.container}>
                    <View style={styles.itemListTitle}>
                        <Text style={{fontFamily:'Ubuntu_700Bold'}}>{recipe?.receita}</Text>
                    </View>
                    <View style={styles.itemListDescribe}>
                        <Text style={{fontFamily:'Oswald_300Light'}}>{recipe?.descricao.split('\\n').map(desc => (
                            <Text>{'\n'}{desc}</Text>))}</Text>
                    </View>

                </View>

            </ScrollView>
        </>
    );
}
const styles = StyleSheet.create({
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
    itemList: {
        backgroundColor: 'lightgrey',
        margin: 15,
        padding: 10,
        width: itemWidth,
        height: itemWidth,
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
        fontFamily: 'Ubuntu_700Bold',

    },
    itemListDescribe:{
        padding:5,
        fontFamily: 'Oswald_400Regular',

    },


});

export default RecipeSelected;