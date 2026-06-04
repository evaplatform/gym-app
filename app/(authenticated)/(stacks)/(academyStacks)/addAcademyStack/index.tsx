import AcademyScreen from "@/components/pages/AcademyScreen";
import useAddAcademy from "./useAddAcademy";

export default function Page() {
  const hooks = useAddAcademy();

  return (
    <AcademyScreen
      academy={hooks.training}
      dispatch={hooks.dispatch}
      isLoading={false}
      newRegister={true}
      setImageAsset={hooks.setImageAsset}
      onSave={hooks.addAcademy}
    />
  );
}
