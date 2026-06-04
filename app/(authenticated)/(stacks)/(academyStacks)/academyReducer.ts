import { LOAD_ALL, RESET } from "@/shared/constants/reducerConsts";
import { IImagesTempProps } from "@/shared/interfaces/IImagesTempProps";
import { IAcademy } from "@/shared/models/IAcademy";

import { ActionType } from "@/shared/types/ReducerTypes";

// Estado estendido para incluir os campos adicionais
export interface ExtendedAcademyState extends IAcademy, IImagesTempProps {
}

export const initialAcademyState: ExtendedAcademyState = {
  id: "",
  name: "",
  location: "",
  phoneNumber: "",
  imagePath: undefined,
  userLimit: 0,
  createdAt: new Date(),
  updatedAt: undefined,
};

export default function academyReducer(
  state: ExtendedAcademyState,
  action: ActionType<ExtendedAcademyState>
): ExtendedAcademyState {
  switch (action.type) {
    // Casos para propriedades diretas do IExercise
    case "id":
    case "name":
    case "location":
    case "phoneNumber":
    case "userLimit":
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
      const academy = action.payload as IAcademy;
      return {
        ...academy,
        oldImagePath: academy.imagePath,
        currentImagePath: academy.imagePath,
      };

    case RESET:
      return initialAcademyState;

    default:
      return state;
  }
}