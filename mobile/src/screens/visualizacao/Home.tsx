import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, ScrollView, RefreshControl, Platform, Image, Text, Button } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import screens from '../../constants/screens';
import AuthContext from '../../contexts/auth';
import { IReceitaSimples } from './../../constants/interfaces'
import { TouchableOpacity } from 'react-native-gesture-handler';
import globalStyles from '../../styles/Global';
import colors from './../../constants/colors'
import api from './../../services/api'
import RecipeList from '../../components/RecipeList';
import { WIDTH } from '../../constants/dimensions';


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: true,
    }),
});

const schedulePushNotification = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Notificação',
            body: 'Local',
            data: { data: 'goes here' },
        },
        trigger: { seconds: 1 },
    });
}

const registerForPushNotificationsAsync = async () => {
    let token;
    if (Constants.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}

const Home = () => {

    const [expoPushToken, setExpoPushToken] = useState('');
    const [notification, setNotification] = useState(false);
    const notificationListener = useRef<any>();
    const responseListener = useRef<any>();
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [receitas, setReceitas] = useState<IReceitaSimples[]>([])


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 2000);
      }, []);

    useEffect(() => {
        registerForPushNotificationsAsync().then((token: any) => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
            setNotification(notification);
            console.log('recebido');

        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log('clicado');

            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);


    useEffect(() => {
        api.get('/busca/receita').then(response => {
            setReceitas(response.data)
        })
    }, [refreshing]);

    const handleNavigateToSearchRecipe = () => {
        navigation.navigate(screens.filtro);
    }


    const handleNavigateToRecipe = (id: number) => {
        navigation.navigate(screens.receita, { id: id });
    }



    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}>
                <Button
                    title="Pesquisar Receitas"
                    onPress={handleNavigateToSearchRecipe}
                />
                {/*
                <View style={{marginTop: 100}}>
                    <Text>Your expo push token: {expoPushToken}</Text>
                    <Button title="Notificação Local" onPress={async () => { await schedulePushNotification() }} />
                    <View style={{margin: 10}}></View>
                    <Button title="Push Notification" onPress={() => sendPushNotification()} />
                    <View style={{margin: 10}}></View>
                    <Button title="Sign In" onPress={() => handleSignIn()} />
                    <View style={{margin: 10}}></View>
                    <Button title="Sign Out" onPress={() => handleSignOut()} />
                </View> */}

                <View>

                    <Image
                        source={require('../../assets/random-foods-comprido.png')}
                        style={{ width: WIDTH - 20, height: 87 }}
                    />

                    <RecipeList titulo='' receitas={ receitas } navegar={ (id: number) => handleNavigateToRecipe(id) } />

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home;