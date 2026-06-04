import { LOAD_ALL, RESET } from "@/shared/constants/reducerConsts";
import { IVideoImagesTempProps } from "@/shared/interfaces/IVideoImagesTempProps";
import { IExercise } from "@/shared/models/IExercise";
import { ActionType } from "@/shared/types/ReducerTypes";
import { VideoSource } from "expo-video";

// Estado estendido para incluir os campos adicionais
export interface ExtendedExerciseState extends IExercise, IVideoImagesTempProps {
  addTrainingId: string;
  removeTrainingId: string;
  addRepetition: number;
  removeRepetition: number;
}

export const initialExerciseState: ExtendedExerciseState = {
  id: "",
  name: "",
  academyId: "",
  trainingIds: [] as string[],
  description: "",
  videoPath: "",
  imagePath: "",
  createdAt: new Date(),
  oldImagePath: "",
  oldVideoPath: "",
  hasGps: false,
  hasStopwatch: false,
  currentImagePath: "",
  currentVideoPath: null as VideoSource,
  addTrainingId: "",
  removeTrainingId: "",
  addRepetition: 0,
  removeRepetition: 0,
  distance: 0,
  distanceUnit: undefined,
  clientWeight: 0,
  repetitions: [] as number[],
  sets: 0,
  exerciseOrientations: "",
  restTimeBetweenSets: 0,
  duration: 0,
  goal: "",
};

export default function exerciseReducer(
  state: ExtendedExerciseState,
  action: ActionType<ExtendedExerciseState>
): ExtendedExerciseState {
  switch (action.type) {
    // Casos para propriedades diretas do IExercise
    case "name":
    case "description":
    case "id":
    case "academyId":
    case "createdAt":
    case "updatedAt":
    case "currentImagePath":
    case "currentVideoPath":
    case "hasGps":
    case "hasStopwatch":
    case "trainingIds":
    case "distance":
    case "distanceUnit":
    case "clientWeight":
    case "repetitions":
    case "sets":
    case "exerciseOrientations":
    case "restTimeBetweenSets":
    case "duration":
    case "goal":
      return { ...state, [action.type]: action.payload };



    // Casos especiais que afetam múltiplos campos
    case "addRepetition":
      if (state.repetitions?.includes(action.payload as number)) {
        return state;
      }

      return {
        ...state,
        repetitions: state.repetitions
          ? [...state.repetitions, action.payload as number]
          : [action.payload as number],
      };

    case "removeRepetition":
      return {
        ...state,
        repetitions: state.repetitions
          ? state.repetitions.filter(
            (rep) => rep !== (action.payload as number)
          )
          : [],
      };

    case "addTrainingId":
      if (state.trainingIds.includes(action.payload)) {
        return state;
      }

      return {
        ...state,
        trainingIds: [...state.trainingIds, action.payload],
      };
    case "removeTrainingId":
      return {
        ...state,
        trainingIds: state.trainingIds.filter(
          (id) => id !== action.payload
        ),
      };
    case "imagePath":
      return {
        ...state,
        imagePath: action.payload,
        currentImagePath: action.payload,
      };

    case "videoPath":
      return {
        ...state,
        videoPath: action.payload,
        currentVideoPath: action.payload as VideoSource,
      };

    case LOAD_ALL:
      const exercise = action.payload as ExtendedExerciseState;
      return {
        ...exercise,
        oldImagePath: exercise.imagePath,
        oldVideoPath: exercise.videoPath,
        currentImagePath: exercise.imagePath,
        currentVideoPath: exercise.videoPath as VideoSource,
      };

    case RESET:
      return initialExerciseState;

    default:
      return state;
  }
}
