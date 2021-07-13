import React from 'react';
import { Text, View } from 'react-native';

import styles from '../styles/components/Category';
import globalStyles from '../styles/Global';

const Category = (props: { nome: string }) => {
    return (
        <View style={ styles.categoryContainer }>
            <Text style={[ globalStyles.regularText, styles.categoryText ]}>{ props.nome }</Text>
        </View>
    )
}

export default Category;