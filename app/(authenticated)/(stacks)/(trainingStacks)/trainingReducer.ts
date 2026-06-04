
import { LOAD_ALL, RESET } from "@/shared/constants/reducerConsts";
import { TrainingTypeEnum } from "@/shared/enum/TrainingTypeEnum";
import { IImagesTempProps } from "@/shared/interfaces/IImagesTempProps";
import { ITraining } from "@/shared/models/ITraining";
import { ActionType } from "@/shared/types/ReducerTypes";


export interface IExtendedInterfaceStates
  extends IImagesTempProps,
  ITraining { }


export const initialTrainingState: IExtendedInterfaceStates = {
  id: "",
  name: "",
  academyId: "",
  exerciseType: TrainingTypeEnum.BODYBUILDING,
  imagePath: undefined,
  createdAt: new Date(),
  updatedAt: undefined,
  oldImagePath: undefined,
  currentImagePath: undefined,
};

export default function trainingReducer(
  state: IExtendedInterfaceStates,
  action: ActionType<IExtendedInterfaceStates>
): IExtendedInterfaceStates {
  switch (action.type) {
    // Casos para propriedades diretas do IExercise
    case "name":
    case "id":
    case "academyId":
    case "exerciseType":
    case "createdAt":
    case "updatedAt":
    case "currentImagePath":
      return { ...state, [action.type]: action.payload };

    // Casos especiais que afetam múltiplos campos
    case "imagePath":
      return {
        ...state,
        imagePath: action.payload,
        currentImagePath: action.payload,
      };

    case LOAD_ALL:
      const training = action.payload as ITraining;
      return {
        ...training,
        oldImagePath: training.imagePath,
        currentImagePath: training.imagePath,
      };

    case RESET:
      return initialTrainingState;

    default:
      return state;
  }
}