import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { IUsuario } from './../constants/interfaces';

interface AuthContextData {
    signed: boolean
    user: IUsuario | null
    signIn(usuario: IUsuario): Promise<void>
    signOut(): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC = ({ children }) => {

    const [user, setUser] = useState<IUsuario | null>(null)

    useEffect(() => {
        async function loadStoragedData() {

            const storagedUser = await AsyncStorage.getItem('user')

            if (storagedUser) {
                const usuario: IUsuario = JSON.parse(storagedUser)
                console.log('Usuário no Storage: ', usuario.nome);
                setUser(usuario)

            }
        }
        loadStoragedData()
    }, []);

    //resolver async
    const signIn = async (usuario: IUsuario) => {
        if (!usuario) {
            throw 'Deu ruim';
        } else {
            AsyncStorage.setItem('user', JSON.stringify(usuario));
            console.log('Login realizado com sucesso');
            setUser(usuario)
        }
    }

    const signOut = async () => {
        await AsyncStorage.clear().then(() => {
            setUser(null);
            console.log("LogOff");
        })
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>

    )

}

export default AuthContext;