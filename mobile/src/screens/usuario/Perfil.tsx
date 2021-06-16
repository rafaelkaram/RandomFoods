import React, { useEffect, useState, useContext } from 'react';
import { Text, ScrollView, TouchableOpacity, View, StyleSheet, Dimensions, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { VictoryPie, VictoryLegend } from 'victory-native';
import { DataTable } from 'react-native-paper';
import { Avatar } from "react-native-elements";
import AuthContext from './../../contexts/auth'
import api from '../../services/api'
import Colors from '../../constants/colors';
import Loading from '../../components/Loading';
import { IPainelTipoReceita, IPainelCategorias, IPainelVotos, IReceitaSimples } from '../../constants/interfaces';

import ItalicText from '../../components/ItalicText';
import BoldText from '../../components/BoldText';
import RegularText from '../../components/RegularText';
import RecipeList from '../../components/RecipeList';
import screens from '../../constants/screens';
import colors from '../../constants/colors';

const Perfil = () => {
    const navigation = useNavigation();
    const [recipeType, setRecipeType] = useState<IPainelTipoReceita[]>([]);
    const [recipesUser, setRecipesUser] = useState<IReceitaSimples[]>([]);
    const [title, setTitle] = useState('');
    const [load, setLoad] = useState<boolean>(false)

    const { user, signOut } = useContext(AuthContext)

    function handleSignOut() {
        signOut()
    }

    const handleNavigateToRecipe = (id: number) => {
        navigation.navigate(screens.receita, { id: id });
    }


    useEffect(() => {
        if (user) {        
            api.get(`/busca/receita-usuario/${user?.id}`)
                .then(response => {                  
                    setRecipesUser(response.data.receitas)                            
                })
                api.get(`/dashboard/tipos-receita/${user?.id}`)
                .then(response => {
                    setRecipeType(response.data)

                })

                setTitle('Receitas de '+user.nome )
        } else {
            setRecipeType([])

        }
        setLoad(true)
    }, []);

    const pieTypeData = recipeType.map((item) => {
        return (
            { x: item.tipo, y: Number(item.count) }
        )
    })


    const totalRecipes: number = pieTypeData.reduce(function (a, b) { return a + b.y }, 0)

    if (!load) {
        return <Loading />
    }
    
    return (
        <>
            <ScrollView>
                <View style={styles.mainContainer}>
                    {user?.path ?
                        <Avatar
                            size="large"
                            rounded
                            title={user?.iniciais}
                            source={{
                                uri: user?.path
                            }}
                            activeOpacity={0.7}
                            containerStyle={{ backgroundColor: 'lightgrey' }}
                        />
                        :
                        <Avatar
                            size="large"
                            rounded
                            title={user?.iniciais}
                            activeOpacity={0.7}
                            containerStyle={{ backgroundColor: 'lightgrey' }}
                        />}
                    <View style={user!?.nome.length > 10 ? styles.nameContainer : null}>
                        <BoldText style={styles.name}>{user?.nome}</BoldText>
                        <RegularText style={styles.login}>@{user?.login}</RegularText>
                    </View>
                </View>
                <View style={styles.totalRecipes}>
                    <Text style={styles.totalRecipesTitle}>Receitas Cadastradas:</Text>
                    <Text style={styles.totalRecipesText}>{totalRecipes}</Text>
                </View>
                <ScrollView style={styles.body}>
                    {recipesUser.length>0?
                     <RecipeList titulo={title} receitas={recipesUser} navegar={(id: number) => handleNavigateToRecipe(id)} />
                    :
                    <></>
                    }
                    
                    
                </ScrollView>
               
                <Button title="Sign Out" onPress={() => handleSignOut()} />
            </ScrollView>
        </>
    )
}

const chartHeight = Dimensions.get("window").height * 0.5;
const chartWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    main: {
        backgroundColor: Colors.background
    },

    body: {
        backgroundColor: colors.background,
    },

    mainContainer: {
        margin: 20,
        backgroundColor: "white",
        height: 120,
        borderRadius: 15,
        flexDirection: 'row',
        padding: 20,
        alignItems: 'center',
        maxWidth: chartWidth,
    },

    nameContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: (chartWidth * 0.7),
    },

    name: {
        marginLeft: 20,
        fontSize: 18,
    },

    login: {
        marginLeft: 20,
        marginTop: 10,
        fontSize: 14,
    },

    totalRecipes: {
        alignItems: 'center',
        marginHorizontal: 15,
        backgroundColor: 'white',
        borderRadius: 20
    },

    totalRecipesTitle: {
        fontFamily: 'Oswald_300Light',
        fontSize: 20,
        margin: 5,
    },

    totalRecipesText: {
        fontFamily: 'Oswald_300Light',
        fontSize: 20,
        margin: 5,
        fontWeight: 'bold'
    },


    pieContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        margin: 15,
    },

    typePie: {
        maxWidth: ((chartWidth / 2) - 20),
        maxHeight: (chartHeight - 120),
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
        marginRight: 10
    },

  
})

export default Perfil;