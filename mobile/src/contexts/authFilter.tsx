import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-community/async-storage';

interface AuthContextData {
    derivadoLeiteS: boolean
    glutenS: boolean
    categoriasS: string[]
    tiposS: string[]
    saveFilter(derivadoLeite: boolean, gluten: boolean, categorias: string[], tipos: string[]): Promise<void>
    deleteFilter(): void
}

const AuthFilter = createContext<AuthContextData>({} as AuthContextData)

export const AuthProviderFilter: React.FC = ({ children }) => {

    const [derivadoLeiteS, setDerivadoLeiteS] = useState<boolean>(false);
    const [glutenS, setGlutenS] = useState<boolean>(false);
    const [categoriasS, setCategoriasS] = useState<string[]>([])
    const [tiposS, setTiposS] = useState<string[]>([])

    useEffect(() => {
        async function loadStoragedData() {

            const storagedDerivadoLeite = await AsyncStorage.getItem('derivadoLeite')
            const storageGluten = await AsyncStorage.getItem('gluten')
            const storageCategorias = await AsyncStorage.getItem('categorias')
            const storageTipos = await AsyncStorage.getItem('tipos')

            if (storagedDerivadoLeite) {
                const derivadoL: boolean = JSON.parse(storagedDerivadoLeite)
                console.log('Derivado Leite no Storage: ', derivadoL);
                setDerivadoLeiteS(derivadoL)
            }
            if (storageGluten) {
                const glu: boolean = JSON.parse(storageGluten)
                console.log('Gluten no Storage: ', glu);
                setGlutenS(glu)
            }
            if (storageCategorias) {
                const cat: string[] = JSON.parse(storageCategorias)
                console.log('Categorias no Storage: ', cat);
                setCategoriasS(cat)
            }
            if (storageTipos) {
                const tip: string[] = JSON.parse(storageTipos)
                console.log('Tipos no Storage: ', tip);
                setTiposS(tip)
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
        setDerivadoLeiteS(derivadoLeite)
        setGlutenS(gluten)
        setCategoriasS(categorias)
        setTiposS(tipos)
    }

    const deleteFilter = async () => {
        setDerivadoLeiteS(false)
        setGlutenS(false)
        setCategoriasS([])
        setTiposS([])
        console.log("Deletando Filtros");
    }

    return (
        <AuthFilter.Provider value={{ derivadoLeiteS, glutenS, categoriasS, tiposS, saveFilter, deleteFilter }}>
            {children}
        </AuthFilter.Provider>

    )

}

export default AuthFilter;