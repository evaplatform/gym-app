import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { fetchExercise } from "../actions/exerciseActions";
import { IGroup, IGroupPermissions } from "@/shared/models/IGroup";
import {
  clearAllGroups,
  fetchGroups,
  updateGroup,
} from "../actions/groupActions";
import { INITIAL_GROUP_DATA } from "@/app/(authenticated)/(stacks)/(groupsStacks)/constants";
import { unifyGroups } from "@/shared/utils/unifyGroup";

const INITIAL_GROUP = {
  ...INITIAL_GROUP_DATA,
  academyId: "",
  id: "",
  createdAt: new Date(),
  updatedAt: new Date(),
};
export interface GroupState {
  unifiedGroup: IGroupPermissions;
  groupList: IGroup[] | null;
  loading: boolean;
  error?: string;
}

const initialState: GroupState = {
  unifiedGroup: INITIAL_GROUP.permissions,
  groupList: [],
  loading: false,
  error: undefined,
};

const groupSlice = createSlice({
  name: "group",
  initialState,
  reducers: {
    setGroup: (state, action: PayloadAction<IGroup[]>) => {
      state.groupList = action.payload;
    },
    clearGroupsState: (state) => {
      state.groupList = [];
    },
  },
  extraReducers: (builder) => {
    // getting data
    builder.addCase(fetchExercise.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(fetchGroups.fulfilled, (state, action) => {
      state.groupList = action.payload;
      state.unifiedGroup = unifyGroups(action.payload || []);
      state.loading = false;
    });
    builder.addCase(fetchGroups.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // updating data
    builder.addCase(updateGroup.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(updateGroup.fulfilled, (state, action) => {
      const updatedGroup = action.payload;
      if (updatedGroup) {
        state.groupList =
          state.groupList?.map((group) =>
            group.id === updatedGroup.id ? updatedGroup : group,
          ) || null;
        state.unifiedGroup = unifyGroups(state.groupList || []);
      }

      state.loading = false;
    });
    builder.addCase(updateGroup.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });

    // clearing data
    builder.addCase(clearAllGroups.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(clearAllGroups.fulfilled, (state, action) => {
      state.groupList = initialState.groupList;
      state.unifiedGroup = initialState.unifiedGroup;
      state.loading = false;
    });
    builder.addCase(clearAllGroups.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message;
    });
  },
});

export const { setGroup, clearGroupsState } = groupSlice.actions;
export default groupSlice.reducer;
