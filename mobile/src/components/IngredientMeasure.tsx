import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { Input } from 'react-native-elements';
import { Picker } from '@react-native-picker/picker';
import CheckBox from '@react-native-community/checkbox';

import { IIngrediente, IUnidade, IIngredienteCadastro } from '../constants/interfaces';
import { WIDTH } from '../constants/dimensions';
import styles from '../styles/components/IngredientMeasure';
import globalStyles from '../styles/Global';

const IngredientMeasure = (props: { ingrediente: IIngrediente, ingredientesCadastro: IIngredienteCadastro[], removeIngrediente: Function, setIngredientes: Function }) => {

  const [check, setCheck] = useState<boolean>(false)
  const [quantidade, setQuantidade] = useState<string>('')
  const [medida, setMedida] = useState<IUnidade>()
  const [nomeUnidade, setNomeUnidade] = useState<string>('')

  const ingrediente = props.ingrediente;
  const ingredientesCadastro = props.ingredientesCadastro;
  const removeIngrediente = props.removeIngrediente;
  const setIngredientes = props.setIngredientes
  const unidades = ingrediente.unidades;

  useEffect(() => {
    if (ingredientesCadastro.length > 0) {
      const i = ingredientesCadastro.findIndex((ingr) => { return ingr.id == ingrediente.id })
      const qtde = ingredientesCadastro[i]?.quantidade?.toString() ?? ''
      const unid = ingredientesCadastro[i]?.tipoUnidade ?? ''
      setQuantidade(qtde)
      setNomeUnidade(unid)
      if (ingredientesCadastro[i]?.semMedida)
        setCheck(true)

      if (unid !== '' && ingrediente.unidades){
        const index = ingrediente.unidades?.findIndex((u) => {return  u.nome === unid})
        setMedida(ingrediente.unidades[index])
      }
    }
  }, [])

  useEffect(() => {
    if (ingredientesCadastro.length > 0) {
      var newIngrs: IIngredienteCadastro[] = ingredientesCadastro
      let semMedida: boolean
      let tipoUnidade: string
      let quantidadeLet: number

      const nome = ingrediente.nome

      if (check) {
        semMedida = true
        tipoUnidade = ''
        quantidadeLet = 0
      } else {
        semMedida = false
        tipoUnidade = medida?.nome ?? ''
        quantidadeLet = Number(quantidade)
      }

      const index = newIngrs.findIndex((ingr) => { return ingr.id == ingrediente.id })
      newIngrs.splice(index, 1)
      newIngrs.push({ id: ingrediente.id, nome, semMedida, tipoUnidade, quantidade: quantidadeLet })
      setIngredientes(newIngrs)
    }
  }, [check, quantidade, medida])

  const rgx = /^[0-9]*[.,]?[0-9]*$/;

  const inputValueValidator = (value: string) => {

    if (!value.match(rgx) || Number(value) > 1000) {
      setQuantidade(quantidade);
    } else
      setQuantidade(value.toString());
  }

  const handleInputValue = (signal: boolean) => {
    if (!medida) return;

    const value = medida.incremento;

    let novoValor = 0
    if (signal)
      novoValor = (Number(quantidade) + value) >= 0 && (Number(quantidade) + value) <= 1000 ? (Number(quantidade) + value) : 1000;
    else
      novoValor = (Number(quantidade) - value) >= 0 ? (Number(quantidade) - value) : 0;
    setQuantidade(novoValor.toString());
  }

  const handleMedida = (m: IUnidade) => {
    setMedida(m)
    setNomeUnidade(m.nome)
  }

  return (
    <View
      key={ingrediente.id}
      style={styles.item}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text style={{ ...globalStyles.boldText, fontSize: 16 }}>{ingrediente.nome}</Text>
        {ingrediente.semMedida === true ?
          <View style={styles.checkBox}>
            <Text style={{ ...globalStyles.regularText, fontSize: 12, marginTop: 5 }}>Sem medida?</Text>
            <CheckBox
              disabled={false}
              value={check}
              style={{ height: 25 }}
              onValueChange={(newValue) => setCheck(newValue)}
            />
          </View>
          : null}
        <TouchableOpacity onPress={() => removeIngrediente(ingrediente.id)}>
          <Feather name='trash-2' size={24} color='black' />
        </TouchableOpacity>
      </View>
      {!check ?
        <View style={styles.campos}>
          {!(ingrediente.tipoUnidade === 'UNIDADE') && unidades ?
            <Picker
              enabled={!check}
              selectedValue={nomeUnidade}
              style={styles.comboBox}
              onValueChange={(itemValue, itemPosition) => handleMedida(unidades[itemPosition - 1])}
            >
              <Picker.Item fontFamily='Ubuntu_400Regular' label={'Selecione uma unidade'} value={''} />
              {unidades?.map(item => {
                return <Picker.Item fontFamily='Ubuntu_400Regular' key={item.id} label={item.nome} value={item.nome} />
              })
              }
            </Picker>
            : <View style={{ width: WIDTH / 1.8 }}></View>}
          <View>
            <Input
              disabled={check}
              placeholder='Qtd'
              onChangeText={(value) => inputValueValidator(value)}
              value={quantidade}
              inputContainerStyle={{ marginTop: 10, borderRadius: 3, borderWidth: 1, width: 50, height: 30, backgroundColor: 'white' }}
              keyboardType={'numeric'}
            ></Input>
          </View>
          <View style={styles.plusMinusContainer}>
            <TouchableOpacity onPress={() => handleInputValue(true)} disabled={check}>
              <AntDesign style={styles.plus} name='pluscircleo' size={24} color={check ? 'gray' : 'black'} />
            </TouchableOpacity>
            <TouchableOpacity disabled={check} onPress={() => handleInputValue(false)}>
              <AntDesign name='minuscircleo' size={24} color={check ? 'gray' : 'black'} />
            </TouchableOpacity>
          </View>
        </View>
        :
        <View style={{ height: 75 }}>
          <Text style={[globalStyles.regularText, styles.toTaste]}>Ingrediente a Gosto</Text>
        </View>
      }
    </View >

  );
}

export default IngredientMeasure;