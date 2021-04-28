import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Dimensions, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IIngredienteTipo, IIngrediente } from '../constants/interfaces';
import api from '../services/api';
import IngredientMeasure from '../components/IngredientMeasure';
import { AntDesign } from '@expo/vector-icons';
import ItalicText from '../components/ItalicText'
import BoldText from '../components/BoldText'
import RegularText from '../components/RegularText';

const NewRecipeMeasures = ({ route }: { route: any }) => {
    const navigation = useNavigation();

    const [ingredientsCart, setIngredientsCart] = useState<IIngredienteTipo[]>([]);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        if (route.params) {
            const { idIngredientes } = route.params;
            const params = { ids: idIngredientes };
            api.get('/busca/ingrediente', { params })
                .then(response => {
                    setIngredientsCart(response.data);
                    setLoad(true);
                });
        } else {
            navigation.navigate('Home');
        }
    }, []);

    if (!load) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={require('../assets/giphy.gif')}
                    style={{ width: 200, height: 200, }}
                />
            </View>)
    }

    function handleNavigateToSteps() {

        navigation.navigate('Nova Receita Steps');
        // const idIngredientes = ingredientsCart.map(ingrediente => {
        //     return ingrediente.id;
        // })
        // if (ingredientsCart.length > 0 && nomeReceita)
        //     navigation.navigate('Medidas', { idIngredientes });
    }
    function removeIngredient(id: number) {

        const newCart: IIngredienteTipo[] = []

        ingredientsCart.map((carrinho, index) => {
            const ingredientes: IIngrediente[] = carrinho.ingredientes.filter(ingrediente => ingrediente.id !== id)
            if (ingredientes.length > 0) {
                const cart: IIngredienteTipo = {
                    nome: carrinho.nome,
                    url: carrinho.url,
                    alt_url: carrinho.alt_url,
                    ingredientes
                }
                newCart.push(cart)
            }
        })
        setIngredientsCart(newCart)
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Image
                style={styles.newRecipeImage}
                source={require('../assets/nova-receita.png')}
            />
            <ItalicText style={styles.subTitle}>Selecione as quantidades</ItalicText>
            <ScrollView>
                {ingredientsCart.map((tipos, index) => {

                    return (
                        <View key={tipos.nome}>
                            <View style={styles.ingredientType}>
                                <BoldText style={{ paddingTop: 15, fontSize: 18 }}>{tipos.nome}</BoldText>
                                <Image
                                    style={{ width: 50, height: 50 }}
                                    source={{
                                        uri: tipos.url
                                    }}
                                />
                            </View>
                            {tipos.ingredientes.map(ingrediente => {
                                if (ingrediente.tipoUnidade === 'UNIDADE') {
                                    ingrediente.unidades.push({
                                        id: 5,
                                        nome: 'Unidade',
                                        sigla: 'U',
                                        taxaConversao: '1.000',
                                        tipo: 'UNIDADE',
                                        qtd: 1
                                    });
                                } else if (ingrediente.tipoUnidade === 'VOLUME') {
                                    ingrediente.unidades.push({
                                        id: 1,
                                        nome: 'Litro',
                                        sigla: 'L',
                                        taxaConversao: '1.000',
                                        tipo: 'VOLUME',
                                        qtd: 1
                                    });
                                    ingrediente.unidades.push({
                                        id: 2,
                                        nome: 'Mililitro',
                                        sigla: 'Ml',
                                        taxaConversao: '0.001',
                                        tipo: 'VOLUME',
                                        qtd: 100
                                    });
                                } else {
                                    ingrediente.unidades.push({
                                        id: 3,
                                        nome: 'Miligrama',
                                        sigla: 'Mg',
                                        taxaConversao: '0.001',
                                        tipo: 'PESO',
                                        qtd: 100
                                    });
                                    ingrediente.unidades.push({
                                        id: 4,
                                        nome: 'Grama',
                                        sigla: 'g',
                                        taxaConversao: '1.000',
                                        tipo: 'PESO',
                                        qtd: 100
                                    });
                                    ingrediente.unidades.push({
                                        id: 6,
                                        nome: 'Quilograma',
                                        sigla: 'Kg',
                                        taxaConversao: '1000.000',
                                        tipo: 'PESO',
                                        qtd: 1
                                    });
                                }
                                return (
                                    <IngredientMeasure key={ingrediente.id} ingrediente={ingrediente} removeIngrediente={(id: number) => removeIngredient(id)} index={index} />
                                )
                            })}
                        </View>
                    )
                })}
                <View style={{ height: 80 }}></View>
            </ScrollView>

            <TouchableOpacity
                style={styles.arrow}
                onPress={handleNavigateToSteps}
            >
                <AntDesign style={{ alignSelf: 'center' }} name="arrowright" size={24} color="white" />
            </TouchableOpacity>

        </SafeAreaView>
    );
}
const Height = Dimensions.get("window").height
const Width = Dimensions.get("window").width;




const styles = StyleSheet.create({

    ingredientType: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        margin: 10,
        marginHorizontal: 100

    },

    arrow: {
        width: 60,
        height: 60,
        borderRadius: 80,
        position: 'absolute',
        top: (Height - 130),
        right: 20,
        backgroundColor: '#e02041',
        justifyContent: 'center',
    },
    newRecipeImage: {
        width: 320,
        height: 70,
        marginHorizontal: 10,
        alignSelf: 'center'
    },
    subTitle: {
        marginBottom: 10,
        textAlign: 'center',
    },

})


export default NewRecipeMeasures;