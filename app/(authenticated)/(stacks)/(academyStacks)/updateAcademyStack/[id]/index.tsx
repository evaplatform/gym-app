import { useLocalSearchParams } from "expo-router";
import useUpdateAcademy from "./useUpdateAcademy";
import AcademyScreen from "@/components/pages/AcademyScreen";

export default function Page() {
  const { id } = useLocalSearchParams();
  const hooks = useUpdateAcademy(id as string);

  return (
    <AcademyScreen
      isLoading={hooks.isLoading}
      academy={hooks.academy}
      onSave={hooks.onUpdate}
      setImageAsset={hooks.setImageAsset}
      onRemove={hooks.onRemoveAcademy}
      dispatch={hooks.dispatch}
    />
  );
}
