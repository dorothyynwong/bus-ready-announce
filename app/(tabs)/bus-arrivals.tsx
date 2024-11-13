import { fetchBusArrivals, fetchStopPointsByCommonNameLineId, fetchStopPointsByCoordinates } from "@/api/api";
import { ArrivalPredictionsByLinesAndStopPointInterface, EntitiesStopPointInterface } from "@/api/apiInterface";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import * as BackgroundFetch from 'expo-background-fetch';
import registerBackgroundFetch from "@/tasks/registerBackgroundFetch";
import { BACKGROUND_FETCH_TASK } from "@/tasks/backgroundFetchTask";
import { TextInput, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from "react-native-element-dropdown";
import { extractNaptanIdsDirections } from "@/utils/extractNaptanIdsDirections";
import useDebounce from "@/hooks/useDebounce";
import StopPointsList from "@/components/StopPointsList";

interface DropDownData {
    label: string;
    value: string;
}

const BusArrivals: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [busArrivals, setBusArrivals] = useState<ArrivalPredictionsByLinesAndStopPointInterface[]>([]);
    const [lineId, setLineId] = useState("");
    const [stopName, setStopName] = useState("");
    const [naptanIds, setNaptanIds] = useState<DropDownData[]>([]);
    const [selectedNaptanId, setSelectedNaptanId] = useState("");
    const [timeInterval, setTimeInterval] = useState("3");
    const [timeStop, setTimeStop] = useState("30");
    const debouncedLineId = useDebounce(lineId, 10000);

    // useEffect(() => {
    //     const setup = async () => {
    //         await registerBackgroundFetch();
    //     };
    //     setup();

    //     const fetchBusArrivalsForeground = async () => {
    //         const busdata = await fetchBusArrivals();
    //         console.log(`inside foreground ${busdata[0]}`);
    //         setBusArrivals(busdata);
    //     }

    //     fetchBusArrivalsForeground();

    //     const interval = setInterval(fetchBusArrivalsForeground, 3 * 60 * 1000);

    //     return () => {
    //         clearInterval(interval);
    //         BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    //     };
    // }, []);

    if (status === "loading") return (
        <View>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading bus arrivals...</Text>
        </View>
    );


    const handlePress = async () => {
        await AsyncStorage.setItem('lineId', lineId);
        fetchStopPointsByCommonNameLineId(stopName, lineId)
            .then(response => {
                const stopPoint = response.data;
                const lat = stopPoint.matches[0].lat;
                const lon = stopPoint.matches[0].lon;

                return fetchStopPointsByCoordinates(lat, lon);
            })
            .then(stopPointsResponse => {
                const stopPoints: EntitiesStopPointInterface[] = stopPointsResponse.data.stopPoints;
                const filteredStopPoints = stopPoints.filter(stopPoint =>
                    stopPoint.commonName.toLowerCase().includes(stopName.toLowerCase()));

                const stopPointNaptanIds = extractNaptanIdsDirections(filteredStopPoints).map(nd => ({
                    label: nd.towards,
                    value: nd.naptanId,
                }));

                setNaptanIds(stopPointNaptanIds);
            })
            .catch(error => console.log(error));
    }

    // const handleSelect = async (stopId: string) => {

    //     await AsyncStorage.setItem('stopId', stopId);
    //     setSelectedNaptanId(stopId);
    //     const fetchBusArrivalsForeground = async () => {
    //         const busdata = await fetchBusArrivals();
    //         console.log(`inside foreground ${busdata[0]}`);
    //         setBusArrivals(busdata);
    //     }

    //     fetchBusArrivalsForeground();

    //     setInterval(fetchBusArrivalsForeground, parseInt(timeInterval === "" ? "3" : timeInterval) * 60 * 1000);
    // }

    return (
        <View>
            <TextInput label="Line Id" value={lineId} onChangeText={(value) => setLineId(value)} ></TextInput>
            <StopPointsList lineId={debouncedLineId} selectedNaptanId={selectedNaptanId} setSelectedNaptanId={setSelectedNaptanId}/>
            {/* <TextInput label="Stop Name" value={stopName} onChangeText={(value) => setStopName(value)} ></TextInput>
            <TextInput label="Time Interval (minutes)" 
                        value={timeInterval.toString()} 
                        keyboardType="numeric"
                        onChangeText={(value) => setTimeInterval(value)} ></TextInput>
            <TouchableOpacity onPress={handlePress}>
                <Text>Search</Text>
            </TouchableOpacity> */}

            {/* {
                naptanIds.length > 0 ?
                    (
                        <>
                            <Dropdown
                                data={naptanIds}
                                labelField="label"
                                valueField="value"
                                placeholder="Select an option"
                                value={selectedNaptanId}
                                onChange={item => handleSelect(item.value)}
                            />
                        </>
                    )
                    :
                    <></>
            } */}

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