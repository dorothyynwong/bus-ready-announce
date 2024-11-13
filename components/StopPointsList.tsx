import { fetchStopPointsByCommonNameLineId, fetchStopPointsByCoordinates, fetchStopPointsByLineId } from "@/api/api";
import { EntitiesStopPointInterface, StopPointsSearchMatchInterface } from "@/api/apiInterface";
import { extractNaptanIdsDirections } from "@/utils/extractNaptanIdsDirections";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Card, List, Text } from "react-native-paper";
import { StyleSheet } from 'react-native';

interface StopPointsListProps {
    lineId: string;
    stopName: string;
    selectedNaptanId: string;
    setSelectedNaptanId: (newId: string) => void;
}

interface DropDownDataInterface {
    label: string;
    value: string;
}

const StopPointsList: React.FC<StopPointsListProps> = ({ lineId, stopName, selectedNaptanId, setSelectedNaptanId }) => {
    const [dropDownData, setDropDownData] = useState<DropDownDataInterface[]>([]);

    useEffect(() => {
        fetchStopPointsByCommonNameLineId(stopName, lineId)
            .then(response => {
                const stopPoint = response.data;
                const matches:StopPointsSearchMatchInterface[] = stopPoint.matches;
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
                // const lat = stopPoint.matches[0].lat;
                // const lon = stopPoint.matches[0].lon;


                // return fetchStopPointsByCoordinates(lat, lon);
            })
            // .then(stopPointsResponse => {
            //     const stopPoints: EntitiesStopPointInterface[] = stopPointsResponse.data.stopPoints;
            //     const filteredStopPoints = stopPoints.filter(stopPoint =>
            //         stopPoint.commonName.toLowerCase().includes(stopName.toLowerCase()));
            //     const stopPointNaptanIds = extractNaptanIdsDirections(filteredStopPoints).map(nd => ({
            //         label: `${nd.commonName} towards ${nd.towards}`,
            //         value: nd.naptanId,
            //     }));
            //     setDropDownData(stopPointNaptanIds);

            // })
            .catch(error => console.log(error));
    }, [lineId, stopName]);

    return (
        // <View style={styles.container}>
        <View>
            <FlatList
                data={dropDownData} // Flat list data
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
        // <>{dropDownData.map(data => <Text>{data.label}</Text>)}</>
        )
}

const styles = StyleSheet.create({
    // container: {
    //     flex: 1,
    //     marginTop: 50,
    //     padding: 10,
    // },
    card: {
        marginBottom: 10,
    },
    itemText: {
        fontSize: 18,
    },
});

export default StopPointsList;