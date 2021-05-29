import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import BoldText from '../components/BoldText';
import RegularText from '../components/RegularText';

const FilterModal = (
    props: {
        modalFilter: boolean,
        derivadoLeite: boolean,
        gluten: boolean,
        categoriasSelecionadas: string[],
        categorias: string[],
        tipos: string[],
        tiposSelecionados: string[],
        tempoDePreparo: number,
        tempos: number[],
        filterCategory: Function,
        filterType: Function,
        setModalFilter: Function,
        setTempoDePreparo: Function,
        setGluten: Function,
        setDerivadoLeite: Function,
    }) => {
        const modalFilter = props.modalFilter
        const derivadoLeite = props.derivadoLeite
        const gluten = props.gluten
        const categoriasSelecionadas = props.categoriasSelecionadas
        const categorias = props.categorias
        const tipos = props.tipos
        const tiposSelecionados = props.tiposSelecionados
        const tempoDePreparo = props.tempoDePreparo
        const tempos = props.tempos
        const filterCategory = props.filterCategory
        const filterType = props.filterType
        const setGluten = props.setGluten
        const setDerivadoLeite = props.setDerivadoLeite
        const setModalFilter = props.setModalFilter
        const setTempoDePreparo = props.setTempoDePreparo
    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={modalFilter}
            onRequestClose={() => {
                setModalFilter(!modalFilter);
            }}
        >
            <BlurView intensity={200} style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}>
                <TouchableOpacity
                    style={styles.modalX}
                    onPress={() => setModalFilter(!modalFilter)}
                >
                    <BoldText style={{ alignSelf: 'center', color: 'white' }}>X</BoldText>
                </TouchableOpacity>
                <BoldText style={{ marginBottom: 10 }}>Filtros Selecionados</BoldText>
                <View style={styles.modalContainer}>
                    <ScrollView style={{ maxHeight: Width }}>
                        <View style={styles.filter}>
                            <View>
                                <Text style={styles.filterListTitle}>Alérgicos</Text>
                                <View style={styles.modalFilter}>
                                    <View>
                                        <TouchableOpacity
                                            style={derivadoLeite === true ? styles.filterBoxSelected : styles.filterBox}
                                            onPress={() => { derivadoLeite === false ? setDerivadoLeite(true) : setDerivadoLeite(false) }}
                                        >
                                            <RegularText style={derivadoLeite === false ? styles.filterName : styles.filterNameSelected}>Sem lactose</RegularText>

                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <TouchableOpacity
                                            style={gluten === true ? styles.filterBoxSelected : styles.filterBox}
                                            onPress={() => { gluten === false ? setGluten(true) : setGluten(false) }}
                                        >
                                            <RegularText style={gluten === false ? styles.filterName : styles.filterNameSelected}>Sem glúten</RegularText>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <View>
                                <Text style={styles.filterListTitle}>Categorias</Text>
                                <View style={styles.modalFilter}>
                                    {categorias.map((categoria, index) => {
                                        return (
                                            <View key={index}>
                                                <TouchableOpacity
                                                    style={categoriasSelecionadas.includes(categoria) ? styles.filterBoxSelected : styles.filterBox}
                                                    onPress={() => { filterCategory(categoria) }}
                                                >
                                                    <RegularText style={!categoriasSelecionadas.includes(categoria) ? styles.filterName : styles.filterNameSelected}>{categoria}</RegularText>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
                            <View>
                                <Text style={styles.filterListTitle}>Tipos</Text>
                                <View style={styles.modalFilter}>
                                    {tipos.map((tipo, index) => {
                                        return (
                                            <View key={index}>
                                                <TouchableOpacity
                                                    style={tiposSelecionados.includes(tipo) ? styles.filterBoxSelected : styles.filterBox}
                                                    onPress={() => { filterType(tipo) }}
                                                >
                                                    <RegularText style={!tiposSelecionados.includes(tipo) ? styles.filterName : styles.filterNameSelected}>{tipo}</RegularText>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })}
                                </View>
                            </View>
                            <View>
                                <Text style={styles.filterListTitle}>Tempo de Preparo</Text>
                                <View style={styles.modalFilter}>
                                    <View>
                                        {tempos.map((tempo, index) => {
                                            return (
                                                <View key={index}>
                                                    <TouchableOpacity
                                                        style={tempoDePreparo === tempo ? styles.filterBoxSelected : styles.filterBox}
                                                        onPress={() => { tempoDePreparo === tempo ? setTempoDePreparo(undefined) : setTempoDePreparo(tempo) }}
                                                    >
                                                        <RegularText style={tempoDePreparo !== tempo ? styles.filterName : styles.filterNameSelected}>
                                                            {tempo === 1 ? ("Até 30 Minutos") : tempo === 2 ? ("30 Minutos") : "Mais de 30 Minutos"}
                                                        </RegularText>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </BlurView>
        </Modal>
    )
}

const Height = Dimensions.get("window").height;
const Width = Dimensions.get("window").width;

const styles = StyleSheet.create({
    modalX: {
        backgroundColor: '#e02041',
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignSelf: 'flex-end'
    },
    nonBlurredContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalContainer: {
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        borderColor: '#E5EAFA',
        borderWidth: 3,
        width: Width * 0.7,
        height: Height * 0.6,
    },
    filter: {
        margin: 10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 0,
    },
    filterListTitle: {
        color: "#f87062",
        textShadowColor: 'black',
        textShadowRadius: 0.5,
        textShadowOffset: {
            width: 0.5,
            height: 0.5,

        },
        margin: 10,
    },
    modalFilter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    filterBox: {
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EAEAEA',
        borderRadius: 8,
        height: 40,
        padding: 5,
        margin: 5,
        justifyContent: 'center'
    },

    filterBoxSelected: {
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e02041',
        borderRadius: 8,
        height: 40,
        padding: 5,
        margin: 5,
        justifyContent: 'center'
    },

    filterName: {
        color: 'black'
    },

    filterNameSelected: {
        color: 'white'
    },
})
export default FilterModal