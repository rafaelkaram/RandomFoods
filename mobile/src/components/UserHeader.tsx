import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';

import styles from '../styles/components/UserHeader';
import globalStyles from '../styles/Global';
import screens from '../constants/screens';
import { IUsuarioSimples } from '../constants/interfaces';
import { WIDTH } from '../constants/dimensions';

const UserHeader = ({
    usuario,
    totalReceitas,
    isPainel
}: {
    usuario: IUsuarioSimples,
    totalReceitas: number,
    isPainel: boolean
}) => {
    const navigation = useNavigation();

    const toggleDrawer = () => {
        //Props to open/close the drawer
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const handleNavigateToPerfil = (id: number) => {
        navigation.navigate(screens.perfil, { id: id });
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
                    <Text style={[globalStyles.regularText, styles.login]}>@{usuario.login}</Text>
                    <View style={styles.segContainer}>
                        <View style={styles.seg}>
                            <Text style={[globalStyles.regularText, styles.numberSeg]}>0</Text>
                            <Text style={[globalStyles.boldText, styles.textSeg]}>Seguidores</Text>
                        </View>
                        <View style={styles.seg}>
                            <Text style={[globalStyles.regularText, styles.numberSeg]}>0</Text>
                            <Text style={[globalStyles.boldText, styles.textSeg]}>Seguindo</Text>
                        </View>
                    </View>
                </View>
            </View>
            <TouchableOpacity style={{ position: 'absolute', right: 10, top: 20}} onPress={() => toggleDrawer()}>
                    <Feather name="menu" size={30} color="black" />
                </TouchableOpacity>
            {isPainel ?
                <TouchableOpacity
                    style={styles.totalRecipes}
                    onPress={() => { handleNavigateToPerfil(usuario.id) }}
                >
                    <Text style={styles.totalRecipesTitle}>Receitas Cadastradas:</Text>
                    <Text style={styles.totalRecipesText}>{totalReceitas}</Text>
                </TouchableOpacity>
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