import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Dimensions, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AntDesign } from '@expo/vector-icons';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { BlurView } from 'expo-blur';

import styles from '../../styles/screens/PassoAPasso';
import globalStyles from '../../styles/Global';
import { IPassoReceita } from '../../constants/interfaces';

import StepRecipe from '../../components/StepRecipe';

const PassoAPasso = () => {
    const [id, setId] = useState(1);
    const [steps, setSteps] = useState<IPassoReceita[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [lastFinished, setLastFinished] = useState(true);

    const addStep = () => {
        if (lastFinished) {
            setId((oldId) => oldId + 1);
            setSteps([ ...steps, { id: id, descricao: '', edit: true, update: false } ]);
            setLastFinished(false);
        }
    }

    const finishedStep = (index: number, descricao: string) => {
        steps.splice(index, 1);
        setSteps([ ...steps, { id: index + 1, descricao: descricao, edit: false, update: false } ]);
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
                transparent={ true }
                visible={ modalVisible }
                onRequestClose={() => { setModalVisible(!modalVisible); }}
            >
                <BlurView intensity={50} style={[ StyleSheet.absoluteFill, styles.nonBlurredContent ]}>
                    <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                        <View style={ globalStyles.modalContainer }>
                            <ScrollView >
                                    <View >
                                        <StepRecipe
                                            step={ stepParam }
                                            index={ stepParam.id }
                                            setModal={ (modalVisible: boolean) => setModal(modalVisible) }
                                            setLast={ (lastFinished: boolean) => setLast(lastFinished) }
                                            newUpdate={ (stepParam: IPassoReceita) => newUpdate(stepParam) }
                                            finished={ (id: number, desc: string) => { finishedStep(id, desc) }}
                                            update={ (index: number, step: IPassoReceita) => { updateStep(index, step) }}
                                            removeStep={ (id: number) => removeStep(id) } />
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

    
    const vaiPraAlgumLugar = () => {
        console.log('opaaa')
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
                key={ item.id } style={ styles.component }
                onLongPress={ drag }>
                {/* {(!item.edit) && */}
                <StepRecipe
                    step={ item }
                    index={ index }
                    setModal={ (modalVisible: boolean) => setModal(modalVisible) }
                    setLast={ (lastFinished: boolean) => setLast(lastFinished) }
                    newUpdate={ (stepParam: IPassoReceita) => newUpdate(stepParam) }
                    update={ (index: number, step: IPassoReceita) => { updateStep(index, step) }}
                    finished={ (index: number, desc: string) => { finishedStep(index, desc) }}
                    removeStep={ (id: number) => removeStep(id) } />
                {/* } */}
            </TouchableOpacity>
        );
    }

    //steps.sort((a, b) => a.id - b.id)
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Image
                style={ globalStyles.recipeImage }
                source={ require('../../assets/nova-receita.png') }
            />
            <Text style={[ globalStyles.subTitleText, globalStyles.subTitle ]}>Descreva os passos</Text>

            <View>
                { console.log(steps) }
                { steps.map((step, index) => {
                    return (
                        <View key={ step.id }>
                        { (step.edit && !step.update) &&
                        <Modal
                            //key={step.id }
                            animationType='none'
                            transparent={ true }
                            visible={ modalVisible }
                            onRequestClose={() => { setModalVisible(!modalVisible); }}
                        >

                            <BlurView intensity={50} style={[ StyleSheet.absoluteFill, styles.nonBlurredContent ]}>
                                <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                                    <View style={ globalStyles.modalContainer }>
                                        <ScrollView >
                                            { (step.edit && !step.update) &&
                                                <View >
                                                    <StepRecipe
                                                        step={ step }
                                                        index={ index }
                                                        setModal={ (modalVisible: boolean) => setModal(modalVisible) }
                                                        setLast={ (lastFinished: boolean) => setLast(lastFinished) }
                                                        newUpdate={ (stepParam: IPassoReceita) => newUpdate(stepParam) }
                                                        finished={ (id: number, desc: string) => { finishedStep(id, desc) }}
                                                        update={ (index: number, step: IPassoReceita) => { updateStep(index, step) }}
                                                        removeStep={ (id: number) => removeStep(id) } />
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
                    style={ styles.add }
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
                    data={ steps }
                    renderItem={ renderItem }
                    keyExtractor={ (item, index) => `draggable-item-${item.id}` }
                    onDragEnd={ ({ data }) => {
                        setSteps(data)
                        steps.sort((a, b) => a.id - b.id)
                    }}
                />
            </View>
            <TouchableOpacity
                style={globalStyles.arrow}
                onPress={vaiPraAlgumLugar}
            >
                <AntDesign style={{ alignSelf: 'center' }} name='arrowright' size={24} color='white' />
            </TouchableOpacity>
        </SafeAreaView>
    );
}

export default PassoAPasso;