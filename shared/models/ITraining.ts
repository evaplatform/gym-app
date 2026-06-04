import { TrainingTypeEnum } from "../enum/TrainingTypeEnum";
import { IDefaultEntityProperties } from "../interfaces/IDefaultEntityProperties";
import { IdType } from "../interfaces/IdType";
import { IImagePathProperty } from "../interfaces/IImagePathProperty";



export interface ITraining extends IDefaultEntityProperties, IImagePathProperty {
  name: string;
  academyId: IdType;
  exerciseType: TrainingTypeEnum;
}
