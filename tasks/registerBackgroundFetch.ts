import {  Platform  } from "react-native";
import * as Notifications from 'expo-notifications';
import * as BackgroundFetch from 'expo-background-fetch';
import AsyncStorage from "@react-native-async-storage/async-storage";

const BACKGROUND_FETCH_TASK = 'background-fetch-bus-arrivals';

const registerBackgroundFetch = async () => {
    try {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            throw new Error('Permission not granted for notifications');
        }

        const timeInterval = await AsyncStorage.getItem('timeInterval');

        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
            minimumInterval: timeInterval && parseInt(timeInterval) > 0 ? parseInt(timeInterval) * 60 : 3 * 60, 
            stopOnTerminate: true,
            startOnBoot: true,
        });

        if (Platform.OS === 'ios') {
            await BackgroundFetch.setMinimumIntervalAsync(3 * 60);
        }

        console.log('Background fetch task registered successfully');
    } catch (err) {
        console.error('Background fetch registration failed:', err);
    }
};

export default registerBackgroundFetch;