import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

import Home from './pages/Home'
import NewRecipe from './pages/NewRecipe'
import Recipe from './pages/Recipe'
import RecipeSelected from './pages/RecipeSelected'

const AppStack = createStackNavigator()

const Routes = () => {
    return(
    <NavigationContainer>
        <AppStack.Navigator>
            <AppStack.Screen name="Home" component={NewRecipe}/>
            <AppStack.Screen name="Recipe" component={Recipe}/>
            <AppStack.Screen name="RecipeSelected" component={RecipeSelected}/>
        </AppStack.Navigator>
    </NavigationContainer>
    )
}

export default Routes