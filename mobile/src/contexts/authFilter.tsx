import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

interface AuthContextData {
    derivadoLeiteContext: boolean
    glutenContext: boolean
    categoriasContext: string[]
    tiposContext: string[]
    saveFilter(derivadoLeite: boolean, gluten: boolean, categorias: string[], tipos: string[]): Promise<void>
    deleteFilter(): void
}

const AuthFilter = createContext<AuthContextData>({} as AuthContextData)

export const AuthProviderFilter: React.FC = ({ children }) => {

    const [derivadoLeiteContext, setDerivadoLeiteContext] = useState<boolean>(false);
    const [glutenContext, setGlutenContext] = useState<boolean>(false);
    const [categoriasContext, setCategoriasContext] = useState<string[]>([])
    const [tiposContext, setTiposContext] = useState<string[]>([])

    useEffect(() => {
        const loadStoragedData = async () => {

            const storageDerivadoLeite = await AsyncStorage.getItem('derivadoLeite')
            const storageGluten = await AsyncStorage.getItem('gluten')
            const storageCategorias = await AsyncStorage.getItem('categorias')
            const storageTipos = await AsyncStorage.getItem('tipos')

            if (storageDerivadoLeite) {
                const derivadoL: boolean = JSON.parse(storageDerivadoLeite)
                console.log('Derivado Leite no Storage: ', derivadoL);
                setDerivadoLeiteContext(derivadoL)
            }
            if (storageGluten) {
                const glu: boolean = JSON.parse(storageGluten)
                console.log('Gluten no Storage: ', glu);
                setGlutenContext(glu)
            }
            if (storageCategorias) {
                const cat: string[] = JSON.parse(storageCategorias)
                console.log('Categorias no Storage: ', cat);
                setCategoriasContext(cat)
            }
            if (storageTipos) {
                const tip: string[] = JSON.parse(storageTipos)
                console.log('Tipos no Storage: ', tip);
                setTiposContext(tip)
            }
        }
        loadStoragedData()
    }, []);

    const saveFilter = async (derivadoLeite: boolean, gluten: boolean, categorias: string[], tipos: string[]) => {
        AsyncStorage.setItem('derivadoLeite', JSON.stringify(derivadoLeite));
        AsyncStorage.setItem('gluten', JSON.stringify(gluten));
        AsyncStorage.setItem('categorias', JSON.stringify(categorias));
        AsyncStorage.setItem('tipos', JSON.stringify(tipos));
        console.log('Filtros salvos com sucesso');
        setDerivadoLeiteContext(derivadoLeite)
        setGlutenContext(gluten)
        setCategoriasContext(categorias)
        setTiposContext(tipos)
    }

    const deleteFilter = async () => {
        setDerivadoLeiteContext(false)
        setGlutenContext(false)
        setCategoriasContext([])
        setTiposContext([])
        console.log("Deletando Filtros");
    }

    return (
        <AuthFilter.Provider value={{ derivadoLeiteContext, glutenContext, categoriasContext, tiposContext, saveFilter, deleteFilter }}>
            {children}
        </AuthFilter.Provider>

    )

}

export default AuthFilter;