import GroupScreen from "@/components/pages/GroupScreen";
import useAddGroup from "./useAddGroup";

export default function AddGroupStack() {
  const { dispatch, addGroup, group } = useAddGroup();

  return (
    <GroupScreen dispatch={dispatch} handleSave={addGroup} group={group} />
  );
}
