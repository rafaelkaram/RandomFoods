import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Button, ScrollView, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VictoryPie, VictoryLegend } from 'victory-native';
import { useNavigation } from '@react-navigation/native';
import { DataTable } from 'react-native-paper';

import AuthContext from './../../contexts/auth';

import api from '../../services/api';

import { IPainelTipoReceita, IPainelCategorias, IPainelVotos } from '../../constants/interfaces';
import { HEIGHT, WIDTH } from '../../constants/dimensions';
import dashboardColors from '../../constants/dashboardColors';
import colors from '../../constants/colors';
import screens from '../../constants/screens';
import globalStyles from '../../styles/Global';
import styles from '../../styles/screens/Painel';

import Loading from '../../components/Loading';
import UserHeader from '../../components/UserHeader';

const Painel = () => {
    const navigation = useNavigation();

    const [recipeType, setRecipeType] = useState<IPainelTipoReceita[]>([]);
    const [recipeCategory, setRecipeCategory] = useState<IPainelCategorias[]>([]);
    const [topVotedRecipe, setTopVotedRecipe] = useState<IPainelVotos[]>([]);
    const [load, setLoad] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState(false);

    const { user, signOut } = useContext(AuthContext);

    function handleSignOut() {
        signOut();
    }

    useEffect(() => {
        if (user) {
            api.get(`/dashboard/tipos-receita/${user.id}`)
                .then(response => { setRecipeType(response.data); });
            api.get(`/dashboard/categorias/${user.id}`)
                .then(response => { setRecipeCategory(response.data); });
            api.get(`/dashboard/avaliacoes/${user.id}`)
                .then(response => { setTopVotedRecipe(response.data); });
        } else {
            navigation.navigate(screens.login);
        }
        setLoad(true);
    }, [user, refreshing]);

    const pieTypeData = recipeType.map((item) => {
        return { x: item.tipo, y: Number(item.count) }
    });

    const pieCategoryData = recipeCategory.map((item) => {
        if (item.categoria == null)
            return { x: 'Sem Categoria', y: Number(item.count) }
        else
            return { x: item.categoria, y: Number(item.count) }
    });

    const pieTypeLegend = recipeType.map((item) => {
        return { name: item.tipo }
    });

    const pieCategoryLegend = recipeCategory.map((item) => {
        if (item.categoria == null)
            return { name: 'Sem Categoria' }
        else
            return { name: item.categoria }
    });

    const totalRecipes: number = pieTypeData.reduce(function (a, b) { return a + b.y }, 0);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    if (!load || !user) {
        return <Loading />
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}
            >
                <UserHeader
                    usuario={user}
                    totalReceitas={totalRecipes}
                    isPainel={true}
                />

                <View style={styles.pieContainer}>
                    <View style={styles.typePie}>
                        <Text style={[globalStyles.subTitleText, styles.chartsTitle]}>{`Receitas\npor Tipo`}</Text>
                        <View style={{ position: 'absolute', padding: 10 }}>
                            <VictoryPie
                                height={((HEIGHT / 2) - 180)}
                                width={(WIDTH / 2)}
                                colorScale={['orange', colors.primary]}
                                labels={({ datum }) => `${datum.y}`}
                                data={pieTypeData}
                                innerRadius={30}
                                style={{ labels: { fontSize: 15 } }}
                            />
                        </View>
                        <View style={{ position: 'absolute', top: 180, left: 10 }}>
                            <VictoryLegend
                                colorScale={['orange', colors.primary]}
                                data={pieTypeLegend}
                                style={{ labels: { fontSize: 15 } }}
                            />
                        </View>
                    </View>

                    <View style={styles.categoryPie}>
                        <Text style={[globalStyles.subTitleText, styles.chartsTitle]}>{`Receitas\npor Categoria`}</Text>
                        <View style={{ position: 'absolute', padding: 10 }}>
                            <VictoryPie
                                height={((HEIGHT / 2) - 180)}
                                width={(WIDTH / 2)}
                                colorScale={[dashboardColors.first, dashboardColors.second, dashboardColors.third, dashboardColors.fourth, dashboardColors.fifth]}
                                labels={({ datum }) => `${datum.y}`}
                                data={pieCategoryData}
                                innerRadius={30}
                                style={{ labels: { fontSize: 15 } }}
                            />
                        </View>
                        <View style={{ position: 'absolute', top: 180, left: 10 }}>
                            <VictoryLegend
                                colorScale={[dashboardColors.first, dashboardColors.second, dashboardColors.third, dashboardColors.fourth, dashboardColors.fifth]}
                                data={pieCategoryLegend}
                                style={{ labels: { fontSize: 15 } }}
                            />
                        </View>

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
            </ScrollView>
        </SafeAreaView>
    )
}

export default Painel;