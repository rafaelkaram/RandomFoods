import React from 'react';
import { Image, View } from 'react-native';

import styles from '../styles/components/Category';

const Category = (props: { nome: string }) => {
    return (
        <View style={[styles.categoryContainer]}>

            <Image
                source={{ uri: props.nome }}
                style={{ width: 40, height: 40 }}
            />

        </View>

    )
}

export default Category;