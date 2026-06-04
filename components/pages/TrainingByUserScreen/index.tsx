import { View, StyleSheet, Alert } from "react-native";
import Container from "../../custom/Container";

import { IExercise } from "@/shared/models/IExercise";
import { useTranslation } from "@/hooks/useTranslation";
import { ITraining } from "@/shared/models/ITraining";
import Checkbox from "@/components/custom/Checkbox";
import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Button } from "@/components/custom/Button";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { IdType } from "@/shared/interfaces/IdType";
import Dropdown from "@/components/custom/Dropdown";
import { generateDropdownOptions } from "@/shared/utils/generateDropdownOptions";
import { ITrainingByUser } from "@/shared/models/ITrainingByUser";
import { Skeleton } from "@/components/custom/Skeleton";
import { getWeekdaysList } from "@/shared/utils/weedaysUtils";
import { Dispatch } from "@/shared/types/ReducerTypes";
import { ExtendedTrainingByUserState } from "@/app/(authenticated)/(stacks)/(trainingByUserStacks)/trainingByUserReducer";
import { RootReduxState } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { SeverityEnum } from "@/shared/enum/SeverityEnum";

type TrainingScreenProps = {
  isLoading?: boolean;
  trainingList: ITraining[];
  trainingsFromUser?: ITraining[];
  trainingByUser?: ITrainingByUser;
  onSave: (trainingsIds: IdType[]) => void;
  onRemove?: () => void;
  dispatch: Dispatch<ExtendedTrainingByUserState>;
};

export default function TrainingByUserScreen({
  isLoading = false,
  trainingList,
  trainingsFromUser,
  trainingByUser,
  dispatch,
  onSave,
  onRemove
}: TrainingScreenProps) {
  const { t } = useTranslation();
    const { unifiedGroup } = useSelector((state: RootReduxState) => state.group);


  const [selectedTrainingsId, setSelectedTrainingsId] = useState<IdType[]>([]);

  const trainingItemList = useMemo(
    () => generateDropdownOptions({ list: trainingList }),
    [trainingList]
  );

  useFocusEffect(
    useCallback(() => {
      if (trainingsFromUser?.length) {
        const trainingsId = trainingsFromUser.map((training) => training.id);
        setSelectedTrainingsId(trainingsId);
      }
    }, [])
  );

  const onConfirmSave = () => {
    Alert.alert(
      t(AppMessagesEnum.TRAINING_BY_USER_CONFIRM_SAVE_TITLE),
      t(AppMessagesEnum.TRAINING_BY_USER_CONFIRM_SAVE),
      [
        {
          text: t(AppMessagesEnum.CANCEL),
          style: "cancel",
        },
        {
          text: t(AppMessagesEnum.FINALIZE),
          onPress: () => onSave(selectedTrainingsId),
        },
      ]
    );
  };

  return (
    <Container style={styles.container}>
      <View style={styles.fieldsWrapper}>
        <Dropdown
          items={trainingItemList}
          label={t(AppMessagesEnum.TRAINING_LIST)}
          placeholder={t(AppMessagesEnum.TRAINING_SELECT_PLACEHOLDER)}
          selectedValue={trainingByUser?.trainingId || ""}
          setSelectedValue={(value) => {
            const selectedTraining = trainingList?.find(
              (tr) => tr.id === value
            );

            if (!selectedTraining) {
              return;
            }

            dispatch({
              type: "trainingId",
              payload: value,
            });
          }}
        />

        <View style={styles.inputWrapper}>
          {isLoading ? (
            <Skeleton style={styles.inputWrapper} />
          ) : (
            getWeekdaysList().map((weekday, i, array) => {
              const weekDays = trainingByUser?.weekDays?.map((day) =>
                Number(day)
              );

              return (
                <View key={weekday.description} style={styles.inputWrapper}>
                  <Checkbox
                    label={weekday.description}
                    checked={weekDays?.includes(weekday.day)}
                    onChange={(checked) => {
                      if (checked) {
                        dispatch({
                          type: "addDay",
                          payload: weekday.day,
                        });
                      } else {
                        dispatch({
                          type: "removeDay",
                          payload: weekday.day,
                        });
                      }
                    }}
                  />
                </View>
              );
            })
          )}
        </View>
      </View>
      <Button title={t(AppMessagesEnum.SAVE)} onPress={onConfirmSave} disabled={!unifiedGroup.drawerMenu.trainingByUserList.update.permitted} />

      <Button title={t(AppMessagesEnum.REMOVE)} onPress={onRemove} disabled={!unifiedGroup.drawerMenu.trainingByUserList.delete.permitted} severity={SeverityEnum.DANGER} />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
  },
  fieldsWrapper: {
    gap: 20
  },
  cardWrapper: {
    marginBottom: 10,
  },
  itemWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  collapsable: {
    flex: 1,
  },
  checkbox: {
    marginTop: 18,
  },
  inputWrapper: { width: "100%" },
});
