import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Dimensions, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import BoldText from '../../components/BoldText'
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';


import { IPassoReceita } from '../../constants/interfaces';

import ItalicText from '../../components/ItalicText';
import StepRecipe from '../../components/StepRecipe';

const PassoAPasso = () => {
    const navigation = useNavigation();

    const [load, setLoad] = useState(false);
    const [id, setId] = useState(1);
    const [steps, setSteps] = useState<IPassoReceita[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [lastFinished, setLastFinished] = useState(true);

    const addStep = () => {
        if (lastFinished) {
            setId((oldId) => oldId + 1);
            setSteps([...steps, { id: id, descricao: '', edit: true, update: false }])
            setLastFinished(false)

        }

    }

    const finishedStep = (index: number, descricao: string) => {
        steps.splice(index, 1)
        setSteps([...steps, { id: index + 1, descricao: descricao, edit: false, update: false }])
        setLastFinished(true)
    }

    const updateStep = (id: number, newStep: IPassoReceita) => {
        const stepIndex = steps.findIndex((step, index) => step.id == newStep.id)
        steps.splice(stepIndex, 1)
        steps.push(newStep)
        steps.sort((a, b) => a.id - b.id)
        setLastFinished(true)
    }

    const newUpdate = (stepParam: IPassoReceita) => {
        const stepIndex = steps.findIndex((step) => step.id == stepParam.id)
        steps.splice(stepIndex, 1)
        stepParam.edit = true
        stepParam.update = true
        steps.push(stepParam)
        steps.sort((a, b) => a.id - b.id)
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => { setModalVisible(!modalVisible); }}
            >

                <BlurView intensity={50} style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}>
                    <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                        <View style={styles.modalContainer}>
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
                                            removeStep={(id: number) => removeStep(id)} />
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



    function setLast(last: boolean) {
        setLastFinished(last);
    }

    function removeStep(id: number) {

        const newSteps: IPassoReceita[] = []
        const passos: IPassoReceita[] = steps.filter((step, index) => index !== id)

        passos.map((vetorStep, index) => {
            if (passos.length > 0) {
                const newPasso: IPassoReceita = {
                    id: index + 1,
                    descricao: vetorStep.descricao,
                    edit: false,
                    update: false
                }

                newSteps.push(newPasso)
            }
        })
        setSteps(newSteps)
    }

    // const handleNavigateToIngredients = () => {
    //     if (nomeReceita)
    //         navigation.navigate('Nova Receita Ingredientes');
    // }

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
                    removeStep={(id: number) => removeStep(id)} />
                {/* } */}

            </TouchableOpacity>
        );
    }

    //steps.sort((a, b) => a.id - b.id)
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Image
                style={styles.newRecipeImage}
                source={require('../../assets/nova-receita.png')}
            />
            <ItalicText style={styles.subTitle}>Descreva os passos</ItalicText>

            <View>
                {console.log(steps)}
                {steps.map((step, index) => {

                    return (
                        <View key={step.id }>
                        {(step.edit && !step.update) &&
                        <Modal
                            //key={step.id }
                            animationType="none"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => { setModalVisible(!modalVisible); }}
                        >

                            <BlurView intensity={50} style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}>
                                <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                                    <View style={styles.modalContainer}>
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
                                                        removeStep={(id: number) => removeStep(id)} />
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
                    <Text style={{ color: "white", fontSize: 16 }}>Adicionar passo</Text>
                    <AntDesign style={{ marginLeft: 10 }} name="pluscircleo" size={24} color='white' />
                </TouchableOpacity>

            </View>

            {/* <ScrollView> */}
            <View
                style={{ flex: 1 }}>

                <DraggableFlatList
                    data={steps}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `draggable-item-${item.id}`}
                    onDragEnd={({ data }) => {setSteps(data)
                        steps.sort((a, b) => a.id - b.id)}}
                />

            </View>

        </SafeAreaView >
    );
}

const Height = Dimensions.get("window").height
const Width = Dimensions.get("window").width;

const styles = StyleSheet.create({
    newRecipeImage: {
        width: 320,
        height: 70,
        marginHorizontal: 10
    },
    subTitle: {
        marginBottom: 10,
        textAlign: 'center',
    },

    add: {
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e02041',
        borderRadius: 8,
        height: 40,
        padding: 5,
        margin: 10,
        justifyContent: 'center',
        flexDirection: "row",
    },

    component: {

    }
    ,
    arrow: {
        width: 60,
        height: 60,
        borderRadius: 80,
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: '#e02041',
        justifyContent: 'center',
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
        width: Width * 0.9,
        height: Height * 0.43,
    },

    modalX: {
        backgroundColor: '#e02041',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignSelf: 'flex-end'
    },
    nonBlurredContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "lightgray"
    },
    modalFooter: {
    },
    actions: {
        borderRadius: 5,
        marginHorizontal: 10,
        paddingVertical: 10,
        paddingHorizontal: 20
    },
})

export default PassoAPasso;