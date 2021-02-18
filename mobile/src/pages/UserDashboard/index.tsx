import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Image} from 'react-native'
import { VictoryPie, VictoryLegend } from 'victory-native'
import api from '../../services/api'
import { SafeAreaView } from 'react-native-safe-area-context';
import { DataTable } from 'react-native-paper';

interface RecipeType {
    tipo: string,
    count: number,
}

interface RecipeCategory {
    nome_categoria: string,
    count: number,
}

interface TopVotedRecipe {
    id: number,
    nome: string,
    nota: string,
    num_notas: number
}


const UserDashboard = () => {

    const [recipeType, setRecipeType] = useState<RecipeType[]>([])
    const [recipeCategory, setRecipeCategory] = useState<RecipeCategory[]>([])
    const [topVotedRecipe, setTopVotedRecipe] = useState<TopVotedRecipe[]>([])

    const id = 1

    useEffect(() => {
        api.get(`recipesType/${id}`)
            .then(response => {
                setRecipeType(response.data)

            })
        api.get(`recipesCategory/${id}`)
            .then(response => {
                setRecipeCategory(response.data)
            })

        api.get(`topVotedRecipe/${id}`)
            .then(response => {
                setTopVotedRecipe(response.data)

            })
    }, []);


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


    return (
        <SafeAreaView style={styles.main}>
                <ScrollView>
                        <Image 
                            style={{width:212,height:66,margin:15}}
                            source={require('../../assets/dashboard.png')}/>
                    <View style={styles.totalRecipes}>
                        <Text style={styles.totalRecipesTitle}>Receitas Cadastradas:</Text>
                        <Text style={styles.totalRecipesText}>{totalRecipes}</Text>
                    </View>
                    <View style={styles.pieContainer}>
                        <View style={styles.typePie}>
                            <Text style={styles.chartsTitle}>{`Receitas\npor Tipo`}</Text>
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
                            <Text style={styles.chartsTitle}>{`Receitas\npor Categoria`}</Text>

                            <VictoryPie
                                height={((chartHeight / 2) - 50)}
                                width={(chartWidth / 2)}
                                colorScale={["#10a377", "#62e399","#3f9665","#29e379","#99ffc5"]}
                                labels={({ datum }) => `${datum.y}`}
                                data={pieCategoryData}
                                innerRadius={30}
                                style={{ labels: { fontSize: 15 } }}
                            />
                            <ScrollView>
                            <VictoryLegend x={10}
                                colorScale={["#10a377", "#62e399","#3f9665","#29e379","#99ffc5"]}
                                data={pieCategoryLegend}
                                style={{ labels: { fontSize: 15 } }}
                            />
                            </ScrollView>
                        </View>
                    </View>
                    <View>
                    {}
                        <Text style={styles.tableTitle}>Top receitas mais votadas</Text>                 
                            <View style={styles.topVotedTable}>
                                <DataTable>
                                    <DataTable.Header>
                                        <DataTable.Title style={{flexBasis: 30}} >Receita</DataTable.Title>
                                        <DataTable.Title numeric>Nota</DataTable.Title>
                                        <DataTable.Title style={{flexBasis: 10}} numeric>Nº de Notas</DataTable.Title>
                                    </DataTable.Header>
                                    {topVotedRecipe.map(item =>{
                                        return(
                                            <TouchableOpacity key={item.id}>
                                                <DataTable.Row >
                                                    <DataTable.Cell style={{flexBasis: 30}}>{item.nome}</DataTable.Cell>
                                                    <DataTable.Cell numeric>{item.nota}</DataTable.Cell>
                                                    <DataTable.Cell numeric>{item.num_notas}</DataTable.Cell>
                                                </DataTable.Row>
                                            </TouchableOpacity>
                                        )
                                    })}
                                </DataTable>
                            </View> 
                    </View>
                </ScrollView>
        </SafeAreaView>
    )
}

const chartHeight = Dimensions.get("window").height * 0.5;
const chartWidth = Dimensions.get("window").width;



const styles = StyleSheet.create({

    main:{
        flex: 1,
        backgroundColor: "#F0F0F5"
    },

    titleContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 15,
    },

    mainTitle: {
        textAlign: 'left',
        color: "#f87062",
        fontFamily: 'Ubuntu_700Bold',
        padding: 15,
        fontSize: 24,
        textShadowColor: 'black',
        textShadowRadius: 1,
        textShadowOffset: { 
            width: 1,
            height: 1
          }, 
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
        alignSelf: 'baseline',
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
        maxWidth: ((chartWidth / 2)-20),
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

    tableTitle:{
        textAlign: 'center',
        fontFamily:"Ubuntu_500Medium_Italic",
        color: "#f87062",
        textShadowColor: 'black',
        textShadowRadius: 0.5,
        textShadowOffset: { 
            width: 0.5,
            height: 0.5
          },
    },

    topVotedTable: {
        marginHorizontal: 20,
        backgroundColor: "white",
        borderRadius: 10,
        marginTop: 10
    }

})

export default UserDashboard