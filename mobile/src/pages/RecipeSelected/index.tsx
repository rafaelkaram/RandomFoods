import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native'
import { Rating, AirbnbRating } from 'react-native-elements';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Category from '../../components/Category';
import moment from 'moment';
import "moment/min/locales";

import { useNavigation } from '@react-navigation/native';
import api from '../../services/api'

const { width } = Dimensions.get('window')
const numberGrid = 3;
const itemWidth = width / numberGrid;
moment.locale('pt-br');


interface Recipe {
    id: number,
    id_usuario: number,
    receita: string,
    descricao: string,
    nota: number,
    num_notas: number,
    tipo: string,
    data_cadastro: Date,
    ativa: boolean,
    ingredientes: [{
        id: number,
        nome: string,
        quantidade: number,
    }],
    categorias: [string],
}

interface Comment {
    filter(arg0: ({ obj }: { obj: any; }) => boolean): Comment,
    usuario: string,
    id: number,
    id_usuario: number,
    id_receita: number,
    id_pai: number,
    valor: string,
    data: Date,
    avaliacao: number,
}


function RecipeSelected({ route }: { route: any }) {

    const idRecipe = route.params.id;
    const [recipe, setRecipe] = useState<Recipe>();
    const [comments, setComments] = useState<Comment[]>([]);
    const [subComments, setSubComments] = useState<Comment[]>([]);
    //const { rating:number } = recipe.nota;




    useEffect(() => {
        api.get(`receita/${idRecipe}`).then(response => {
            setRecipe(response.data);
        });
        api.get(`comentar/${idRecipe}`)
            .then(response => {
                console.log(response.data);
                setComments(response.data.comentarios);
                setSubComments(response.data.filhos);
            });
    }, []);

    function ShowComments({ comentarios }: { comentarios: any }) {

        if (!comentarios) {
            return (<Text>Vamos comentar galera!</Text>);
        } else {

            return (

                <View style={styles.comments} >
                    { comentarios.map((comment: { usuario: string; avaliacao: number; data: Date; valor: string; id: number; }) => (
                        <View>
                            <View style={styles.singleComment}>
                                <View>
                                    <View style={styles.commentTitle}>
                                        <View style={styles.commentUserDate}>
                                            <Text style={styles.commentUser}>{comment.usuario}</Text>
                                            <Text style={styles.commentDate}> - {moment(comment.data).startOf('day').fromNow()}</Text>
                                        </View>
                                        <Rating imageSize={10} readonly startingValue={comment?.avaliacao} />

                                    </View>
                                </View>

                                <Text style={{ fontFamily: 'Ubuntu_400Regular' }}>{comment.valor}</Text>
                                <View style={styles.commentHour}>
                                    <Text>{moment(comment.data).format('HH:mm')}</Text>
                                </View>
                            </View>
                            <ShowSubComment sub={comment.id} />
                        </View>
                    ))}
                </View>
            );
        }
    }

    function ShowSubComment({ sub }: { sub: any }) {
        if (subComments) {
            const childComments = subComments.filter(obj => obj.id_pai === sub);
            if (childComments) {
                console.log(childComments);
                return (
                    <View style={styles.identacao}>
                        <ShowComments comentarios={childComments} />
                    </View>
                );
            }
        }
        return (<Text></Text>);
    }

    return (

        <>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.itemListTitle}>
                        <Text style={{ fontFamily: 'Ubuntu_700Bold', fontSize: 20, color: 'white' }}>{recipe?.receita}</Text>

                    </View>
                    <View style={styles.note}>
                        <Text style={{ fontFamily: 'Ubuntu_700Bold' }}>NOTA:</Text>
                        <Rating imageSize={20} readonly startingValue={recipe?.nota} />
                    </View>
                
                    <View style={styles.category}>
                        {recipe?.categorias.map(category => {
                            return (
                                    <Category key={category} nome={category} />
                            )
                        })}

                    </View>
                    <View style={styles.ingredientList}>
                        <Text style={{ fontFamily: 'Ubuntu_700Bold' }}>INGREDIENTES:</Text>
                        {recipe?.ingredientes.map(ingredient => {
                            return (
                                <View style={styles.ingredient} key={ingredient.id}>
                                    <Entypo name="dot-single" size={15} color="black" />
                                    <Text style={{ fontFamily: 'Ubuntu_400Regular' }}>{ingredient.nome}</Text>
                                    <Text style={{ fontFamily: 'Ubuntu_400Regular' }}>{ingredient.quantidade ? `: ${ingredient.quantidade.toString().replace('.00', '')}` : ' a gosto'}</Text>
                                </View>
                            )
                        })}
                    </View>

                    <View style={styles.itemListDescribe}>
                        <Text style={{ fontFamily: 'Ubuntu_400Regular' }}>{recipe?.descricao.split('\\n').map((desc, index) => (
                            <Text key={index}>{'\n'}{desc}</Text>))}</Text>
                    </View>
                    <ShowComments comentarios={comments} />

                </View>

            </ScrollView>
        </>
    );
}
const styles = StyleSheet.create({

    itemListTitle: {
        backgroundColor: '#e02041',

        fontSize: 20,
        textAlign: 'center',
        fontFamily: 'Ubuntu_700Bold',

        margin: 3,
        padding: 10,
    },
    rating: {
        backgroundColor: '#e02041',
    },
    container: {
        flex: 1,
        backgroundColor: '#F0F0F5'
    },
    note: {
        flexDirection: 'row',
        padding: 3,
        margin: 10,
    },
    type: {
        flexDirection: 'row',
        padding: 3,
        margin: 10,
    },
    category: {
        flexDirection:'row',
        flexWrap: 'wrap',
    },
    
    ingredientList: {
        margin: 10,
        padding: 5,
        backgroundColor: 'white',
    },
    ingredient: {
        flexDirection: 'row',
        padding: 3,
    },
    itemList: {
        backgroundColor: 'lightgrey',
        margin: 15,
        padding: 10,
        width: itemWidth,
        height: itemWidth,
        flexDirection: 'column',
        borderRadius: 20
    },
    itemListImage: {
        borderWidth: 1,
        height: itemWidth - 40,
        borderRadius: 20,
        textAlign: 'center',

    },

    itemListDescribe: {
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        padding: 5,
        backgroundColor: 'white',

    },
    comments: {
        margin: 10,
        padding: 5,

    },
    singleComment: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
    },
    commentTitle: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        fontFamily: 'Ubuntu_400Regular'
    },
    commentUserDate: {
        flexDirection: 'row',
    },
    commentUser: {

        fontFamily: 'Ubuntu_700Bold'

    },
    commentDate: {
        color: '#999999',
        fontFamily: 'Ubuntu_400Regular'
    },
    commentHour: {
        paddingTop: 10,
        alignItems: 'flex-end',

    },
    identacao: {
        marginTop: 10,
        //backgroundColor:'red',

    },




});

export default RecipeSelected;