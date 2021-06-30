import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';

import api from '../../services/api';

import componentStyles from '../../styles/components/RecipeList';
import globalStyles from '../../styles/Global';
import styles from '../../styles/screens/Quantidade';
import screens from '../../constants/screens';
import { IListaIngredientes, IIngrediente } from '../../constants/interfaces';

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
                style={ globalStyles.recipeImage }
                source={ require('../../assets/nova-receita.png') }
            />
            <Text style={[ globalStyles.subTitleText, globalStyles.subTitle ]}>Selecione as quantidades</Text>
            <ScrollView>
                {ingredientsCart.map(tipos => {
                    return (
                        <View key={ tipos.nome }>
                            <View style={ styles.ingredientType }>
                                <Text style={{ ...globalStyles.boldText, paddingTop: 15, fontSize: 18 }}>{ tipos.nome }</Text>
                                <Image
                                    style={{ width: 50, height: 50 }}
                                    source={{ uri: tipos.url }}
                                />
                            </View>
                            { tipos.ingredientes.map(ingrediente => {
                                return <IngredientMeasure
                                            key={ ingrediente.id }
                                            ingrediente={ ingrediente }
                                            removeIngrediente={ (id: number) => removeIngredient(id) }
                                        />
                            })}
                        </View>
                    )
                })}
                <View style={{ height: 80 }}></View>
            </ScrollView>
            <TouchableOpacity
                style={ globalStyles.arrow }
                onPress={ handleNavigateToSteps }
            >
                <AntDesign style={{ alignSelf: 'center' }} name='arrowright' size={24} color='white' />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default Quantidades;