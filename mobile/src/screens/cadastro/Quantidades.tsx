import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Dimensions, View, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';

import api from '../../services/api';

import { IListaIngredientes, IIngrediente } from '../../constants/interfaces';
import screens from '../../constants/screens';

import BoldText from '../../components/BoldText';
import ItalicText from '../../components/ItalicText';
import IngredientMeasure from '../../components/IngredientMeasure';
import Loading from '../../components/Loading';

const Quantidades = ({ route }: { route: any }) => {
    const navigation = useNavigation();

    const [ingredientsCart, setIngredientsCart] = useState<IListaIngredientes[]>([]);
    const [load, setLoad] = useState<boolean>(false);

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
            navigation.navigate(screens.home);
        }
    }, []);

    if (!load) {
        return <Loading />
    }

    const handleNavigateToSteps = () => {

        navigation.navigate(screens.cadastroPassos);
    }

    const removeIngredient = (id: number) => {

        const newCart: IListaIngredientes[] = [];

        ingredientsCart.map(carrinho => {
            const ingredientes: IIngrediente[] = carrinho.ingredientes.filter(ingrediente => ingrediente.id !== id);
            if (ingredientes.length > 0) {
                const cart: IListaIngredientes = {
                    nome: carrinho.nome,
                    url: carrinho.url,
                    ingredientes
                }
                newCart.push(cart);
            }
        });
        setIngredientsCart(newCart);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Image
                style={styles.newRecipeImage}
                source={require('../assets/nova-receita.png')}
            />
            <ItalicText style={styles.subTitle}>Selecione as quantidades</ItalicText>
            <ScrollView>
                {ingredientsCart.map(tipos => {
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
                            { tipos.ingredientes.map(ingrediente => {
                                return <IngredientMeasure
                                            key={ingrediente.id}
                                            ingrediente={ingrediente}
                                            removeIngrediente={(id: number) => removeIngredient(id)}
                                        />
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

export default Quantidades;