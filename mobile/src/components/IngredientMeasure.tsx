import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import api from '../services/api';
import { Input } from 'react-native-elements'
import { IIngredient } from '../constants/interfaces';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView } from 'react-native-gesture-handler';

const IngredientMeasure = (props: { ingrediente: IIngredient, index: number }) => {

  const [semMedida, setSemMedida] = useState(true);
  const [quantidade, setQuantidade] = useState("");

  const ingrediente: IIngredient = props.ingrediente;
  const unidades = ingrediente.unidades;

  if (ingrediente.tipoUnidade === 'UNIDADE') {
    unidades.push({
      id: 5,
      nome: 'Unidade',
      sigla: 'U',
      taxaConversao: '1.000',
      tipo: 'UNIDADE',
    });
  } else if (ingrediente.tipoUnidade === 'VOLUME') {
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
      style={styles.item}
    >
      <Text style={{ lineHeight: 30 }}>{ingrediente.nome}</Text>
      {/* <View style={styles.campos}> */}
        <Input
          placeholder="Qtd"
          onChangeText={(value) => setQuantidade(value)}
          value={quantidade}
          containerStyle={styles.input}
         inputContainerStyle={{ marginTop: 10, borderWidth: 1, width: 40, height: 30 }}
        />
        {!(ingrediente.tipoUnidade === 'UNIDADE' || ingrediente.semMedida) && (
          <View style={{ zIndex: 999 - props.index }}>
            <DropDownPicker
              items={comboBox}
              containerStyle={styles.comboBox}
              dropDownStyle={{backgroundColor:"white",}}
              onChangeItem={item => console.log(item.label, item.value)}
            />
          </View>
        )}
      </View>
    // </View>


  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,

  },
  item: {
    flexDirection: "row",
    //  alignItems: "center",
   // justifyContent: "flex-end",
    margin: 10,
    padding: 15,
    borderWidth: 1,
    alignContent:"center",
    alignItems:'center',  

  },
  input:{
    width:40,
    marginTop:20,
  },
  campos: {
  flexDirection:"row",
  alignContent:"center",
  alignItems:'center',
  padding:10,
  borderWidth:1,

  },

  comboBox: {
    marginLeft: 20,
    width: 200,
    height: 40,
  }
});

export default IngredientMeasure;