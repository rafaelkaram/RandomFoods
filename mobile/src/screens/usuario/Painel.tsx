import React, { useEffect, useState, useContext, useCallback } from 'react';
import { ScrollView, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VictoryPie, VictoryLegend } from 'victory-native';
import { useNavigation } from '@react-navigation/native';
import { DataTable } from 'react-native-paper';

import AuthContext from './../../contexts/auth';

import api from '../../services/api';

import {
    IPainelTipoReceita,
    IPainelCategorias,
    IPainelCurtidas,
    ISeguidor,
    IUsuario,
    IHeader
} from '../../constants/interfaces';
import { HEIGHT, WIDTH } from '../../constants/dimensions';
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
    const [topCurtidas, setTopCurtidas] = useState<IPainelCurtidas[]>([]);
    const [seguidores, setSeguidores] = useState<ISeguidor[]>([]);
    const [seguindo, setSeguindo] = useState<ISeguidor[]>([]);
    const [load, setLoad] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState(false);

    const { user, headers }: { user: IUsuario | undefined, headers: IHeader | undefined } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            console.log({ user, headers });

            api.get('dashboard/tipos-receita', { headers })
                .then(response => { setRecipeType(response.data); });
            api.get('dashboard/categorias', { headers })
                .then(response => { setRecipeCategory(response.data); });
            api.get('dashboard/curtidas', { headers })
                .then(response => { setTopCurtidas(response.data); });
            api.get(`busca/seguidores/${user.id}`)
                .then(response => { setSeguidores(response.data) });
            api.get(`busca/seguidos/${user.id}`)
                .then(response => { setSeguindo(response.data), setLoad(true); });
        } else {
            navigation.navigate(screens.login);
        }
    }, [user, refreshing]);

    const pieTypeData = recipeType.map((item) => {
        return { x: item.tipo, y: Number(item.count) }
    });

    const pieTypeLegend = recipeType.map((item) => {
        return { name: item.tipo }
    });

    const totalRecipes: number = pieTypeData.reduce(function (a, b) { return a + b.y }, 0);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setLoad(false);
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    const handleNavigateToReceitasCategoria = (categoria: string) => {
        navigation.navigate(screens.receitaCategoria, { categoria });
    }

    const handleNavigateToRecipe = (id: number) => {
        navigation.navigate(screens.receita, { id: id });
    }

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
                    seguidores={seguidores.length}
                    seguidos={seguindo.length}
                    totalReceitas={totalRecipes}
                    isPainel={true}
                />
                {
                    recipeType.length > 0 ?
                        <>
                            <View style={styles.typePie}>
                                <Text style={[globalStyles.subTitleText, styles.chartsTitle]}>{` Receitas por Tipo `}</Text>
                                <View style={{ marginTop: -(HEIGHT / 15) }}>
                                    <VictoryPie
                                        height={((HEIGHT / 2) - 120)}
                                        width={(WIDTH / 2)}
                                        colorScale={['orange', colors.primary]}
                                        labels={({ datum }) => `${datum.y}`}
                                        data={pieTypeData}
                                        innerRadius={30}
                                        style={{ labels: { fontSize: 15 } }}
                                    />
                                </View>
                                <View style={{ position: 'absolute', top: ((HEIGHT / 2) - 210), left: 10 }}>
                                    <VictoryLegend
                                        colorScale={['orange', colors.primary]}
                                        data={pieTypeLegend}
                                        style={{ labels: { fontSize: 15 } }}
                                    />
                                </View>
                            </View>
                            {
                                recipeCategory.length > 0 ?
                                    <View>
                                        <Text style={[globalStyles.subTitleText, styles.tableTitle]}>Quantidade de Receitas por Categoria</Text>
                                        <View style={styles.table}>
                                            <DataTable>
                                                <DataTable.Header>
                                                    <DataTable.Title style={{ flexBasis: 30 }} >Categoria</DataTable.Title>
                                                    <DataTable.Title numeric>Receitas</DataTable.Title>
                                                </DataTable.Header>
                                                {recipeCategory.map((item, index) => {
                                                    return (
                                                        <TouchableOpacity key={index}>
                                                            <DataTable.Row >
                                                                <DataTable.Cell onPress={() => { handleNavigateToReceitasCategoria(item.categoria) }} style={{ flexBasis: 30 }}>{item.categoria}</DataTable.Cell>
                                                                <DataTable.Cell numeric>{item.count}</DataTable.Cell>
                                                            </DataTable.Row>
                                                        </TouchableOpacity>
                                                    )
                                                })}
                                            </DataTable>
                                        </View>
                                    </View>
                                    :
                                    null
                            }
                            {
                                topCurtidas.length > 0 ?
                                    <View>
                                        <Text style={[globalStyles.subTitleText, styles.tableTitle]}>Top receitas mais curtidas</Text>
                                        <View style={styles.table}>
                                            <DataTable>
                                                <DataTable.Header>
                                                    <DataTable.Title style={{ flexBasis: 30 }} >Receita</DataTable.Title>
                                                    <DataTable.Title numeric>Curtidas</DataTable.Title>
                                                </DataTable.Header>
                                                {topCurtidas.map(item => {
                                                    return (
                                                        <TouchableOpacity key={item.id}>
                                                            <DataTable.Row >
                                                                <DataTable.Cell onPress={() => { handleNavigateToRecipe(item.id) }} style={{ flexBasis: 250 }}>{item.nome}</DataTable.Cell>
                                                                <DataTable.Cell numeric>{item.curtidas}</DataTable.Cell>
                                                            </DataTable.Row>
                                                        </TouchableOpacity>
                                                    )
                                                })}
                                            </DataTable>
                                        </View>
                                    </View>
                                    :
                                    null
                            }
                        </>
                        :
                        <View>
                            <Text style={[globalStyles.subTitleText, globalStyles.recipeListSubTitle, { marginTop: 20 }]}>Você não possui receitas cadastradas!</Text>
                        </View>
                }

            </ScrollView>
        </SafeAreaView>
    )
}

export default Painel;