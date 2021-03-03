import React from 'react';
import { StyleSheet, View } from 'react-native';

import { IComment } from '../constants/interfaces';
import Comment from './Comment';

interface SubCommentProps {
  id: number,
  comments: IComment[]
}

const SubComment = (props : SubCommentProps) => {
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