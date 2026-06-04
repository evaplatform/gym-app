import { Button } from "@/components/custom/Button";
import usePickVideoImage from "@/hooks/usePickVideoImage";
import { View, StyleSheet, ScrollView } from "react-native";

import * as ImagePicker from "expo-image-picker";
import { trainingType, TrainingTypeEnum } from "@/shared/enum/TrainingTypeEnum";
import Container from "../../custom/Container";
import { ItemType } from "../../custom/Dropdown";
import Input from "../../custom/Input";
import { ImageWrapper } from "../../custom/ImageWrapper";

import { SeverityEnum } from "@/shared/enum/SeverityEnum";
import { Skeleton } from "../../custom/Skeleton";
import { Dispatch } from "@/shared/types/ReducerTypes";
import { ExtendedAcademyState } from "@/app/(authenticated)/(stacks)/(academyStacks)/academyReducer";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { RootReduxState } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

type AcademyScreenProps = {
  isLoading?: boolean;
  newRegister?: boolean;
  academy: ExtendedAcademyState;
  onSave: () => Promise<void>;
  onRemove?: () => Promise<void>;
  setImageAsset: React.Dispatch<
    React.SetStateAction<ImagePicker.ImagePickerAsset[] | null>
  >;
  dispatch: Dispatch<ExtendedAcademyState>;
};

export default function AcademyScreen({
  isLoading = false,
  newRegister,
  onSave,
  setImageAsset,
  academy,
  dispatch,
  onRemove,
}: AcademyScreenProps) {
  const { unifiedGroup } = useSelector((state: RootReduxState) => state.group);
  const { t } = useTranslation();
  const { pickImage } = usePickVideoImage();

  return (
    <Container>
      <ScrollView contentContainerStyle={{ width: "100%" }}>
        <View style={styles.fields}>
          {isLoading ? (
            <Skeleton style={styles.inputWrapper} />
          ) : (
            <View style={styles.inputWrapper}>
              <Input
                label={t(AppMessagesEnum.ACADEMY_NAME_LABEL)}
                value={academy.name}
                onChange={(e) =>
                  dispatch({ type: "name", payload: e.nativeEvent.text })
                }
              />
            </View>
          )}

          {isLoading ? (
            <Skeleton style={styles.inputWrapper} />
          ) : (
            <View style={styles.inputWrapper}>
              <Input
                label={t(AppMessagesEnum.LOCALIZATION)}
                value={academy.location}
                onChange={(e) =>
                  dispatch({ type: "location", payload: e.nativeEvent.text })
                }
              />
            </View>
          )}

          {isLoading ? (
            <Skeleton style={styles.inputWrapper} />
          ) : (
            <View style={styles.inputWrapper}>
              <Input
                label={t(AppMessagesEnum.PHONE)}
                mask="PHONE"
                placeholder="(99) 9999-9999"
                value={academy.phoneNumber}
                onChangeText={(formatted, raw) => {
                  dispatch({ type: "phoneNumber", payload: raw });
                }}
              />
            </View>
          )}

          {isLoading ? (
            <Skeleton style={styles.inputWrapper} />
          ) : (
            <View style={styles.inputWrapper}>
              <Input
                label={t(AppMessagesEnum.ACADEMY_USER_LIMIT)}
                keyboardType="numeric"
                value={academy.userLimit.toString()}
                onChange={(e) =>
                  dispatch({ type: "userLimit", payload: e.nativeEvent.text })
                }
              />
            </View>
          )}

          <View style={styles.imageVideoGroup}>
            <ImageWrapper
              defaultImage={require("@/assets/images/default-logo.png")}
              isLoading={isLoading}
              object={academy}
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
                    type: "imagePath",
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
            isLoading || !unifiedGroup.drawerMenu.academies.update.permitted
          }
        />
        {onRemove && (
          <Button
            disabled={
              isLoading || !unifiedGroup.drawerMenu.academies.delete.permitted
            }
            title={t(AppMessagesEnum.ACADEMY_REMOVE)}
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
