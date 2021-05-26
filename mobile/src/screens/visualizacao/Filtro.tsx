import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Dimensions, Modal } from 'react-native';
import { Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Feather, AntDesign } from '@expo/vector-icons';
import { List } from 'react-native-paper';

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
    const [modalFilter, setModalFilter] = useState<boolean>(false);
    const [nomeIngrediente, setnomeIngrediente] = useState<string>('');
    const [derivadoLeite, setDerivadoLeite] = useState<boolean>(false);
    const [gluten, setGluten] = useState<boolean>(false);
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([])
    const [categorias, setCategorias] = useState<string[]>([])
    const [tipos, setTipos] = useState<string[]>([])
    const [tiposSelecionados, setTiposSelecionados] = useState<string[]>([])
    const [tempoDePreparo, setTempoDePreparo] = useState<string>('')

    useEffect(() => {
        api.get('/busca/tipo-ingrediente')
            .then(response => {
                setIngredientTypes(response.data);
                setIngredientList(response.data);
            })
        api.get('/busca/categoria')
            .then(response => {
                setCategorias(response.data)
            })

        api.get('/busca/tipo-receita')
            .then(response => {
                setTipos(response.data)
            })

        setLoad(true)

    }, []);

    useEffect(() => {
        filterIngredients()
    }, [gluten, derivadoLeite, nomeIngrediente]);


    const handleNavigateToRecipe = () => {
        if (ingredientsCart.length > 0)
            navigation.navigate(screens.resultadoPesquisa,
                {
                    ingredientes: selectedItems,
                    derivadoLeite: derivadoLeite,
                    gluten: gluten,
                    categorias: categoriasSelecionadas,
                    tipos: tiposSelecionados,
                }
            )
    }

    const handleSelectItem = (id: number, nome: string) => {
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if (alreadySelected >= 0) {
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
                if (list2) list.push(list2);
            });
        } else if (gluten || derivadoLeite) {
            ingredientTypes.map(ingredientType => {
                const list2: IListaIngredientes | null = filterGlutenEDerivadoLeite(gluten, derivadoLeite, ingredientType.ingredientes, ingredientType);
                if (list2) list.push(list2);
            });
        } else {
            list = ingredientTypes;
        }

        setIngredientList(list);
    }

    const filterCategory = (categoria: string) => {
        const alreadySelected = categoriasSelecionadas.findIndex(item => item === categoria);
        if (alreadySelected >= 0) {
            const filteredItems = categoriasSelecionadas.filter(item => item !== categoria);
            setCategoriasSelecionadas(filteredItems);
        } else {
            setCategoriasSelecionadas([...categoriasSelecionadas, categoria]);
        }
    }

    const filterType = (tipo: string) => {
        const alreadySelected = tiposSelecionados.findIndex(item => item === tipo);
        if (alreadySelected >= 0) {
            const filteredItems = tiposSelecionados.filter(item => item !== tipo);
            setTiposSelecionados(filteredItems);
        } else {
            setTiposSelecionados([...tiposSelecionados, tipo]);
        }
    }

    const handleTempoPreparo = (sinal: string) => {

    }

    if (!load) {
        return <Loading />
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.searchRecipeImageBasketContainer}>
                <Image
                    style={styles.searchRecipeImage}
                    source={require('../../assets/pesquisar-receitas.png')}
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
            <Input
                placeholder="Pesquise por algum ingrediente"
                onChangeText={(value) => setnomeIngrediente(value)}
                value={nomeIngrediente}
                inputContainerStyle={{ borderBottomWidth: 0 }}
                style={styles.inputIngredient}
            />


            <Modal
                animationType="none"
                transparent={true}
                visible={modalFilter}
                onRequestClose={() => {
                    setModalFilter(!modalFilter);
                }}
            >
                <BlurView intensity={200} style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}>
                    <TouchableOpacity
                        style={styles.modalX}
                        onPress={() => setModalFilter(!modalFilter)}
                    >
                        <BoldText style={{ alignSelf: 'center', color: 'white' }}>X</BoldText>
                    </TouchableOpacity>
                    <BoldText style={{ marginBottom: 10 }}>Filtros Selecionados</BoldText>
                    <View style={styles.modalContainer}>
                        <ScrollView style={{ maxHeight: Width }}>
                            <View style={styles.filter}>
                                <View>
                                    <Text style={styles.filterListTitle}>Alérgicos</Text>
                                    <View style={styles.modalFilter}>
                                        <View>
                                            <TouchableOpacity
                                                style={derivadoLeite === true ? styles.filterBoxSelected : styles.filterBox}
                                                onPress={() => { derivadoLeite === false ? setDerivadoLeite(true) : setDerivadoLeite(false) }}
                                            >
                                                <RegularText style={derivadoLeite === false ? styles.filterName : styles.filterNameSelected}>Sem lactose</RegularText>

                                            </TouchableOpacity>
                                        </View>
                                        <View>
                                            <TouchableOpacity
                                                style={gluten === true ? styles.filterBoxSelected : styles.filterBox}
                                                onPress={() => { gluten === false ? setGluten(true) : setGluten(false) }}
                                            >
                                                <RegularText style={gluten === false ? styles.filterName : styles.filterNameSelected}>Sem glúten</RegularText>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>

                                <View>
                                    <Text style={styles.filterListTitle}>Categorias</Text>
                                    <View style={styles.modalFilter}>
                                        {categorias.map((categoria, index) => {
                                            return (
                                                <View key={index}>
                                                    <TouchableOpacity
                                                        style={categoriasSelecionadas.includes(categoria) ? styles.filterBoxSelected : styles.filterBox}
                                                        onPress={() => { filterCategory(categoria) }}
                                                    >
                                                        <RegularText style={!categoriasSelecionadas.includes(categoria) ? styles.filterName : styles.filterNameSelected}>{categoria}</RegularText>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>
                                <View>
                                    <Text style={styles.filterListTitle}>Tipos</Text>
                                    <View style={styles.modalFilter}>
                                        {tipos.map((tipo, index) => {
                                            return (
                                                <View key={index}>
                                                    <TouchableOpacity
                                                        style={tiposSelecionados.includes(tipo) ? styles.filterBoxSelected : styles.filterBox}
                                                        onPress={() => { filterType(tipo) }}
                                                    >
                                                        <RegularText style={!tiposSelecionados.includes(tipo) ? styles.filterName : styles.filterNameSelected}>{tipo}</RegularText>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>
                                <View>
                                    <Text style={styles.filterListTitle}>Tempo de Preparo (Minutos)</Text>
                                    <View style={styles.modalFilter}>
                                        <View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </BlurView>
            </Modal>
            <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setModalFilter(true)}>
                <Text style={styles.filterButtonText}>Filtros</Text>
            </TouchableOpacity>




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
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 50
    },

    ingredientSelected: {
        backgroundColor: '#e02041',
        borderRadius: 8,
        height: 40,
        padding: 5,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 50
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 0,
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

    inputIngredient: {
        borderWidth: 1,
        paddingLeft: 5,
        borderRadius: 10,
        borderColor: 'gray',
        marginBottom: -20,
    },
    filterList: {
        width: 120,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
    },
    filterListTitle: {
        color: "#f87062",
        textShadowColor: 'black',
        textShadowRadius: 0.5,
        textShadowOffset: {
            width: 0.5,
            height: 0.5,

        },
        margin: 10,
    },
    modalFilter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    filterButtonText: {
        color: "white",
    },
    filterButton: {
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: '#e02041',
        borderRadius: 8,
        height: 40,
        padding: 5,
        margin: 5,
        justifyContent: 'center',
        width: 100
    },
    dadosDisplay: {
        flexDirection: "row",
        alignItems: 'center',
    },
})

export default Filtro;