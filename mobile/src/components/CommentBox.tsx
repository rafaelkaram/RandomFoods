import React from 'react';
import { StyleSheet, View, } from 'react-native';

import Comment from '../components/Comment';
import { IComment } from '../constants/interfaces';

interface CommentBoxProps {
  comentarios: IComment[],

}

const CommentBox = ({ comentarios,  } : CommentBoxProps) => {

  return (
    <View style={styles.boxContainer} >
      { comentarios.map(comentario =>
        <Comment comentarios={ comentario }/>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  boxContainer: {

  }
});

export default CommentBox;