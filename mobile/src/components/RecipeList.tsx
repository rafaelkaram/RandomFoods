import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import colors from "../../src/constants/colors";

import { AntDesign } from '@expo/vector-icons';

import { IReceitaSimples } from '../constants/interfaces';
import styles from '../styles/components/RecipeList';
import globalStyles from '../styles/Global';


const RecipeList = (props: { titulo: string, receitas: IReceitaSimples[], navegar: Function }) => {
    const titulo = props.titulo;
    const receitas = props.receitas;
    const navegar = props.navegar;

    return (
        <View>
            <Text style={[ globalStyles.subTitleText, globalStyles.recipeListSubTitle ]}>{titulo}</Text>
            <View style={ styles.recipeListColumns }>
                { receitas.map(item => {
                    return (
                        <View style={ styles.recipeListContainer } key={item.id}>
                            <TouchableOpacity
                                onPress={() => navegar(item.id)}>
                                { item.foto ? (
                                    <Avatar
                                        size="large"
                                        source={{ uri: item.foto }}
                                        activeOpacity={0.7}
                                        containerStyle={ styles.recipeListImage }
                                        rounded
                                    />
                                ) : (<Text style={ styles.recipeListImage }>{ item.receita }</Text>)
                                }
                                <Text style={[ globalStyles.boldText, styles.recipeListTitle ]}>{item.receita}</Text>
                                <AntDesign style={styles.likeHeart} name='heart' size={20} color={colors.primary}/>
                            </TouchableOpacity>
                        </View>
                    )
                })}
            </View>
        </View>
    );
}

export default RecipeList;