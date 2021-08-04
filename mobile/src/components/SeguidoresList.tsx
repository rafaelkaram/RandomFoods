import React from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import { Avatar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { SimpleLineIcons } from '@expo/vector-icons';
import colors from "../../src/constants/colors";

import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';

import { ISeguidor } from '../constants/interfaces';
import screens from '../constants/screens';
import styles from '../styles/components/SeguidoresList';
import globalStyles from '../styles/Global';
import { WIDTH } from '../constants/dimensions';


const SeguidoresList = ({
    seguidores,
    seguidor,
    deixarSeguir
}: {
    seguidores: ISeguidor[],
    seguidor: boolean,
    deixarSeguir: Function
}) => {

    const navigation = useNavigation();

    const handleNavigateToPerfil = (id: number) => {
        navigation.navigate(screens.perfil, { id: id });
    }


    return (
        <View>

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
                                <Text style={[styles.seguidorUsername, globalStyles.regularText]}>{item.usuario.login}</Text>
                            </View>
                            {!seguidor &&
                                <TouchableOpacity onPress={() => deixarSeguir(item.id)} style={[{ alignItems: 'center' }, styles.botaoUnfollow]}>
                                    <SimpleLineIcons name="user-unfollow" size={20} color={'white'} />
                                </TouchableOpacity>
                            }

                        </View>
                    </TouchableOpacity>
                )
            })}
        </View>

    );
}

export default SeguidoresList;