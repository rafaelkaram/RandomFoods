import React, { useContext } from 'react';
import { Image, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AuthContext, { AuthProvider } from './contexts/auth';
import { AuthProviderFilter } from './contexts/authFilter';
import { AuthProviderReceita } from './contexts/authReceita';
import { Ionicons } from '@expo/vector-icons';

import Home from './screens/visualizacao/Home';
import DadosGerais from './screens/cadastro/DadosGerais';
import Ingredientes from './screens/cadastro/Ingredientes';
import Quantidades from './screens/cadastro/Quantidades';
import Configuracoes from './screens/usuario/Configuracoes';
import ResultadoPesquisa from './screens/visualizacao/ResultadoPesquisa';
import Receita from './screens/visualizacao/Receita';
import Receita2 from './screens/visualizacao/Receita';
import Login from './screens/usuario/Login';
import Painel from './screens/usuario/Painel';
import Perfil from './screens/usuario/Perfil';
import Seguidores from './screens/usuario/Seguidores';
import Filtro from './screens/visualizacao/Filtro';
import PassoAPasso from './screens/cadastro/PassoAPasso';
import Usuario from './screens/cadastro/Usuario';

import screens from './constants/screens';

import DrawerMenu from './components/DrawerMenu';

const AppStack = createStackNavigator()
const Tab = createBottomTabNavigator()
const Drawer = createDrawerNavigator()



const RecipeStack = () => {
    return (
        <AppStack.Navigator headerMode={'none'}>
            <AppStack.Screen name={screens.cadastroReceita} component={DadosGerais} />
            <AppStack.Screen name={screens.cadastroIngredientes} component={Ingredientes} />
            <AppStack.Screen name={screens.cadastroQuantidades} component={Quantidades} />
            <AppStack.Screen name={screens.cadastroPassos} component={PassoAPasso} />
            <AppStack.Screen name={screens.resultadoPesquisa} component={ResultadoPesquisa} />
            <AppStack.Screen name={screens.receita} component={Receita} />
        </AppStack.Navigator>
    )
}

const HomeStack = () => {
    return (
        <AppStack.Navigator headerMode={'none'}>
            <AppStack.Screen name={screens.home} component={Home} />
            <AppStack.Screen name={screens.resultadoPesquisa} component={ResultadoPesquisa} />
            <AppStack.Screen name={screens.receita} component={Receita} />
            <AppStack.Screen name={screens.perfil} component={Perfil} />
            <AppStack.Screen name={screens.receita2} component={Receita2} />
        </AppStack.Navigator>
    )
}

const PesquisaStack = () => {
    return (
        <AppStack.Navigator headerMode={'none'}>
            <AppStack.Screen name={screens.filtro} component={Filtro} />
            <AppStack.Screen name={screens.resultadoPesquisa} component={ResultadoPesquisa} />
            <AppStack.Screen name={screens.receita} component={Receita} />
            <AppStack.Screen name={screens.perfil} component={Perfil} />
            <AppStack.Screen name={screens.receita2} component={Receita2}  />
        </AppStack.Navigator>
    )
}


const UserDrawerStack = () => {

    return (
        <AppStack.Navigator headerMode={'none'}>
            <AppStack.Screen name={screens.painel} component={Painel} />
            <AppStack.Screen name={screens.perfil} component={Perfil} />
            <AppStack.Screen name={screens.seguidores} component={Seguidores} />
            <AppStack.Screen name={screens.receita} component={Receita} />
            <AppStack.Screen name={screens.configuracoes} component={Configuracoes} />
        </AppStack.Navigator>
    )

}

const UserStack = () => {

    const { signed } = useContext(AuthContext)

    if (!signed) {
        return (
            <AppStack.Navigator headerMode={'none'}>
                <AppStack.Screen name={screens.login} component={Login} />
                <AppStack.Screen name={screens.cadastroUsuario} component={Usuario} />
            </AppStack.Navigator>
        )
    } else {
        return (
            <AuthProviderReceita>
                <Drawer.Navigator drawerPosition='right' drawerContent={props => <DrawerMenu {...props} />} >
                    <Drawer.Screen name='Perfil' component={UserDrawerStack} options={{
                        drawerIcon: () => <Ionicons name='person-outline' size={24} color='black' />,
                        drawerLabel: () => <Text style={{ color: 'black', right: 20 }}>Perfil</Text>
                    }} />
                    <Drawer.Screen name='Nova Receita' component={RecipeStack} options={{
                        drawerIcon: () => <Image style={{ width: 26, height: 26, right: 1 }} source={require('./assets/new-recipe-icon.png')} />,
                        drawerLabel: () => <Text style={{ color: 'black', right: 20 }}>Nova Receita</Text>
                    }} />
                </Drawer.Navigator>
            </AuthProviderReceita>

        )
    }
}

const Routes = () => {
    return (
        <>
            <NavigationContainer >
                <AuthProvider>
                    <AuthProviderFilter>
                        <Tab.Navigator>
                            <Tab.Screen
                                options={{
                                    tabBarLabel: 'Home',
                                    tabBarIcon: ({ color, size }) => (
                                        <MaterialCommunityIcons name='home' color={color} size={size} />
                                    ),
                                }}
                                name='HomeStack'
                                component={HomeStack}
                            />
                            <Tab.Screen
                                options={{
                                    tabBarLabel: 'Pesquisar Receitas',
                                    tabBarIcon: () => (
                                        <Image
                                            style={{ width: 32, height: 25 }}
                                            source={require('../assets/chapeu.png')} />
                                    ),
                                }}
                                name='Search'
                                component={PesquisaStack}
                            />
                            <Tab.Screen
                                options={{
                                    tabBarLabel: 'Perfil',
                                    tabBarIcon: ({ color, size }) => (
                                        <AntDesign name='user' color={color} size={size} />
                                    ),
                                }}
                                name='User'
                                component={UserStack}
                            />
                        </Tab.Navigator>
                    </AuthProviderFilter>
                </AuthProvider>
            </NavigationContainer>
        </>
    )
}

export default Routes;