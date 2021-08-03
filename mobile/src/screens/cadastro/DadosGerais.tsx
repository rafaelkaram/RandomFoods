import React, { useEffect, useState, useContext } from 'react';
import { Alert, Image, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Input } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';

import api from '../../services/api';

import globalStyles from '../../styles/Global';
import styles from '../../styles/screens/DadosGerais';
import screens from '../../constants/screens';
import { IMidiaPicker } from '../../constants/interfaces';

import Loading from '../../components/Loading';
import colors from '../../constants/colors';

import AuthReceita from '../../contexts/authReceita';

const DadosGerais = () => {
    const navigation = useNavigation();

    const {
        saveDadosGerais,
        nomeReceitaContext,
        tipoReceitaContext,
        categoriasContext,
        minutosContext,
        porcoesContext,
        midiasContext
    } = useContext(AuthReceita)


    const [load, setLoad] = useState<boolean>(false)
    const [nomeReceita, setNomeReceita] = useState<string>('');
    const [tipoReceita, setTipoReceita] = useState<string>('');
    const [minutos, setMinutos] = useState<string>('');
    const [tempoPreparo, setTempoPreparo] = useState<string>('00:00');
    const [porcoes, setPorcoes] = useState<string>('');
    const [tipos, setTipos] = useState<string[]>([]);
    const [midias, setMidias] = useState<IMidiaPicker[]>([]);
    const [categoriasSelecionadas, setCategoriasSelecionadas] = useState<string[]>([])
    const [categorias, setCategorias] = useState<string[]>([])
    const rgx = /^[0-9]*[.,]?[0-9]*$/;


    useEffect(() => {
        api.get('/busca/tipo-receita')
            .then(response => {
                setTipos(response.data);
                setLoad(true);
            });
        api.get('/busca/categoria')
            .then(response => {
                setCategorias(response.data)
            });
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted')
                    Alert.alert('Permissão',
                        'É necessário dar permissão para poder adicionar fotos e vídeos',
                        [{ text: 'OK', onPress: () => console.log('Os maluco concordou!') }]
                    );
            }
        })();
        setNomeReceita(nomeReceitaContext)
        setTipoReceita(tipoReceitaContext)
        setCategoriasSelecionadas(categoriasContext)
        setMinutos(minutosContext)
        setPorcoes(porcoesContext)
        setMidias(midiasContext)
    }, []);

    if (!load) {
        return <Loading />
    }

    const createButtonAlert = (mensagem: string) => {
        Alert.alert(
            "Dados não preenchidos",
            mensagem,
            [{ text: "OK", onPress: () => console.log("OK Pressed") }]
        );
    }

    const handleAddMidia = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
            mediaTypes: ImagePicker.MediaTypeOptions.All,
        });

        if (!result.cancelled) {
            const midia: IMidiaPicker = result as IMidiaPicker;
            setMidias([...midias, midia]);
        }
    }

    const toggleDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const handleRemoveMidia = async (id: number) => {
        const midiaList = midias.filter((midia: IMidiaPicker, index: number) => index !== id);
        setMidias([...midiaList]);
    }

    const handleNavigateToIngredients = async () => {
        if (
            !nomeReceita ||
            !tipoReceita ||
            !minutos ||
            !porcoes ||
            nomeReceita === '' ||
            tipoReceita === '' ||
            minutos === '' ||
            porcoes === ''
        )
            createButtonAlert("Preencha todos os dados");
        else {
            /*const data = new FormData();

            data.append('teste', 'sim');
            data.append('nome', nomeReceita);
            data.append('descricao', `Serve ${porcoes} porção(ões)\n\n`);
            data.append('tipo', tipoReceita);
            data.append('tempoPreparo', tempoPreparo);

            midias?.forEach((midia, index) => {
                if (midia.type === 'image')
                    data.append('midias', {
                        name: `image_${index}.png`,
                        type: 'image/png',
                        uri: midia.uri
                    } as any);
                if (midia.type === 'video')
                    data.append('midias', {
                        name: `video_${index}.mp4`,
                        type: 'video/mp4',
                        uri: midia.uri
                    } as any);
            });

            await api.post('cadastro/receita', data).then(response => {
                console.log({ msg: 'Recebemos resposta!', response: response.data });
            });*/

            saveDadosGerais(nomeReceita, tipoReceita, categoriasSelecionadas, minutos, porcoes, midias)
            navigation.navigate(screens.cadastroIngredientes);
        }
    }

    const handleInputValue = (isTempoPreparo: boolean, isSoma: boolean) => {
        if (isSoma)
            if (isTempoPreparo)
                setMinutos((Number(minutos) + 1).toString());
            else
                setPorcoes((Number(porcoes) + 1).toString());
        else {
            if (isTempoPreparo) {
                const novoValor = (Number(minutos) - 1) < 0 ? 0 : Number(minutos) - 1;
                setMinutos(novoValor.toString());
            } else {
                const novoValor = (Number(porcoes) - 1) < 0 ? 0 : Number(porcoes) - 1;
                setPorcoes(novoValor.toString());
            }
        }
    }

    const inputValueValidator = (valor: string, isTempoPreparo: boolean) => {
        if (!valor.match(rgx) || Number(valor) > 1000)
            if (isTempoPreparo)
                setMinutos(minutos);
            else
                setPorcoes(porcoes);
        else
            if (isTempoPreparo)
                setMinutos(valor.toString());
            else
                setPorcoes(valor.toString());
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

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView>
                <View style={styles.newRecipeImageContainer}>
                    <Image
                        style={globalStyles.recipeImage}
                        source={require('../../assets/nova-receita.png')}
                    />
                    <Text style={[globalStyles.subTitleText, globalStyles.subTitle, { marginTop: 10 }]}>Dados Gerais</Text>

                </View>
                <TouchableOpacity style={{ position: 'absolute', right: 10, top: 20 }} onPress={() => toggleDrawer()}>
                    <Feather name="menu" size={30} color="black" />
                </TouchableOpacity>
                <View style={{ ...globalStyles.container, minHeight: 130, }}>
                    <Text style={[globalStyles.boldText, styles.textContainer]}>Nome da receita</Text>
                    <Input
                        placeholder='Insira o nome da receita'
                        onChangeText={(value) => setNomeReceita(value)}
                        value={nomeReceita}
                        inputContainerStyle={{ borderBottomWidth: 0, marginTop: 10 }}
                    />
                </View>
                <View style={{ ...globalStyles.container, minHeight: 130, }} >
                    <Text style={[globalStyles.boldText, styles.textContainer]}>Midias da receita</Text>
                    <View style={styles.midiaContainer}>
                        {midias.map((midia, index) => {
                            return (
                                <View style={styles.midiaView} key={index} >
                                    <Image
                                        source={{ uri: midia.uri }}
                                        style={styles.midia}
                                    />
                                    <TouchableOpacity style={styles.midiaRemove} onPress={() => handleRemoveMidia(index)} >
                                        <Feather name='minus' size={16} color={colors.primary} />
                                    </TouchableOpacity>
                                    {midia.type === 'video' &&
                                        <View style={styles.playIcon} >
                                            <Ionicons name='play' size={20} color={colors.primary} />
                                        </View>
                                    }
                                </View>
                            );
                        })}
                        <TouchableOpacity style={styles.midiaInput} onPress={handleAddMidia} >
                            <Feather name='plus' size={24} color={colors.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ ...globalStyles.container, minHeight: 130, }}>
                    <Text style={[globalStyles.boldText, styles.textContainer]}>Tipo de receita</Text>
                    <Picker
                        selectedValue={tipoReceita}
                        style={styles.comboBox}
                        mode='dropdown'
                        onValueChange={(itemValue) => setTipoReceita(itemValue)}
                    >
                        <Picker.Item label={'Selecione um tipo'} value={''} />
                        {tipos.map(item => {
                            return (
                                <Picker.Item key={item} label={item} value={item} />

                            )
                        })}
                    </Picker>
                </View>
                <View style={{ ...globalStyles.container, minHeight: 130 }}>
                    <Text style={[globalStyles.boldText, styles.textContainer]}>Categorias</Text>
                    <View style={styles.categories}>
                        {categorias.map((categoria, index) => {
                            return (
                                <View key={index}>
                                    <TouchableOpacity
                                        style={categoriasSelecionadas.includes(categoria) ? globalStyles.filterBoxSelected : globalStyles.filterBox}
                                        onPress={() => { filterCategory(categoria) }}
                                    >
                                        <Text style={[globalStyles.regularText, categoriasSelecionadas.includes(categoria) && globalStyles.filterNameSelected]}>{categoria}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </View>
                </View>
                <View style={{ ...globalStyles.container, minHeight: 130, }}>
                    <Text style={[globalStyles.boldText, styles.textContainer]}>Tempo de preparo (Minutos)</Text>
                    <View style={styles.dadosDisplay}>
                        <TouchableOpacity
                            onPress={() => handleInputValue(true, false)}>
                            <AntDesign name="minuscircleo" size={24} color='black' />

                        </TouchableOpacity>
                        <View>
                            <Input
                                placeholder="0"
                                keyboardType="numeric"
                                onChangeText={(value) => inputValueValidator(value, true)}
                                value={minutos}
                                style={{ textAlign: 'center' }}
                                inputContainerStyle={{ borderWidth: 1, marginTop: 20, marginLeft: 10, marginRight: 10, width: 50, borderRadius: 10 }}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => handleInputValue(true, true)}
                        >
                            <AntDesign name="pluscircleo" size={24} color='black' />
                        </TouchableOpacity>
                    </View>

                </View>
                <View style={{ ...globalStyles.container, minHeight: 130, }}>
                    <Text style={[globalStyles.boldText, styles.textContainer]}>Quantidade de porções</Text>
                    <View style={styles.dadosDisplay}>
                        <TouchableOpacity
                            onPress={() => handleInputValue(false, false)}>
                            <AntDesign name="minuscircleo" size={24} color='black' />

                        </TouchableOpacity>
                        <View>
                            <Input
                                placeholder="0"
                                onChangeText={(value) => inputValueValidator(value, false)}
                                keyboardType="numeric"
                                value={porcoes}
                                style={{ textAlign: 'center' }}
                                inputContainerStyle={{ borderWidth: 1, marginTop: 20, marginLeft: 10, marginRight: 10, width: 50, borderRadius: 10 }}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => handleInputValue(false, true)}
                            onLongPress={() => handleInputValue(false, true)}>
                            <AntDesign name="pluscircleo" size={24} color='black' />
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <TouchableOpacity
                style={globalStyles.arrow}
                onPress={handleNavigateToIngredients}
            >
                <AntDesign style={{ alignSelf: 'center' }} name="arrowright" size={24} color="white" />
            </TouchableOpacity>

        </SafeAreaView>
    );
}

export default DadosGerais;