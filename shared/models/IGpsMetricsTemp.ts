import * as Location from "expo-location";
import { IdType } from '../interfaces/IdType';
import { IDefaultEntityProperties } from "../interfaces/IDefaultEntityProperties";

export interface IGpsMetricsTemp extends IDefaultEntityProperties{
	exerciseId: IdType;
    academyId: IdType;
	speedAverage: number;
	raceFinalized?: boolean;
	distance: number;
	pace: string;
	elapsedTime: number;
	startLocation: Location.LocationObjectCoords | null;
	endLocation: Location.LocationObjectCoords | null;
	routePoints: Location.LocationObjectCoords[];
}
