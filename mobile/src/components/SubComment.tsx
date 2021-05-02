import React from 'react';
import { StyleSheet, View } from 'react-native';

import { IComentario } from '../constants/interfaces';

import Comment from './Comment';

const SubComment = (props: { id: number, comments: IComentario[] }) => {
  return (
    <View style={ styles.subCommentContainer }>
      <Comment comentarios={ props.comments } />
    </View>
  )
}

const styles = StyleSheet.create({
  subCommentContainer: {
      marginTop: 10,
      backgroundColor:'green',
  },
});

export default SubComment;