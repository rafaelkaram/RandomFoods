import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import api from '../services/api';
import { IIngredientCart, IUnidade } from '../constants/interfaces';
import DropDownPicker from 'react-native-dropdown-picker';

const IngredientMeasure = (props: any) => {

  const ingrediente = props.ingrediente
  const volume = [{ label: "Mililitros", value: 2 }, { label: "Litros", value: 1 }]
  const peso = [{ label: "Gramas", value: 3 }, { label: "Quilogramas", value: 5 }]

  if (ingrediente.tipoUnidade == "UNIDADE") {
    return (
      <View
        key={ingrediente.id}
        style={styles.item}>
        <Text style={{ lineHeight: 30 }}>{ingrediente.name}</Text>

      </View>
    );
  } else {
    return (

      <View
        key={ingrediente.id}
        style={{...styles.item,zIndex: 999-props.index}}>
        <Text style={{ lineHeight: 30 }}>{ingrediente.name}</Text>

        <DropDownPicker
          items={ingrediente.tipoUnidade == "VOLUME" ? volume : peso}
          containerStyle={styles.comboBox}
          onChangeItem={item => console.log(item.label, item.value)}

        />


      </View>
    )

  }
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