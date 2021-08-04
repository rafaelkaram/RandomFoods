import React, { useEffect, useState, useContext } from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { WIDTH } from '../../constants/dimensions';
import api from '../../services/api';

import { IListaIngredientes, ICart, IIngrediente } from '../../constants/interfaces';
import fixString from '../../assets/functions/utils';
import styles from '../../styles/screens/Filtro';
import globalStyles from '../../styles/Global';
import screens from '../../constants/screens';

import BasketCounter from '../../components/BasketCounter';
import FilterModal from '../../components/FilterModal';
import Loading from '../../components/Loading';
import AuthFilter from '../../contexts/authFilter';


const Filtro = () => {
    const navigation = useNavigation();

    const { saveFilter, derivadoLeiteContext, glutenContext, categoriasContext, tiposContext } = useContext(AuthFilter)

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
                setTempoDePreparo([response.data[1], response.data[1]])
                setBaseTempoPreparo(response.data)
            });
        
        setDerivadoLeite(derivadoLeiteContext)
        setGluten(glutenContext)
        setCategoriasSelecionadas(categoriasContext)
        setTiposSelecionados(tiposContext)

        setLoad(true);
    }, []);

    useEffect(() => {
        filterIngredients()
    }, [gluten, derivadoLeite, nomeIngrediente]);

    useEffect(() => {
        let qtde = 0;
        if (categoriasSelecionadas && categoriasSelecionadas.length > 0) qtde++;
        if (tiposSelecionados && tiposSelecionados.length > 0) qtde++;
        if (tempoDePreparo && !(tempoDePreparo[1] === baseTempoPreparo[1])) qtde++;
        setSelectedFiltro(qtde);

    }, [categoriasSelecionadas, tiposSelecionados, tempoDePreparo]);


    const handleNavigateToRecipe = () => {
        if (ingredientsCart.length > 0){
            saveFilter(derivadoLeite, gluten, categoriasSelecionadas, tiposSelecionados);
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
    }

    const handleSelectItem = (id: number, nome: string) => {
        const alreadySelected = selectedItems.findIndex(item => item === id);

        if (alreadySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            const filteredNames = ingredientsCart.filter(item => item.id !== id);

            setSelectedItems(filteredItems);
            setIngredientsCart(filteredNames);
        } else {
            const ingrediente = { id: id, nome: nome };
            setSelectedItems([...selectedItems, id]);
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
            <BasketCounter
                ingredientes={ ingredientsCart }
                isCadastro={ false }
                setVisible={ setModalVisible }
            />
            <Text style={[ globalStyles.subTitleText, globalStyles.subTitle ]}>Selecione os ingredientes</Text>
            <Modal
                animationType='none'
                transparent={ true }
                visible={ modalVisible }
                onRequestClose={() => { setModalVisible(!modalVisible); }}
            >
                <BlurView intensity={200} style={[ StyleSheet.absoluteFill, styles.nonBlurredContent ]}>
                    <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                        <TouchableOpacity
                            style={ globalStyles.modalX }
                            onPress={ () => setModalVisible(!modalVisible) }
                        >
                            <Text style={{ ...globalStyles.boldText, alignSelf: 'center', color: 'white' }}>X</Text>
                        </TouchableOpacity>
                        <View style={{ ...globalStyles.modalContainer, width: WIDTH * 0.8, height: 400 } }>
                            <Text style={{ ...globalStyles.boldText, marginBottom: 10 }}>Ingredientes Selecionados</Text>
                            <ScrollView>
                                { ingredientsCart.map(ingrediente => {
                                    return (
                                        <View
                                            style={ globalStyles.modalList }
                                            key={ ingrediente.id }
                                        >
                                            <Text style={{ lineHeight: 30 }}>{ ingrediente.nome }</Text>
                                            <TouchableOpacity
                                                onPress={ () => handleSelectItem(ingrediente.id, ingrediente.nome) }>
                                                <Feather name='trash-2' size={24} color='black' />
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
                placeholder='Pesquise por algum ingrediente'
                onChangeText={ (value) => setnomeIngrediente(value) }
                value={ nomeIngrediente }
                inputContainerStyle={{ borderBottomWidth: 0 }}
                style={ globalStyles.inputPesquisa }
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
                        style={ derivadoLeite ? globalStyles.filterBoxSelected : globalStyles.filterBox }
                        onPress={() => { setDerivadoLeite(!derivadoLeite) }}
                    >
                        <Text style={[ globalStyles.regularText, derivadoLeite && globalStyles.filterNameSelected ]}>Sem lactose</Text>

                    </TouchableOpacity>
                    <TouchableOpacity
                        style={ gluten ? globalStyles.filterBoxSelected : globalStyles.filterBox }
                        onPress={() => { setGluten(!gluten) }}
                    >
                        <Text style={[ globalStyles.regularText, gluten && globalStyles.filterNameSelected ]}>Sem glúten</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={ selectedFiltro !== 0 ? globalStyles.filterBoxSelected : globalStyles.filterBox }
                        onPress={ () => setModalFilter(true) }
                    >
                        <Text style={[ globalStyles.regularText, selectedFiltro !== 0 && globalStyles.filterNameSelected ]}>Filtro</Text>
                        <View style={{ paddingLeft: 5 }}>
                        { selectedFiltro > 0 ?
                            <View style={ styles.filterBubble }>
                                <Text style={[ globalStyles.boldText, styles.bubbleText ]}>{ selectedFiltro }</Text>
                            </View>
                            :
                            <FontAwesome name='filter' size={18} color={ selectedFiltro !== 0 ? 'white' : 'rgba(0, 0, 0, 0.7)' } />
                        }
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <ScrollView>
                { ingredientList.map(ingredientList => {
                    return (
                        <View key={ ingredientList.nome } style={ globalStyles.container }>
                            <View>
                                <View style={styles.ingredientTypeNameImageContainer}>
                                    <Text style={[ globalStyles.boldText, styles.ingredientTypeName ]}>{ingredientList.nome}</Text>
                                    <Image style={ styles.ingredientTypeIcon }
                                        source={{ uri: ingredientList.url }} />
                                </View>
                                <View style={ styles.ingredientContainer }>
                                    { ingredientList.ingredientes.map(ingrediente => {
                                        return (
                                            <TouchableOpacity
                                                style={ selectedItems.includes(ingrediente.id) ? globalStyles.filterBoxSelected : globalStyles.filterBox }
                                                onPress={ () => handleSelectItem(ingrediente.id, ingrediente.nome) }
                                                key={ ingrediente.id }
                                            >
                                                <Text style={[ globalStyles.regularText, selectedItems.includes(ingrediente.id) && globalStyles.filterNameSelected ]}>{ ingrediente.nome }</Text>
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
                style={ globalStyles.arrow }
                onPress={ handleNavigateToRecipe }
            >
                <AntDesign style={{ alignSelf: 'center' }} name='arrowright' size={24} color='white' />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default Filtro;