import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import React, { useState, useEffect } from 'react';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

export default function App() {
  // request the token
    useEffect(() => {
        (async() => {
          let token;
          // check, is this a device or a simulator
          if (Constants.isDevice) {
            // see if we haven't already been granted access
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
            // ask for the token
            token = (await Notifications.getExpoPushTokenAsync()).data;
    
          }else {
            alert('You are running this app on a simulator, you must use a real device to use push notifications');
          }
    
          // make modifcations to android
          if (Platform.OS === 'android') {
            Notifications.setNotificationChannelAsync('default', {
              name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
            });
          }
    
          if (token != undefined) {
            console.log(`Our token is ${token}`);
          }else {
            console.log(`We are unable to get the token`);
          }
        })();
      }, []);
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
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
