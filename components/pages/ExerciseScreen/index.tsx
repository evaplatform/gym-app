import { Button } from "@/components/custom/Button";
import Input from "@/components/custom/Input";
import usePickVideoImage from "@/hooks/usePickVideoImage";
import { View, StyleSheet, ScrollView } from "react-native";
import Container from "../../custom/Container";
import * as ImagePicker from "expo-image-picker";
import { SeverityEnum } from "@/shared/enum/SeverityEnum";
import { Skeleton } from "../../custom/Skeleton";
import { ExtendedExerciseState } from "@/app/(authenticated)/(stacks)/(exercisesStacks)/exerciseReducer";
import { ImageWrapper } from "../../custom/ImageWrapper";
import { Dispatch } from "@/shared/types/ReducerTypes";
import { ITraining } from "@/shared/models/ITraining";

import { useMemo, useState } from "react";
import { IAcademy } from "@/shared/models/IAcademy";
import { generateDropdownOptions } from "@/shared/utils/generateDropdownOptions";
import { UserWithTokens } from "@/services/AuthServices/types";
import { ExerciseVideo } from "../../custom/ExerciseVideo";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import Dropdown, { ItemType } from "@/components/custom/Dropdown";
import { MAX_LENGTH_DESCRIPTION } from "@/shared/constants/general";
import Checkbox from "@/components/custom/Checkbox";
import Textarea from "@/components/custom/Textarea";
import {
  DistanceUnitEnum,
  DistanceValues,
} from "@/shared/enum/DistanceUnitEnum";
import { useCreateListItem } from "@/components/custom/List/useCreateListItem";
import List from "@/components/custom/List";
import { RootReduxState } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import Collapsable from "@/components/custom/Collapsable";

type ExerciseScreenProps = {
  newRegister?: boolean;
  isLoading?: boolean;
  exercise: ExtendedExerciseState;
  setImageAsset: React.Dispatch<
    React.SetStateAction<ImagePicker.ImagePickerAsset[] | null>
  >;
  setVideoExerciseAsset: React.Dispatch<
    React.SetStateAction<ImagePicker.ImagePickerAsset[] | undefined>
  >;
  onSave: () => Promise<void>;
  onRemoveExercise?: () => Promise<void>;
  dispatch: Dispatch<ExtendedExerciseState>;
  trainingList?: ITraining[];
  academyList?: IAcademy[];
  user: UserWithTokens | null;
};

const distanceUnitItems: ItemType[] = Object.values(DistanceUnitEnum).map(
  (unit) => ({
    value: unit,
    label: DistanceValues[unit as DistanceUnitEnum],
  }),
);

