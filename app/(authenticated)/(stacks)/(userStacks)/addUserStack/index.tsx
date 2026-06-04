import { useLocalSearchParams } from "expo-router";
import { IAcademy } from "@/shared/models/IAcademy";
import UserScreen from "@/components/pages/UserScreen";
import useAddUser from "./useAddUser";
import { IGroup } from "@/shared/models/IGroup";

export default function Page() {
  const { academyList, groupList } = useLocalSearchParams();
  const academies = academyList
    ? (JSON.parse(academyList as string) as IAcademy[])
    : [];

  const groups = groupList
    ? (JSON.parse(groupList as string) as IGroup[])
    : [];

  const hooks = useAddUser();

  return (
    <UserScreen
      isLoading={false}
      user={hooks.user}
      academyList={academies}
      groupList={groups}
      onSave={hooks.addUser}
      dispatch={hooks.dispatch}
      isNewUser
    />
  );
}
