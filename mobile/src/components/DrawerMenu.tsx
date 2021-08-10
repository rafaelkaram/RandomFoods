import React, {useContext} from 'react';
import { Alert,StyleSheet, View, Text } from 'react-native';
import { DrawerContentScrollView ,DrawerItemList,DrawerItem} from '@react-navigation/drawer';
import AuthContext from '../contexts/auth'
import { MaterialIcons } from '@expo/vector-icons';



const DrawerMenu = (props: any) => {
    const { signOut } = useContext(AuthContext)

    const handleSignOut = () => {
        signOut();
    }
    return (
        <DrawerContentScrollView {...props}>

            <DrawerItemList {...props} />
            <DrawerItem label={() =>
            <View style={{flexDirection: 'row'}}>
                <MaterialIcons name="logout" size={24} color="black" />
                <Text style={{marginLeft: 15}}>Logout</Text>
            </View>
        }
                onPress={() => {
                    handleSignOut()
                    Alert.alert('Desconectado','\nVocê foi desconectado')

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