export default function ExerciseScreen({
  newRegister = false,
  isLoading = false,
  exercise,
  trainingList,
  academyList,
  onSave,
  setImageAsset,
  setVideoExerciseAsset,
  onRemoveExercise,
  dispatch,
  user,
}: ExerciseScreenProps) {
  const { t } = useTranslation();
  const { unifiedGroup } = useSelector((state: RootReduxState) => state.group);
  const { pickImage, pickVideo } = usePickVideoImage();
  const { createListItem } = useCreateListItem();

  const [tempRepetitions, setTempRepetitions] = useState<string>("");

  const [selectedTrainingId, setSelectedTrainingId] = useState<string | null>(
    null,
  );

  const trainings = useMemo(
    () => generateDropdownOptions({ list: trainingList }),
    [],
  );

  const academyItems = useMemo(
    () => generateDropdownOptions({ list: academyList }),
    [],
  );

  const onDeleteItem = (trainingId: string) => () => {
    dispatch({ type: "removeTrainingId", payload: trainingId });
  };

  const trainingListItem = useMemo(
    () =>
      createListItem({
        list: trainingList ?? [],
        savedIds: exercise.trainingIds,
        onDelete: (id) => dispatch({ type: "removeTrainingId", payload: id }),
      }),
    [exercise.trainingIds, trainingList, dispatch],
  );

  const repetitionListItem = useMemo(
    () =>
      createListItem({
        list: exercise.repetitions ?? [],
        savedIds: exercise.repetitions?.map((repetition) =>
          repetition.toString(),
        ) as string[],
        onDelete: (id) =>
          dispatch({ type: "removeRepetition", payload: Number(id) }),
      }),
    [exercise.repetitions, dispatch],
  );

  return (
    <Container style={styles.container}>
      <ScrollView contentContainerStyle={{ width: "100%", paddingTop: 0 }}>
        <View style={styles.fields}>
          {isLoading ? (
            <Skeleton style={styles.inputWrapper} />
          ) : (
            <View style={styles.inputWrapper}>
              <Input
                label={t(AppMessagesEnum.EXERCISE_NAME_LABEL)}
                value={exercise?.name}
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
              enabled={unifiedGroup.changeAcademy.permitted}
              items={academyItems}
              label={t(AppMessagesEnum.ACADEMY_NAME_LABEL)}
              selectedValue={exercise.academyId}
              setSelectedValue={(value) =>
                dispatch({ type: "academyId", payload: value })
              }
            />
          )}

          {isLoading ? (
            <Skeleton style={styles.inputWrapper} />
          ) : (
            <View style={styles.fieldWithAddButton}>
              <Dropdown
                items={trainings}
                label={t(AppMessagesEnum.TRAINING_LIST)}
                selectedValue={
                  selectedTrainingId || exercise.trainingIds[0] || ""
                }
                setSelectedValue={(value) => {
                  setSelectedTrainingId(value);
                }}
                containerStyle={{ width: "50%" }}
              />
              <Button
                icon="plus"
                onPress={() =>
                  dispatch({
                    type: "addTrainingId",
                    payload: selectedTrainingId || "",
                  })
                }
                style={{ width: 80, height: 55 }}
              />
            </View>
          )}

          {/* Create component list */}
          <List list={trainingListItem} isLoading={isLoading} />

          <Collapsable
            title={t(AppMessagesEnum.EXERCISE_MOBILITY_FIELDS)}
            isCollapsed={true}
            onlyHideContent
            style={styles.collapsable}
          >
            <View style={styles.unitWrapper}>
              {isLoading ? (
                <Skeleton style={styles.inputWrapperInRow} />
              ) : (
                <View style={styles.inputWrapperInRow}>
                  <Input
                    label={t(AppMessagesEnum.USER_EXERCISE_DISTANCE_LABEL)}
                    value={exercise?.distance?.toString()}
                    keyboardType="numeric"
                    onChange={(e) =>
                      dispatch({
                        type: "distance",
                        payload: e.nativeEvent.text,
                      })
                    }
                  />
                </View>
              )}

              {isLoading ? (
                <Skeleton style={styles.inputWrapperInRow} />
              ) : (
                <Dropdown
                  items={distanceUnitItems}
                  label={t(AppMessagesEnum.USER_EXERCISE_DISTANCE_UNIT_LABEL)}
                  selectedValue={exercise?.distanceUnit?.toString() ?? ""}
                  setSelectedValue={(value) =>
                    dispatch({ type: "distanceUnit", payload: value })
                  }
                />
              )}
            </View>
          </Collapsable>

          <Collapsable
            title={t(AppMessagesEnum.EXERCISE_HYPERTROPHY_FIELDS)}
            isCollapsed={true}
            onlyHideContent
            style={styles.collapsable}
          >
            {isLoading ? (
              <Skeleton style={styles.inputWrapper} />
            ) : (
              <View style={styles.inputWrapper}>
                <Input
                  label={t(AppMessagesEnum.USER_EXERCISE_WEIGHT_LABEL)}
                  value={exercise?.clientWeight?.toString()}
                  keyboardType="numeric"
                  onChange={(e) =>
                    dispatch({
                      type: "clientWeight",
                      payload: e.nativeEvent.text,
                    })
                  }
                />
              </View>
            )}

            {isLoading ? (
              <Skeleton style={styles.inputWrapper} />
            ) : (
              <View style={styles.fieldWithAddButton}>
                <Input
                  label={t(AppMessagesEnum.USER_EXERCISE_REPETITIONS_LABEL)}
                  value={tempRepetitions}
                  keyboardType="numeric"
                  onChange={(e) => setTempRepetitions(e.nativeEvent.text)}
                  containerStyle={{ flex: 1 }}
                />
                <Button
                  icon="plus"
                  onPress={() =>
                    dispatch({
                      type: "addRepetition",
                      payload: Number(tempRepetitions) || 0,
                    })
                  }
                  style={{ width: 80, height: 55 }}
                />
              </View>
            )}

            <List list={repetitionListItem} isLoading={isLoading} />

            {isLoading ? (
              <Skeleton style={styles.inputWrapper} />
            ) : (
              <View style={styles.inputWrapper}>
                <Input
                  label={t(AppMessagesEnum.USER_EXERCISE_SETS_LABEL)}
                  keyboardType="numeric"
                  value={exercise?.sets?.toString()}
                  onChange={(e) =>
                    dispatch({ type: "sets", payload: e.nativeEvent.text })
                  }
                />
              </View>
            )}

            {isLoading ? (
              <Skeleton style={styles.inputWrapper} />
            ) : (
              <View style={styles.inputWrapper}>
                <Input
                  label={t(
                    AppMessagesEnum.USER_EXERCISE_SHORT_DESCRIPTION_LABEL,
                  )}
                  value={exercise?.exerciseOrientations?.toString()}
                  maxLength={500}
                  onChange={(e) =>
                    dispatch({
                      type: "exerciseOrientations",
                      payload: e.nativeEvent.text,
                    })
                  }
                />
              </View>
            )}

            {isLoading ? (
              <Skeleton style={styles.inputWrapper} />
            ) : (
              <View style={styles.inputWrapper}>
                <Input
                  label={t(
                    AppMessagesEnum.USER_EXERCISE_REST_TIME_BETWEEN_SETS_LABEL,
                  )}
                  value={exercise?.restTimeBetweenSets?.toString() || ""}
                  keyboardType="numeric"
                  placeholder="60"
                  onChange={(e) =>
                    dispatch({
                      type: "restTimeBetweenSets",
                      payload: e.nativeEvent.text,
                    })
                  }
                />
              </View>
            )}

            {isLoading ? (
              <Skeleton style={styles.inputWrapper} />
            ) : (
              <View style={styles.inputWrapper}>
                <Input
                  label={t(AppMessagesEnum.USER_EXERCISE_DURATION_LABEL)}
                  keyboardType="numeric"
                  value={exercise?.duration?.toString()}
                  placeholder="60"
                  onChange={(e) =>
                    dispatch({ type: "duration", payload: e.nativeEvent.text })
                  }
                />
              </View>
            )}
          </Collapsable>

          <Collapsable
            title={t(AppMessagesEnum.EXERCISE_GENERAL_FIELDS)}
            isCollapsed={true}
            onlyHideContent
            style={styles.collapsable}
          >
            {isLoading ? (
              <Skeleton style={styles.inputWrapper} />
            ) : (
              <View style={styles.inputWrapper}>
                <Input
                  label={t(AppMessagesEnum.USER_EXERCISE_GOAL_LABEL)}
                  value={exercise?.goal?.toString() || ""}
                  placeholder="3 x 10kg"
                  onChange={(e) =>
                    dispatch({ type: "goal", payload: e.nativeEvent.text })
                  }
                />
              </View>
            )}

            {isLoading ? (
              <Skeleton style={styles.description} />
            ) : (
              <View style={styles.inputWrapper}>
                <Textarea
                  label={t(AppMessagesEnum.DESCRIPTION)}
                  multiline
                  maxLength={MAX_LENGTH_DESCRIPTION}
                  numberOfLines={4}
                  textAlignVertical="top"
                  style={styles.description}
                  value={exercise?.description}
                  onChange={(e) =>
                    dispatch({
                      type: "description",
                      payload: e.nativeEvent.text,
                    })
                  }
                />
              </View>
            )}

            <View style={styles.checkboxGroup}>
              {isLoading ? (
                <Skeleton style={styles.inputWrapper} />
              ) : (
                <Checkbox
                  label={t(AppMessagesEnum.EXERCISE_HAS_STOPWATCH)}
                  checked={exercise.hasStopwatch}
                  onChange={(checked) => {
                    dispatch({ type: "hasStopwatch", payload: checked });
                  }}
                />
              )}

              {isLoading ? (
                <Skeleton style={styles.inputWrapper} />
              ) : (
                <Checkbox
                  label={t(AppMessagesEnum.EXERCISE_HAS_GPS)}
                  checked={exercise.hasGps}
                  onChange={(checked) => {
                    dispatch({ type: "hasGps", payload: checked });
                  }}
                />
              )}
            </View>
          </Collapsable>

          <Collapsable
            title={t(AppMessagesEnum.EXERCISE_IMAGE_AND_VIDEO_FIELDS)}
            isCollapsed={true}
            onlyHideContent
            style={styles.collapsable}
          >
            <View style={styles.imageVideoGroup}>
              <ImageWrapper
                defaultImage={require("@/assets/images/default-exercise.jpg")}
                isLoading={isLoading}
                object={exercise}
                newRegister={newRegister}
              />

              <Button
                severity={SeverityEnum.SECONDARY}
                disabled={isLoading}
                style={styles.button}
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

            <View style={styles.imageVideoGroup}>
              <ExerciseVideo
                isLoading={isLoading}
                object={exercise}
                newRegister={newRegister}
              />
              <Button
                severity={SeverityEnum.SECONDARY}
                disabled={isLoading}
                title={
                  exercise?.currentVideoPath
                    ? t(AppMessagesEnum.UPDATE_VIDEO)
                    : t(AppMessagesEnum.UPLOAD_VIDEO)
                }
                onPress={async () => {
                  const videoAsset = await pickVideo();
                  if (videoAsset) {
                    setVideoExerciseAsset(videoAsset);
                    dispatch({
                      type: "currentVideoPath",
                      payload: videoAsset[0].uri,
                    });
                  }
                }}
              />
            </View>
          </Collapsable>
        </View>
      </ScrollView>
      <View style={styles.buttonWrapper}>
        <Button
          title={t(AppMessagesEnum.SAVE)}
          onPress={onSave}
          disabled={
            isLoading || !unifiedGroup.drawerMenu.exercises.update.permitted
          }
        />
        {onRemoveExercise && (
          <Button
            disabled={
              isLoading || !unifiedGroup.drawerMenu.exercises.delete.permitted
            }
            title={t(AppMessagesEnum.EXERCISE_REMOVE)}
            onPress={onRemoveExercise}
            severity={SeverityEnum.DANGER}
          />
        )}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {},
  checkboxGroup: {
    width: "100%",
    gap: 10,
  },
  inputWrapper: { width: "100%", minHeight: 40, gap: 0 },
  description: { width: "100%", height: 120 },
  buttonWrapper: { width: "100%", gap: 5 },
  button: { flex: 1, width: 350, marginHorizontal: 30 },
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
  contentContainer: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50,
  },
  controlsContainer: {
    padding: 10,
  },
  fieldWithAddButton: {
    gap: 10,
    flexDirection: "row",
    alignItems: "flex-end",

    justifyContent: "space-between", // Alinha os itens com espaço entre eles
    width: "100%",
  },
  unitWrapper: {
    width: "100%",
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  inputWrapperInRow: { width: "20%" },
  collapsable: {
    width: "100%",
  },
});
