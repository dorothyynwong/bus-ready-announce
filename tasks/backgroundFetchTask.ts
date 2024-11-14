import * as TaskManager from 'expo-task-manager';
import * as BackgroundFetch from 'expo-background-fetch';
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Battery from 'expo-battery';
import { fetchBusArrivals } from '@/api/api';

export const BACKGROUND_FETCH_TASK = 'background-fetch-bus-arrivals';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const startTime = Date.now();
    const TIMEOUT = 25 * 1000; 

    try {
        const batteryLevel = await Battery.getBatteryLevelAsync();
        const isCharging = await Battery.getBatteryStateAsync() === Battery.BatteryState.CHARGING;
        const fetchStartTime = await AsyncStorage.getItem('fetchStartTime');
        const currentTime = Date.now();

        if (fetchStartTime && (currentTime - parseInt(fetchStartTime) > 10 * 60 * 1000)) { // 30 minutes
            await BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
            console.log('Background fetch task unregistered after 30 minutes');
            return BackgroundFetch.BackgroundFetchResult.NoData;
        }

        if (batteryLevel > 0.2 || isCharging) {
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Task timeout')), TIMEOUT)
            );

            const busArrivals = await Promise.race([
                fetchBusArrivals(),
                timeoutPromise
            ]);

            if (Date.now() - startTime < TIMEOUT) {
                await AsyncStorage.setItem('lastBackgroundFetch', new Date().toISOString());
                return BackgroundFetch.BackgroundFetchResult.NewData;
            }
        }
        
        return BackgroundFetch.BackgroundFetchResult.NoData;
    } catch (error) {
        console.error('Background fetch failed:', error);
        return BackgroundFetch.BackgroundFetchResult.Failed;
    }
});
