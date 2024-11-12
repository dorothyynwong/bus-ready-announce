import {  Platform  } from "react-native";
import * as Notifications from 'expo-notifications';
import * as BackgroundFetch from 'expo-background-fetch';

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

        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
            minimumInterval: 3 * 60, // 3 minutes (note: actual interval may be longer due to OS restrictions)
            stopOnTerminate: false,
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