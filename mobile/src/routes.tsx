import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator} from '@react-navigation/stack'

import Home from './pages/Home'
import NewRecipe from './pages/NewRecipe'

const AppStack = createStackNavigator()

const Routes = () => {
    return(
    <NavigationContainer>
        <AppStack.Navigator>
            <AppStack.Screen name="Home" component={NewRecipe}/>
        </AppStack.Navigator>
    </NavigationContainer>
    )
}

export default Routes