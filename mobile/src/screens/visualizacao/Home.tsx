import React from 'react';
import { ScrollView, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import screens from '../../constants/screens';

const Home = () => {

    const navigation = useNavigation();

    const handleNavigateToSearchRecipe = () => {
        navigation.navigate(screens.filtro);
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <Button
                    title="Pesquisar Receitas"
                    onPress={ handleNavigateToSearchRecipe }
                />
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home;