import React, { useEffect, useState } from 'react';
import { Text, ScrollView, StyleSheet, Dimensions, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IIngredient } from '../constants/interfaces';
import api from '../services/api';
import IngredientMeasure from '../components/IngredientMeasure';
import { setAutoLogAppEventsEnabledAsync } from 'expo-facebook';

const NewRecipeMeasures = ({ route }: { route: any }) => {
    const navigation = useNavigation();

    const [ingredientsCart, setIngredientsCart] = useState<IIngredient[]>([]);
    const [load, setLoad] = useState(false);

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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text>Medidas</Text>
            <ScrollView>
                { ingredientsCart.map((ingrediente, index) => {
                    return <IngredientMeasure ingrediente={ ingrediente } key={ ingrediente.id } index={ index } />
                })}
            </ScrollView>
        </SafeAreaView>
    );
}


const Height = Dimensions.get("window").height;
const Width = Dimensions.get("window").width;


const styles = StyleSheet.create({



})

export default NewRecipeMeasures;