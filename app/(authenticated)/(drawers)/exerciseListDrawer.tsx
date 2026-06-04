import { Button } from "@/components/custom/Button";
import {
  View,
  StyleSheet,
  FlatList,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import Card from "@/components/custom/Card";
import { ExerciseServices } from "@/services/ExerciseServices";
import { IExercise } from "@/shared/models/IExercise";
import { useState, useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import Container from "@/components/custom/Container";
import { TrainingServices } from "@/services/TrainingServices";
import { ITraining } from "@/shared/models/ITraining";
import { AcademyServices } from "@/services/AcademyServices";
import { IAcademy } from "@/shared/models/IAcademy";
import useFetchUser from "@/hooks/useFetchUser";
import { IUser } from "@/shared/models/IUser";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { useTranslation } from "@/hooks/useTranslation";
import useAddSkeletonListHOC from "@/hooks/useAddSkeletonListHOC";
import Input from "@/components/custom/Input";
import { RootReduxState } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

export default function Page() {
  const { unifiedGroup } = useSelector((state: RootReduxState) => state.group);
  const router = useRouter();
  const { t } = useTranslation();
  const { safe } = useApi();
  const { getUser } = useFetchUser();
  const [exerciseList, setExerciseList] = useState<IExercise[]>([]);
  const [originalExerciseList, setOriginalExerciseList] = useState<IExercise[]>(
    [],
  );
  const [trainingList, setTrainingList] = useState<ITraining[]>([]);
  const [academyList, setAcademyList] = useState<IAcademy[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleSearch = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const text = e.nativeEvent.text;

    if (text.trim() === "") {
      setExerciseList(originalExerciseList);
      return;
    }

    const filteredExercises = originalExerciseList.filter((exercise) =>
      exercise.name.toLowerCase().includes(text.toLowerCase()),
    );

    if (filteredExercises.length === 0) {
      setExerciseList([]);
      return;
    }

    setExerciseList(filteredExercises);
  };

  useFocusEffect(
    useCallback(() => {
      Promise.all([
        safe(ExerciseServices.getAll()),
        safe(TrainingServices.getAll()),
        safe(AcademyServices.getAll()),
        safe(getUser()),
      ]).then((results) => {
        results.forEach((result, i) => {
          if (i === 0 && Array.isArray(result)) {
            const data = result as IExercise[];
            setExerciseList(data);
            setOriginalExerciseList(data);
          }
          if (i === 1 && Array.isArray(result)) {
            const data = result as ITraining[];
            setTrainingList(data);
          }
          if (i === 2 && Array.isArray(result)) {
            const data = result as IAcademy[];
            setAcademyList(data);
          }
          if (i === 3) {
            const data = result as IUser;
            setUser(data);
          }
        });
        setIsLoading(false);
      });
    }, []),
  );

  const ListWithSkeleton = useAddSkeletonListHOC({
    isLoading,
    emptyListMessage: t(AppMessagesEnum.DRAWER_NO_EXERCISES_FOUND),
    list: exerciseList,
    component: (
      <>
        {exerciseList && exerciseList.length > 0 && (
          <FlatList
            showsVerticalScrollIndicator
            data={exerciseList}
            keyExtractor={(item) => item.id}
            renderItem={(item) => {
              const sourceImage = item?.item?.imagePath
                ? { uri: item?.item?.imagePath }
                : require("@/assets/images/default-exercise.jpg");

              return (
                <View style={styles.cardWrapper} key={item.item.id}>
                  <Card
                    onPress={() =>
                      router.push({
                        pathname: `/(authenticated)/(stacks)/(exercisesStacks)/updateExerciseStack/${item.item.id}`,
                        params: {
                          trainingList: JSON.stringify(trainingList),
                          academyList: JSON.stringify(academyList),
                          user: JSON.stringify(user),
                        },
                      })
                    }
                    leftLabel={item.item.name}
                    source={sourceImage}
                    isLoading={isLoading}
                    disabled={
                      !unifiedGroup.drawerMenu.exercises.visualize.permitted
                    }
                  />
                </View>
              );
            }}
          />
        )}
      </>
    ),
  });

  return (
    <Container style={styles.container}>
      <Input
        leftIcon="search"
        label={t(AppMessagesEnum.SEARCH)}
        style={styles.inputSearch}
        onChange={handleSearch}
        editable={!isLoading}
      />
      <ListWithSkeleton />

      <Button
        disabled={isLoading || !unifiedGroup.drawerMenu.exercises.add.permitted}
        title={t(AppMessagesEnum.DRAWER_ADD_EXERCISE_BUTTON_TITLE)}
        onPress={() => {
          router.push({
            pathname:
              "/(authenticated)/(stacks)/(exercisesStacks)/addExerciseStack",
            params: {
              trainingList: JSON.stringify(trainingList),
              academyList: JSON.stringify(academyList),
              user: JSON.stringify(user),
            },
          });
        }}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
  },
  inputSearch: {
    marginBottom: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  view: { flex: 1, width: "100%" },
  cardWrapper: {
    marginBottom: 10,
  },
});
