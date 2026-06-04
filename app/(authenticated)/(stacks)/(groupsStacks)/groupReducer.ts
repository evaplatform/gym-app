import { LOAD_ALL, RESET } from "@/shared/constants/reducerConsts";
import { IGroup } from "@/shared/models/IGroup";
import { ActionType } from "@/shared/types/ReducerTypes";
import { INITIAL_GROUP_DATA } from "./constants";
import { ApiRequestType } from "@/shared/types/ApiRequestType";

export type GroupState = ApiRequestType<IGroup>;

export const initialGroupState: GroupState = {
  ...INITIAL_GROUP_DATA
};

export default function groupReducer(
  state: GroupState,
  action: ActionType<GroupState>
): GroupState {
  switch (action.type) {
    case "name":
    case "id":
    case "academyId":
    case "createdAt":
    case "updatedAt":
    case "permissions":
      return { ...state, [action.type]: action.payload };

    case LOAD_ALL:
      const group = action.payload as GroupState;
      return {
        ...group,
      };

    case RESET:
      return initialGroupState;

    default:
      return state;
  }
}
