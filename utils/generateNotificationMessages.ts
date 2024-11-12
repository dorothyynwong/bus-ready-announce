import { ArrivalPredictionsByLinesAndStopPointInterface } from "@/api/apiInterface";

export const GenerateNotificationFromBusArrivalData = (busArrivals: ArrivalPredictionsByLinesAndStopPointInterface[]) => {
    let minutes: string[] = [];
    const filteredBusArrivals = busArrivals.filter(busArrival => busArrival.timeToStation <= 20 * 60);

    filteredBusArrivals.map((busArrival) => {
        const minToStation = Math.round(busArrival.timeToStation / 60);
        if (minToStation <= 20) minutes.push(`${minToStation} minutes`);
    })
    return `Bus ${filteredBusArrivals[0].lineId} towards ${filteredBusArrivals[0].destinationName} is arriving ${filteredBusArrivals[0].stationName} in ` + minutes.join(", next in ");
}
