import { ITimeStamps } from "./ITimeStamps";

export interface IDefaultEntityProperties extends ITimeStamps {
  id: string;
  isDeleted?: boolean;
}