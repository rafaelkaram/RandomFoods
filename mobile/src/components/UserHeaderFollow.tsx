import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from 'react-native-elements';
import { SimpleLineIcons } from '@expo/vector-icons';

import styles from '../styles/components/UserHeaderFollow';
import globalStyles from '../styles/Global';

import { IUsuarioSimples } from '../constants/interfaces';
import screens from '../constants/screens';

const UserHeader = ({
    usuario,
    totalReceitas,
    isPainel,
    seguidores,
    seguidos,
    seguidor,
    seguirUsuario
}: {
    usuario: IUsuarioSimples,
    totalReceitas: number,
    isPainel: boolean,
    seguidores: number,
    seguidos: number,
    seguidor: boolean,
    seguirUsuario: Function
}) => {
    const navigation = useNavigation();

    const handleNavigateToPerfil = (id: number) => {
        navigation.navigate(screens.perfil, { id: id });
    }

    const handleNavigateToSeguidores = (id: number, seguidor: boolean) => {
        navigation.navigate(screens.seguidores, { id: id, seguidor });
    }

    return (
        <View>
            <View style={styles.container}>
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
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
                    {
                        seguidor ?
                            <TouchableOpacity onPress={() => seguirUsuario()} style={[{ alignItems: 'center' }, styles.filterBoxSelected]}>
                                <Text style={[{ marginRight: 5 }, globalStyles.regularText, styles.following]}>Seguindo</Text>
                                <SimpleLineIcons name="user-following" size={18} color={'white'} />
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => seguirUsuario()} style={[styles.filterBox]}>
                                <Text style={[{ marginRight: 5 }, globalStyles.regularText]}>Seguir</Text>
                                <SimpleLineIcons name="user-follow" size={18} color={'black'} />
                            </TouchableOpacity>
                    }

                </View>
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
            </View >
            {
                isPainel ?
                    <TouchableOpacity
                        style={styles.totalRecipes
                        }
                        onPress={() => { handleNavigateToPerfil(usuario.id) }}
                    >
                        <Text style={styles.totalRecipesTitle}>Receitas Cadastradas:</Text>
                        <Text style={styles.totalRecipesText}>{totalReceitas}</Text>
                    </TouchableOpacity >
                    :
                    <View style={styles.totalRecipes}>
                        <Text style={styles.totalRecipesTitle}>Receitas Cadastradas:</Text>
                        <Text style={styles.totalRecipesText}>{totalReceitas}</Text>
                    </View>
            }
        </View >
    )
}

export default UserHeader;