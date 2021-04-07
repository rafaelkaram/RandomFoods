import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import api from '../services/api';
import { IIngredient } from '../constants/interfaces';
import DropDownPicker from 'react-native-dropdown-picker';

const IngredientMeasure = (props: { ingrediente: IIngredient, index: number }) => {

  const [ semMedida, setSemMedida ] = useState(true);

  const ingrediente: IIngredient = props.ingrediente;
  const unidades = ingrediente.unidades;

  if ( ingrediente.tipoUnidade === 'UNIDADE' ) {
    unidades.push({
      id: 5,
      nome: 'Unidade',
      sigla: 'U',
      taxaConversao: '1.000',
      tipo: 'UNIDADE',
    });
  } else if ( ingrediente.tipoUnidade === 'VOLUME' ) {
    unidades.push({
      id: 1,
      nome: 'Litro',
      sigla: 'L',
      taxaConversao: '1.000',
      tipo: 'VOLUME',
    });
    unidades.push({
      id: 2,
      nome: 'Mililitro',
      sigla: 'Ml',
      taxaConversao: '0.001',
      tipo: 'VOLUME',
    });
  } else {
    unidades.push({
      id: 3,
      nome: 'Miligrama',
      sigla: 'Mg',
      taxaConversao: '0.001',
      tipo: 'PESO',
    });
    unidades.push({
      id: 4,
      nome: 'Grama',
      sigla: 'g',
      taxaConversao: '1.000',
      tipo: 'PESO',
    });
    unidades.push({
      id: 6,
      nome: 'Quilograma',
      sigla: 'Kg',
      taxaConversao: '1000.000',
      tipo: 'PESO',
    });
  }

  const comboBox = unidades.map(unidade => {
    return { label: unidade.sigla, value: unidade.id }
  });

  return (

    <View
      key={ingrediente.id}
      style={ styles.item }
    >
      <Text style={{ lineHeight: 30 }}>{ ingrediente.nome }</Text>
      { !(ingrediente.tipoUnidade === 'UNIDADE' || semMedida ) && (
        <View style={{ zIndex: 999 - props.index }}>
          <DropDownPicker
            items={ comboBox }
            containerStyle={styles.comboBox}
            onChangeItem={ item => console.log(item.label, item.value) }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 10,
    padding: 15,

  },

  comboBox: {
    marginLeft: 20,
    width: 200,
    height: 40,
  }
});

export default IngredientMeasure;