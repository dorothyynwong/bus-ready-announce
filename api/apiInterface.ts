export interface StopPointsSearchMatchInterface {
    id: string;
    url: string;
    name: string;
    lat: number;
    lon: number;
}

export interface StopPointsByCommonNameInterface {
    query: string;
    from: number;
    page: number;
    pageSize: number;
    provider: string;
    total: number;
    matches: StopPointsSearchMatchInterface[];
    maxScore: number;

}

export interface EntitiesTrainLoadingInterface {
    line: string;
    lineDirection: string;
    platformDirection: string;
    direction: string;
    naptanTo: string;
    timeSlice: string;
    value: number;
}

export interface EntitiesPassengerFlowInterface {
    timeSlice: string;
    value: number;
}

export interface EntitiesCrowdingInterface {
    passengerFlows: EntitiesPassengerFlowInterface;
    trainLoadings: EntitiesTrainLoadingInterface;
}

export interface EntitiesIdentifierInterface {
    id: string;
    name: string;
    uri: string;
    fullName: string;
    type: string;
    crowding: EntitiesCrowdingInterface;
    routeType: string;
    status: string;
}

export interface EntitiesLineGroupInterface {
    naptanIdReference: string;
    stationAtcoCode: string;
    lineIdentifier: string[];
}

export interface EntitiesLineModeGroupInterface {
    modeName: string;
    lineIdentifier: string[];
}

export interface EntitiesAdditionalPropertiesInterface {
    category: string;
    key: string;
    sourceSystemKey: string;
    value: string;
    modified: string;
}

export interface EntitiesPlaceInterface {
    id: string;
    url: string;
    commonName: string;
    distance: number;
    placeType: string;
    additionalProperties: EntitiesAdditionalPropertiesInterface[];
    children: EntitiesPlaceInterface[];
    childrenUrls: string[];
    lat: number;
    lon: number;
}

export interface EntitiesStopPointInterface {
    naptanId: string;
    platformName: string;
    indicator: string;
    stopLetter: string;
    modes: string[];
    icsCode: string;
    smsCode: string;
    stopType: string;
    stationNaptan: string;
    accessibilitySummary: string;
    hubNaptanCode: string;
    lines: EntitiesIdentifierInterface[];
    linesGroup: EntitiesLineGroupInterface[];
    lineModesGroups: EntitiesLineModeGroupInterface[];
    fullName: string;
    naptanMode: string;
    status: boolean;
    id: string;
    url: string;
    commonName: string;
    distance: number;
    placeType: string;
    additionalProperties: EntitiesAdditionalPropertiesInterface[];
    children: EntitiesPlaceInterface[];
    childrenUrls: string[];
    lat: number;
    lon: number;
}

export interface StopPointsByCoordinatesInterface {
    centrePoint: number[];
    stopPoints: EntitiesStopPointInterface[];
    pageSize: number;
    total: number;
    page: number;
}

export interface TimingInterface {
    countdownServerAdjustment: string;
    source: string;
    insert: string;
    read: string;
    sent: string;
    received: string;
}

export interface ArrivalPredictionsByLinesAndStopPointInterface {
    id: string;
    operationType: 0;
    vehicleId: string;
    naptanId: string;
    stationName: string;
    lineId: string;
    lineName: string;
    platformName: string;
    direction: string;
    bearing: string;
    destinationNaptanId: string;
    destinationName: string;
    timestamp: string;
    timeToStation: 0;
    currentLocation: string;
    towards: string;
    expectedArrival: string;
    timeToLive: string;
    modeName: string;
    timing: TimingInterface;
}

export interface NotificationMessageInterface {
    to: string;
    sound: string;
    title: string;
    body: string;
    data: { someData: string }
  }
  
  