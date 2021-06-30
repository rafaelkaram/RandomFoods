import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { ICart } from '../constants/interfaces';

import styles from '../styles/components/BasketCounter';

const BasketCounter = ({
    ingredientes,
    isCadastro,
    setVisible
}: {
    ingredientes: ICart[],
    isCadastro: boolean,
    setVisible: Function
}) => {
    return (
        <View style={ styles.container }>
            <Image
                style={ styles.image }
                source={ isCadastro ? require('../assets/nova-receita.png') : require('../assets/pesquisar-receitas.png') }
            />
            <TouchableOpacity
                style={ styles.basketContainer }
                onPress={ () => setVisible(true) }>
                <Image
                    style={{ width: 40, height: 40 }}
                    source={ require('../assets/basket-icon.png') }
                />
                <View style={ styles.basketCounter }>
                    <Text style={{ alignSelf: 'center', color: 'white' }}>{ ingredientes.length }</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

export default BasketCounter;