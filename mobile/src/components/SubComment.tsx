import React from 'react';
import { StyleSheet, View } from 'react-native';

import Comment from './Comment';

const SubComment = ({ id, props }: { id: number, props: any }) => {
  return (
    <View style={styles.subCommentContainer}>
      <Comment comentarios={props.childComments} />
    </View>
  )
}

const styles = StyleSheet.create({
  subCommentContainer: {
      marginTop: 10,
      backgroundColor:'red',
  },
});

export default SubComment;