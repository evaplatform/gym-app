import { LOAD_ALL, RESET } from "@/shared/constants/reducerConsts";
import { ITrainingByUser } from "@/shared/models/ITrainingByUser";

import { ActionType } from "@/shared/types/ReducerTypes";
import { log } from "@/shared/utils/log";

// Extended state to include additional fields
export interface ExtendedTrainingByUserState extends ITrainingByUser {
  addDay?: (day: string) => void;
  removeDay?: (day: string) => void;
}

export const initialTrainingByUserState: ExtendedTrainingByUserState = {
  id: "",
  userId: "",
  academyId: "",
  trainingId: "",
  weekDays: [],

  createdAt: new Date(),
  updatedAt: new Date()
};

export default function trainingByUserReducer(
  state: ExtendedTrainingByUserState,
  action: ActionType<ExtendedTrainingByUserState>
): ExtendedTrainingByUserState {
  switch (action.type) {

    case "userId":
    case "academyId":
    case "weekDays":
    case "trainingId":

      return { ...state, [action.type]: action.payload };

    // special cases
    case 'addDay':
      log("passed to addDay", action.payload);

      const weekDays = state.weekDays?.map(day => Number(day)) || [];

      if (weekDays.includes(action.payload)) {
        return state; // Day already exists, no need to add
      }
      const newWeekDays = Array.from(new Set([...weekDays, Number(action.payload)])).sort((a, b) => a - b);

      return {
        ...state,
        weekDays: newWeekDays,
      };

    case 'removeDay':
      log("passed to removeDay", action.payload);
      return {
        ...state,
        weekDays: state.weekDays?.filter(day => day !== action.payload),
      };


    case LOAD_ALL:
      const trainingByUser = action.payload as ExtendedTrainingByUserState;
      return {
        ...trainingByUser,
        weekDays: trainingByUser.weekDays?.map(day => Number(day)) ?? [],
      };

    case RESET:
      return initialTrainingByUserState;

    default:
      return state;
  }
}
