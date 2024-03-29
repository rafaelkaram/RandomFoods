import React from 'react';
import { Text, TouchableOpacity, View, SafeAreaView } from 'react-native';
import { Avatar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { SimpleLineIcons } from '@expo/vector-icons';

import { ISeguidor, IUsuario, IUsuarioSimples } from '../constants/interfaces';
import screens from '../constants/screens';
import styles from '../styles/components/SeguidoresList';
import globalStyles from '../styles/Global';

const SeguidoresList = ({
    seguidores,
    seguidor,
    deixarSeguir,
    contextUser,
    user
}: {
    seguidores: ISeguidor[],
    seguidor: boolean,
    deixarSeguir: Function,
    contextUser: IUsuario | undefined,
    user: IUsuarioSimples
}) => {

    let verification = false
    if (contextUser?.id == user.id) {
        verification = true
    }

    const navigation = useNavigation();

    const handleNavigateToPerfil = (id: number) => {
        navigation.navigate(screens.perfil, { id: id });
    }


    return (
        <SafeAreaView>

            {seguidores.length > 0 ?
                <>
                    {seguidores.map(item => {
                        return (
                            <TouchableOpacity
                                onPress={() => handleNavigateToPerfil(item.usuario.id)}
                                style={styles.seguidor} key={item.id}>

                                {item.usuario.path ? (
                                    <Avatar
                                        size='small'
                                        rounded
                                        activeOpacity={0.7}
                                        containerStyle={{ backgroundColor: 'lightgrey' }}
                                        source={{ uri: item.usuario.path }}
                                    />)
                                    :
                                    <Avatar
                                        size='small'
                                        rounded
                                        title={item.usuario.iniciais}
                                        activeOpacity={0.7}
                                        containerStyle={{ backgroundColor: 'lightgrey' }}
                                    />
                                }
                                <View style={styles.container}>
                                    <View>
                                        <Text style={styles.seguidorName}>{item.usuario.nome}</Text>
                                        <Text style={[styles.seguidorUsername, globalStyles.regularText]}>{`@${item.usuario.login}`}</Text>
                                    </View>
                                    {verification && !seguidor &&

                                        <TouchableOpacity onPress={() => deixarSeguir(item.id, item.usuario.nome)} style={[{ alignItems: 'center' }, styles.botaoUnfollow]}>
                                            <SimpleLineIcons name="user-unfollow" size={20} color={'white'} />
                                        </TouchableOpacity>

                                    }
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </>
                :
                <View>
                    {
                        verification ?
                            <Text style={[globalStyles.subTitleText, globalStyles.recipeListSubTitle, { marginTop: 20 }]}>{seguidor ? 'Você não possui seguidores!' : 'Você não está seguindo ninguém!'}</Text>
                            :
                            <Text style={[globalStyles.subTitleText, globalStyles.recipeListSubTitle, { marginTop: 20 }]}>{seguidor ? `${user.nome} não possui seguidores!` : `${user.nome} não está seguindo ninguém!`}</Text>
                    }

                </View>
            }


        </SafeAreaView>

    );
}

export default SeguidoresList;