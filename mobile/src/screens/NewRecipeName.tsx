import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Button, Image, StyleSheet, Dimensions, Platform } from 'react-native'

import { Input } from 'react-native-elements'
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../services/api';
import DateTimePicker from '@react-native-community/datetimepicker';
import BoldText from '../components/BoldText'
import RegularText from '../components/RegularText'
import ItalicText from '../components/ItalicText'
import { AntDesign } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';


const NewRecipeName = () => {
    const navigation = useNavigation();

    const [load, setLoad] = useState(false)
    const [nomeReceita, setNomeReceita] = useState('');
    const [tipoReceita, setTipoReceita] = useState('');
    const [tempoPreparo, setTempoPreparo] = useState(new Date());
    const [tempoPreparo2, setTempoPreparo2] = useState('00:00');
    const [porcoes, setPorcoes] = useState('');
    const [tipos, setTipos] = useState([]);
    const [date, setDate] = useState(new Date(1598051730000));
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    useEffect(() => {
        api.get('/busca/tipo-receita')
            .then(response => {
                setTipos(response.data);
                setLoad(true);
            });

    }, []);

    if (!load) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={require('../assets/giphy.gif')}
                    style={{ width: 200, height: 200, }}
                />
            </View>)
    }
    function handleNavigateToIngredients() {

        if (nomeReceita)
            navigation.navigate('Nova Receita Ingredientes');
    }


    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setTempoPreparo(currentDate);

        let horas = tempoPreparo.getHours()
        let minutos = tempoPreparo.getMinutes()
        setTempoPreparo2(horas + ":" + minutos);
    };

    const showMode = (currentMode: string) => {
        setShow(true);
        setMode(currentMode);
    };

    const showTimepicker = () => {
        showMode('time');
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View style={styles.newRecipeImageBasketContainer}>
                    <Image
                        style={styles.newRecipeImage}
                        source={require('../assets/nova-receita.png')}
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

                <View style={styles.containerTime}>
                    <BoldText style={styles.textContainer}>Tempo de preparo</BoldText>
                    <Input
                        placeholder="Tempo de preparo"
                        onChangeText={(value) => setNomeReceita(value)}
                        value={tempoPreparo2}
                        inputContainerStyle={{ borderBottomWidth: 0, marginTop: 10 }}
                    />
                    <Button onPress={showTimepicker} title="Escolher o tempo" />
                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={tempoPreparo}
                            mode='time'
                            is24Hour={false}
                            display="clock"
                            onChange={onChange}
                        />
                    )}
                </View>
                <View style={styles.container}>
                    <BoldText style={styles.textContainer}>Quantidade de porções</BoldText>
                    <Input
                        placeholder="Quantidade de porções"
                        onChangeText={(value) => setNomeReceita(value)}
                        value={porcoes}
                        inputContainerStyle={{ borderBottomWidth: 0, marginTop: 10 }}
                    />
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
    containerTime: {
        margin: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        height: 200,

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

export default NewRecipeName;