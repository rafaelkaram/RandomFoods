import React, { useEffect, useState, useContext } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native'
import { Input } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { Feather, AntDesign } from '@expo/vector-icons';

import api from '../../services/api';

import { IListaIngredientes, ICart } from '../../constants/interfaces';
import { WIDTH } from '../../constants/dimensions';
import screens from '../../constants/screens';
import styles from '../../styles/screens/Ingredientes';
import globalStyles from '../../styles/Global';
import fixString from '../../assets/functions/utils';

import Loading from '../../components/Loading';
import BasketCounter from '../../components/BasketCounter';

import AuthReceita from '../../contexts/authReceita';

const Ingredientes = () => {
    const navigation = useNavigation();

    const {
        saveIngredientes,
        ingredientesContext,
        itemsContext,
    } = useContext(AuthReceita)

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

        setIngredientsCart(ingredientesContext)
        setSelectedItems(itemsContext)
    }, []);

    const handleNavigateToMeasures = () => {
        const idIngredientes = ingredientsCart.map(ingrediente => {
            return ingrediente.id;
        })
        if (ingredientsCart.length > 0){
            saveIngredientes(ingredientsCart, selectedItems)
            navigation.navigate(screens.cadastroQuantidades, { idIngredientes });
        }
    }

    const handleSelectItem = (id: number, nome: string) => {
        const alredySelected = selectedItems.findIndex(item => item === id);

        if (alredySelected >= 0) {
            const filteredItems = selectedItems.filter(item => item !== id);
            const filteredNames = ingredientsCart.filter(item => item.id !== id);

            setSelectedItems(filteredItems);
            setIngredientsCart(filteredNames);
        } else {
            const ingrediente = { id: id, nome: nome };

            setSelectedItems([ ...selectedItems, id ]);
            setIngredientsCart([ ...ingredientsCart, ingrediente ]);
        }
    }

    if (!load) {
        return <Loading />
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <BasketCounter
                ingredientes={ ingredientsCart }
                isCadastro={ true }
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
                        <View style={ globalStyles.modalContainer}>
                            <Text style={{ ...globalStyles.boldText, marginBottom: 10 }}>Ingredientes Selecionados</Text>
                            <ScrollView>
                                { ingredientsCart.map(ingrediente => {
                                    return (
                                        <View
                                            style={ globalStyles.modalList }
                                            key={ ingrediente.id }>
                                            <View style={{ maxWidth: WIDTH * 0.7 }}>
                                                <Text style={{ lineHeight: 30 }}>{ ingrediente.nome }</Text>
                                            </View>
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
            <ScrollView>
                { ingredientTypes.map(ingredientTypes => {
                    if (ingredientTypes.ingredientes.filter(ingrediente => fixString(ingrediente.nome.toLowerCase()).match(nomeIngrediente.toLowerCase())).length === 0) {
                        return;
                    }
                    return (
                        <View key={ ingredientTypes.nome } style={ globalStyles.container }>
                            <View>
                                <View style={ styles.ingredientTypeNameImageContainer }>
                                    <Text style={[ globalStyles.boldText, styles.ingredientTypeName ]}>{ ingredientTypes.nome }</Text>
                                    <Image
                                        style={ styles.ingredientTypeIcon }
                                        source={{ uri: ingredientTypes.url }}
                                    />
                                </View>
                                <View style={styles.ingredietContainer}>
                                    {ingredientTypes.ingredientes.filter(ingrediente => fixString(ingrediente.nome.toLowerCase()).match(nomeIngrediente.toLowerCase())).map(ingrediente => {
                                        return (
                                            <TouchableOpacity
                                                style={selectedItems.includes(ingrediente.id) ? globalStyles.filterBoxSelected : globalStyles.filterBox}
                                                onPress={() => handleSelectItem(ingrediente.id, ingrediente.nome)}
                                                key={ingrediente.id}
                                            >
                                                <Text style={[ globalStyles.regularText, selectedItems.includes(ingrediente.id) ? styles.ingredientNameSelected : styles.ingredientName ]}>{ ingrediente.nome }</Text>
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
                onPress={ handleNavigateToMeasures }
            >
                <AntDesign style={{ alignSelf: 'center' }} name='arrowright' size={24} color='white' />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default Ingredientes;