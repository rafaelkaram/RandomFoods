import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Dimensions, Modal } from 'react-native';
import { Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import FilterModal from '../../components/FilterModal'

import { IListaIngredientes, ICart, IIngrediente } from '../../constants/interfaces';
import colors from '../../constants/colors';
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
    const [load, setLoad] = useState<boolean>(false);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [modalFilter, setModalFilter] = useState<boolean>(false);
    const [nomeIngrediente, setnomeIngrediente] = useState<string>('');
    const [derivadoLeite, setDerivadoLeite] = useState<boolean>(false);
    const [gluten, setGluten] = useState<boolean>(false);
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([])
    const [categorias, setCategorias] = useState<string[]>([])
    const [tipos, setTipos] = useState<string[]>([])
    const [tiposSelecionados, setTiposSelecionados] = useState<string[]>([])
    const [tempoDePreparo, setTempoDePreparo] = useState<number[]>([0, 0]);
    const [selectedFiltro, setSelectedFiltro] = useState<number>(0);
    const [baseTempoPreparo, setBaseTempoPreparo] = useState<number[]>([]);

    useEffect(() => {
        api.get('/busca/tipo-ingrediente')
            .then(response => {
                setIngredientTypes(response.data);
                setIngredientList(response.data);
            });
        api.get('/busca/categoria')
            .then(response => {
                setCategorias(response.data)
            });
        api.get('/busca/tipo-receita')
            .then(response => {
                setTipos(response.data)
            });
        api.get('/busca/tempo-preparo')
            .then(response => {
                setTempoDePreparo(response.data)
                setBaseTempoPreparo(response.data)
            });
        setLoad(true);
    }, []);

    useEffect(() => {
        filterIngredients()
    }, [gluten, derivadoLeite, nomeIngrediente]);

    useEffect(() => {
        let qtde = 0;
        if (categoriasSelecionadas && categoriasSelecionadas.length > 0) qtde++;
        if (tiposSelecionados && tiposSelecionados.length > 0) qtde++;
        if (tempoDePreparo && !(tempoDePreparo[0] === baseTempoPreparo[0] && tempoDePreparo[1] === baseTempoPreparo[1])) qtde++;
        setSelectedFiltro(qtde);

    }, [categoriasSelecionadas, tiposSelecionados, tempoDePreparo]);


    const handleNavigateToRecipe = () => {
        if (ingredientsCart.length > 0)
            navigation.navigate(screens.resultadoPesquisa,
                {
                    ingredientes: selectedItems,
                    derivadoLeite: derivadoLeite,
                    gluten: gluten,
                    categorias: categoriasSelecionadas,
                    tipos: tiposSelecionados,
                    tempoDePreparo: tempoDePreparo,
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
            <FilterModal
                modalFilter={ modalFilter }
                categoriasSelecionadas={ categoriasSelecionadas }
                categorias={ categorias }
                tipos={ tipos }
                tiposSelecionados={ tiposSelecionados }
                tempoDePreparo={ tempoDePreparo }
                tempos={ baseTempoPreparo }
                css={ styles }
                filterCategory={ (categoria: string) => filterCategory(categoria) }
                filterType={ (tipo: string) => filterType(tipo) }
                setModalFilter={ (modalFilter: boolean) => setModalFilter(modalFilter) }
                setTempoDePreparo={ (tempo: [number, number]) => setTempoDePreparo(tempo) }
            />
            <View style={ styles.modalFilter }>
                <View style={ styles.filterContainer }>
                    <TouchableOpacity
                        style={ derivadoLeite ? styles.filterBoxSelected : styles.filterBox }
                        onPress={() => { setDerivadoLeite(!derivadoLeite) }}
                    >
                        <RegularText style={ derivadoLeite && styles.filterNameSelected }>Sem lactose</RegularText>

                    </TouchableOpacity>
                    <TouchableOpacity
                        style={ gluten ? styles.filterBoxSelected : styles.filterBox }
                        onPress={() => { setGluten(!gluten) }}
                    >
                        <RegularText style={ gluten && styles.filterNameSelected }>Sem glúten</RegularText>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={ selectedFiltro !== 0 ? styles.filterBoxSelected : styles.filterBox }
                        onPress={() => setModalFilter(true)}
                    >
                        <RegularText style={ selectedFiltro !== 0 && styles.filterNameSelected }>Filtro</RegularText>
                        <View style={{ paddingLeft: 5 }}>
                        { selectedFiltro > 0 ?
                            <View style={ styles.filterBubble }>
                                <BoldText style={ styles.bubbleText }>{ selectedFiltro }</BoldText>
                            </View>
                            :
                            <FontAwesome name='filter' size={18} color={ selectedFiltro !== 0 ? 'white' : 'rgba(0, 0, 0, 0.7)' } />
                        }
                        </View>
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
                                <View style={styles.ingredientContainer}>
                                    {ingredientList.ingredientes.map(ingrediente => {
                                        return (
                                            <TouchableOpacity
                                                style={ selectedItems.includes(ingrediente.id) ? styles.filterBoxSelected : styles.filterBox }
                                                onPress={() => handleSelectItem(ingrediente.id, ingrediente.nome)}
                                                key={ ingrediente.id }
                                            >
                                                <RegularText style={ selectedItems.includes(ingrediente.id) && styles.filterNameSelected }>{ingrediente.nome}</RegularText>
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
        position: 'absolute',
        top: 0,
        right: 0,
        marginRight: 10,
        marginBottom: 10
    },

    basketCounter: {
        backgroundColor: colors.selectedButton,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: 'black',
        width: 25,
        height: 25,
        justifyContent: 'center',
        marginHorizontal: 7.5,
        marginTop: -5
    },

    subTitle: {
        marginBottom: 10,
        textAlign: 'center',
    },

    modalList: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 2
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
        backgroundColor: colors.dimmedBackground,
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

    ingredientContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        padding: 5
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
        bottom: 10,
        right: 10,
        backgroundColor: colors.selectedButton,
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

    filterBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.button,
        borderRadius: 15,
        height: 30,
        paddingHorizontal: 10,
        margin: 5,
    },

    filterBoxSelected: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.selectedButton,
        borderRadius: 15,
        height: 30,
        paddingHorizontal: 10,
        margin: 5
    },

    filterBubble: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 20,
        width: 20,
        borderRadius: 10,
        backgroundColor: 'white'
    },

    bubbleText: {
        color: colors.dimmedBackground
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

    modalFilter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 5
    },

    filterContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
})

export default Filtro;