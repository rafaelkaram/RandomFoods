import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import api from '../../services/api'

import Colors from '../../constants/colors';
import { IUsuario } from '../../constants/interfaces';

import Loading from '../../components/Loading';

const Configuracoes = () => {

    const [ usuario, setUsuario ] = useState<IUsuario>();
    const [ load, setLoad ] = useState<boolean>(false);

    useEffect(() => {
        api.get(`busca/usuario`).then(response => {
            setUsuario(response.data[0]);
            setLoad(true);
        });

    }, [ usuario ])

    if(!load) return <Loading />

    return (
        <SafeAreaView style={styles.main}>
            <ScrollView>
                <Text>Seja Bem Vindo { usuario?.nome } ({ usuario?.iniciais })!</Text>
            </ScrollView>
        </SafeAreaView>
    )
}

const chartHeight = Dimensions.get("window").height * 0.5;
const chartWidth = Dimensions.get("window").width;



const styles = StyleSheet.create({

    main: {
        flex: 1,
        backgroundColor: Colors.background
    },

    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 15,
    },

    mainTitle: {
        textAlign: 'left',
        color: "#f87062",
        fontFamily: 'Ubuntu_700Bold',
        padding: 15,
        fontSize: 24,
        textShadowColor: 'black',
        textShadowRadius: 1,
        textShadowOffset: {
            width: 1,
            height: 1
        },
    },

    totalRecipes: {
        alignItems: 'center',
        marginHorizontal: 15,
        backgroundColor: 'white',
        borderRadius: 20
    },

    totalRecipesTitle: {
        fontFamily: 'Oswald_300Light',
        fontSize: 20,
        margin: 5,
    },

    totalRecipesText: {
        fontFamily: 'Oswald_300Light',
        fontSize: 20,
        margin: 5,
        fontWeight: 'bold'
    },

    chartsTitle: {
        paddingTop: 5,
        paddingLeft: 5,
        fontFamily: 'Ubuntu_500Medium_Italic',
        color: "#f87062",
        alignSelf: 'flex-start',
        textShadowColor: 'black',
        textShadowRadius: 0.5,
        textShadowOffset: {
            width: 0.5,
            height: 0.5
        },
    },

    pieContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        margin: 15,
    },

    typePie: {
        maxWidth: ((chartWidth / 2) - 20),
        maxHeight: (chartHeight - 120),
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        marginRight: 10
    },

    categoryPie: {
        maxWidth: ((chartWidth / 2) - 20),
        maxHeight: (chartHeight - 120),
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15
    },

    tableTitle: {
        textAlign: 'center',
    },

    topVotedTable: {
        marginHorizontal: 20,
        backgroundColor: "white",
        borderRadius: 10,
        marginTop: 10
    }

})

export default Configuracoes;