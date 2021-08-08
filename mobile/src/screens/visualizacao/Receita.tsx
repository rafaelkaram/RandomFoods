import React, { useEffect, useState, useContext, useCallback } from 'react'
import { Alert, ScrollView, Text, TouchableOpacity, View, RefreshControl } from 'react-native';
import { Rating, Avatar, Icon } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, TabActions } from '@react-navigation/native';
import { Entypo, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';

import 'moment/min/locales';

import api from '../../services/api';
import AuthContext from './../../contexts/auth';

import styles from '../../styles/screens/Receita';
import globalStyles from '../../styles/Global';
import screens from '../../constants/screens';
import {
    IUsuario,
    IComentario,
    ICurtidaSimples,
    IMidia,
    IReceita,
    IHeader
} from '../../constants/interfaces';

import Loading from '../../components/Loading';
import Comment from '../../components/Comment';
import Category from '../../components/Category';
import CarouselItems from '../../components/Carousel';
import InputComment from '../../components/InputComment';

moment.locale('pt-br');

const Receita = ({ route }: { route: any }) => {

    const navigation = useNavigation();

    const idRecipe = route.params.id;
    const [recipe, setRecipe] = useState<IReceita>();
    const [comentarios, setComentarios] = useState<IComentario[]>([]);
    const [etapas, setEtapas] = useState<string[]>([]);
    const [midias, setMidias] = useState<IMidia[]>([]);
    const [curtidas, setCurtidas] = useState<ICurtidaSimples[]>([]);
    const [refreshing, setRefreshing] = useState(false);
    const [idComentarioPai, setIdComentarioPai] = useState<number | null>(null);

    const [newC, setNewC] = useState<boolean>(false);
    const [isCurtida, setIsCurtida] = useState<boolean>(false);
    const [loadComentario, setLoadComentario] = useState<boolean>(false);

    const { user, headers }: { user: IUsuario | undefined, headers: IHeader | undefined } = useContext(AuthContext);

    useEffect(() => {
        api.get(`busca/receita/${idRecipe}`)
            .then(response => {
                setRecipe(response.data);
                setEtapas(response.data?.descricao.split('\\n'));
                setMidias(response.data?.midias);
                setCurtidas(response.data?.curtidas);
            }
            );
        api.get(`busca/comentario-receita/${idRecipe}`)
            .then(response => {
                setComentarios(response.data);
            }
            );

    }, [refreshing, idRecipe, isCurtida]);

    useEffect(() => {
        const curtida: ICurtidaSimples[] = curtidas.filter(curtida2 => (curtida2.usuario.id === user?.id));
        if (curtida && curtida.length > 0)
            setIsCurtida(true);
    }, [curtidas]);

    const curtirReceita = () => {
        if (!isCurtida) {
            api.post('cadastro/curtida', { idReceita: recipe?.id }, { headers })
                .then(response => {
                    setIsCurtida(true);
                }).catch(error => {
                    Alert.alert(
                        'Falha no resgistro de curtida',
                        '\nFalha no resgistro de curtida',
                        [
                            { text: 'OK' }
                        ]
                    );
                    setIsCurtida(false);
                }
                );
        } else {
            const curtida: ICurtidaSimples[] = curtidas.filter(curtida2 => (curtida2.usuario.id === user?.id));
            api.delete(`remove/curtida/${curtida[0].id}`, { headers })
                .then(response => {
                    setIsCurtida(false);
                }).catch(error => {
                    Alert.alert(
                        'Falha no resgistro de curtida',
                        '\nFalha no resgistro de curtida',
                        [
                            { text: 'OK' }
                        ]
                    );
                    setIsCurtida(true);
                }
                );
        }
    }

    const handleNavigateToPerfil = (id: number | undefined) => {
        if (recipe?.usuario.id == user?.id) {
            const jumpToAction = TabActions.jumpTo('User');
            navigation.dispatch(jumpToAction);
        } else {
            navigation.navigate(screens.perfil, { id: id });
        }
    }

    const handleNavigateToLogin = () => {
        const jumpToAction = TabActions.jumpTo('User');
        navigation.dispatch(jumpToAction);
    }

    const submitComentario = async (idReceita: number, idPai: number, conteudo: string) => {
        setLoadComentario(true);
        api.post('cadastro/comentario', { conteudo, idPai, idReceita }, { headers })
            .then(response => {
                setComentarios(response.data);
                setLoadComentario(false);
            }).catch(error => {
                Alert.alert(
                    'Falha no resgistro de comentário',
                    '\nArruma o texto depois',
                    [
                        { text: 'OK' }
                    ]
                );
                setLoadComentario(false);
            }
            );
    }

    const setNew = () => {
        setNewC(!newC)
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
    }, []);

    if (!recipe) {
        return (
            <Loading />
        )
    }

    return (
        <SafeAreaView>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}
            >
                <View style={styles.container}>
                    <View style={styles.itemListTitle}>
                        <Text style={[globalStyles.boldText, styles.titleText]}>{recipe.receita}</Text>
                    </View>
                    <CarouselItems midias={midias} />
                    <TouchableOpacity
                        style={styles.autor}
                        onPress={() => { handleNavigateToPerfil(recipe.usuario.id) }}
                    >
                        {recipe.usuario.path ? (
                            <Avatar
                                size='small'
                                rounded
                                activeOpacity={0.7}
                                containerStyle={{ backgroundColor: 'lightgrey' }}
                                source={{ uri: recipe.usuario.path }}
                            />)
                            :
                            <Avatar
                                size='small'
                                rounded
                                title={recipe.usuario.iniciais}
                                activeOpacity={0.7}
                                containerStyle={{ backgroundColor: 'lightgrey' }}
                            />
                        }
                        <Text style={styles.autorName}>{recipe.usuario.nome}</Text>
                    </TouchableOpacity>
                    <View style={styles.time}>
                        <View style={{ alignSelf: 'center', marginRight: 10 }}>
                            <Icon
                                name='clock'
                                type='font-awesome-5'
                                size={20}
                            />
                        </View>
                        <View>
                            <Text style={globalStyles.boldText}>Tempo de Preparo:  </Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ marginLeft: 5 }}>{recipe.tempoPreparo} Minutos</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.category}>
                        {recipe.categorias.map(category => {
                            return (
                                <Category key={category} nome={category} />
                            )
                        })}

                    </View>
                    <View style={styles.ingredientList}>
                        <Text style={globalStyles.boldText}>Ingredientes:</Text>

                        {recipe.ingredientes.map(ingredient => {
                            return (
                                <View style={styles.ingredient} key={ingredient.id}>
                                    <Entypo name='dot-single' size={15} color='black' />
                                    <Text style={globalStyles.regularText}>{ingredient.nome}</Text>
                                    <Text style={globalStyles.regularText}>: {ingredient.medida}</Text>
                                </View>
                            )
                        })}
                    </View>

                    <View style={styles.itemListDescribe}>
                        <Text style={globalStyles.boldText}>Preparo:</Text>
                        {etapas.map((etapa, index) => {
                            return (
                                <View key={index} style={{ margin: 10 }}>
                                    <Text style={{ ...globalStyles.regularText, lineHeight: 18 }}>
                                        {etapa}
                                    </Text>
                                </View>
                            )
                        })}
                    </View>
                    {user ?
                        <View style={styles.buttonActions}>
                            <TouchableOpacity style={isCurtida ? styles.buttonFavTrue : styles.buttonFavFalse}
                                onPress={() => { curtirReceita() }}
                            >
                                <AntDesign name='heart' size={20} color='white' />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.buttonComentar}
                                onPress={() => {
                                    setIdComentarioPai(null);
                                    setNewC(!newC)
                                }}
                            >
                                <Text style={{ ...globalStyles.boldText, color: 'white', fontSize: 16 }}>Comentar</Text>
                                <MaterialCommunityIcons name='comment' size={20} color='white' style={{ marginLeft: 10 }} />
                            </TouchableOpacity>
                        </View>
                        :
                        <TouchableOpacity style={styles.textLogin} onPress={() => handleNavigateToLogin()}>
                            <Text style={{ ...globalStyles.boldText, color: 'white', fontSize: 16, textAlign: 'center' }}>Gostou da Receita?</Text>
                            <Text style={{ ...globalStyles.boldText, color: 'white', fontSize: 16, textAlign: 'center' }}>Faça seu login, curta e comente!</Text>
                        </TouchableOpacity>
                    }
                    {
                        loadComentario ?
                            <Loading /> :
                            <View>
                                {
                                    comentarios.filter(comentario2 => (!comentario2.comentarioPai)).map(comentario => {
                                        return (
                                            <Comment
                                                key={comentario.id}
                                                comentario={comentario}
                                                lista={comentarios}
                                                isLogado={user ? true : false}
                                                setNew={setNew}
                                                setIdPai={setIdComentarioPai}
                                            />
                                        )
                                    })
                                }
                            </View>
                    }
                    {
                        (newC) &&
                        <InputComment
                            idPai={idComentarioPai}
                            idReceita={recipe.id}
                            submit={(idReceita: number, idPai: number, conteudo: string) => submitComentario(idReceita, idPai, conteudo)}
                            setNew={() => setNew()}
                        />
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Receita;