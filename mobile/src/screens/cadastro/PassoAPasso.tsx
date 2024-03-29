import React, { useState, useContext, useEffect } from 'react';
import { Alert, View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Modal } from 'react-native';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { BlurView } from 'expo-blur';

import styles from '../../styles/screens/PassoAPasso';
import globalStyles from '../../styles/Global';
import { IAuthContextData, IPassoReceita, IIngredienteQuantidade, IUsuario, IHeader } from '../../constants/interfaces';

import api from '../../services/api';

import StepRecipe from '../../components/StepRecipe';
import Loading from '../../components/Loading';

import AuthReceita from '../../contexts/authReceita';
import AuthContext from '../../contexts/auth';

const createFormData = (object: Object, form?: FormData, name?: string): FormData => {
    const formData = form || new FormData();
    for (let property in object) {
        const item = object[property];
        if (!object.hasOwnProperty(property) && item == null && item == undefined) {
            continue;
        }
        const formKey = name ? `${name}[${property}]` : property;
        if (typeof item === 'object') {
            createFormData(item, formData, formKey);
        } else {
            formData.append(formKey, item);
        }
    }
    return formData;
}

const PassoAPasso = () => {

    const navigation = useNavigation();

    const { user, headers }: { user: IUsuario | undefined, headers: IHeader | undefined } = useContext(AuthContext);

    const {
        nomeReceitaContext,
        tipoReceitaContext,
        categoriasContext,
        minutosContext,
        porcoesContext,
        midiasContext,
        ingredientesQuantidadeContext,
        stepsContext,
        saveSteps,
        deleteItems,
    } = useContext(AuthReceita) as IAuthContextData;


    const [id, setId] = useState(1);
    const [steps, setSteps] = useState<IPassoReceita[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [lastFinished, setLastFinished] = useState(true);
    const [load, setLoad] = useState<boolean>(false);
    const [receitaId, setReceitaId] = useState<number>(0)

    useEffect(() => {
        setSteps(stepsContext)
        setLoad(true);
    }, [])

    useEffect(() => {
        saveSteps(steps)
    }, [steps])

    if (!load || !user) {
        return <Loading />
    }

    const addStep = () => {
        if (lastFinished) {
            setId((oldId) => oldId + 1);
            setSteps([...steps, { id: id, descricao: '', edit: true, update: false }]);
            setLastFinished(false);
        }
    }

    const finishedStep = (index: number, descricao: string) => {
        steps.splice(index, 1);
        setSteps([...steps, { id: index + 1, descricao: descricao, edit: false, update: false }]);
        setLastFinished(true);
    }

    const updateStep = (id: number, newStep: IPassoReceita) => {
        const stepIndex = steps.findIndex((step, index) => step.id == newStep.id);
        steps.splice(stepIndex, 1);
        steps.push(newStep);
        steps.sort((a, b) => a.id - b.id);
        setLastFinished(true);
    }

    const newUpdate = (stepParam: IPassoReceita) => {
        const stepIndex = steps.findIndex((step) => step.id == stepParam.id);
        steps.splice(stepIndex, 1);
        stepParam.edit = true;
        stepParam.update = true;
        steps.push(stepParam);
        steps.sort((a, b) => a.id - b.id);
        return (
            <Modal
                animationType='none'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => { setModalVisible(!modalVisible); }}
            >
                <BlurView intensity={50} style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}>
                    <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                        <View style={globalStyles.modalContainer}>
                            <ScrollView >
                                <View >
                                    <StepRecipe
                                        step={stepParam}
                                        index={stepParam.id}
                                        setModal={(modalVisible: boolean) => setModal(modalVisible)}
                                        setLast={(lastFinished: boolean) => setLast(lastFinished)}
                                        newUpdate={(stepParam: IPassoReceita) => newUpdate(stepParam)}
                                        finished={(id: number, desc: string) => { finishedStep(id, desc) }}
                                        update={(index: number, step: IPassoReceita) => { updateStep(index, step) }}
                                        removeStep={(id: number) => removeStep(id)}
                                    />
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </BlurView>
            </Modal>
        )
    }

    const setModal = (modalVisible: boolean) => {
        setModalVisible(modalVisible);
    }

    const setLast = (last: boolean) => {
        setLastFinished(last);
    }

    const handleNavigateToReceita = () => {
        navigation.dispatch(CommonActions.reset({
            index: 0,
            routes: [
                { name: 'User' },
            ]
        }))
        //navigation.dispatch(StackActions.replace(screens.receita, {id: 331}))
        //navigation.dispatch(StackActions.popToTop());
        //navigation.reset({index: 0, routes:[{ name: screens.receita, params: { id: 331 } }]})
        //const jumpToAction = TabActions.jumpTo('HomeStack');
        //navigation.dispatch(TabActions.jumpTo('HomeStack', {receita: 331}))
        //navigation.navigate(screens.receita, {id: 331})
    }

    const cadastraReceita = async () => {
        if (steps.length < 1) {
            Alert.alert(
                'Adicione pelo menos um passo',
                '',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
            );
            return;
        }
        let stringSteps: string = '';
        for (let i = 0; i < steps.length; i++) {
            stringSteps += `${steps[i].id}- ${steps[i].descricao}\\n`;
        }
        stringSteps = stringSteps.substring(0, stringSteps.length - 2);

        const newIngredientes: IIngredienteQuantidade[] = [];

        ingredientesQuantidadeContext.forEach(ingr => {
            if (ingr.semMedida) {
                newIngredientes.push({
                    id: ingr.id,
                })
            } else {
                newIngredientes.push({
                    id: ingr.id,
                    quantidade: ingr.quantidade,
                    unidade: ingr.unidade,
                })
            }
        });

        const newCategorias = categoriasContext.map(categoria => {
            return categoria.toUpperCase()
        });

        const data = createFormData({
            idUsuario: user.id,
            nome: nomeReceitaContext,
            tipo: tipoReceitaContext.toUpperCase(),
            tempoPreparo: minutosContext,
            porcoes: porcoesContext,
            descricao: stringSteps,
            categorias: newCategorias,
            ingredientes: newIngredientes
        });

        midiasContext?.forEach((midia, index) => {
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

        setLoad(false);

        await api.post('cadastro/receita', data, { headers }).then(response => {
            // Apaga do storage e do contexto
            deleteItems()
            setReceitaId(response.data)
            setLoad(true);
            Alert.alert(
                `Receita: ${ nomeReceitaContext }`,
                'Receita cadastrada com Sucesso',
                [{
                    text: 'OK', onPress: () => handleNavigateToReceita()
                }]
            )
        }).catch(error => {
            setLoad(true);
            Alert.alert(
                'Ocorreu um erro ao processar sua solicitação.',
                '',
                [
                    { text: 'OK' }
                ]
            );
        })
    }

    const removeStep = (id: number) => {
        const newSteps: IPassoReceita[] = [];
        const passos: IPassoReceita[] = steps.filter((step, index) => index !== id);

        passos.map((vetorStep, index) => {
            if (passos.length > 0) {
                const newPasso: IPassoReceita = {
                    id: index + 1,
                    descricao: vetorStep.descricao,
                    edit: false,
                    update: false
                }
                newSteps.push(newPasso);
            }
        });
        setSteps(newSteps);
    }

    const renderItem = ({ item, index, drag }: any) => {
        return (
            <TouchableOpacity
                key={item.id} style={styles.component}
                onLongPress={drag}>
                {/* {(!item.edit) && */}
                <StepRecipe
                    step={item}
                    index={index}
                    setModal={(modalVisible: boolean) => setModal(modalVisible)}
                    setLast={(lastFinished: boolean) => setLast(lastFinished)}
                    newUpdate={(stepParam: IPassoReceita) => newUpdate(stepParam)}
                    update={(index: number, step: IPassoReceita) => { updateStep(index, step) }}
                    finished={(index: number, desc: string) => { finishedStep(index, desc) }}
                    removeStep={(id: number) => removeStep(id)}
                />
                {/* } */}
            </TouchableOpacity>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Image
                style={globalStyles.recipeImage}
                source={require('../../assets/nova-receita.png')}
            />
            <Text style={[globalStyles.subTitleText, globalStyles.subTitle]}>Descreva os passos</Text>

            <View>
                {console.log(steps)}
                {steps.map((step, index) => {
                    return (
                        <View key={step.id}>
                            {(step.edit && !step.update) &&
                                <Modal
                                    //key={step.id }
                                    animationType='none'
                                    transparent={true}
                                    visible={modalVisible}
                                    onRequestClose={() => { setModalVisible(!modalVisible); }}
                                >

                                    <BlurView intensity={50} style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}>
                                        <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                                            <View style={globalStyles.modalContainer}>
                                                <ScrollView >
                                                    {(step.edit && !step.update) &&
                                                        <View >
                                                            <StepRecipe
                                                                step={step}
                                                                index={index}
                                                                setModal={(modalVisible: boolean) => setModal(modalVisible)}
                                                                setLast={(lastFinished: boolean) => setLast(lastFinished)}
                                                                newUpdate={(stepParam: IPassoReceita) => newUpdate(stepParam)}
                                                                finished={(id: number, desc: string) => { finishedStep(id, desc) }}
                                                                update={(index: number, step: IPassoReceita) => { updateStep(index, step) }}
                                                                removeStep={(id: number) => removeStep(id)}
                                                            />
                                                        </View>
                                                    }
                                                </ScrollView>
                                            </View>
                                        </View>
                                    </BlurView>
                                </Modal>
                            }
                        </View>
                    )
                })}
                <TouchableOpacity
                    style={styles.add}
                    onPress={() => {
                        addStep()
                        setModalVisible(true)
                    }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>Adicionar passo</Text>
                    <AntDesign style={{ marginLeft: 10 }} name='pluscircleo' size={24} color='white' />
                </TouchableOpacity>
            </View>

            {/* <ScrollView> */}
            <View
                style={{ flex: 1 }}>
                <DraggableFlatList
                    data={steps}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `draggable-item-${item.id}`}
                    onDragEnd={({ data }) => {
                        setSteps(data)
                        steps.sort((a, b) => a.id - b.id)
                    }}
                />
            </View>
            <TouchableOpacity
                style={globalStyles.arrow}
                onPress={cadastraReceita}
            >
                <AntDesign style={{ alignSelf: 'center' }} name='arrowright' size={24} color='white' />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default PassoAPasso;