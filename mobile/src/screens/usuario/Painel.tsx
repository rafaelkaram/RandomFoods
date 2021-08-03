import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Button, ScrollView, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VictoryPie, VictoryLegend } from 'victory-native';
import { useNavigation } from '@react-navigation/native';
import { DataTable } from 'react-native-paper';

import AuthContext from './../../contexts/auth';

import api from '../../services/api';

import { IPainelTipoReceita, IPainelCategorias, IPainelVotos, ISeguidor } from '../../constants/interfaces';
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
    const [seguidores, setSeguidores] = useState<ISeguidor[]>([]);
    const [seguindo, setSeguindo] = useState<ISeguidor[]>([]);
    const [load, setLoad] = useState<boolean>(false);
    const [refreshing, setRefreshing] = useState(false);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            api.get(`/dashboard/tipos-receita/${user.id}`)
                .then(response => { setRecipeType(response.data); });
            api.get(`/dashboard/categorias/${user.id}`)
                .then(response => { setRecipeCategory(response.data); });
            api.get(`/dashboard/avaliacoes/${user.id}`)
                .then(response => { setTopVotedRecipe(response.data); });
            api.get(`/busca/seguidores/${user.id}`)
                .then(response => { setSeguidores(response.data) });
            api.get(`/busca/seguidos/${user.id}`)
                .then(response => { setSeguindo(response.data) });
        } else {
            navigation.navigate(screens.login);
        }
        setLoad(true);
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
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    const handleNavigateToPerfil = (id: number | undefined) => {
        navigation.navigate(screens.perfil, { id: id });

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

                <View>
                    <Text style={[globalStyles.subTitleText, styles.tableTitle]}>Quantidade de Receitas por Categoria</Text>
                    <View style={styles.topVotedTable}>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title onPress={() => { }} style={{ flexBasis: 30 }} >Categoria</DataTable.Title>
                                <DataTable.Title numeric>#Receitas</DataTable.Title>
                            </DataTable.Header>
                            {recipeCategory.map((item, index) => {
                                return (
                                    <TouchableOpacity key={index}>
                                        <DataTable.Row >
                                            <DataTable.Cell style={{ flexBasis: 30 }}>{item.categoria}</DataTable.Cell>
                                            <DataTable.Cell numeric>{item.count}</DataTable.Cell>
                                        </DataTable.Row>
                                    </TouchableOpacity>
                                )
                            })}
                        </DataTable>
                    </View>
                </View>

                <View>
                    <Text style={[globalStyles.subTitleText, styles.tableTitle]}>Top receitas mais votadas</Text>
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