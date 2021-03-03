import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView, StyleSheet, Dimensions, FlatList, TouchableOpacity } from 'react-native'
import { Rating, AirbnbRating } from 'react-native-elements';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import "moment/min/locales";

import { IComment, IRecipe } from '../constants/interfaces';
import Colors from '../constants/colors';
import RegularText from '../components/RegularText';
import Category from '../components/Category';
import BoldText from '../components/BoldText';
import api from '../services/api'

const { height, width } = Dimensions.get('window')
const numberGrid = 3;
const itemWidth = width / numberGrid;
moment.locale('pt-br');

function SelectedRecipe({ route }: { route: any }) {

    const idRecipe = route.params.id;
    const [recipe, setRecipe] = useState<IRecipe>();
    const [comments, setComments] = useState<IComment[]>([]);
    const [subComments, setSubComments] = useState<IComment[]>([]);
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
                        <View key={ comment.id }>
                            <View style={styles.singleComment}>
                                <View>
                                    <View style={styles.commentTitle}>
                                        <View style={styles.commentUserDate}>
                                            <BoldText>{comment.usuario}</BoldText>
                                            <RegularText style={styles.commentDate}> - {moment(comment.data).startOf('day').fromNow()}</RegularText>
                                        </View>
                                        <Rating imageSize={10} readonly startingValue={comment?.avaliacao} />

                                    </View>
                                </View>

                                <RegularText>{comment.valor}</RegularText>
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
                        <BoldText style={ styles.titleText }>{recipe?.receita}</BoldText>

                    </View>
                    <View style={styles.note}>
                        <BoldText>NOTA:</BoldText>
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
                        <BoldText>INGREDIENTES:</BoldText>
                        {recipe?.ingredientes.map(ingredient => {
                            return (
                                <View style={styles.ingredient} key={ingredient.id}>
                                    <Entypo name="dot-single" size={15} color="black" />
                                    <RegularText>{ingredient.nome}</RegularText>
                                    <RegularText>{ingredient.quantidade ? `: ${ingredient.quantidade.toString().replace('.00', '')}` : ' a gosto'}</RegularText>
                                </View>
                            )
                        })}
                    </View>

                    <View style={styles.itemListDescribe}>
                        <RegularText>{recipe?.descricao.split('\\n').map((desc, index) => (
                            <Text key={index}>{'\n'}{desc}</Text>))}</RegularText>
                    </View>
                    <ShowComments comentarios={comments} />

                </View>

            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    itemListTitle: {
        backgroundColor: Colors.dimmedBackground,

        margin: 3,
        padding: 10,
    },

    titleText: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },

    rating: {
        backgroundColor: Colors.dimmedBackground,
    },

    container: {
        flex: 1,
        backgroundColor: Colors.background
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
    },

    commentUserDate: {
        flexDirection: 'row',
    },

    commentDate: {
        color: '#999'
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

export default SelectedRecipe;