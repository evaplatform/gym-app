import { IdType } from "./IdType";

export interface IExercise {
    id: string;
    name: string; // unique
    academyId: IdType; // point to academy collection
    exerciseBlockId: IdType;
    description?: string;
    video?: string;
    imagePath?: string;
    videoPath?: string;
    createdAt: Date;
    updatedAt?: Date;
  }
  