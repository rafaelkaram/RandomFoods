import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { Input } from 'react-native-elements';
import { AntDesign, Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';

import { IIngrediente, IUnidade } from '../constants/interfaces';

import RegularText from '../components/RegularText';
import BoldText from '../components/BoldText';

const IngredientMeasure = (props: { ingrediente: IIngrediente, removeIngrediente: Function }) => {

  const [check, setCheck] = useState<boolean>(false);
  const [quantidade, setQuantidade] = useState<string>('');
  const [medida, setMedida] = useState<IUnidade>();

  const ingrediente = props.ingrediente;
  const removeIngrediente = props.removeIngrediente
  const unidades = ingrediente.unidades;

  const rgx = /^[0-9]*[.,]?[0-9]*$/;

  const inputValueValidator = (value: string) => {

    if (!value.match(rgx) || Number(value) > 1000) {
      setQuantidade(quantidade)
    } else
      setQuantidade(value.toString())
  }

  const handleInputValue = (signal: boolean) => {
    if (!medida) return;

    const value = medida.incremento;

    let novoValor = 0
    if (signal) {
      novoValor = (Number(quantidade) + value) >= 0 && (Number(quantidade) + value) <= 1000 ? (Number(quantidade) + value) : 1000;
      setQuantidade(novoValor.toString())

    } else {
      novoValor = (Number(quantidade) - value) >= 0 ? (Number(quantidade) - value) : 0;
      setQuantidade(novoValor.toString())
    }
  }

  return (
    <View
      key={ingrediente.id}
      style={styles.item}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <BoldText style={{ fontSize: 16 }}>{ingrediente.nome}</BoldText>
        {ingrediente.semMedida === true ?
          <View style={styles.checkBox}>
            <RegularText style={{ fontSize: 12, marginTop: 5 }}>Sem medida?</RegularText>
            <CheckBox
              disabled={false}
              value={check}
              style={{ height: 25 }}
              onValueChange={(newValue) => setCheck(newValue)}
            />
          </View>
          : null}
        <TouchableOpacity onPress={() => removeIngrediente(ingrediente.id)}>
          <Feather name="trash-2" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {!check ?
        <View style={styles.campos}>
          {!(ingrediente.tipoUnidade === 'UNIDADE') && unidades ?
            <Picker
              enabled={!check}
              selectedValue={ medida?.nome }
              style={styles.comboBox}
              onValueChange={ (itemValue, itemIndex) => setMedida(unidades[itemIndex]) }
            >
              <Picker.Item fontFamily='Ubuntu_400Regular' label={ 'Selecione uma unidade' } value={ '' } />
              { unidades?.map(item => {
                  return <Picker.Item fontFamily='Ubuntu_400Regular' key={item.id} label={item.nome} value={ item.nome } />
                })
              }
            </Picker>
            : <View style={{ width: Width / 1.8 }}></View>}
          <View>
            <Input
              disabled={check}
              placeholder="Qtd"
              onChangeText={(value) => inputValueValidator(value)}
              value={quantidade}
              inputContainerStyle={{ marginTop: 10, borderRadius: 3, borderWidth: 1, width: 50, height: 30, backgroundColor: 'white' }}
              keyboardType={'numeric'}
            ></Input>
          </View>
          <View style={styles.plusMinusContainer}>
            <TouchableOpacity onPress={() => handleInputValue(true)} disabled={check}>
              <AntDesign style={styles.plus} name="pluscircleo" size={24} color={check ? 'gray' : 'black'} />
            </TouchableOpacity>
            <TouchableOpacity disabled={check} onPress={() => handleInputValue(false)}>
              <AntDesign name="minuscircleo" size={24} color={check ? 'gray' : 'black'} />
            </TouchableOpacity>
          </View>
        </View>
        :
        <View style={{ height: 75 }}>
          <RegularText style={styles.toTaste}>Ingrediente a Gosto</RegularText>
        </View>
      }
    </View >

  );
}

const Height = Dimensions.get("window").height;
const Width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  item: {
    padding: 10,
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 10,
  },

  checkBox: {
    flexDirection: 'row',
    marginLeft: 20,
  },

  toTaste: {
    fontSize: 16,
    alignSelf: 'center',
    paddingTop: 30
  },

  plusMinusContainer: {
    flexDirection: 'column',
    paddingBottom: 10
  },

  plus: {
    paddingBottom: 15
  },

  campos: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  comboBox: {
    width: Width / 1.8,
    height: 30,
  },
});

export default IngredientMeasure;