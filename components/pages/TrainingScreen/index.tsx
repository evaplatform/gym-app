import { Button } from "@/components/custom/Button";
import usePickVideoImage from "@/hooks/usePickVideoImage";
import { View, StyleSheet, ScrollView } from "react-native";

import * as ImagePicker from "expo-image-picker";
import { trainingType, TrainingTypeEnum } from "@/shared/enum/TrainingTypeEnum";
import Container from "../../custom/Container";
import Dropdown, { ItemType } from "../../custom/Dropdown";
import Input from "../../custom/Input";
import { ImageWrapper } from "../../custom/ImageWrapper";

import { Dispatch } from "@/shared/types/ReducerTypes";
import { SeverityEnum } from "@/shared/enum/SeverityEnum";
import { IExtendedInterfaceStates } from "@/app/(authenticated)/(stacks)/(trainingStacks)/trainingReducer";
import { Skeleton } from "../../custom/Skeleton";
import { UserWithTokens } from "@/services/AuthServices/types";
import { useMemo } from "react";
import { generateDropdownOptions } from "@/shared/utils/generateDropdownOptions";
import { IAcademy } from "@/shared/models/IAcademy";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { log } from "@/shared/utils/log";
import { ITraining } from "@/shared/models/ITraining";
import { useSelector } from "react-redux";
import { RootReduxState } from "@/redux";

type TrainingScreenProps = {
  isLoading?: boolean;
  newRegister?: boolean;
  training: IExtendedInterfaceStates;
  onSave: () => Promise<void>;
  onRemove?: () => Promise<void>;
  setImageAsset: React.Dispatch<
    React.SetStateAction<ImagePicker.ImagePickerAsset[] | null>
  >;
  dispatch: Dispatch<IExtendedInterfaceStates>;
  user: UserWithTokens | null;
  academyList?: IAcademy[];
  trainingList?: ITraining[];
};

const items: ItemType[] = Object.values(TrainingTypeEnum).map((value) => ({
  label: trainingType[value],
  value: value,
}));

export default function TrainingScreen({
  isLoading = false,
  newRegister,
  training,
  academyList,
  trainingList,
  user,
  setImageAsset,
  onSave,
  dispatch,
  onRemove,
}: TrainingScreenProps) {
  const { unifiedGroup } = useSelector((state: RootReduxState) => state.group);
  const { pickImage } = usePickVideoImage();
  const { t } = useTranslation();

  const academyItems = useMemo(
    () => generateDropdownOptions({ list: academyList }),
    [],
  );

  return (
    <Container>
      <ScrollView contentContainerStyle={{ width: "100%" }}>
        <View style={styles.fields}>
          {isLoading ? (
            <Skeleton style={styles.inputWrapper} />
          ) : (
            <View style={styles.inputWrapper}>
              <Input
                label={t(AppMessagesEnum.TRAINING_NAME_LABEL)}
                value={training.name}
                onChange={(e) =>
                  dispatch({ type: "name", payload: e.nativeEvent.text })
                }
              />
            </View>
          )}

          {isLoading ? (
            <Skeleton style={styles.inputWrapper} />
          ) : (
            <Dropdown
              items={items}
              label={t(AppMessagesEnum.TRAINING_TYPE_LABEL)}
              selectedValue={training.exerciseType}
              setSelectedValue={(value) => {
                log("Selected exercise type:", value);
                dispatch({ type: "exerciseType", payload: value });
              }}
            />
          )}

          {isLoading ? (
            <Skeleton style={styles.inputWrapper} />
          ) : (
            <Dropdown
              enabled={unifiedGroup.changeAcademy.permitted}
              items={academyItems}
              label={t(AppMessagesEnum.ACADEMY_NAME_LABEL)}
              selectedValue={training.academyId}
              setSelectedValue={(value) =>
                dispatch({ type: "academyId", payload: value })
              }
            />
          )}

          <View style={styles.imageVideoGroup}>
            <ImageWrapper
              defaultImage={require("@/assets/images/default-exercise.jpg")}
              isLoading={isLoading}
              object={training}
              newRegister={newRegister}
            />
            <Button
              style={styles.button}
              severity={SeverityEnum.SECONDARY}
              disabled={isLoading}
              title={t(AppMessagesEnum.UPLOAD_IMAGE)}
              onPress={async () => {
                const imageAsset = await pickImage();
                if (imageAsset) {
                  setImageAsset(imageAsset);
                  dispatch({
                    type: "currentImagePath",
                    payload: imageAsset[0].uri,
                  });
                }
              }}
            />
          </View>
        </View>
      </ScrollView>
      <View style={styles.buttonWrapper}>
        <Button
          title={t(AppMessagesEnum.SAVE)}
          onPress={onSave}
          disabled={
            isLoading || !unifiedGroup.drawerMenu.trainings.update.permitted
          }
        />
        {onRemove && (
          <Button
            disabled={
              isLoading || !unifiedGroup.drawerMenu.trainings.delete.permitted
            }
            title={t(AppMessagesEnum.TRAINING_REMOVE)}
            onPress={onRemove}
            severity={SeverityEnum.DANGER}
          />
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonWrapper: { width: "100%", gap: 5 },
  button: { flex: 1, width: 350, marginHorizontal: 30 },
  inputWrapper: { width: "100%", minHeight: 40 },
  fields: {
    width: "100%",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  imageVideoGroup: {
    width: "90%",
    alignItems: "center",
    gap: 5,
    marginVertical: 10,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "cover",
  },
});
