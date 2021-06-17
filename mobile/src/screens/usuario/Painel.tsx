import React, { useEffect, useState, useContext } from 'react';
import { Text, ScrollView, TouchableOpacity, View, StyleSheet, Dimensions, Button } from 'react-native';
import { VictoryPie, VictoryLegend } from 'victory-native';
import { useNavigation } from '@react-navigation/native';
import { DataTable } from 'react-native-paper';
import { Avatar } from "react-native-elements";
import AuthContext from './../../contexts/auth'
import api from '../../services/api'
import Colors from '../../constants/colors';
import Loading from '../../components/Loading';
import { IPainelTipoReceita, IPainelCategorias, IPainelVotos } from '../../constants/interfaces';

import ItalicText from '../../components/ItalicText';
import BoldText from '../../components/BoldText';
import RegularText from '../../components/RegularText';
import screens from '../../constants/screens';
import { SafeAreaView } from 'react-native-safe-area-context';

const Painel = () => {
    const navigation = useNavigation();
    const [recipeType, setRecipeType] = useState<IPainelTipoReceita[]>([]);
    const [recipeCategory, setRecipeCategory] = useState<IPainelCategorias[]>([]);
    const [topVotedRecipe, setTopVotedRecipe] = useState<IPainelVotos[]>([]);
    const [load, setLoad] = useState<boolean>(false)

    const { user, signOut } = useContext(AuthContext)

    function handleSignOut() {
        signOut()
    }

    const handleNavigateToPerfil = (id: number | undefined) => {
        navigation.navigate(screens.perfil, { id: id });
    }

    useEffect(() => {
        if (user) {
            api.get(`/dashboard/tipos-receita/${user?.id}`)
                .then(response => {
                    setRecipeType(response.data)

                })
            api.get(`/dashboard/categorias/${user?.id}`)
                .then(response => {
                    setRecipeCategory(response.data)
                })

            api.get(`/dashboard/avaliacoes/${user?.id}`)
                .then(response => {
                    setTopVotedRecipe(response.data)
                })
        } else {
            setRecipeType([])
            setRecipeCategory([])
            setTopVotedRecipe([])
        }
        setLoad(true)
    }, [user]);

    const pieTypeData = recipeType.map((item) => {
        return (
            { x: item.tipo, y: Number(item.count) }
        )
    })

    const pieCategoryData = recipeCategory.map((item) => {
        if (item.nome_categoria == null)
            return (
                { x: 'Sem Categoria', y: Number(item.count) }
            ); else
            return (
                { x: item.nome_categoria, y: Number(item.count) }
            )
    })

    const pieTypeLegend = recipeType.map((item) => {
        return (
            { name: item.tipo }
        )
    })

    const pieCategoryLegend = recipeCategory.map((item) => {
        if (item.nome_categoria == null)
            return (
                { name: 'Sem Categoria' }
            ); else
            return (
                { name: item.nome_categoria }
            )
    })

    const totalRecipes: number = pieTypeData.reduce(function (a, b) { return a + b.y }, 0)

    if (!load) {
        return <Loading />
    }

    return (
            <SafeAreaView style={{flex:1}}>
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
                    <TouchableOpacity style={styles.totalRecipes}
                        onPress={() => {
                            handleNavigateToPerfil(user?.id)
                        }}>
                        <Text style={styles.totalRecipesTitle}>Receitas Cadastradas:</Text>
                        <Text style={styles.totalRecipesText}>{totalRecipes}</Text>
                    </TouchableOpacity>
                    <View style={styles.pieContainer}>
                        <View style={styles.typePie}>
                            <ItalicText style={styles.chartsTitle}>{`Receitas\npor Tipo`}</ItalicText>
                            <VictoryPie
                                height={((chartHeight / 2) - 50)}
                                width={(chartWidth / 2)}
                                colorScale={["orange", "#e02041"]}
                                labels={({ datum }) => `${datum.y}`}
                                data={pieTypeData}
                                innerRadius={30}
                                style={{ labels: { fontSize: 15 } }}
                            />
                            <VictoryLegend x={140}
                                gutter={20}
                                colorScale={["orange", "#e02041"]}
                                data={pieTypeLegend}
                                style={{ labels: { fontSize: 15 } }}
                            />
                        </View>

                        <View style={styles.categoryPie}>
                            <ItalicText style={styles.chartsTitle}>{`Receitas\npor Categoria`}</ItalicText>

                            <VictoryPie
                                height={((chartHeight / 2) - 50)}
                                width={(chartWidth / 2)}
                                colorScale={["#10a377", "#62e399", "#3f9665", "#29e379", "#99ffc5"]}
                                labels={({ datum }) => `${datum.y}`}
                                data={pieCategoryData}
                                innerRadius={30}
                                style={{ labels: { fontSize: 15 } }}
                            />
                            <ScrollView>
                                <VictoryLegend x={10}
                                    colorScale={["#10a377", "#62e399", "#3f9665", "#29e379", "#99ffc5"]}
                                    data={pieCategoryLegend}
                                    style={{ labels: { fontSize: 15 } }}
                                />
                            </ScrollView>
                        </View>
                    </View>
                    <View>
                        { }
                        <Text style={styles.tableTitle}>Top receitas mais votadas</Text>
                        <View style={styles.topVotedTable}>
                            <DataTable>
                                <DataTable.Header>
                                    <DataTable.Title style={{ flexBasis: 30 }} >Receita</DataTable.Title>
                                    <DataTable.Title numeric>Nota</DataTable.Title>
                                    <DataTable.Title style={{ flexBasis: 10 }} numeric>Nº de Notas</DataTable.Title>
                                </DataTable.Header>
                                {topVotedRecipe.map(item => {
                                    return (
                                        <TouchableOpacity key={item.id}>
                                            <DataTable.Row >
                                                <DataTable.Cell style={{ flexBasis: 30 }}>{item.nome}</DataTable.Cell>
                                                <DataTable.Cell numeric>{item.nota}</DataTable.Cell>
                                                <DataTable.Cell numeric>{item.num_notas}</DataTable.Cell>
                                            </DataTable.Row>
                                        </TouchableOpacity>
                                    )
                                })}
                            </DataTable>
                        </View>
                    </View>
                    <View style={{ margin: 10 }}></View>
                    <Button title="Sign Out" onPress={() => handleSignOut()} />
                </ScrollView>
            </SafeAreaView>
    )
}

const chartHeight = Dimensions.get("window").height * 0.5;
const chartWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
    main: {
        backgroundColor: Colors.background
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

    chartsTitle: {
        paddingTop: 5,
        paddingLeft: 5,
        fontFamily: 'Ubuntu_500Medium_Italic',
        color: "#f87062",
        alignSelf: 'flex-start',
        textShadowColor: 'black',
        textShadowRadius: 0.5,
        textShadowOffset: {
            width: 0.5,
            height: 0.5
        },
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

    categoryPie: {
        maxWidth: ((chartWidth / 2) - 20),
        maxHeight: (chartHeight - 120),
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 15
    },

    tableTitle: {
        textAlign: 'center',
    },

    topVotedTable: {
        marginHorizontal: 20,
        backgroundColor: "white",
        borderRadius: 10,
        marginTop: 10,
        marginBottom: 15,
    }

})

export default Painel;