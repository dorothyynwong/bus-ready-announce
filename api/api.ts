import { AxiosResponse } from "axios";
import { client } from "./apiClient";
import { NotificationMessageInterface } from "./apiInterface";
import { ArrivalPredictionsByLinesAndStopPointInterface } from "@/api/apiInterface";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GenerateNotificationFromBusArrivalData } from "@/utils/generateNotificationMessages";

export async function fetchArrivalPredictionsByLines(ids: string) {
    try {
        const response: AxiosResponse = await client.get(`https://api.tfl.gov.uk/Line/${ids}/Arrivals`);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function fetchArrivalPredictionsByLinesAndStopPoint(ids: string, stopPointId: string) {
    try {
        const response: AxiosResponse = await client.get(`https://api.tfl.gov.uk/Line/${ids}/Arrivals/${stopPointId}`);
        console.log(`inside api.ts` );
        return response;
    } catch (error) {
        throw error;
    }
}

export async function fetchStopPointsByCoordinates(lat: number, lon:number) {
    try {
        const response: AxiosResponse = await client.get(`https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&stopTypes=NaptanPublicBusCoachTram`);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function fetchStopPointsByCommonNameLineId(query: string, ids: string) {
    try {
        const response: AxiosResponse = await client.get(`https://api.tfl.gov.uk/StopPoint/Search/${query}?lines=${ids}&modes=bus`);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function fetchStopPointsByLineId(id: string){
    try {
        const response: AxiosResponse = await client.get(`https://api.tfl.gov.uk/Line/${id}/StopPoints`);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function sendPushNotification(message: NotificationMessageInterface) {
    try
    {
        const response: AxiosResponse = await client.post('https://exp.host/--/api/v2/push/send', message , {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
          });
          return response.data;
    } catch (error) {
        throw error;
    }
}

export const fetchBusArrivals = async (): Promise<ArrivalPredictionsByLinesAndStopPointInterface[]> => {
    const expoPushToken = await AsyncStorage.getItem('expoPushToken');
    const lineId = await AsyncStorage.getItem('lineId');
    const stopId = await AsyncStorage.getItem('stopId');

    console.log(`expoPushToken ${expoPushToken}`);
    console.log(`lineId ${lineId}`);
    console.log(`stopId ${stopId}`);

    if ( !lineId || !stopId ) return [];

    const response = await fetchArrivalPredictionsByLinesAndStopPoint(lineId, stopId);
    const busArrivalsSort: ArrivalPredictionsByLinesAndStopPointInterface[] = response.data;
    console.log(`inside fetchBusArrivals: ${busArrivalsSort[0].vehicleId}`);
    busArrivalsSort.sort((a, b) => a.timeToStation - b.timeToStation);

    const messageBody = GenerateNotificationFromBusArrivalData(busArrivalsSort);

    if (expoPushToken && expoPushToken != "")
    {
        const message = {
            to: expoPushToken!,
            sound: 'default',
            title: `${lineId} is coming`,
            body: messageBody,
            data: { someData: 'goes here' },
          };
        sendPushNotification(message);
    }

    return busArrivalsSort;
}