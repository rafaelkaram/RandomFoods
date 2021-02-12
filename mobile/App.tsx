import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Oswald_400Regular, Oswald_300Light } from '@expo-google-fonts/oswald';
import { Ubuntu_700Bold, Ubuntu_400Regular, useFonts } from '@expo-google-fonts/ubuntu';
import AppLoading from 'expo-app-loading';

import Routes from './src/routes'


export default function App() {
  const [fontsLoaded] = useFonts({
    Oswald_400Regular,
    Ubuntu_700Bold,
    Oswald_300Light,
    Ubuntu_400Regular,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  return (
    <>
      <Routes />
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
