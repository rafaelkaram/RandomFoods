import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Button, Image, StyleSheet, Dimensions, Modal } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import BoldText from '../components/BoldText'
import RegularText from '../components/RegularText'
import ItalicText from '../components/ItalicText'
import fixString from '../assets/functions/utils'
import { IIngredientType, IIngredientCart } from '../constants/interfaces';
import { Feather, AntDesign } from '@expo/vector-icons';
import api from '../services/api';

const SearchRecipe = () => {
    const navigation = useNavigation();

    const [ingredientsCart, setIngredientsCart] = useState<IIngredientCart[]>([]);
    const [ingredientTypes, setIngredientTypes] = useState<IIngredientType[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [load, setLoad] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);


    useEffect(() => {
        api.get('ingredientetype')
            .then(response => {
                setIngredientTypes(response.data);
                setLoad(true)
            })
    }, []);


    function handleNavigateToRecipe() {
        navigation.navigate('Receita', { ingredientes: selectedItems });
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
            <View style={styles.searchRecipeImageBasketContainer}>
                <Image
                    style={styles.searchRecipeImage}
                    source={require('../assets/pesquisar-receitas.png')}
                />
                <TouchableOpacity
                    style={styles.basketContainer}
                    onPress={() => setModalVisible(true)}>
                    <Image
                        style={{ width: 40, height: 40 }}
                        source={require('../assets/basket-icon.png')}
                    />
                    <View style={styles.basketCounter}>
                        <Text style={{ alignSelf: 'center', color: 'white' }}>{ingredientsCart.length}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <ItalicText style={styles.subTitle}>Selecione os ingredientes</ItalicText>
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <BlurView intensity={200} style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}>
                    <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                        <TouchableOpacity
                            style={styles.modalX}
                            onPress={() => setModalVisible(!modalVisible)}
                        >
                            <BoldText style={{ alignSelf: 'center', color: 'white' }}>X</BoldText>
                        </TouchableOpacity>
                        <View style={styles.modalContainer}>

                            <BoldText style={{ marginBottom: 10 }}>Ingredientes Selecionados</BoldText>
                            <ScrollView>
                                {ingredientsCart.map(ingrediente => {
                                    return (
                                        <View
                                            style={styles.modalList}
                                            key={ingrediente.ingredient.id}>
                                            <Text style={{ lineHeight: 30 }}>{ingrediente.ingredient.name}</Text>
                                            <TouchableOpacity
                                                onPress={() => handleSelectItem(ingrediente.ingredient.id, ingrediente.ingredient.name)}>
                                                <Feather name="trash-2" size={24} color="black" />
                                            </TouchableOpacity>
                                        </View>
                                    )
                                })}
                            </ScrollView>

                        </View>
                    </View>
                </BlurView>
            </Modal>
            <ScrollView style={{ marginBottom: 110 }}>
                {ingredientTypes.map(ingredientTypes => {
                    const image_url = ingredientTypes.image_url.replace('localhost', '192.168.100.5') + fixString(ingredientTypes.tipo) + `-colored.png`

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
            <TouchableOpacity
                style={styles.arrow}
                onPress={handleNavigateToRecipe}
            >
                <AntDesign style={{ alignSelf: 'center' }} name="arrowright" size={24} color="white" />
            </TouchableOpacity>
        </SafeAreaView>
    );
}


const Height = Dimensions.get("window").height;
const Width = Dimensions.get("window").width;


const styles = StyleSheet.create({

    mainContainer: {
        margin: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 20,
    },

    searchRecipeImageBasketContainer: {
        flexDirection: 'row'
    },

    searchRecipeImage: {
        width: 320,
        height: 60,
        marginHorizontal: 10
    },

    basketContainer: {
        alignSelf: 'flex-end',
        marginRight: 10,
        marginBottom: 10
    },

    basketCounter: {
        backgroundColor: '#e02041',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center'
    },

    subTitle: {
        marginBottom: 10,
        textAlign: 'center',
    },

    modalList: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },

    modalContainer: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: '#E5EAFA',
        borderWidth: 3,
        width: Width * 0.7,
        height: Height * 0.6,
    },

    modalX: {
        backgroundColor: '#e02041',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignSelf: 'flex-end'
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
    },

    nonBlurredContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },

    arrow: {
        width: 60,
        height: 60,
        borderRadius: 80,
        position: 'absolute',
        top: 640,
        right: 20,
        backgroundColor: '#e02041',
        justifyContent: 'center',
    },

})

export default SearchRecipe;