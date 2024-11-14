import { fetchBusArrivals, fetchStopPointsByCommonNameLineId, fetchStopPointsByCoordinates } from "@/api/api";
import { ArrivalPredictionsByLinesAndStopPointInterface, EntitiesStopPointInterface, StopPointsSearchMatchInterface } from "@/api/apiInterface";
import { extractNaptanIdsDirections } from "@/utils/extractNaptanIdsDirections";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { StyleSheet } from 'react-native';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface StopPointsListProps {
    lineId: string;
    stopName: string;
    setBusArrivals: (busArrivals: ArrivalPredictionsByLinesAndStopPointInterface[]) => void;
    timeInterval: string;
}

interface BusStopDataInterface {
    label: string;
    value: string;
}

const StopPointsList: React.FC<StopPointsListProps> = ({ lineId, stopName, setBusArrivals, timeInterval }) => {
    const [busStopData, setBusStopData] = useState<BusStopDataInterface[]>([]);

    useEffect(() => {
        fetchStopPointsByCommonNameLineId(stopName, lineId)
            .then(response => {
                const stopPoint = response.data;
                const matches: StopPointsSearchMatchInterface[] = stopPoint.matches;
                matches.map(match => {
                    const lat = match.lat;
                    const lon = match.lon;
                    fetchStopPointsByCoordinates(lat, lon)
                        .then(stopPointsResponse => {
                            const stopPoints: EntitiesStopPointInterface[] = stopPointsResponse.data.stopPoints;
                            const filteredStopPoints = stopPoints.filter(stopPoint =>
                                stopPoint.commonName.toLowerCase().includes(stopName.toLowerCase()));
                            const stopPointNaptanIds = extractNaptanIdsDirections(filteredStopPoints).map(nd => ({
                                label: `${nd.commonName} towards ${nd.towards}`,
                                value: nd.naptanId,
                            }));
                            setBusStopData(prevData => [...prevData, ...stopPointNaptanIds]);
                        })
                })
            })
            .catch(error => console.log(error));
    }, [lineId, stopName]);

    const onCardPress = async (data: BusStopDataInterface) => {
        await AsyncStorage.setItem('lineId', lineId);
        await AsyncStorage.setItem('stopId', data.value);
        const fetchBusArrivalsForeground = async () => {
            const busdata = await fetchBusArrivals();
            console.log(`inside foreground`);
            setBusArrivals(busdata);
        }

        fetchBusArrivalsForeground();

        setInterval(fetchBusArrivalsForeground, parseInt(timeInterval === "" ? "3" : timeInterval) * 60 * 1000);
    }
    return (
        <View>
            <FlatList
                data={busStopData}
                renderItem={({ item }) => (
                    <Card style={styles.card} onPress={() => onCardPress(item)}>
                        <Card.Content>
                            <Text style={styles.itemText}>{item.label}</Text>
                        </Card.Content>
                    </Card>
                )}
                keyExtractor={(item, index) => `${item.value}-${index}`}
                initialNumToRender={20}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        marginBottom: 10,
    },
    itemText: {
        fontSize: 18,
    },
});

export default StopPointsList;