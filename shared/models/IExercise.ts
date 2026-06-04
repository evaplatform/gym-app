import { DistanceUnitEnum } from "../enum/DistanceUnitEnum";
import { IDefaultEntityProperties } from "../interfaces/IDefaultEntityProperties";
import { IdType } from "../interfaces/IdType";
import { IImageProp } from "../interfaces/IImageProp";
import { IVideoProp } from "../interfaces/IVideoProp";
export interface IExercise extends IDefaultEntityProperties, IImageProp, IVideoProp {
  name: string; // unique
  academyId: IdType; // point to academy collection
  trainingIds: IdType[];
  description?: string;

  hasStopwatch?: boolean;
  hasGps?: boolean;

  // cardio
  distance?: number;
  distanceUnit?: DistanceUnitEnum; // e.g., kilometers, miles

  // bodybuilding | mobility | stretching
  clientWeight?: number;
  repetitions?: number[];
  sets?: number;

  // all types
  exerciseOrientations?: string;
  restTimeBetweenSets?: number;
  duration?: number;
  goal?: string;
  userNotes?: string;

  completed?: boolean;
}
