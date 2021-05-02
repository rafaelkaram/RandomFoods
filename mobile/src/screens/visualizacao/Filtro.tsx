import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Dimensions, Modal } from 'react-native';
import { Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Feather, AntDesign } from '@expo/vector-icons';

import api from '../../services/api';

import { IListaIngredientes, ICart, IIngrediente } from '../../constants/interfaces';
import screens from '../../constants/screens';
import fixString from '../../assets/functions/utils';

import BoldText from '../../components/BoldText';
import Loading from '../../components/Loading';
import ItalicText from '../../components/ItalicText';
import RegularText from '../../components/RegularText';


const Filtro = () => {
    const navigation = useNavigation();

    const [ingredientsCart, setIngredientsCart] = useState<ICart[]>([]);
    const [ingredientTypes, setIngredientTypes] = useState<IListaIngredientes[]>([]);
    const [ingredientList, setIngredientList] = useState<IListaIngredientes[]>([]);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [load, setLoad] = useState<boolean>(false)
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [nomeIngrediente, setnomeIngrediente] = useState<string>('');
    const [derivadoLeite, setDerivadoLeite] = useState<boolean>(false);
    const [gluten, setGluten] = useState<boolean>(false);

    useEffect(() => {
        api.get('/busca/tipo-ingrediente')
            .then(response => {
                setIngredientTypes(response.data);
                setIngredientList(response.data);
                setLoad(true)
            })
    }, []);

    useEffect(() => {
        filterIngredients()
    }, [gluten, derivadoLeite, nomeIngrediente]);


    const handleNavigateToRecipe = () => {
        if (ingredientsCart.length > 0)
            navigation.navigate(screens.resultadoPesquisa, { ingredientes: selectedItems, derivadoLeite: derivadoLeite, gluten: gluten })
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

    const filterGlutenEDerivadoLeite = (gluten: boolean, derivadoLeite: boolean, ingredientes: IIngrediente[], tipoIngrediente: IListaIngredientes) => {
        const glutenList = gluten ? ingredientes.filter(ingrediente => ingrediente.gluten === !gluten) : ingredientes;
        const derviadoLeiteList = derivadoLeite ? glutenList.filter(ingrediente => ingrediente.derivadoLeite === !derivadoLeite) : glutenList;

        if (derviadoLeiteList.length > 0)
            return {
                nome: tipoIngrediente.nome,
                url: tipoIngrediente.url,
                ingredientes: derviadoLeiteList
            }

        return null;
    }

    const filterIngredients = () => {
        let list: IListaIngredientes[] = [];
        if (nomeIngrediente !== '') {
            ingredientTypes.map(ingredientType => {
                const list1: IIngrediente[] = ingredientType.ingredientes.filter(ingrediente => fixString(ingrediente.nome.toLowerCase()).match(nomeIngrediente.toLowerCase()));
                const list2: IListaIngredientes | null = filterGlutenEDerivadoLeite(gluten, derivadoLeite, list1, ingredientType);
                if(list2) list.push(list2);
            });
        } else if (gluten || derivadoLeite) {
            ingredientTypes.map(ingredientType => {
                const list2: IListaIngredientes | null = filterGlutenEDerivadoLeite(gluten, derivadoLeite, ingredientType.ingredientes, ingredientType);
                if(list2) list.push(list2);
            });
        } else {
            list = ingredientTypes;
        }

        setIngredientList(list);
    }


    if (!load) {
        return <Loading />
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
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
                                            key={ingrediente.id}>
                                            <Text style={{ lineHeight: 30 }}>{ingrediente.nome}</Text>
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
            <View>
                <Input
                    placeholder="Pesquise por algum ingrediente"
                    onChangeText={(value) => setnomeIngrediente(value)}
                    value={nomeIngrediente}
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                />

            </View>
            <View style={styles.filter}>
                <View>
                    <TouchableOpacity
                        style={derivadoLeite === true ? styles.filterBoxSelected : styles.filterBox}
                        onPress={() => { derivadoLeite === false ? setDerivadoLeite(true) : setDerivadoLeite(false) }}
                    >
                        <RegularText style={derivadoLeite === false ? styles.filterName : styles.filterNameSelected}>Receitas sem lactose</RegularText>

                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={gluten === true ? styles.filterBoxSelected : styles.filterBox}
                        onPress={() => { gluten === false ? setGluten(true) : setGluten(false) }}
                    >
                        <RegularText style={gluten === false ? styles.filterName : styles.filterNameSelected}>Receitas sem gluten</RegularText>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
                {ingredientList.map(ingredientList => {
                    return (
                        <View key={ingredientList.nome} style={styles.mainContainer}>
                            <View>
                                <View style={styles.ingredientTypeNameImageContainer}>
                                    <BoldText style={styles.ingredientTypeName}>{ingredientList.nome}</BoldText>
                                    <Image style={styles.ingredientTypeIcon}
                                        source={{
                                            uri: ingredientList.url
                                        }} />
                                </View>
                                <View style={styles.ingredietContainer}>
                                    {ingredientList.ingredientes.map(ingrediente => {
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
        flexDirection: 'row',
        maxWidth: Width
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
        top: (Height - 100),
        right: 20,
        backgroundColor: '#e02041',
        justifyContent: 'center',
    },

    filter: {
        margin: 10,
        flexDirection: 'row'
    },

    filterBox: {
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EAEAEA',
        borderRadius: 8,
        height: 40,
        padding: 5,
        margin: 5,
        justifyContent: 'center'
    },

    filterBoxSelected: {
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e02041',
        borderRadius: 8,
        height: 40,
        padding: 5,
        margin: 5,
        justifyContent: 'center'
    },

    filterName: {
        color: 'black'
    },

    filterNameSelected: {
        color: 'white'
    },

})

export default Filtro;