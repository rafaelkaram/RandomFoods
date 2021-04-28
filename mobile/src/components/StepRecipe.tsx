import React, { useEffect, useState, useContext } from 'react';

import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from 'react-native-elements'
import { IIngrediente, IRecipeStep } from '../constants/interfaces';
import CheckBox from '@react-native-community/checkbox';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import BoldText from '../components/BoldText'
import { Feather } from '@expo/vector-icons';

import { Ionicons } from '@expo/vector-icons';

const StepRecipe = (props: { steps: IRecipeStep, index: number, finished:any }) => {


    const [textTitle, setTextTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [edit, setEdit] = useState(true)
    const step = props.steps;
    const finished = props.finished;



    //const ingrediente = props.ingrediente;



    // console.log(ingrediente.nome)
    return (

        <SafeAreaView
            key={step.id}>
            <View style={styles.component}>
                <BoldText>{step.id}.</BoldText>
                <View style={styles.column}>
                    {(step.edit) &&
                        <View>
                            <Input
                                placeholder="Descrição"
                                onChangeText={(value) => setDesc(value)}
                                value={desc}
                                inputContainerStyle={{ borderBottomWidth: 0, marginTop: 10, width: 280 }}
                            />

                        </View>
                    }
                    {(!step.edit) &&
                        <View>
                            <Text>{step.descricao}</Text>
                        </View>
                    }

                </View>
                {(step.edit) &&
                    <TouchableOpacity
                        onPress={() => {
                            finished(step.id,desc)
                        }}>
                        <Feather name="check" size={24} color="green" />
                    </TouchableOpacity>
                }

            </View>

        </SafeAreaView>


    );
}

const styles = StyleSheet.create({
    component: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: 'white',
        borderRadius: 10,
        marginLeft: 10,
        marginRight: 10,
        padding: 10,
    },
    column: {
        marginLeft: 20,
        flexDirection: "column"
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

});

export default StepRecipe;