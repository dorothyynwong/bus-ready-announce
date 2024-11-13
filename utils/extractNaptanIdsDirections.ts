import { EntitiesStopPointInterface} from "@/api/apiInterface";

export const extractNaptanIdsDirections = (data: EntitiesStopPointInterface[]): { naptanId: string; commonName: string; towards: string }[] => {
    return data.map((stopPoint) => {
      const towardsProperty = stopPoint.additionalProperties.find(
        (property) => property.key === "Towards"
      );
      
      return {
        naptanId: stopPoint.naptanId,
        commonName: stopPoint.commonName,
        towards: towardsProperty ? towardsProperty.value : stopPoint.naptanId
      };
    });
  };