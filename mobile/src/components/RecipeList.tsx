import React from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { Avatar } from 'react-native-elements';
import colors from "../../src/constants/colors";

import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

import { IReceitaSimples } from '../constants/interfaces';
import styles from '../styles/components/RecipeList';
import globalStyles from '../styles/Global';
import { WIDTH } from '../constants/dimensions';


const RecipeList = (props: { titulo: string, receitas: IReceitaSimples[], navegar: Function }) => {
    const titulo = props.titulo;
    const receitas = props.receitas;
    const navegar = props.navegar;

    return (
        <View>
            <Text style={[globalStyles.subTitleText, globalStyles.recipeListSubTitle]}>{titulo}</Text>
            <View style={styles.recipeListColumns}>
                {receitas.map(item => {
                    return (
                        <TouchableOpacity
                            onPress={() => navegar(item.id)}
                            style={styles.main} key={item.id}>

                            <View>
                                <Image
                                    source={{ uri: item.foto }}
                                    style={styles.image}
                                />
                            </View>

                            <View style={{ width: WIDTH - 140 }}>

                                <View style={styles.textContainer}>
                                    <Text>{item.receita}</Text>
                                    <Text style={[globalStyles.regularText, { fontSize: 10, margin: 5 }]} >@{item.usuario.login}</Text>
                                    <View style={ styles.likeComment }>
                                        <AntDesign style={{margin: 5}} name='heart' size={20} color={colors.primary} />
                                        <Text style={{margin: 5}}>{ item.curtidas }</Text>
                                        <MaterialCommunityIcons style={{margin: 5}} name='comment' size={20} color='gray' />
                                        <Text style={{margin: 5}}>{ item.comentarios }</Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                    {
                                        item.categorias.length > 0 ?

                                            item.categorias.map((categoria, index) => {

                                                return (

                                                    <Image
                                                        key={index}
                                                        // source={require('./../../assets/VEGANA.png')}
                                                        source={{ uri: `http://192.168.100.5:3333/uploads/midia/categoria/${categoria}.png` }}
                                                        style={{ width: 40, height: 40 }}
                                                    />

                                                )
                                            }) : null
                                    }
                                </View>
                            </View>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    );
}

export default RecipeList;