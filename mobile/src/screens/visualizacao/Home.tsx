import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, ScrollView, Button, Platform, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import screens from '../../constants/screens';
import api from './../../services/api'
import AuthContext from '../../contexts/auth';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: true,
    }),
});
async function schedulePushNotification() {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Notificação",
            body: 'Local',
            data: { data: 'goes here' },
        },
        trigger: { seconds: 1 },
    });
}

async function registerForPushNotificationsAsync() {
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


    useEffect(() => {
        registerForPushNotificationsAsync().then((token: any) => setExpoPushToken(token));

        notificationListener.current = Notifications.addNotificationReceivedListener((notification: any) => {
            setNotification(notification);
            console.log("recebido");

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


    const {signed, signIn, signOut} = useContext(AuthContext)
    
    function handleSignIn(){
        signIn()
    }

    function handleSignOut(){
        signOut()
    }


    const handleNavigateToSearchRecipe = () => {
        navigation.navigate(screens.filtro);
    }


    const sendPushNotification = () => {
        let response = fetch('https://exp.host/--/api/v2/push/send', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                to: expoPushToken,
                sound: 'default',
                title: 'Push',
                body: 'notification'
            })
        })
    }

    return (
        <SafeAreaView style={{ alignItems: 'center', justifyContent: 'space-around' }}>
            <ScrollView>
                <Button
                    title="Pesquisar Receitas"
                    onPress={handleNavigateToSearchRecipe}
                />

                <View style={{marginTop: 100}}>
                    <Text>Your expo push token: {expoPushToken}</Text>
                    <Button title="Notificação Local" onPress={async () => { await schedulePushNotification() }} />
                    <View style={{margin: 10}}></View>
                    <Button title="Push Notification" onPress={() => sendPushNotification()} />
                    <View style={{margin: 10}}></View>
                    <Button title="Sign In" onPress={() => handleSignIn()} />
                    <View style={{margin: 10}}></View>
                    <Button title="Sign Out" onPress={() => handleSignOut()} />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Home;