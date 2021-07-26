import React from 'react';
import { Image, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import MultiSlider from '@ptomasroos/react-native-multi-slider';

import { WIDTH } from '../constants/dimensions';
import colors from '../constants/colors';
import styles from '../styles/components/FilterModal';
import globalStyles from '../styles/Global';

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
            animationType='none'
            transparent={ true }
            visible={ modalFilter }
            onRequestClose={() => {
                setModalFilter(!modalFilter);
            }}
        >
            <BlurView intensity={200} style={[ StyleSheet.absoluteFill, css.nonBlurredContent ]}>
                <View style={ styles.filterContainer}>
                    <TouchableOpacity
                        style={ globalStyles.modalX }
                        onPress={() => setModalFilter(!modalFilter)}
                    >
                        <Text style={ styles.filterClose }>X</Text>
                    </TouchableOpacity>
                    <View style={{ ...globalStyles.modalContainer, width: WIDTH * 0.8, height: 400 }}>
                        <Text style={ styles.filterTitle }>Filtros Selecionados</Text>
                        <ScrollView>
                            <View style={ styles.filter }>
                                <View>
                                    <Text style={[ globalStyles.subTitleText, css.filterListTitle ]}>Categorias</Text>
                                    <View style={{ ...css.modalFilter, justifyContent: 'flex-start', paddingHorizontal: 0 }}>
                                        { categorias.map((categoria, index) => {
                                            return (
                                                <View key={index}>
                                                    <TouchableOpacity
                                                        style={ categoriasSelecionadas.includes(categoria) ? css.filterBoxSelected : css.filterBox }
                                                        onPress={() => { filterCategory(categoria) }}
                                                    >
                                                        <Text style={[ globalStyles.regularText, categoriasSelecionadas.includes(categoria) && css.filterNameSelected ]}>{categoria}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>
                                <View>
                                    <Text style={[ globalStyles.subTitleText, css.filterListTitle ]}>Tipos</Text>
                                    <View style={{ ...css.modalFilter, justifyContent: 'flex-start', paddingHorizontal: 0 }}>
                                        { tipos.map((tipo, index) => {
                                            return (
                                                <View key={ index }>
                                                    <TouchableOpacity
                                                        style={ tiposSelecionados.includes(tipo) ? css.filterBoxSelected : css.filterBox }
                                                        onPress={() => { filterType(tipo) }}
                                                    >
                                                        <Text style={[ globalStyles.regularText, tiposSelecionados.includes(tipo) && css.filterNameSelected ]}>{ tipo }</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>
                                <View>
                                    <Text style={[ globalStyles.subTitleText, css.filterListTitle ]}>Tempo de Preparo</Text>
                                    <View style={{ alignItems: 'center' }}>
                                        <MultiSlider
                                            customMarker={() => { return (<Image source={require('../../assets/chapeuSlider.png')} style={{ width: 30, height: 30 }} />) }}
                                            values={ [tempoDePreparo[0], tempoDePreparo[1]] }
                                            min={ tempos[0] }
                                            max={ tempos[1] }
                                            sliderLength={ WIDTH * 0.6 }
                                            minMarkerOverlapDistance={ 12 }
                                            onValuesChange={(value) => setTempoDePreparo(value)}
                                            trackStyle={{ height: 10, borderRadius: 5 }}
                                            selectedStyle={{ backgroundColor: colors.translucidPrimary }}
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

export default FilterModal;