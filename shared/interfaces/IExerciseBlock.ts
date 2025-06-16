import { BlockTypeEnum } from "../enum/BlockTypeEnum";
import { IdType } from "./IdType";

export interface IExerciseBlock {
    id: string;
    name: string; 
    imagePath: string;
    academyId: IdType;
    exerciseType: BlockTypeEnum;
    createdAt: Date;
    updatedAt?: Date;
  }
  