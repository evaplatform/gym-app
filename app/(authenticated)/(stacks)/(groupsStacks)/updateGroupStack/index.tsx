import GroupScreen from "@/components/pages/GroupScreen";
import useUpdateGroup from "./useUpdateGroup";

export default function UpdateGroupStack() {
  const { dispatch, updateGroup, group, handleRemove } = useUpdateGroup();

  return (
    <GroupScreen
      isEditing
      group={group}
      dispatch={dispatch}
      handleSave={updateGroup}
      handleRemove={handleRemove}
    />
  );
}
