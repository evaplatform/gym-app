import { WeekDaysEnum } from "../enum/WeekDaysEnum";
import { IDefaultEntityProperties } from "../interfaces/IDefaultEntityProperties";
import { IdType } from "../interfaces/IdType";

export interface ITrainingByUser extends IDefaultEntityProperties {
  userId: IdType;
  academyId: IdType;
  trainingId: IdType;
  weekDays?: WeekDaysEnum[];
  completed?: boolean;
}
