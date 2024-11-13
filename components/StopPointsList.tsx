import { fetchStopPointsByCommonNameLineId, fetchStopPointsByCoordinates } from "@/api/api";
import { EntitiesStopPointInterface, StopPointsSearchMatchInterface } from "@/api/apiInterface";
import { extractNaptanIdsDirections } from "@/utils/extractNaptanIdsDirections";
import { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { StyleSheet } from 'react-native';

interface StopPointsListProps {
    lineId: string;
    stopName: string;
}

interface DropDownDataInterface {
    label: string;
    value: string;
}

const StopPointsList: React.FC<StopPointsListProps> = ({ lineId, stopName}) => {
    const [dropDownData, setDropDownData] = useState<DropDownDataInterface[]>([]);

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
                            setDropDownData(prevData => [...prevData, ...stopPointNaptanIds]);
                        })
                })
            })
            .catch(error => console.log(error));
    }, [lineId, stopName]);

    return (
        <View>
            <FlatList
                data={dropDownData} 
                renderItem={({ item }) => (
                    <Card style={styles.card}>
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