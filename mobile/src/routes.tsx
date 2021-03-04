import React from 'react'
import { Image, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { AntDesign } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import Home from './screens/Home'
import NewRecipe from './screens/NewRecipe'
import Dashboard from './screens/Dashboard'
import Recipe from './screens/Recipe'
import SelectedRecipe from './screens/SelectedRecipe'

import App from '../App'
import SearchRecipe from './screens/SearchRecipe'

const AppStack = createStackNavigator()

const Tab = createBottomTabNavigator();

const Drawer = createDrawerNavigator()


const RecipeStack = () => {
    return (
        <AppStack.Navigator>
            <AppStack.Screen name="Nova Receita" component={NewRecipe} />
            <AppStack.Screen name="Receita" component={Recipe} />
            <AppStack.Screen name="Receita Selecionada" component={SelectedRecipe} />
        </AppStack.Navigator>
    )
}

const HomeStack = () => {
    return (
        <AppStack.Navigator>
            <AppStack.Screen name="Home" component={Home} />
            <AppStack.Screen name="Pesquisar Receitas" component={SearchRecipe} />
            <AppStack.Screen name="Receita" component={Recipe} />
            <AppStack.Screen name="Receita Selecionada" component={SelectedRecipe} />
        </AppStack.Navigator>
    )
}


const UserAccount = () => {
    return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>UserAccount</Text>
        </SafeAreaView>
    )
}

const UserDrawer = () => {
    return (
        <Drawer.Navigator drawerPosition='right'>
            <Drawer.Screen name='Account' component={UserAccount} />
            <Drawer.Screen name='Dashboard' component={Dashboard} />
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