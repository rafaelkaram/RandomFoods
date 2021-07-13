import React, { useState } from 'react';
import { Dimensions, Modal, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';

const StepModal = (props: { index: number, visible: boolean, closeModal: Function, text?: string }) => {
  const index = props.index;
  const visible = props.visible;
  const closeModal = props.closeModal;

  const [ descricao, setDescricao ] = useState(props.text ? props.text : '');

  return (
    <Modal
      animationType="none"
      transparent={ true }
      visible={ visible }
      onRequestClose={ closeModal(index, descricao) }
    >
      <BlurView intensity={50} style={[StyleSheet.absoluteFill, styles.nonBlurredContent]}>
        <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
          <View style={styles.modalContainer}>
            <TextInput
              placeholder="Descrição"
              onChangeText={(value) => setDescricao(value)}
              value={ descricao }
            />
            <TouchableOpacity onPress={() => { closeModal(descricao, index) }}>
              <Feather name="check" size={24} color="green" />
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

const Height = Dimensions.get("window").height
const Width = Dimensions.get("window").width;

const styles = StyleSheet.create({
  modalContainer: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#E5EAFA',
    borderWidth: 3,
    width: Width * 0.9,
    height: Height * 0.43,
  },

  nonBlurredContent: {
      alignItems: 'center',
      justifyContent: 'center',
  },
});

export default StepModal;