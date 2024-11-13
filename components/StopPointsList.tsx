import { fetchStopPointsByLineId } from "@/api/api";
import { EntitiesStopPointInterface } from "@/api/apiInterface";
import { extractNaptanIdsDirections } from "@/utils/extractNaptanIdsDirections";
import { useEffect, useState } from "react";
import { Dropdown } from "react-native-element-dropdown";

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

    return (<>
        <Dropdown
            data={dropDownData}
            labelField="label"
            valueField="value"
            placeholder="Select a bus stop"
            value={selectedNaptanId}
            onChange={item => setSelectedNaptanId(item.value)}
        />
    </>)
}

export default StopPointsList;