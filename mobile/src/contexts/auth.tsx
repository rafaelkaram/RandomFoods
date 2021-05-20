import React, { createContext, useState, useEffect, useContext } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import api from '../services/api'
import { IUsuario } from './../constants/interfaces'


interface AuthContextData {
    signed: boolean
    user: IUsuario | null
    signIn(): Promise<void>
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
    }, [])

    //resolver async
    async function signIn() {
        const response = await api.get('/busca/usuario')
            .then(response => {
                setUser(response.data[1]);
                AsyncStorage.setItem('user', JSON.stringify(response.data[1]))
                console.log("Login");

            })
    }

    async function signOut() {
        AsyncStorage.clear().then(() => {
            setUser(null)
            console.log("LogOff");

        })
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>

    )

}

export default AuthContext