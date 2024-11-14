import { ArrivalPredictionsByLinesAndStopPointInterface} from "@/api/apiInterface";
import React, { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { TextInput, Text } from "react-native-paper";
import useDebounce from "@/hooks/useDebounce";
import StopPointsList from "@/components/StopPointsList";

const BusArrivals: React.FC = () => {
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [busArrivals, setBusArrivals] = useState<ArrivalPredictionsByLinesAndStopPointInterface[]>([]);
    const [lineId, setLineId] = useState("");
    const [stopName, setStopName] = useState("");
    const [timeInterval, setTimeInterval] = useState("3");
    const [timeStop, setTimeStop] = useState("30");
    const debouncedLineId = useDebounce(lineId, 10000);
    const debouncedStopName = useDebounce(stopName, 1000);

    if (status === "loading") return (
        <View>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading bus arrivals...</Text>
        </View>
    );

    return (
        <View>
            <TextInput label="Line Id" value={lineId} onChangeText={(value) => setLineId(value)} ></TextInput>
            <TextInput label="Stop Name" value={stopName} onChangeText={(value) => setStopName(value)} ></TextInput>
            <TextInput label="Time Interval (minutes)" 
                        value={timeInterval.toString()} 
                        keyboardType="numeric"
                        onChangeText={(value) => setTimeInterval(value)} ></TextInput>

            {debouncedLineId!="" && debouncedStopName!="" &&
            <StopPointsList lineId={debouncedLineId} 
                            stopName={debouncedStopName}
                            setBusArrivals={setBusArrivals}
                            timeInterval={timeInterval}
                            />}

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