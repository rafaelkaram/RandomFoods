import React from 'react';
import { StyleSheet } from 'react-native';
import AppLoading from 'expo-app-loading';
import { Ubuntu_700Bold, Ubuntu_500Medium_Italic, Ubuntu_400Regular} from '@expo-google-fonts/ubuntu';
import { Oswald_300Light, useFonts} from '@expo-google-fonts/oswald';

import Routes from './src/routes';

export default function App() {
  const [fontsLoad] = useFonts({
    Ubuntu_700Bold,
    Oswald_300Light,
    Ubuntu_500Medium_Italic,
    Ubuntu_400Regular
  });

  if(!fontsLoad){
    return <AppLoading/>
  }
  return (
    <>
        <Routes/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});