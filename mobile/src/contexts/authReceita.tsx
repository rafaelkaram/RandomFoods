import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { IMidiaPicker, ICart } from '../constants/interfaces';

interface AuthContextData {
    nomeReceitaContext: string,
    tipoReceitaContext: string,
    categoriasContext: string[],
    minutosContext: string,
    porcoesContext: string,
    midiasContext: IMidiaPicker[],
    ingredientesContext: ICart[],
    itemsContext: number[],
    saveDadosGerais(nomeReceita: string, tipoReceita: string, categorias: string[], minutos: string, porcoes: string, midias: IMidiaPicker[]): Promise<void>,
    saveIngredientes(ingredientes: ICart[], itemsContext: number[]): Promise<void>
}


const AuthReceita = createContext<AuthContextData>({} as AuthContextData)

export const AuthProviderReceita: React.FC = ({ children }) => {

    const [nomeReceitaContext, setNomeReceitaContext] = useState<string>('')
    const [tipoReceitaContext, setTipoReceitaContext] = useState<string>('')
    const [categoriasContext, setCategoriasContext] = useState<string[]>([])
    const [minutosContext, setMinutosContext] = useState<string>('')
    const [porcoesContext, setPorcoesContext] = useState<string>('')
    const [midiasContext, setMidiasContext] = useState<IMidiaPicker[]>([])
    const [ingredientesContext, setIngredientesContext] = useState<ICart[]>([])
    const [itemsContext, setItemsContext] = useState<number[]>([])

    useEffect(() => {
        async function loadStoragedData() {

            const storageNomeReceita = await AsyncStorage.getItem('nomeReceita')
            const storageTipoReceita = await AsyncStorage.getItem('tipoReceita')
            const storageCategorias = await AsyncStorage.getItem('categorias')
            const storageMinutos = await AsyncStorage.getItem('minutos')
            const storagePorcoes = await AsyncStorage.getItem('porcoes')
            const storageMidias = await AsyncStorage.getItem('midias')
            const storageIngredientes = await AsyncStorage.getItem('ingredientes')
            const storageItems = await AsyncStorage.getItem('items')

            if (storageNomeReceita){
                const formatNomeReceita: string = JSON.parse(storageNomeReceita)
                console.log('formatNomeReceita: ' + formatNomeReceita)
                setNomeReceitaContext(formatNomeReceita)
            }

            if (storageTipoReceita){
                const formatTipoReceita: string = JSON.parse(storageTipoReceita)
                console.log('formatTipoReceita: ' + formatTipoReceita)
                setTipoReceitaContext(formatTipoReceita)
            }

            if (storageCategorias) {
                const formatCategorias: string[] = JSON.parse(storageCategorias)
                console.log('formatCategorias: ' + formatCategorias)
                setCategoriasContext(formatCategorias)
            }

            if (storageMinutos){
                const formatMinutos: string = JSON.parse(storageMinutos)
                console.log('formatMinutos: ' + formatMinutos)
                setMinutosContext(formatMinutos)
            }

            if (storagePorcoes){
                const formatPorcoes: string = JSON.parse(storagePorcoes)
                console.log('formatPorcoes: ' + formatPorcoes)
                setPorcoesContext(formatPorcoes)
            }

            if (storageMidias){
                const formatMidias: IMidiaPicker[] = JSON.parse(storageMidias)
                console.log('formatMidias: ' + formatMidias)
                setMidiasContext(formatMidias)
            }

            if (storageIngredientes){
                const formatIngredientes: ICart[] = JSON.parse(storageIngredientes)
                console.log('formatIngredientes: ' + formatIngredientes)
                setIngredientesContext(formatIngredientes)
            }

            if (storageItems){
                const formatItems: number[] = JSON.parse(storageItems)
                console.log('formatItems: ' + formatItems)
                setItemsContext(formatItems)
            }

        }
        loadStoragedData()
    }, [])

    const saveDadosGerais = async (nomeReceita: string, tipoReceita: string, categorias: string[], minutos: string, porcoes: string, midias: IMidiaPicker[]) => {
        AsyncStorage.setItem('nomeReceita', JSON.stringify(nomeReceita))
        AsyncStorage.setItem('tipoReceita', JSON.stringify(tipoReceita))
        AsyncStorage.setItem('categorias', JSON.stringify(categorias))
        AsyncStorage.setItem('minutos', JSON.stringify(minutos))
        AsyncStorage.setItem('porcoes', JSON.stringify(porcoes))
        AsyncStorage.setItem('midias', JSON.stringify(midias))
        console.log('dados da receita salvos no storage')
        setNomeReceitaContext(nomeReceita)
        setTipoReceitaContext(tipoReceita)
        setCategoriasContext(categorias)
        setMinutosContext(minutos)
        setPorcoesContext(porcoes)
        setMidiasContext(midias)
    }

    const saveIngredientes = async (ingredientes: ICart[], items: number[]) => {
        AsyncStorage.setItem('ingredientes', JSON.stringify(ingredientes))
        AsyncStorage.setItem('items', JSON.stringify(items))
        setIngredientesContext(ingredientes)
        setItemsContext(items)
    }

    return (
        <AuthReceita.Provider 
            value={{ 
                nomeReceitaContext, 
                tipoReceitaContext, 
                categoriasContext, 
                minutosContext, 
                porcoesContext, 
                midiasContext,
                ingredientesContext,
                itemsContext,
                saveDadosGerais,
                saveIngredientes
            }}>
            {children}
        </AuthReceita.Provider>

    )
}

export default AuthReceita;