import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import { Feather, Ionicons } from '@expo/vector-icons';

import styles from '../styles/components/UserHeader';
import globalStyles from '../styles/Global';
import screens from '../constants/screens';
import { IUsuarioSimples } from '../constants/interfaces';

const UserHeader = ({
    usuario,
    seguidores,
    seguidos,
    totalReceitas,
    isPainel
}: {
    usuario: IUsuarioSimples,
    seguidores: number,
    seguidos: number,
    totalReceitas: number,
    isPainel: boolean
}) => {

    const navigation = useNavigation();

    const toggleDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const handleNavigateToPerfil = (id: number) => {
        navigation.dispatch(DrawerActions.jumpTo('Receitas Cadastradas', {screen: 'Perfil', params: {id: id} }));
    }

    const handleNavigateToNovaReceita = () => {
        navigation.dispatch(DrawerActions.jumpTo('Nova Receita'));
    }

    const handleNavigateToSeguidores = (id: number, seguidor: boolean) => {
        navigation.navigate(screens.seguidores, { id: id, seguidor });
    }


    return (
        <View>
            <View style={styles.container}>
                {usuario.path ?
                    <Avatar
                        size='large'
                        rounded
                        title={usuario.iniciais}
                        source={{ uri: usuario.path }}
                        activeOpacity={0.7}
                        containerStyle={{ backgroundColor: 'lightgrey' }}
                    />
                    :
                    <Avatar
                        size='large'
                        rounded
                        title={usuario.iniciais}
                        activeOpacity={0.7}
                        containerStyle={{ backgroundColor: 'lightgrey' }}
                    />}

                <View style={usuario.nome.length > 10 ? styles.nameContainer : null}>
                    <Text style={[globalStyles.boldText, styles.name]}>{usuario.nome}</Text>
                    <Text style={usuario.nome.length > 10 ? [globalStyles.regularText, styles.bigLogin] : [globalStyles.regularText, styles.login]}>@{usuario.login}</Text>
                    <View style={styles.segContainer}>
                        <TouchableOpacity style={styles.seg} onPress={() => handleNavigateToSeguidores(usuario.id, true)}>
                            <Text style={usuario.nome.length > 10 ? [globalStyles.regularText, styles.bigNumberSeg] : [globalStyles.regularText, styles.numberSeg]}>{seguidores ? seguidores : 0}</Text>
                            <Text style={usuario.nome.length > 10 ? [globalStyles.boldText, styles.bigTextSeg] : [globalStyles.boldText, styles.textSeg]}>Seguidores</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.seg} onPress={() => handleNavigateToSeguidores(usuario.id, false)}>
                            <Text style={usuario.nome.length > 10 ? [globalStyles.regularText, styles.bigNumberSeg] : [globalStyles.regularText, styles.numberSeg]}>{seguidos ? seguidos : 0}</Text>
                            <Text style={usuario.nome.length > 10 ? [globalStyles.boldText, styles.bigTextSeg] : [globalStyles.boldText, styles.textSeg]}>Seguindo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={{ position: 'absolute', right: 10, top: 20 }} onPress={() => toggleDrawer()}>
                <Feather name="menu" size={30} color="black" />
            </TouchableOpacity>
            {isPainel ?
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TouchableOpacity
                        style={styles.totalAndNewRecipes}
                        onPress={() => { handleNavigateToPerfil(usuario.id) }}
                    >
                        <Text style={styles.totalRecipesTitle}>Receitas Cadastradas:</Text>
                        <Text style={styles.totalRecipesText}>{totalReceitas}</Text>

                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleNavigateToNovaReceita()}
                        style={styles.totalAndNewRecipes}>
                        <Text style={styles.totalRecipesTitle}>Criar Nova Receita</Text>
                        <Ionicons name="add-circle-outline" size={35} color="black" />
                    </TouchableOpacity>

                </View>
                :
                <View style={styles.totalRecipes}>
                    <Text style={styles.totalRecipesTitle}>Receitas Cadastradas:</Text>
                    <Text style={styles.totalRecipesText}>{totalReceitas}</Text>
                </View>
            }
        </View>
    )
}

export default UserHeader;