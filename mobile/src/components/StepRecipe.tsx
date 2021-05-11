import React, { useState } from 'react';

import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from 'react-native-elements'
import { Feather } from '@expo/vector-icons';

import { IPassoReceita } from '../constants/interfaces';

import BoldText from '../components/BoldText';

const StepRecipe = (props: {
    step: IPassoReceita,
    index: number,
    finished: Function,
    removeStep: Function,
    setModal: Function,
    setLast: Function,
    update: Function
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
    // if (step.update){
    //     setDesc(step.descricao)
    // }


    //const ingrediente = props.ingrediente;

    // console.log(ingrediente.nome)
    return (

        <SafeAreaView>
            <View style={styles.component}>
                {/* <BoldText style={{ fontSize: 20 }}>{id + 1}.</BoldText>
                <View style={styles.column}> */}
                {(step.edit) &&
                    <View>
                        <View style={styles.modalHeader}>
                            <BoldText style={{ marginBottom: 10, fontSize: 18 }}>{id + 1}º Passo</BoldText>
                        </View>
                        <View style={styles.divider}></View>

                        <View style={styles.newRow}>
                            <View>

                                <Input
                                    placeholder="Descrição"
                                    multiline={true}
                                    autoFocus
                                    onChangeText={(value) => setDesc(value)}
                                    value={desc? desc:step.descricao}
                                    inputContainerStyle={{ borderBottomWidth: 0, width: 300, height: 100 }}
                                />


                            </View>
                            {/* <TouchableOpacity
                                    onPress={() => {
                                        if (desc) {
                                            finished(id, desc)
                                            setModal(false)
                                        }
                                    }}>
                                    <Feather name="check" size={24} color="green" />
                                </TouchableOpacity> */}
                        </View>
                        <View style={styles.modalFooter}>
                            {/* <View style={styles.divider}></View> */}
                            <View style={{ flexDirection: "row-reverse", marginVertical: 20 }}>
                                <TouchableOpacity style={{ ...styles.actions, backgroundColor: "#21ba45" }}
                                    onPress={() => {
                                        if (desc) {
                                            finished(id, desc)
                                            setModal(false)
                                        }
                                    }}>
                                    <Feather name="check" size={24} color="white" />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ ...styles.actions, backgroundColor: "#db2828" }}
                                    onPress={() => {
                                        setModal(false)
                                        if (!update) {
                                            removeStep(id)
                                        }
                                        setLast(true)
                                    }}>
                                    <BoldText style={{ alignSelf: 'center', color: 'white', fontSize: 18 }}>X</BoldText>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }
                {(!step.edit) &&


                    <View style={styles.newRow}>
                        <BoldText style={{ fontSize: 20 }}>{id + 1}.</BoldText>
                        <Text style={{ width: 260, marginLeft: 20 }}>{step.descricao}</Text>
                        <TouchableOpacity
                            style={{ marginLeft: 15 }}
                            onPress={() => {
                                step.edit = true
                                step.update = true
                                //setDesc(step.descricao)
                                setModal(true)
                                // update(id,step)
                            }
                            }>
                            <Feather name="edit" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ marginLeft: 20 }}
                            onPress={() => removeStep(id)}>
                            <Feather name="trash-2" size={24} color="black" />
                        </TouchableOpacity>



                    </View>
                }

            </View>

            {/* </View> */}

        </SafeAreaView>
    );
}
const Height = Dimensions.get("window").height
const Width = Dimensions.get("window").width;

const styles = StyleSheet.create({
    component: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: 'white',
        borderRadius: 10,
        //borderWidth:1,
        //marginLeft: 10,
        marginRight: 10,
        padding: 10,
    },

    column: {
        marginLeft: 20,
        flexDirection: "row"
    },
    newRow: {
        flexDirection: 'row',
        alignItems: 'center',


    },

    title: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
        backgroundColor: '#634A96',
        padding: 10,
        margin: 10,
        marginBottom: 0,
    },

    inputTitle: {
        backgroundColor: 'white',
        margin: 10,
        padding: 10,

        borderWidth: 1,

    },

    inputDesc: {
        backgroundColor: 'white',
        padding: 10,
        margin: 10,
        marginTop: 1,
        borderWidth: 1,
        height: 250,

    },

    options: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',

    },

    op: {
        borderWidth: 1,
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#634A96',
        borderColor: '#2D0320',
        width: 140,
        marginHorizontal: 10,
        marginTop: 20,
        textAlign: 'center'
    },

    recipeStep: {

        borderRadius: 2,
        padding: 10,
        backgroundColor: '#EBE399',
        marginHorizontal: 10,
        marginVertical: 4,
        borderWidth: 2,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderColor: '#D8A931',

    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "lightgray"
    },
    modalHeader: {
        borderBottomWidth: 1,
        borderColor: "lightgray",
        width: Width * 0.8,
        alignItems: 'center'

    },
    modalFooter: {
        borderTopWidth: 1,
        borderColor: "lightgray",
        width: Width * 0.8,

    },
    actions: {
        borderRadius: 5,
        marginHorizontal: 10,
        // marginVertical:'auto',
        //marginTop:10,
        paddingVertical: 10,
        //paddingHorizontal: 20,
        width: 60,
        alignItems: 'center'
    },


});

export default StepRecipe;