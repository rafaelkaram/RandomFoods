import React, { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import api from '../../services/api';

import colors from '../../constants/colors';
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
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
            <ScrollView>
                <Text>Seja Bem Vindo { usuario?.nome } ({ usuario?.iniciais })!</Text>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Configuracoes;