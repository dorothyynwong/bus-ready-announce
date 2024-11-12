import { fetchBusArrivals } from "@/api/api";
import { ArrivalPredictionsByLinesAndStopPointInterface } from "@/api/apiInterface";
import { useEffect, useState } from "react";
import { ActivityIndicator, AppState, Platform,  TouchableOpacity,  View } from "react-native";
import * as BackgroundFetch from 'expo-background-fetch';
import registerBackgroundFetch from "@/tasks/registerBackgroundFetch";
import { BACKGROUND_FETCH_TASK } from "@/tasks/backgroundFetchTask";
import { TextInput, Text, Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BusArrivals: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [busArrivals, setBusArrivals] = useState<ArrivalPredictionsByLinesAndStopPointInterface[]>([]);
    const [lineId, setLineId] = useState("");
    const [stationId, setStationId] = useState("")

    useEffect(() => {
        const setup = async () => {
            await registerBackgroundFetch();
        };
        setup();

        const fetchBusArrivalsForeground = async () => {
            const busdata = await fetchBusArrivals();
            console.log(`inside foreground ${busdata[0]}`);
            setBusArrivals(busdata);
        }

        fetchBusArrivalsForeground();

        const interval = setInterval(fetchBusArrivalsForeground, 3 * 60 * 1000);

        return () => {
            clearInterval(interval);
            BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
        };
    }, []);

    if (status === "loading") return (
        <View>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading bus arrivals...</Text>
        </View>
    );

    const handlePress = async() => {
        await AsyncStorage.setItem('lineId', lineId);
        await AsyncStorage.setItem('stationId', stationId);

        const fetchBusArrivalsForeground = async () => {
            const busdata = await fetchBusArrivals();
            console.log(`inside foreground ${busdata[0]}`);
            setBusArrivals(busdata);
        }

        fetchBusArrivalsForeground();

        const interval = setInterval(fetchBusArrivalsForeground, 3 * 60 * 1000);
    }

    return (
        <View>
            <TextInput label="Line Id" value={lineId} onChangeText={(value) => setLineId(value)} ></TextInput>
            <TextInput label="Station Id" value={stationId} onChangeText={(value) => setStationId(value)} ></TextInput>
            <TouchableOpacity onPress={handlePress}>
                <Text>Search</Text>
            </TouchableOpacity>

            {
                busArrivals.length > 0 ?
                    (<>
                        <Text>{busArrivals[0].lineId} towards {busArrivals[0].destinationName} at {busArrivals[0].stationName}</Text>
                        {
                            busArrivals.map((busArrival, index) => (
                                <Text key={index}>
                                    {busArrival.vehicleId} Arriving in {Math.round(busArrival.timeToStation / 60)} minutes
                                </Text>
                            ))
                        }
                    </>)
                    : <></>
            }

        </View>
    );
}

export default BusArrivals