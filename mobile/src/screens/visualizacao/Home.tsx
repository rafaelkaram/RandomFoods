import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { View, ScrollView, RefreshControl, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';

import api from './../../services/api';

import screens from '../../constants/screens';
import { IReceitaSimples } from './../../constants/interfaces'

import AuthContext from '../../contexts/auth';
import Loading from '../../components/Loading';
import RecipeList from '../../components/RecipeList';

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
    const [receitas, setReceitas] = useState<IReceitaSimples[]>([]);
    const [receitasSeguidor, setReceitasseguidor] = useState<IReceitaSimples[]>([]);
    const [load, setLoad] = useState<boolean>(false);

    const { user, headers } = useContext(AuthContext);

    const sendPushNotification = () => {
        let response = fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: 'ExponentPushToken[vIrbrrNuUq7P8LJrMwQtCr]',
                sound: 'default',
                title: 'Push',
                body: 'notification'
            })
        })
    }

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setLoad(false);
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
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    useEffect(() => {
        api.get('busca/home', { headers }).then(response => {
            setReceitas(response.data.listCurtidas);
            if (response.data.listSeguidores.length > 0) setReceitasseguidor(response.data.listSeguidores);
            setLoad(true);
        })
    }, [refreshing, user]);

    const handleNavigateToRecipe = (id: number) => {
        navigation.navigate(screens.receita, { id: id });
    }

    if (!load) {
        return <Loading />
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Image
                source={require('../../assets/random-foods-comprido.png')}
                style={{ width: 385, height: 90, paddingHorizontal: 10, marginBottom: 20, alignSelf: 'center' }}
            />
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />}>
                {/* <Button
                    title="Pesquisar Receitas"
                    onPress={handleNavigateToSearchRecipe}
                /> */}

                {/* <View style={{ marginTop: 100 }}>
                    <Text>Your expo push token: {expoPushToken}</Text>
                    <Button title="Notificação Local" onPress={async () => { await schedulePushNotification() }} />
                    <View style={{ margin: 10 }}></View>
                    <Button title="Push Notification" onPress={() => sendPushNotification()} />
                    <View style={{ margin: 10 }}></View>
                </View> */}

                <View>

                    <RecipeList titulo='Mais Curtidas' receitas={receitas} navegar={(id: number) => handleNavigateToRecipe(id)} />
                    {receitasSeguidor.length > 0 &&
                        <RecipeList titulo='De quem você segue' receitas={receitasSeguidor} navegar={(id: number) => handleNavigateToRecipe(id)} />
                    }

                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home;