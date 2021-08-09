import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Avatar } from 'react-native-elements';
import { ICurtidaSimples } from '../constants/interfaces';
import globalStyles from './../styles/Global'
import styles from '../styles/components/CurtidasModal';

const CurtidasModal = ({
    curtidas,
    navigate
}: {
    curtidas: ICurtidaSimples[],
    navigate: Function
}) => {
    return (
        <View>
            {
                curtidas.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={() => navigate(item.usuario.id)}
                            style={styles.usuarioCurtida}>

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
                            <View style={styles.containerCurtidas}>
                                <View>
                                    <Text style={styles.usuarioCurtidaName}>{item.usuario.nome}</Text>
                                    <Text style={[styles.usuarioCurtidaUsername, globalStyles.regularText]}>{`@${item.usuario.login}`}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )

                })
            }

        </View >
    );
}

export default CurtidasModal;