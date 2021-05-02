import React from 'react';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Home from './screens/visualizacao/Home';
import DadosGerais from './screens/cadastro/DadosGerais';
import Ingredientes from './screens/cadastro/Ingredientes';
import Quantidades from './screens/cadastro/Quantidades';
import Configuracoes from './screens/usuario/Configuracoes';
import ResultadoPesquisa from './screens/visualizacao/ResultadoPesquisa';
import Receita from './screens/visualizacao/Receita';
import Login from './screens/usuario/Login';
import Painel from './screens/usuario/Painel';
import Filtro from './screens/visualizacao/Filtro';
import PassoAPasso from './screens/cadastro/PassoAPasso';

import screens from './constants/screens';

const AppStack = createStackNavigator()
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator()

const RecipeStack = () => {
    return (
        <AppStack.Navigator headerMode={ 'none' }>
            <AppStack.Screen name={ screens.cadastroReceita } component={ DadosGerais } />
            <AppStack.Screen name={ screens.cadastroIngredientes } component={ Ingredientes } />
            <AppStack.Screen name={ screens.cadastroQuantidades } component={ Quantidades } />
            <AppStack.Screen name={ screens.cadastroPassos } component={ PassoAPasso } />
            <AppStack.Screen name={ screens.resultadoPesquisa } component={ ResultadoPesquisa } />
            <AppStack.Screen name={ screens.receita } component={ Receita } />
        </AppStack.Navigator>
    )
}

const HomeStack = () => {
    return (
        <AppStack.Navigator headerMode={'none'}>
            <AppStack.Screen name={ screens.home } component={ Home } />
            <AppStack.Screen name={ screens.filtro } component={ Filtro } />
            <AppStack.Screen name={ screens.resultadoPesquisa } component={ ResultadoPesquisa } />
            <AppStack.Screen name={ screens.receita } component={ Receita } />
        </AppStack.Navigator>
    )
}


/*const UserAccount = () => {
    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>UserAccount</Text>
        </SafeAreaView>
    )
}*/

const UserDrawer = () => {
    return (
        <Drawer.Navigator drawerPosition='right'>
            <Drawer.Screen name={ screens.login } component={ Login } />
            <Drawer.Screen name={ screens.painel } component={ Painel } />
            <Drawer.Screen name={ screens.configuracoes } component={ Configuracoes } />
        </Drawer.Navigator>
    )
}

const Routes = () => {
    return (
        <NavigationContainer >
            <Tab.Navigator>
                <Tab.Screen
                    options={{
                        tabBarLabel: 'Home',
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="home" color={color} size={size} />
                        ),
                    }}
                    name="HomeStack"
                    component={HomeStack} />

                <Tab.Screen
                    options={{
                        tabBarLabel: 'NewRecipe',
                        tabBarIcon: () => (
                            <Image
                                style={{ width: 32, height: 25 }}
                                source={require('../assets/chapeu.png')} />
                        ),
                    }}
                    name="NewRecipe"
                    component={RecipeStack} />
                <Tab.Screen
                    options={{
                        tabBarLabel: 'User',
                        tabBarIcon: ({ color, size }) => (
                            <AntDesign name="user" color={color} size={size} />
                        ),
                    }}
                    name="User"
                    component={UserDrawer} />
            </Tab.Navigator>
        </NavigationContainer>
    )
}

export default Routes