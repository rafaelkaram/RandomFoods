import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { IMidiaPicker } from '../constants/interfaces';

interface AuthContextData {
    nomeReceitaContext: string,
    tipoReceitaContext: string,
    minutosContext: string,
    porcoesContext: string,
    midiasContext: IMidiaPicker[],
    saveDadosGerais(nomeReceita: string, tipoReceita: string, minutos: string, porcoes: string, midias: IMidiaPicker[]): Promise<void>
}


const AuthReceita = createContext<AuthContextData>({} as AuthContextData)

export const AuthProviderReceita: React.FC = ({ children }) => {
    const [nomeReceitaContext, setNomeReceitaContext] = useState<string>('')
    const [tipoReceitaContext, setTipoReceitaContext] = useState<string>('')
    const [minutosContext, setMinutosContext] = useState<string>('')
    const [porcoesContext, setPorcoesContext] = useState<string>('')
    const [midiasContext, setMidiasContext] = useState<IMidiaPicker[]>([]);

    useEffect(() => {
        async function loadStoragedData() {

            const storageNomeReceita = await AsyncStorage.getItem('nomeReceita')
            const storageTipoReceita = await AsyncStorage.getItem('tipoReceita')
            const storageMinutos = await AsyncStorage.getItem('minutos')
            const storagePorcoes = await AsyncStorage.getItem('porcoes')
            const storageMidias = await AsyncStorage.getItem('midias')

            if (storageNomeReceita){
                const formatNomeReceita: string = JSON.parse(storageNomeReceita)
                console.log('setou: ' + formatNomeReceita)
                setNomeReceitaContext(formatNomeReceita)
            }

            if (storageTipoReceita){
                const formatTipoReceita: string = JSON.parse(storageTipoReceita)
                console.log('setou: ' + formatTipoReceita)
                setTipoReceitaContext(formatTipoReceita)
            }

            if (storageMinutos){
                const formatMinutos: string = JSON.parse(storageMinutos)
                console.log('setou: ' + formatMinutos)
                setMinutosContext(formatMinutos)
            }

            if (storagePorcoes){
                const formatPorcoes: string = JSON.parse(storagePorcoes)
                console.log('setou: ' + formatPorcoes)
                setPorcoesContext(formatPorcoes)
            }

            if (storageMidias){
                const formatMidias: IMidiaPicker[] = JSON.parse(storageMidias)
                console.log('setou: ' + formatMidias)
                setMidiasContext(formatMidias)
            }

        }
        loadStoragedData()
    }, [])

    const saveDadosGerais = async (nomeReceita: string, tipoReceita: string, minutos: string, porcoes: string, midias: IMidiaPicker[]) => {
        AsyncStorage.setItem('nomeReceita', JSON.stringify(nomeReceita))
        AsyncStorage.setItem('tipoReceita', JSON.stringify(tipoReceita))
        AsyncStorage.setItem('minutos', JSON.stringify(minutos))
        AsyncStorage.setItem('porcoes', JSON.stringify(porcoes))
        AsyncStorage.setItem('midias', JSON.stringify(midias))
        console.log('dados da receita salvos no storage')
        setNomeReceitaContext(nomeReceita)
        setTipoReceitaContext(tipoReceita)
        setMinutosContext(minutos)
        setPorcoesContext(porcoes)
        setMidiasContext(midias)
    }

    return (
        <AuthReceita.Provider value={{ nomeReceitaContext, tipoReceitaContext, minutosContext, porcoesContext, midiasContext, saveDadosGerais }}>
            {children}
        </AuthReceita.Provider>

    )
}

export default AuthReceita;