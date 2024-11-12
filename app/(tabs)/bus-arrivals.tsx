import { fetchBusArrivals, fetchStopPointsByCommonNameLineId, fetchStopPointsByCoordinates } from "@/api/api";
import { ArrivalPredictionsByLinesAndStopPointInterface, EntitiesStopPointInterface } from "@/api/apiInterface";
import { useEffect, useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import * as BackgroundFetch from 'expo-background-fetch';
import registerBackgroundFetch from "@/tasks/registerBackgroundFetch";
import { BACKGROUND_FETCH_TASK } from "@/tasks/backgroundFetchTask";
import { TextInput, Text } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from "react-native-element-dropdown";

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
    const [checked, setChecked] = useState("");
    const [selectedNaptanId, setSelectedNaptanId] = useState("");

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


    const handlePress = async () => {
        await AsyncStorage.setItem('lineId', lineId);
        fetchStopPointsByCommonNameLineId(stopName, lineId)
            .then(async response => {
                const stopPoint = response.data;
                const lat = stopPoint.matches[0].lat;
                const lon = stopPoint.matches[0].lon;
                fetchStopPointsByCoordinates(lat, lon)
                    .then(response => {
                        console.log(response.data);
                        const stopPoints: EntitiesStopPointInterface[] = response.data.stopPoints;
                        const filteredStopPoints = stopPoints.filter(stopPoint => stopPoint.commonName.toLowerCase().includes(stopName.toLowerCase()))
                        console.log(filteredStopPoints)
                        const stopPointNaptanIds: DropDownData[] = [];
                        filteredStopPoints.map(stopPoint => {
                            const dropDownData = {
                                label: stopPoint.naptanId,
                                value: stopPoint.naptanId,
                            }
                            stopPointNaptanIds.push(dropDownData);

                        });
                        setNaptanIds(stopPointNaptanIds);
                    })
                    .catch(error => console.log(error));
            })
            .catch(error => console.log(error));
    }

    const handleSelect = async (stopId: string) => {

        await AsyncStorage.setItem('stopId', stopId);

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
            <TextInput label="Stop Name" value={stopName} onChangeText={(value) => setStopName(value)} ></TextInput>
            <TouchableOpacity onPress={handlePress}>
                <Text>Search</Text>
            </TouchableOpacity>

            {
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
            }

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