import React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, } from 'react-native';
import { Rating, Avatar, } from 'react-native-elements';

import { IReceitaSimples } from '../constants/interfaces';
import colors from '../constants/colors';

import ItalicText from '../components/ItalicText';

import BoldText from '../components/BoldText';

const { height, width } = Dimensions.get('window');
const numberGrid = 3;
const itemWidth = width / numberGrid;
const itemHeight = height / numberGrid;

const RecipeList = (props: { titulo: string, receitas: IReceitaSimples[], navegar: Function }) => {
    const titulo = props.titulo;
    const receitas = props.receitas;
    const navegar = props.navegar;

    return (
        <View>
            <ItalicText style={styles.subTitle}>{titulo}</ItalicText>
            <View style={styles.columns}>
                {receitas.map(item => {
                    return (
                        <View style={styles.itemList} key={item.id}>
                            <TouchableOpacity
                                onPress={() => navegar(item.id)}>
                                {item.foto ? (
                                    <Avatar
                                        size="large"
                                        source={{ uri: item.foto }}
                                        activeOpacity={0.7}
                                        containerStyle={styles.itemListImage}
                                        rounded
                                    />
                                ) : (<Text style={styles.itemListImage}>{item.receita}</Text>)
                                }
                                <BoldText style={styles.itemListTitle}>{item.receita}</BoldText>
                                <Rating imageSize={20} readonly startingValue={Number(item.nota)} />
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        backgroundColor: colors.dimmedBackground,
        color: 'white',

        fontSize: 19,
        textAlign: 'center',

        margin: 3,
        padding: 10,
        marginHorizontal: 10,
        borderRadius: 25

    },


    subTitle: {
        marginBottom: 10,
        textAlign: 'center',
        fontSize: 20,
        margin: 3,
    },

    container: {
        flex: 1,
    },

    columns: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },

    itemList: {
        backgroundColor: 'white',
        margin: 15,
        padding: 10,
        width: itemWidth,

        flexDirection: 'column',
        borderRadius: 20,
    },

    itemListImage: {
        height: itemHeight * 0.45,
        width: '100%',
        borderRadius: 20,
        textAlign: 'center',
        alignSelf: 'center'
    },

    itemListTitle: {
        marginTop: 5,
        fontSize: 15,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default RecipeList;