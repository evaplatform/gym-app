import { useLocalSearchParams } from "expo-router";
import { IAcademy } from "@/shared/models/IAcademy";
import UserScreen from "@/components/pages/UserScreen";
import useUpdateUser from "./useUpdateUser";
import { IGroup } from "@/shared/models/IGroup";

export default function Page() {
  const { academyList, groupList, id } = useLocalSearchParams();
  const academies = academyList
    ? (JSON.parse(academyList as string) as IAcademy[])
    : [];

  const groups = groupList
    ? (JSON.parse(groupList as string) as IGroup[])
    : [];

  const hooks = useUpdateUser(id as string);

  return (
    <UserScreen
      isLoading={hooks.isLoading}
      user={hooks.user}
      academyList={academies}
      onSave={hooks.onUpdate}
      dispatch={hooks.dispatch}
      onRemove={hooks.onRemoveUser}
      groupList={groups}
    />
  );
}
