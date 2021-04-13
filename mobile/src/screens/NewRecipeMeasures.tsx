import React, { useEffect, useState } from 'react';
import { Text, ScrollView, StyleSheet, Dimensions, View, Image, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IIngredient } from '../constants/interfaces';
import api from '../services/api';
import IngredientMeasure from '../components/IngredientMeasure';
import { setAutoLogAppEventsEnabledAsync } from 'expo-facebook';
import { Feather, AntDesign } from '@expo/vector-icons';
import ItalicText from '../components/ItalicText'

const NewRecipeMeasures = ({ route }: { route: any }) => {
    const navigation = useNavigation();

    const [ingredientsCart, setIngredientsCart] = useState<IIngredient[]>([]);
    const [load, setLoad] = useState(false);
    const Height = Dimensions.get("window").height;
    const Width = Dimensions.get("window").width;

    useEffect(() => {
        if (route.params) {
            console.log(route.params);
            const { idIngredientes } = route.params;
            const params = { ids: idIngredientes };
            api.get('/busca/ingrediente', { params })
                .then(response => {
                    console.log(response.data);
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

    function handleNavigateToMeasures() {
        // const idIngredientes = ingredientsCart.map(ingrediente => {
        //     return ingrediente.id;
        // })
        // if (ingredientsCart.length > 0 && nomeReceita)
        //     navigation.navigate('Medidas', { idIngredientes });
    }



    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Image
                style={styles.newRecipeImage}
                source={require('../assets/nova-receita.png')}
            />
            <ItalicText style={styles.subTitle}>Selecione as quantidades</ItalicText>
            <ScrollView>
                {ingredientsCart.map((ingrediente, index) => {
                    if (ingrediente.tipoUnidade === 'UNIDADE') {
                        ingrediente.unidades.push({
                            id: 5,
                            nome: 'Unidade',
                            sigla: 'U',
                            taxaConversao: '1.000',
                            tipo: 'UNIDADE',
                        });
                    } else if (ingrediente.tipoUnidade === 'VOLUME') {
                        ingrediente.unidades.push({
                            id: 1,
                            nome: 'Litro',
                            sigla: 'L',
                            taxaConversao: '1.000',
                            tipo: 'VOLUME',
                        });
                        ingrediente.unidades.push({
                            id: 2,
                            nome: 'Mililitro',
                            sigla: 'Ml',
                            taxaConversao: '0.001',
                            tipo: 'VOLUME',
                        });
                    } else {
                        ingrediente.unidades.push({
                            id: 3,
                            nome: 'Miligrama',
                            sigla: 'Mg',
                            taxaConversao: '0.001',
                            tipo: 'PESO',
                        });
                        ingrediente.unidades.push({
                            id: 4,
                            nome: 'Grama',
                            sigla: 'g',
                            taxaConversao: '1.000',
                            tipo: 'PESO',
                        });
                        ingrediente.unidades.push({
                            id: 6,
                            nome: 'Quilograma',
                            sigla: 'Kg',
                            taxaConversao: '1000.000',
                            tipo: 'PESO',
                        });
                    }
                    return (
                            <IngredientMeasure key={ingrediente.id} ingrediente={ingrediente} index={index} />
                    )
                })}


            </ScrollView>
            <TouchableOpacity
                style={styles.arrow}
                onPress={handleNavigateToMeasures}
            >
                <AntDesign style={{ alignSelf: 'center' }} name="arrowright" size={24} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}
const Height = Dimensions.get("window").height
const Width = Dimensions.get("window").width;




const styles = StyleSheet.create({


    arrow: {
        width: 60,
        height: 60,
        borderRadius: 80,
        position: 'absolute',
        top: (Height - 100),
        right: 20,
        backgroundColor: '#e02041',
        justifyContent: 'center',
    },
    newRecipeImage: {
        width: 320,
        height: 70,
        marginHorizontal: 10
    },
    subTitle: {
        marginBottom: 10,
        textAlign: 'center',
    },

})

export default NewRecipeMeasures;