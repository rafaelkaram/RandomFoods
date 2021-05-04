import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { IPassoReceita } from '../../constants/interfaces';

import ItalicText from '../../components/ItalicText';
import StepRecipe from '../../components/StepRecipe';

// const NewStep = () => {

//     return (
//         <View>
//             <Input
//                 placeholder="Titulo"
//                 onChangeText={(value) => setTitulo(value)}
//                 value={titulo}
//                 inputContainerStyle={{ borderBottomWidth: 0, marginTop: 10 }}
//             />
//             <Input
//                 placeholder="Descrição"
//                 onChangeText={(value) => setDesc(value)}
//                 value={desc}
//                 inputContainerStyle={{ borderBottomWidth: 0, marginTop: 10 }}
//             />

//             <TouchableOpacity
//                 style={styles.add}
//                 onPress={() => addStep(titulo, desc)}
//             >
//                 Confirmar
//             </TouchableOpacity>
//         </View>
//     );

// }
const PassoAPasso = () => {
    const navigation = useNavigation();

    const [load, setLoad] = useState(false);
    const [steps, setSteps] = useState<IPassoReceita[]>([]);
    const [titulo, setTitulo] = useState('');
    const [desc, setDesc] = useState('');
    const [edit, setEdit] = useState(true);

    const addStep = () => {
        setSteps([...steps, { descricao: '', edit: true }])
    }

    const finishedStep = (index: number, descricao: string) => {

        steps.splice(index - 1, 1)
        setSteps([...steps, { descricao: descricao, edit: false }])

    }

    // const handleNavigateToIngredients = () => {
    //     if (nomeReceita)
    //         navigation.navigate('Nova Receita Ingredientes');
    // }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Image
                style={styles.newRecipeImage}
                source={require('../../assets/nova-receita.png')}
            />
            <ItalicText style={styles.subTitle}>Descreva os passos</ItalicText>

            <View>

                <TouchableOpacity
                    style={styles.add}
                    onPress={() => {
                        addStep()
                    }}
                >
                    <Text>Novo passo</Text>
                </TouchableOpacity>
            </View>
            <ScrollView>
                {steps.map((step, index) => {
                    return (
                        <View
                            key={index}>
                            <StepRecipe step={step} index={index} finished={(index: number, desc: string) => { finishedStep(index, desc) }} />
                        </View>
                    )
                })}
            </ScrollView>
            {/* <TouchableOpacity
                style={styles.arrow}
                onPress={handleNavigateToIngredients}
            >
                <AntDesign style={{ alignSelf: 'center' }} name="arrowright" size={24} color="white" />
            </TouchableOpacity> */}

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


})

export default PassoAPasso;