import React, { useEffect, useState } from 'react'
import { Text, ScrollView, TouchableOpacity, View, StyleSheet, ImageBackgroundComponent } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Link, useHistory } from 'react-router-dom';
import { Input } from "react-native-elements";
import Icon from 'react-native-vector-icons/Ionicons';

import api from '../services/api'
import Colors from '../constants/colors';
import { IUser } from '../constants/interfaces';
import BoldText from '../components/BoldText';

const Profile = () => {
   
    const [user, setUser] = useState<IUser>();


    useEffect(() => {
        api.get(`user`).then(response => {
            setUser(response.data[4]);
            console.log(user)
        });
    }, [])

   

    return (
        <SafeAreaView>
            <ScrollView >
                <View style={styles.mainContainer}>
                <Text style={styles.image}>Imagem</Text>
                <BoldText style={styles.name}>{user?.nome}</BoldText>
               </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
  mainContainer:{
      margin:20,
      backgroundColor:"white",
      height:150,
      borderRadius:15,
      flexDirection:'row',
      padding:20,
      alignItems:'center'

  },
  image:{
    borderWidth: 1,
    height: 100,
    width:100,
    textAlign: 'center',
  },
  name:{
      marginLeft:15,
      fontSize:18,
  }
})

export default Profile