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

//https://api.tfl.gov.uk/Line/194/Arrivals/490005796S
export async function fetchArrivalPredictionsByLinesAndStopPoint(ids: string, stopPointId: string) {
    try {
        const response: AxiosResponse = await client.get(`https://api.tfl.gov.uk/Line/${ids}/Arrivals/${stopPointId}`);
        console.log(`inside api.ts ${response.data}` );
        return response;
    } catch (error) {
        throw error;
    }
}

export async function fetchStopPointsByCoordinates(lat: number, lon:number, stopTypes:string, radius:number, returnLines: boolean) {
    //NaptanPublicBusCoachTram
    //51.399271, -0.033838
    //1000
    //https://api.tfl.gov.uk/StopPoint/?lat=51.399271&lon=-0.033838&radius=1000&stopTypes=NaptanPublicBusCoachTram&returnLines=true
    // 490005796S
    try {
        const response: AxiosResponse = await client.get(`https://api.tfl.gov.uk/StopPoint/?lat=${lat}&lon=${lon}&radius=${radius}&stopTypes=${stopTypes}&returnLines=${returnLines}`);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function fetchStopPointsByCommonName(query: string) {
    try {
        const response: AxiosResponse = await client.get(`https://api.tfl.gov.uk/StopPoint/Search?query=${query}`);
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
    const stationId = await AsyncStorage.getItem('stationId');

    // const lineId = "194";
    // const stationId = "490005796S";

    console.log(`expoPushToken ${expoPushToken}`);
    console.log(`lineId ${lineId}`);
    console.log(`stationId ${stationId}`);

    if ( !lineId || !stationId ) return [];

    const response = await fetchArrivalPredictionsByLinesAndStopPoint(lineId, stationId);
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