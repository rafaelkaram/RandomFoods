import React, { useState } from 'react';
import { Text, TouchableOpacity, View, ScrollView, Modal, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { Avatar } from 'react-native-elements';
import { ICurtidaSimples } from '../constants/interfaces';
import globalStyles from './../styles/Global'
import styles from '../styles/components/CurtidasModal';
import { WIDTH } from '../constants/dimensions';

const CurtidasModal = ({
    curtidas,
    navigate,
    logado
}: {
    curtidas: ICurtidaSimples[],
    navigate: Function,
    logado: boolean

}) => {
    const [modalVisible, setModalVisible] = useState(false)
    return (
        <View>
            <TouchableOpacity onPress={() => curtidas.length > 0 ? setModalVisible(true) : null} style={logado ? styles.curtidasContainer : [styles.curtidasContainer, { maxWidth: WIDTH - 250 }]}>
                <Text style={logado ? styles.numCurtida : [styles.numCurtida, { alignSelf: 'center' }]}>{curtidas.length == 1 ? curtidas.length + " curtida " : curtidas.length + " curtidas "}</Text>
            </TouchableOpacity>
            <Modal
                animationType='none'
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => { setModalVisible(!modalVisible); }}
            >
                <BlurView intensity={200} style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}>
                    <TouchableOpacity
                        style={globalStyles.modalX}
                        onPress={() => setModalVisible(!modalVisible)}
                    >
                        <Text style={{ ...globalStyles.boldText, alignSelf: 'center', color: 'white' }}>X</Text>
                    </TouchableOpacity>
                    <View style={{ ...globalStyles.modalContainer }}>
                        <ScrollView>
                            <TouchableOpacity
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                {
                                    curtidas.map((item, index) => {
                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => { setModalVisible(false), navigate(item.usuario.id) }}
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
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </BlurView>
            </Modal>


        </View >
    );
}

export default CurtidasModal;