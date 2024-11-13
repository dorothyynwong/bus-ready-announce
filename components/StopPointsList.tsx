import { fetchStopPointsByLineId } from "@/api/api";
import { EntitiesStopPointInterface } from "@/api/apiInterface";
import { extractNaptanIdsDirections } from "@/utils/extractNaptanIdsDirections";
import { useEffect, useState } from "react";
import { FlatList, ScrollView, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Card, List, Text } from "react-native-paper";
import { StyleSheet } from 'react-native';

interface StopPointsListProps {
    lineId: string;
    selectedNaptanId: string;
    setSelectedNaptanId: (newId: string) => void;
}

interface DropDownDataInterface {
    label: string;
    value: string;
}

const StopPointsList: React.FC<StopPointsListProps> = ({ lineId, selectedNaptanId, setSelectedNaptanId }) => {
    const [dropDownData, setDropDownData] = useState<DropDownDataInterface[]>([]);

    useEffect(() => {
        fetchStopPointsByLineId(lineId)
            .then(response => {
                const stopPoints = response.data;
                const stopPointNaptanIds = extractNaptanIdsDirections(stopPoints).map(nd => ({
                    label: `${nd.commonName} towards ${nd.towards}`,
                    value: nd.naptanId,
                }));
                setDropDownData(stopPointNaptanIds);

            })
            .catch(error => console.log(error));
    }, [lineId]);

    return (
        <View style={styles.container}>
            <FlatList
                data={dropDownData} // Flat list data
                renderItem={({ item }) => (
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text style={styles.itemText}>{item.label}</Text>
                        </Card.Content>
                    </Card>
                )}
                keyExtractor={(item) => item.value}
                initialNumToRender={20} 
            />
        </View>)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50,
        padding: 10,
    },
    card: {
        marginBottom: 10,
    },
    itemText: {
        fontSize: 18,
    },
});

export default StopPointsList;