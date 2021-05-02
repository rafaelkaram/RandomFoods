import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Rating, Avatar } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Entypo } from '@expo/vector-icons';
import moment from 'moment';

import "moment/min/locales";

import api from '../../services/api'

import { IComentario, IReceita } from '../../constants/interfaces';
import colors from '../../constants/colors';

import RegularText from '../../components/RegularText';
import Category from '../../components/Category';
import BoldText from '../../components/BoldText';

const { height, width } = Dimensions.get('window');
const numberGrid = 3;
const itemWidth = width / numberGrid;
moment.locale('pt-br');

function SelectedRecipe({ route }: { route: any }) {

    const idRecipe = route.params.id;
    const [recipe, setRecipe] = useState<IReceita>();
    const [comments, setComments] = useState<IComentario[]>([]);
    const [initials, setInitials] = useState<string>('');

    useEffect(() => {

        api.get(`/busca/receita/${idRecipe}`).then(response => {
            setRecipe(response.data);

            const names = response.data?.usuario.nome.split(" ")

            const tam = names.length - 1
            const firstName: string = names[0]
            const lastName: string = names[tam]
            setInitials(firstName[0] + lastName[0]);

        });
        api.get(`busca/comentario-receita/${idRecipe}`)
            .then(response => {
                setComments(response.data);
            });
        // api.get(`receita/${idRecipe}`).then(response => {
        //     setRecipe(response.data);
        //     setNota(recipe?.nota)

        //     const names= response.data?.usuario.split(" ")

        //     const tam  = names.length - 1
        //     const firstName :string = names[0]
        //     const lastName :string = names[tam]
        //     setInitials(firstName[0]+lastName[0]);

        // });
        // api.get(`comentar/${idRecipe}`)
        //     .then(response => {
        //         //console.log(response.data);
        //         setComments(response.data.comentarios);
        //         setSubComments(response.data.filhos);
        //     });
    }, []);

    const ShowComments = ({ comentarios }: { comentarios: any[] }) => {

        if (!comentarios) {
            return (<Text>Vamos comentar galera!</Text>);
        } else {
            return (

                <View style={styles.comments} >
                    { comentarios.map(comment => {
                        return (
                            <View key={comment.id}>
                                <View style={styles.singleComment}>
                                    <View>
                                        <View style={styles.commentTitle}>
                                            <View style={styles.commentUserDate}>
                                                <BoldText>{comment.usuario.nome}</BoldText>
                                                <RegularText style={styles.commentDate}> - {moment(comment.data).startOf('day').fromNow()}</RegularText>
                                            </View>
                                            {/* <Rating imageSize={10} readonly startingValue={Number(comment?.avaliacao)} /> */}

                                        </View>
                                    </View>

                                    <RegularText>{comment.valor}</RegularText>
                                    <View style={styles.commentHour}>
                                        <Text>{moment(comment.data).format('HH:mm')}</Text>
                                    </View>
                                </View>
                                <ShowSubComment sub={comment.id} />
                            </View>
                        )
                    })}
                </View>
            );
        }
    }

    const ShowSubComment = ({ sub }: { sub: any }) => {
        const childComments = comments.filter(obj => obj.comentarioPai === sub);
        if (childComments) {
            return (
                <View style={styles.identacao}>
                    <ShowComments comentarios={childComments} />
                </View>
            );

        }
        return (<></>);
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.itemListTitle}>
                        <BoldText style={styles.titleText}>{recipe?.nome}</BoldText>

                    </View>
                    <View style={styles.autor}>
                        <Avatar
                            size="small"
                            rounded
                            title={initials}
                            activeOpacity={0.7}
                            containerStyle={{ backgroundColor: 'lightgrey' }}
                        />
                        <Text style={styles.autorName}>{recipe?.usuario.nome}</Text>
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
                                    <RegularText>{ingredient.qtde ? `: ${ingredient.qtde.toString().replace('.00', '')}` : ' a gosto'}</RegularText>
                                </View>
                            )
                        })}
                    </View>

                    <View style={styles.itemListDescribe}>
                        <RegularText>{recipe?.descricao.split('\\n').map((desc, index) => (
                            <Text key={index}>{'\n'}{desc}</Text>))}</RegularText>
                    </View>
                    <ShowComments comentarios={comments.filter(comentario => (comentario.comentarioPai === null))} />

                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    itemListTitle: {
        backgroundColor: colors.dimmedBackground,
        margin: 3,
        padding: 10,
    },

    titleText: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },
    autor: {
        margin: 10,
        padding: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
    },
    autorName: {
        marginLeft: 15,
    },
    rating: {
        backgroundColor: colors.dimmedBackground,
    },

    container: {
        flex: 1,
        backgroundColor: colors.background
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
        flexDirection: 'row',
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