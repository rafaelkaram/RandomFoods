import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from 'react-native-elements'
import { IIngrediente } from '../constants/interfaces';
import CheckBox from '@react-native-community/checkbox';
import { ScrollView } from 'react-native-gesture-handler';
import { Picker } from '@react-native-picker/picker';
import BoldText from '../components/BoldText'

const IngredientMeasure = (props: { ingrediente: IIngrediente, index: number }) => {

  const [semMedida, setSemMedida] = useState(true);
  const [check, setCheck] = useState(false);
  const [quantidade, setQuantidade] = useState("");
  const [medida, setMedida] = useState("");


  const ingrediente = props.ingrediente;
  const unidades = ingrediente.unidades


  console.log(ingrediente.nome)
  return (

    <SafeAreaView
      key={ingrediente.id}
      style={styles.item}
    >
      <View style={styles.comp}>
        <BoldText style={{ lineHeight: 30 }}>{ingrediente.nome}</BoldText>
        <View style={styles.campos}>
          <CheckBox
            disabled={false}
            value={check}
            onValueChange={(newValue) => setCheck(newValue)}
          />

          {!(ingrediente.tipoUnidade === 'UNIDADE') && (
              <Picker
                selectedValue={medida}
                style={styles.comboBox}
                mode='dropdown'
                onValueChange={(itemValue) =>
                  setMedida(itemValue)
                }>
                {unidades.map(item => {
                  
                  return (
                    <Picker.Item key={item.id} label={item.sigla} value={item.id} />

                  )
                })}
              </Picker>
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
    </SafeAreaView>


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
    //marginTop: 20,
    marginLeft: 10,
    marginRight: 15,
  },
  comp: {
    flexDirection: "column",
    justifyContent: 'space-evenly',
    //alignContent: "center",
    //alignItems: 'center',
    padding: 10,
    //borderWidth:1,
    width: 360,


  },
  campos: {
    flexDirection: "row",
  },

  comboBox: {
    marginLeft: 20,
    width: 180,
    height: 40,
    borderWidth: 1
  },
  ingredientTypeIcon: {
    margin: 10,
    width: 30,
    height: 30
  },
});

export default IngredientMeasure;