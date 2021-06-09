import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Dimensions, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import BoldText from './BoldText';
import RegularText from './RegularText';
import colors from '../constants/colors';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import ItalicText from './ItalicText';

const { width, height } = Dimensions.get('window');

const FilterModal = (props: {
    modalFilter: boolean,
    categoriasSelecionadas: string[],
    categorias: string[],
    tipos: string[],
    tiposSelecionados: string[],
    tempoDePreparo: number[],
    tempos: number[],
    css: any,
    filterCategory: Function,
    filterType: Function,
    setModalFilter: Function,
    setTempoDePreparo: Function,
}) => {
    const modalFilter = props.modalFilter;
    const categoriasSelecionadas = props.categoriasSelecionadas;
    const categorias = props.categorias;
    const tipos = props.tipos;
    const tiposSelecionados = props.tiposSelecionados;
    const tempoDePreparo = props.tempoDePreparo;
    const css = props.css;
    const tempos = props.tempos;
    const filterCategory = props.filterCategory;
    const filterType = props.filterType;
    const setModalFilter = props.setModalFilter;
    const setTempoDePreparo = props.setTempoDePreparo;

    return (
        <Modal
            animationType="none"
            transparent={true}
            visible={modalFilter}
            onRequestClose={() => {
                setModalFilter(!modalFilter);
            }}
        >
            <BlurView intensity={200} style={[StyleSheet.absoluteFill, css.nonBlurredContent]}>
                <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                    <TouchableOpacity
                        style={ css.modalX}
                        onPress={() => setModalFilter(!modalFilter)}
                    >
                        <BoldText style={{ alignSelf: 'center', color: 'white' }}>X</BoldText>
                    </TouchableOpacity>
                    <View style={{ ...css.modalContainer, width: width * 0.8, height: 400 }}>
                        <BoldText style={{ marginVertical: 5, alignSelf: 'center' }}>Filtros Selecionados</BoldText>
                        <ScrollView>
                            <View style={ styles.filter }>
                                <View>
                                    <ItalicText style={ css.filterListTitle }>Categorias</ItalicText>
                                    <View style={{ ...css.modalFilter, justifyContent: 'flex-start', paddingHorizontal: 0 }}>
                                        { categorias.map((categoria, index) => {
                                            return (
                                                <View key={index}>
                                                    <TouchableOpacity
                                                        style={categoriasSelecionadas.includes(categoria) ? css.filterBoxSelected : css.filterBox }
                                                        onPress={() => { filterCategory(categoria) }}
                                                    >
                                                        <RegularText style={ categoriasSelecionadas.includes(categoria) && css.filterNameSelected }>{categoria}</RegularText>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>
                                <View>
                                    <ItalicText style={ css.filterListTitle }>Tipos</ItalicText>
                                    <View style={{ ...css.modalFilter, justifyContent: 'flex-start', paddingHorizontal: 0 }}>
                                        { tipos.map((tipo, index) => {
                                            return (
                                                <View key={index}>
                                                    <TouchableOpacity
                                                        style={tiposSelecionados.includes(tipo) ? css.filterBoxSelected : css.filterBox}
                                                        onPress={() => { filterType(tipo) }}
                                                    >
                                                        <RegularText style={ tiposSelecionados.includes(tipo) && css.filterNameSelected }>{tipo}</RegularText>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>
                                <View>
                                    <ItalicText style={ css.filterListTitle }>Tempo de Preparo</ItalicText>
                                    <View style={{ alignItems: 'center' }}>
                                        <MultiSlider
                                            customMarker={() => { return (<Image source={require('../../assets/chapeuSlider.png')} style={{ width: 30, height: 30 }} />) }}
                                            values={ [tempoDePreparo[0], tempoDePreparo[1]] }
                                            min={ tempos[0] }
                                            max={ tempos[1] }
                                            sliderLength={ width * 0.6 }
                                            minMarkerOverlapDistance={ 12 }
                                            onValuesChange={(value) => setTempoDePreparo(value)}
                                            trackStyle={{ height: 10, borderRadius: 5 }}
                                            selectedStyle={{ backgroundColor: colors.opaqueBackground }}
                                            unselectedStyle={{ backgroundColor: colors.button }}
                                        />
                                    </View>
                                    <View style={{ paddingHorizontal: 20, marginTop: -10 }}>
                                        <Text>Entre { tempoDePreparo[0] } min e { tempoDePreparo[1] } min</Text>
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </BlurView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    filter: {
        margin: 10,
        marginTop: 0,
    },
})

export default FilterModal;