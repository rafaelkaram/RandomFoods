import React,{useContext} from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { Avatar, Icon } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';
import colors from "../../src/constants/colors";
import AuthContext from '../contexts/auth';

import Category from '../components/Category';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

import { IReceitaSimples, IUsuario } from '../constants/interfaces';
import styles from '../styles/components/RecipeList';
import globalStyles from '../styles/Global';
import { WIDTH } from '../constants/dimensions';


const RecipeList = (props: { titulo: string, receitas: IReceitaSimples[], navegar: Function, idUser?: number, deletarReceita?:Function }) => {
    const titulo = props.titulo;
    const receitas = props.receitas;
    const navegar = props.navegar;
    const deletarReceita = props.deletarReceita;
   
    const { user } = useContext(AuthContext);
    let validar = false
    if (props.idUser){
        if (user?.id == props.idUser) {
            validar = true
        }
    }
    

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
                                    <View>
                                        <Text>{item.receita}</Text>
                                        <Text style={[globalStyles.regularText, { fontSize: 10, margin: 5 }]} >@{item.usuario.login}</Text>
                                        <View style={styles.likeComment}>
                                            <AntDesign style={{ margin: 5 }} name='heart' size={20} color={colors.primary} />
                                            <Text style={{ margin: 5 }}>{item.curtidas}</Text>
                                            <MaterialCommunityIcons style={{ margin: 5 }} name='comment' size={20} color='gray' />
                                            <Text style={{ margin: 5 }}>{item.comentarios}</Text>
                                            <Feather name="clock" style={{ margin: 5 }} size={20} color="black" />
                                            <Text style={{ margin: 5 }}>{item.tempoPreparo}</Text>
                                        </View>
                                    </View>
                                    <View>
                                        {validar && deletarReceita &&
                                            <TouchableOpacity  onPress={() => deletarReceita(item.id, item.receita)}>
                                                <AntDesign name="close" size={24} color="red" />
                                            </TouchableOpacity>
                                        }

                                    </View>

                                </View>

                                <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
                                    {
                                        item.categorias.length > 0 ?

                                            item.categorias.map((categoria, index) => {

                                                return (

                                                    <Category key={index} nome={categoria} />

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