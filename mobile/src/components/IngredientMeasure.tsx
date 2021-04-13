import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import api from '../services/api';
import { Input } from 'react-native-elements'
import { IIngredient } from '../constants/interfaces';
import DropDownPicker from 'react-native-dropdown-picker';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';

const IngredientMeasure = (props: { ingrediente: IIngredient, index: number }) => {

  const [semMedida, setSemMedida] = useState(true);
  const [quantidade, setQuantidade] = useState("");
  const [medida, setMedida] = useState("");


  const ingrediente: IIngredient = props.ingrediente;
  const unidades = ingrediente.unidades;

 

  const comboBox = unidades.map(unidade => {
    return { label: unidade.sigla, value: unidade.id }
  });
  console.log(comboBox);

  return (

    <View
      key={ingrediente.id}
      style={styles.item}
    >
      <View style={styles.comp}>
        <Text style={{ lineHeight: 30 }}>{ingrediente.nome}</Text>
        <View style={styles.campos}>

          {!(ingrediente.tipoUnidade === 'UNIDADE' || ingrediente.semMedida) && (
            <View style={{ zIndex: 999 - props.index }}>
              {/* <DropDownPicker
                items={comboBox}
                containerStyle={styles.comboBox}
                dropDownStyle={{ backgroundColor: "white", }}
                onChangeItem={item => console.log(item.label, item.value)}
              /> */}
              <Picker
                selectedValue={medida}
                style={styles.comboBox}
                onValueChange={(itemValue) =>
                  setMedida(itemValue)
                }>
                {unidades.map(item => {
                  return (
                    <Picker.Item key={item.id} label={item.sigla} value={item.id} />

                  )
                })}
                {/* <Picker.Item label="Java" value="java" />
                <Picker.Item label="JavaScript" value="js" /> */}
              </Picker>
            </View>
          )}
          <Input
            placeholder="Qtd"
            onChangeText={(value) => setQuantidade(value)}
            value={quantidade}
            containerStyle={styles.input}
            inputContainerStyle={{ marginTop: 10, borderRadius: 3, borderWidth: 1, width: 40, height: 30, backgroundColor: 'white' }}
          />
        </View>
      </View>
    </View>


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
    padding: 15,
    backgroundColor: 'white',
    margin: 5,
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 10,
    width: 380,

    //borderWidth: 1,
    alignContent: "center",
    alignItems: 'center',

  },
  input: {
    width: 40,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 15,
  },
  comp: {
    flexDirection: "column",
    justifyContent: 'space-evenly',
    alignContent: "center",
    alignItems: 'center',
    padding: 10,
    //borderWidth:1,
    width: 360,


  },
  campos: {
    flexDirection: "row",
  },

  comboBox: {
    marginLeft: 20,
    width: 200,
    height: 40,
  }
});

export default IngredientMeasure;