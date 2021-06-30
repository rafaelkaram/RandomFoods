import React, { useState } from 'react';

import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from 'react-native-elements'
import { Feather } from '@expo/vector-icons';

import { IPassoReceita } from '../constants/interfaces';

import styles from '../styles/components/StepRecipe';
import globalStyles from '../styles/Global';

const StepRecipe = (props: {
    step: IPassoReceita,
    index: number,
    finished: Function,
    removeStep: Function,
    setModal: Function,
    setLast: Function,
    update: Function,
    newUpdate: Function

}) => {

    const [textTitle, setTextTitle] = useState<string>('');
    const [desc, setDesc] = useState<string>('');
    const [edit, setEdit] = useState<boolean>(true)
    const step = props.step;
    const id = props.index;
    const finished = props.finished;
    const removeStep = props.removeStep;
    const setModal = props.setModal;
    const setLast = props.setLast;
    const update = props.update;
    const newUpdate = props.newUpdate;


    return (
        <SafeAreaView>
            <View style={ styles.component }>
                { (step.edit) &&
                    <View>
                        <View style={ styles.modalHeader }>
                            <Text style={{ ...globalStyles.boldText, marginBottom: 10, fontSize: 18 }}>{ id + 1 }º Passo</Text>
                        </View>
                        <View style={ styles.divider }></View>
                        <View style={ styles.newRow }>
                            <View>
                                <Input
                                    placeholder='Descrição'
                                    multiline={ true }
                                    autoFocus
                                    onChangeText={ (value) => setDesc(value) }
                                    value={ desc ? desc : step.descricao }
                                    inputContainerStyle={{ borderBottomWidth: 0, width: 300, height: 100 }}
                                />
                            </View>

                        </View>
                        <View style={ styles.modalFooter }>
                            <View style={{ flexDirection: 'row-reverse', marginVertical: 20 }}>
                                <TouchableOpacity style={{ ...styles.actions, backgroundColor: '#21ba45' }}
                                    onPress={() => {
                                        if (desc) {
                                            if (step.update) {
                                                step.edit = false
                                                step.update = false
                                                step.descricao = desc
                                                update(step.id, step)
                                            } else {
                                                finished(id, desc)
                                            }
                                            setModal(false)
                                        }
                                    }}>
                                    <Feather name='check' size={24} color='white' />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ ...styles.actions, backgroundColor: '#db2828' }}
                                    onPress={() => {
                                        if (!step.update) {
                                            removeStep(id)
                                        } else {
                                            step.edit = false
                                            step.update = false
                                        }
                                        setModal(false)
                                        setLast(true)
                                    }}>
                                    <Text style={{ ...globalStyles.boldText, alignSelf: 'center', color: 'white', fontSize: 18 }}>X</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }
                { (!step.edit) &&
                    <View style={ styles.newRow }>
                        <Text style={{ ...globalStyles.boldText, fontSize: 20 }}>{ id + 1 }.</Text>
                        <Text style={{ width: 260, marginLeft: 20 }}>{ step.descricao }</Text>
                        <TouchableOpacity
                            style={{ marginLeft: 15 }}
                            onPress={() => {
                                newUpdate(step)
                                setModal(true)
                            }}
                        >
                            <Feather name='edit' size={24} color='black' />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginLeft: 20 }}
                            onPress={ () => removeStep(id) }>
                            <Feather name='trash-2' size={24} color='black' />
                        </TouchableOpacity>
                    </View>
                }
            </View>
        </SafeAreaView>
    );
}

export default StepRecipe;