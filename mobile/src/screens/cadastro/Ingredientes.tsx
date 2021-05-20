import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Dimensions, Modal } from 'react-native'
import { Input } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Feather, AntDesign } from '@expo/vector-icons';

import api from '../../services/api';

import { IListaIngredientes, ICart } from '../../constants/interfaces';
import screens from '../../constants/screens';

import BoldText from '../../components/BoldText';
import Loading from '../../components/Loading';
import RegularText from '../../components/RegularText';
import ItalicText from '../../components/ItalicText';
import fixString from '../../assets/functions/utils';

const Ingredientes = () => {
    const navigation = useNavigation();

    const [ingredientsCart, setIngredientsCart] = useState<ICart[]>([]);
    const [ingredientTypes, setIngredientTypes] = useState<IListaIngredientes[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [load, setLoad] = useState<boolean>(false)
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [nomeIngrediente, setnomeIngrediente] = useState<string>('');


    useEffect(() => {
        api.get('/busca/tipo-ingrediente')
            .then(response => {
                setIngredientTypes(response.data);
                setLoad(true)
            })
    }, []);


    const handleNavigateToMeasures = () => {
        const idIngredientes = ingredientsCart.map(ingrediente => {
            return ingrediente.id;
        })
        if (ingredientsCart.length > 0)
            navigation.navigate(screens.cadastroQuantidades, { idIngredientes });
    }

    const handleSelectItem = (id: number, nome: string) => {
        const alredySelected = selectedItems.findIndex(item => item === id);

        if (alredySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            const filteredNames = ingredientsCart.filter(item => item.id !== id);

            setSelectedItems(filteredItems);
            setIngredientsCart(filteredNames);
        } else {
            setSelectedItems([...selectedItems, id]);

            const ingrediente = { id: id, nome: nome };

            setIngredientsCart([...ingredientsCart, ingrediente]);
        }
    }

    if (!load) {
        return <Loading />
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.newRecipeImageBasketContainer}>
                <Image
                    style={styles.newRecipeImage}
                    source={require('../../assets/nova-receita.png')}
                />
                <TouchableOpacity
                    style={styles.basketContainer}
                    onPress={() => setModalVisible(true)}>
                    <Image
                        style={{ width: 40, height: 40 }}
                        source={require('../../assets/basket-icon.png')}
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
                onRequestClose={() => { setModalVisible(!modalVisible); }}
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
                                            key={ingrediente.id}>
                                            <View style={{maxWidth: Width*0.7}}>
                                                <Text style={{ lineHeight: 30 }}>{ingrediente.nome}</Text>
                                            </View>
                                            <TouchableOpacity
                                                onPress={() => handleSelectItem(ingrediente.id, ingrediente.nome)}>
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
            {/* <View style={styles.recipeName}>
                <BoldText style={styles.recipeNameText}>Nome da receita</BoldText>
            <Input
                    placeholder="Insira o nome da receita"
                    onChangeText={(value) => setnomeReceita(value)}
                    value={nomeReceita}
                    inputContainerStyle={{ borderBottomWidth: 0, marginTop:10 }}
                />
            </View> */}
            <Input
                placeholder="Pesquise por algum ingrediente"
                onChangeText={(value) => setnomeIngrediente(value)}
                value={nomeIngrediente}
                inputContainerStyle={{ borderBottomWidth: 0 }}
            />
            <ScrollView>
                {ingredientTypes.map(ingredientTypes => {
                    if (ingredientTypes.ingredientes.filter(ingrediente => fixString(ingrediente.nome.toLowerCase()).match(nomeIngrediente.toLowerCase())).length === 0) {
                        return;
                    }
                    return (
                        <View key={ingredientTypes.nome} style={styles.mainContainer}>
                            <View>
                                <View style={styles.ingredientTypeNameImageContainer}>
                                    <BoldText style={styles.ingredientTypeName}>{ingredientTypes.nome}</BoldText>
                                    <Image style={styles.ingredientTypeIcon}
                                        source={{
                                            uri: ingredientTypes.url
                                        }} />
                                </View>
                                <View style={styles.ingredietContainer}>
                                    {ingredientTypes.ingredientes.filter(ingrediente => fixString(ingrediente.nome.toLowerCase()).match(nomeIngrediente.toLowerCase())).map(ingrediente => {
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

    mainContainer: {
        margin: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 20,
    },

    newRecipeImageBasketContainer: {
        flexDirection: 'row'
    },

    newRecipeImage: {
        width: 320,
        height: 70,
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
        paddingHorizontal: 5

    },

    modalContainer: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: '#E5EAFA',
        borderWidth: 3,
        width: Width*0.9,
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

    recipeName: {
        margin: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        height: 120,

    },

    recipeNameText: {
        fontSize: 15,
        paddingLeft: 8,
        paddingTop: 10
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

})

export default Ingredientes