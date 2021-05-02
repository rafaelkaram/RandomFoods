import React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Rating, Avatar } from 'react-native-elements';

import { IReceitaSimples } from '../constants/interfaces';
import colors from '../constants/colors';

const { height, width } = Dimensions.get('window');
const numberGrid = 3;
const itemWidth = width / numberGrid;

const RecipeList = (props: { titulo: string, receitas: IReceitaSimples[], navegar: Function }) => {
  const titulo = props.titulo;
  const receitas = props.receitas;
  const navegar = props.navegar;

  return (
    <View>
      <Text style={styles.title}>{ titulo }</Text>
      <View style={styles.columns}>
          {receitas.map(item => {
              return (
                  <View style={styles.itemList} key={item.id}>
                      <TouchableOpacity
                          onPress={() => navegar(item.id)}>
                          { item.foto ? (
                              <Avatar
                                  size="large"
                                  source={{ uri: item.foto }}
                                  activeOpacity={0.7}
                                  containerStyle={styles.itemListImage}
                              />
                            ) : ( <Text style={styles.itemListImage}>{ item.nome }</Text> )
                          }
                          <Text style={styles.itemListTitle}>{ item.nome }</Text>
                          <Rating imageSize={20} readonly startingValue={Number(item.nota)} />
                      </TouchableOpacity>
                  </View>
              )
          })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    title: {
        backgroundColor: colors.dimmedBackground,
        color: 'white',

        fontSize: 20,
        textAlign: 'center',

        margin: 3,
        padding: 10,

    },

    container: {
        flex: 1,
    },

    columns: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly'
    },

    itemList: {
        backgroundColor: 'white',
        margin: 15,
        padding: 10,
        width: itemWidth,

        flexDirection: 'column',
        borderRadius: 20
    },

    itemListImage: {
        borderWidth: 1,
        height: itemWidth - 40,
        borderRadius: 20,
        textAlign: 'center',

    },

    itemListTitle: {
        marginLeft: 10,
        marginTop: 5,
        fontWeight: 'bold',
        textAlign: 'center',

    },
});

export default RecipeList;