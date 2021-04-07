import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Button, Image, StyleSheet, Dimensions, Modal } from 'react-native'
import { Input } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DropDownPicker from 'react-native-dropdown-picker';
import { BlurView } from 'expo-blur';
import BoldText from '../components/BoldText'
import RegularText from '../components/RegularText'
import ItalicText from '../components/ItalicText'
import fixString from '../assets/functions/utils'
import { IIngredientType, IIngredientCart, IIngredient, IUnidade } from '../constants/interfaces';
import { Feather, AntDesign } from '@expo/vector-icons';
import api from '../services/api';
import IngredientMeasure from '../components/IngredientMeasure';

const NewRecipeMeasures = ({ route }: { route: any }) => {
    const navigation = useNavigation();

    const [ingredientsCart, setIngredientsCart] = useState<IIngredientCart[]>([]);
    const [unidades, setUnidades] = useState<IUnidade[]>([]);

    useEffect(() => {
        if (route.params) {
            console.log(route.params)
            const { ingredientes } = route.params
            setIngredientsCart(ingredientes)
        }
        api.get('/busca/unidade')
            .then(response => {
                setUnidades(response.data);
            })
    }, [])



    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text>Medidas</Text>
            <ScrollView>
                {ingredientsCart.map((ingrediente,index) => {
                    return (
                        <IngredientMeasure ingrediente={ingrediente.ingredient} key={ingrediente.ingredient.id} index={index} />
                    )
                }
                )}
            </ScrollView>
        </SafeAreaView>
    );
}


const Height = Dimensions.get("window").height;
const Width = Dimensions.get("window").width;


const styles = StyleSheet.create({



})

export default NewRecipeMeasures;