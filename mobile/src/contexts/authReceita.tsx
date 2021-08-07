import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { IAuthContextData, IMidiaPicker, ICart, IIngredienteCadastro, IPassoReceita } from '../constants/interfaces';

const AuthReceita = createContext<IAuthContextData>({} as IAuthContextData);

export const AuthProviderReceita: React.FC = ({ children }) => {

    const [nomeReceitaContext, setNomeReceitaContext] = useState<string>('');
    const [tipoReceitaContext, setTipoReceitaContext] = useState<string>('');
    const [categoriasContext, setCategoriasContext] = useState<string[]>([]);
    const [minutosContext, setMinutosContext] = useState<string>('');
    const [porcoesContext, setPorcoesContext] = useState<string>('');
    const [midiasContext, setMidiasContext] = useState<IMidiaPicker[]>([]);
    const [ingredientesContext, setIngredientesContext] = useState<ICart[]>([]);
    const [itemsContext, setItemsContext] = useState<number[]>([]);
    const [ingredientesQuantidadeContext, setIngredientesQuantidadeContext] = useState<IIngredienteCadastro[]>([]);
    const [stepsContext, setStepsContext] = useState<IPassoReceita[]>([]);

    useEffect(() => {
        async function loadStoragedData() {

            // Dados Gerais
            const storageNomeReceita = await AsyncStorage.getItem('nomeReceita');
            const storageTipoReceita = await AsyncStorage.getItem('tipoReceita');
            const storageCategorias = await AsyncStorage.getItem('categorias');
            const storageMinutos = await AsyncStorage.getItem('minutos');
            const storagePorcoes = await AsyncStorage.getItem('porcoes');
            const storageMidias = await AsyncStorage.getItem('midias');

            // Ingredientes
            const storageIngredientes = await AsyncStorage.getItem('ingredientes');
            const storageItems = await AsyncStorage.getItem('items');

            // Quantidades
            const storageIngredientesQuantidade = await AsyncStorage.getItem('ingredientesQuantidade');

            // Passo a Passo
            const storageSteps = await AsyncStorage.getItem('steps');

            if (storageNomeReceita){
                const formatNomeReceita: string = JSON.parse(storageNomeReceita);
                setNomeReceitaContext(formatNomeReceita);
            }

            if (storageTipoReceita){
                const formatTipoReceita: string = JSON.parse(storageTipoReceita);
                setTipoReceitaContext(formatTipoReceita);
            }

            if (storageCategorias) {
                const formatCategorias: string[] = JSON.parse(storageCategorias);
                setCategoriasContext(formatCategorias);
            }

            if (storageMinutos) {
                const formatMinutos: string = JSON.parse(storageMinutos);
                setMinutosContext(formatMinutos);
            }

            if (storagePorcoes) {
                const formatPorcoes: string = JSON.parse(storagePorcoes);
                setPorcoesContext(formatPorcoes);
            }

            if (storageMidias) {
                const formatMidias: IMidiaPicker[] = JSON.parse(storageMidias);
                setMidiasContext(formatMidias);
            }

            if (storageIngredientes) {
                const formatIngredientes: ICart[] = JSON.parse(storageIngredientes);
                setIngredientesContext(formatIngredientes);
            }

            if (storageItems) {
                const formatItems: number[] = JSON.parse(storageItems);
                setItemsContext(formatItems);
            }

            if (storageIngredientesQuantidade) {
                const formatIngredientesQuantidade: IIngredienteCadastro[] = JSON.parse(storageIngredientesQuantidade);
                setIngredientesQuantidadeContext(formatIngredientesQuantidade);
            }

            if (storageSteps) {
                const formatSteps: IPassoReceita[] = JSON.parse(storageSteps);
                setStepsContext(formatSteps);
            }

            console.log({
                nomeReceitaContext,
                tipoReceitaContext,
                categoriasContext,
                minutosContext,
                porcoesContext,
                midiasContext,
                ingredientesContext,
                itemsContext,
                ingredientesQuantidadeContext,
                stepsContext
            });
        }
        loadStoragedData();
    }, []);

    const saveDadosGerais = async (nomeReceita: string, tipoReceita: string, categorias: string[], minutos: string, porcoes: string, midias: IMidiaPicker[]) => {
        AsyncStorage.setItem('nomeReceita', JSON.stringify(nomeReceita))
        AsyncStorage.setItem('tipoReceita', JSON.stringify(tipoReceita))
        AsyncStorage.setItem('categorias', JSON.stringify(categorias))
        AsyncStorage.setItem('minutos', JSON.stringify(minutos))
        AsyncStorage.setItem('porcoes', JSON.stringify(porcoes))
        AsyncStorage.setItem('midias', JSON.stringify(midias))
        console.log('Dados da receita salvos no storage')
        setNomeReceitaContext(nomeReceita)
        setTipoReceitaContext(tipoReceita)
        setCategoriasContext(categorias)
        setMinutosContext(minutos)
        setPorcoesContext(porcoes)
        setMidiasContext(midias)
    }

    const saveIngredientes = async (ingredientes: ICart[], items: number[]) => {
        AsyncStorage.setItem('ingredientes', JSON.stringify(ingredientes));
        AsyncStorage.setItem('items', JSON.stringify(items));
        setIngredientesContext(ingredientes);
        setItemsContext(items);
    }

    const saveIngredientesQuantidade = async (ingredientesQuantidade: IIngredienteCadastro[]) => {
        AsyncStorage.setItem('ingredientesQuantidade', JSON.stringify(ingredientesQuantidade));
        setIngredientesQuantidadeContext(ingredientesQuantidade);
    }

    const saveSteps = async (steps: IPassoReceita[]) => {
        AsyncStorage.setItem('steps', JSON.stringify(steps));
        setStepsContext(steps);
    }

    const deleteItems = async () => {
        const arrItems = ['nomeReceita', 'tipoReceita', 'categorias', 'minutos', 'porcoes', 'midias', 'ingredientes', 'items', 'ingredientesQuantidade', 'steps' ]
        AsyncStorage.multiRemove(arrItems);
        setNomeReceitaContext('');
        setTipoReceitaContext('');
        setCategoriasContext([]);
        setMinutosContext('');
        setPorcoesContext('');
        setMidiasContext([]);
        setIngredientesContext([]);
        setItemsContext([]);
        setIngredientesQuantidadeContext([]);
        setStepsContext([]);
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
                ingredientesQuantidadeContext,
                stepsContext,
                saveDadosGerais,
                saveIngredientes,
                saveIngredientesQuantidade,
                saveSteps,
                deleteItems,
            }}>
            {children}
        </AuthReceita.Provider>

    )
}

export default AuthReceita;