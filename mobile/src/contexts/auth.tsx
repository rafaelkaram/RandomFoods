import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import { IHeader, IUsuario } from './../constants/interfaces';

interface AuthContextData {
    signed: boolean
    user: IUsuario | undefined,
    headers: IHeader | undefined,
    signIn(usuario: IUsuario): Promise<void>
    signOut(): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC = ({ children }) => {

    const [user, setUser] = useState<IUsuario | undefined>();
    const [headers, setHeaders] = useState<IHeader | undefined>();

    const logaUsuario = (usuario: IUsuario) => {
        setUser(usuario);
        setHeaders({
            'x-access-token': usuario.token
        });
    }

    useEffect(() => {
        const loadStoragedData = async () => {
            const storagedUser = await AsyncStorage.getItem('user');

            if (storagedUser) {
                const usuario: IUsuario = JSON.parse(storagedUser);
                console.log('Usuário no Storage: ', usuario.nome);
                logaUsuario(usuario);
            }
        }
        loadStoragedData();
    }, []);

    //resolver async
    const signIn = async (usuario: IUsuario) => {
        if (!usuario) {
            throw 'Deu ruim';
        } else {
            AsyncStorage.setItem('user', JSON.stringify(usuario));
            console.log('Login realizado com sucesso');
            logaUsuario(usuario);
        }
    }

    const signOut = async () => {
        await AsyncStorage.clear().then(() => {
            console.log('LogOff');
            setUser(undefined);
            setHeaders(undefined);
        });
    }

    return (
        <AuthContext.Provider value={{ signed: !!user, user, headers, signIn, signOut }}>
            { children }
        </AuthContext.Provider>
    );
}

export default AuthContext;