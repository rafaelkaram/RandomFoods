import React, {useContext} from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, TouchableOpacity ,Image, Text } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView ,DrawerItemList,DrawerItem} from '@react-navigation/drawer';
import AuthContext from '../contexts/auth'
import { MaterialIcons } from '@expo/vector-icons'; 



function DrawerMenu(props: any) {
    const { signOut } = useContext(AuthContext)

    function handleSignOut() {
        signOut()
    }
    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <DrawerItem label={() => 
            <View>
                <MaterialIcons name="logout" size={24} color="black" />
                <Text style={{ color: 'white' }}>Logout</Text>
            </View>
        }
                style={{ backgroundColor: 'red' }}
                onPress={() => {
                    handleSignOut()
                    alert('Você foi desconectado')
                }}
            />
        </DrawerContentScrollView>
    );
}

  
  const styles = StyleSheet.create({
    item: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    label: {
      margin: 16,
      fontWeight: 'bold',
      color: 'rgba(0, 0, 0, .87)',
    },
    iconContainer: {
      marginHorizontal: 16,
      width: 24,
      alignItems: 'center',
    },
    icon: {
      width: 24,
      height: 24,
    }
  });

  export default DrawerMenu;