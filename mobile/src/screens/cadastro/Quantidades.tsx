import React, { useEffect, useState, useContext } from 'react';
import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';

import api from '../../services/api';

import globalStyles from '../../styles/Global';
import styles from '../../styles/screens/Quantidade';
import screens from '../../constants/screens';
import { IListaIngredientes, IIngrediente, IIngredienteCadastro } from '../../constants/interfaces';

import IngredientMeasure from '../../components/IngredientMeasure';
import Loading from '../../components/Loading';

import AuthReceita from '../../contexts/authReceita';

const Quantidades = ({ route }: { route: any }) => {
    const navigation = useNavigation();

    const {
        saveIngredientesQuantidade,
        ingredientesQuantidadeContext,
    } = useContext(AuthReceita)

    const [ingredientsCart, setIngredientsCart] = useState<IListaIngredientes[]>([]);
    const [load, setLoad] = useState<boolean>(false);
    const [ingredientes, setIngredientes] = useState<IIngredienteCadastro[]>([])

    useEffect(() => {
        if (route.params) {
            const { idIngredientes } = route.params;

            if (ingredientesQuantidadeContext.length > 0) {
                setIngredientes(ingredientesQuantidadeContext)
            } else {
                const newIngrs: IIngredienteCadastro[] = []
                idIngredientes.map((id: number) => {
                    newIngrs.push({ id, nomeIngrediente: '' })
                })
                setIngredientes(newIngrs)
            }
            const params = { ids: idIngredientes };
            api.get('/busca/ingrediente', { params })
                .then(response => {
                    setIngredientsCart(response.data);

                    setLoad(true);
                });
        } else {
            navigation.navigate(screens.home);
        }
    }, []);

    if (!load) {
        return <Loading />
    }

    const createButtonAlert = (mensagem: string) => {
        Alert.alert(
            'Dados não preenchidos',
            mensagem,
            [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
        );
    }

    const validaIngreidients = () => {
        for (var key in ingredientes) {
            if (!ingredientes[key].semMedida) {
                if (ingredientes[key].unidade === '') {
                    createButtonAlert('Ingrediente ' + ingredientes[key].nomeIngrediente + ' sem unidade')
                    return false
                }
                if (ingredientes[key].quantidade === 0) {
                    createButtonAlert('Ingrediente ' + ingredientes[key].nomeIngrediente + ' sem quantidade')
                    return false
                }
            }
        }
        return true
    }

    const handleNavigateToSteps = () => {
        if (validaIngreidients()) {
            saveIngredientesQuantidade(ingredientes)
            navigation.navigate(screens.cadastroPassos)
        }
    }

    const removeIngredient = (id: number) => {
        const newCart: IListaIngredientes[] = [];

        ingredientsCart.map(carrinho => {
            const ingredientes: IIngrediente[] = carrinho.ingredientes.filter(ingrediente => ingrediente.id !== id);
            if (ingredientes.length > 0) {
                const cart: IListaIngredientes = {
                    nome: carrinho.nome,
                    url: carrinho.url,
                    ingredientes
                }
                newCart.push(cart);
            }
        });
        setIngredientsCart(newCart);
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Image
                style={globalStyles.recipeImage}
                source={require('../../assets/nova-receita.png')}
            />
            <Text style={[globalStyles.subTitleText, globalStyles.subTitle]}>Selecione as quantidades</Text>
            <ScrollView>
                {ingredientsCart.map(tipos => {
                    return (
                        <View key={tipos.nome}>
                            <View style={styles.ingredientType}>
                                <Text style={{ ...globalStyles.boldText, paddingTop: 15, fontSize: 18 }}>{tipos.nome}</Text>
                                <Image
                                    style={{ width: 50, height: 50 }}
                                    source={{ uri: tipos.url }}
                                />
                            </View>
                            {tipos.ingredientes.map(ingrediente => {
                                return <IngredientMeasure
                                    key={ingrediente.id}
                                    ingrediente={ingrediente}
                                    ingredientesCadastro={ingredientes}
                                    removeIngrediente={(id: number) => removeIngredient(id)}
                                    setIngredientes={(ingredientes: IIngredienteCadastro[]) => setIngredientes(ingredientes)}
                                />
                            })}
                        </View>
                    )
                })}
                <View style={{ height: 80 }}></View>
            </ScrollView>
            <TouchableOpacity
                style={globalStyles.arrow}
                onPress={handleNavigateToSteps}
            >
                <AntDesign style={{ alignSelf: 'center' }} name='arrowright' size={24} color='white' />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default Quantidades;