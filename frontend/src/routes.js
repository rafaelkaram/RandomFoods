import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Converter from './pages/Converter';
import Profile from './pages/Profile';
import NewRecipe from './pages/NewRecipe';
import NewIngredient from './pages/NewIngredient';
import NewIngredientType from './pages/NewIngredientType';

export default function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Login} />
                <Route path="/signup" component={SignUp} />
                <Route path="/conversor" component={Converter} />
                <Route path="/profile" component={Profile} />
                <Route path="/recipe/new" component={NewRecipe} />
                <Route path="/ingredient/new" component={NewIngredient} />
                <Route path="/ingredient-type/new" component={NewIngredientType} />
            </Switch>
        </BrowserRouter>
    )
}