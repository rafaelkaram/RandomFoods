import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Image, StyleSheet, Dimensions, Alert } from 'react-native';
import { Input } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import api from '../../services/api';
import screens from '../../constants/screens';
import BoldText from '../../components/BoldText';
import ItalicText from '../../components/ItalicText';
import Loading from '../../components/Loading';

const DadosGerais = () => {
    const navigation = useNavigation();


    const [load, setLoad] = useState<boolean>(false)
    const [nomeReceita, setNomeReceita] = useState<string>('');
    const [tipoReceita, setTipoReceita] = useState<string>('');
    const [minutos, setMinutos] = useState<string>('');
    const [tempoPreparo, setTempoPreparo] = useState<string>('00:00');
    const [porcoes, setPorcoes] = useState<string>('');
    const [tipos, setTipos] = useState<string[]>([]);
    const rgx = /^[0-9]*[.,]?[0-9]*$/;


    useEffect(() => {
        api.get('/busca/tipo-receita')
            .then(response => {
                setTipos(response.data);
                setLoad(true);
            });

    }, []);

    if (!load) {
        return <Loading />
    }


    const createButtonAlert = () =>
        Alert.alert(
            "Nome da Receita",
            "Adicione um nome a sua receita",
            [
                { text: "OK", onPress: () => console.log("OK Pressed") }
            ]
        );

    const handleNavigateToIngredients = () => {
        if (!nomeReceita) {
            createButtonAlert()
        }
        else {
            // Não passa os dados que criou aqui? Como que o sistema vai saber deles depois?
            navigation.navigate(screens.cadastroIngredientes);
        }
    }

    const handleInputValue = (type: string, signal: string) => {
        const sinal = signal
        const tipo = type

        let novoValor = 0
        if (sinal == '+') {
            if (tipo == 'tempoPreparo') {
                setMinutos((Number(minutos) + 1).toString())
            } else if (tipo == 'porções') {
                setPorcoes((Number(porcoes) + 1).toString())
            }

        } else if (sinal == '-') {
            if (tipo == 'tempoPreparo') {
                novoValor = (Number(minutos) - 1) < 0 ? 0 : Number(minutos) - 1
                setMinutos(novoValor.toString())
            } else if (tipo == 'porções') {
                novoValor = (Number(porcoes) - 1) < 0 ? 0 : Number(porcoes) - 1
                setPorcoes(novoValor.toString())
            }
        }
    }

    const inputValueValidator = (value: string, type: string) => {

        if (!value.match(rgx) || Number(value) > 1000) {
            if (type == 'tempoPreparo') {
                setMinutos(minutos)
            } else if (type == 'porções') {
                setPorcoes(porcoes)
            }
        } else {
            if (type == 'tempoPreparo') {
                setMinutos(value.toString())
            } else if (type == 'porções') {
                setPorcoes(value.toString())

            }
        }
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View style={styles.newRecipeImageBasketContainer}>
                    <Image
                        style={styles.newRecipeImage}
                        source={require('../../assets/nova-receita.png')}
                    />
                </View>
                <ItalicText style={styles.subTitle}>Escolha o nome da receita</ItalicText>

                <View style={styles.container}>
                    <BoldText style={styles.textContainer}>Nome da receita</BoldText>
                    <Input
                        placeholder="Insira o nome da receita"
                        onChangeText={(value) => setNomeReceita(value)}
                        value={nomeReceita}
                        inputContainerStyle={{ borderBottomWidth: 0, marginTop: 10 }}
                    />
                </View>
                <View style={styles.container}>
                    <BoldText style={styles.textContainer}>Tipo de receita</BoldText>
                    <Picker
                        selectedValue={tipoReceita}
                        style={styles.comboBox}
                        mode='dropdown'
                        onValueChange={(itemValue) =>
                            setTipoReceita(itemValue)
                        }>
                        {tipos.map(item => {

                            return (
                                <Picker.Item key={item} label={item} value={item} />

                            )
                        })}
                    </Picker>
                </View>

                <View style={styles.container}>
                    <BoldText style={styles.textContainer}>Tempo de preparo (Minutos)</BoldText>
                    <View style={styles.dadosDisplay}>
                        <TouchableOpacity
                            onPress={() => handleInputValue("tempoPreparo", "-")}>
                            <AntDesign name="minuscircleo" size={24} color='black' />

                        </TouchableOpacity>
                        <View>
                            <Input
                                placeholder="Tempo de preparo"
                                keyboardType="numeric"
                                onChangeText={(value) => inputValueValidator(value, 'tempoPreparo')}
                                value={minutos}

                                style={{ textAlign: 'center' }}
                                inputContainerStyle={{ borderWidth: 1, marginTop: 20, marginLeft: 10, marginRight: 10, width: 50, borderRadius: 10 }}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => handleInputValue("tempoPreparo", "+")}
                        >
                            <AntDesign name="pluscircleo" size={24} color='black' />
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={styles.container}>
                    <BoldText style={styles.textContainer}>Quantidade de porções</BoldText>
                    <View style={styles.dadosDisplay}>
                        <TouchableOpacity
                            onPress={() => handleInputValue("porções", "-")}>
                            <AntDesign name="minuscircleo" size={24} color='black' />

                        </TouchableOpacity>
                        <View>
                            <Input
                                placeholder="Quantidade de porções"
                                onChangeText={(value) => inputValueValidator(value, 'porções')}
                                keyboardType="numeric"
                                value={porcoes}
                                style={{ textAlign: 'center' }}
                                inputContainerStyle={{ borderWidth: 1, marginTop: 20, marginLeft: 10, marginRight: 10, width: 50, borderRadius: 10 }}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => handleInputValue("porções", "+")}
                            onLongPress={() => handleInputValue("porções", "+")}>
                            <AntDesign name="pluscircleo" size={24} color='black' />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity
                style={styles.arrow}
                onPress={handleNavigateToIngredients}
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


    container: {
        margin: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        height: 150,

    },

    dadosDisplay: {
        flexDirection: "row",
        alignItems: 'center',
    },

    textContainer: {
        fontSize: 15,
        paddingLeft: 8,
        paddingTop: 10
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
    comboBox: {
        margin: 20,
        width: 180,
        height: 40,
        borderWidth: 1
    },

})

export default DadosGerais;