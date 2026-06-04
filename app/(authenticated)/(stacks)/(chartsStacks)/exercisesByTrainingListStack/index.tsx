import {
  View,
  StyleSheet,
  FlatList,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";

import Card from "@/components/custom/Card";

import Container from "@/components/custom/Container";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { useTranslation } from "@/hooks/useTranslation";

import { IExercise } from "@/shared/models/IExercise";
import useAddSkeletonListHOC from "@/hooks/useAddSkeletonListHOC";
import { useSelector } from "react-redux";
import { RootReduxState } from "@/redux";
import { useCallback, useMemo, useState } from "react";
import { useApi } from "@/hooks/useApi";
import { IconType } from "@/shared/types/IconType";

import Input from "@/components/custom/Input";
import { ExerciseServices } from "@/services/ExerciseServices";

export default function ExercisesByTrainingListStack() {
  const { call } = useApi();
  const {
    trainingId,
    trainingList: trainingListJson,
    user: userJson,
  } = useLocalSearchParams();

  const [exercises, setExercise] = useState<IExercise[]>([]);
  const [originalExercises, setOriginalExercises] = useState<IExercise[]>([]);

  const { loading: loadingTrainingByUser } = useSelector(
    (state: RootReduxState) => state.trainingByUser,
  );

  const user = useMemo(
    () => (userJson ? JSON.parse(userJson as string) : undefined),
    [userJson],
  );

  const { t } = useTranslation();

  const router = useRouter();

  const isLoading = useMemo(
    () => loadingTrainingByUser,
    [loadingTrainingByUser],
  );

  const handleSearch = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const text = e.nativeEvent.text;

    if (text.trim() === "") {
      setExercise(originalExercises);
      return;
    }

    const filteredExercises = originalExercises.filter((exercise) =>
      exercise.name.toLowerCase().includes(text.toLowerCase()),
    );

    if (filteredExercises.length === 0) {
      setExercise([]);
      return;
    }

    setExercise(filteredExercises);
  };

  useFocusEffect(
    useCallback(() => {
      ExerciseServices.getAllByTrainingId(String(trainingId)).then((exerciseList) => {
        const filteredExercises = exerciseList?.filter((exercise: any) =>
          exercise.trainingIds.includes(trainingId),
        );

        if (!filteredExercises) {
          setExercise([]);
          setOriginalExercises([]);
          return;
        }

        setExercise(filteredExercises);
        setOriginalExercises(filteredExercises);
      });
    }, [trainingId, user.id]),
  );

  const ListWithSkeleton = useAddSkeletonListHOC({
    isLoading,
    emptyListMessage: t(AppMessagesEnum.EXERCISE_NOT_FOUND),
    list: exercises,
    component: (
      <>
        {exercises && exercises.length > 0 && (
          <FlatList
            showsVerticalScrollIndicator
            data={exercises}
            keyExtractor={(item) => item.id}
            renderItem={(exercise) => {
              const sourceImage = exercise?.item?.imagePath
                ? { uri: exercise?.item?.imagePath }
                : require("@/assets/images/default-exercise.jpg");

              const isExerciseCompleted = exercise?.item?.completed || false;

              const centerIcon: { centerIcon: IconType } | {} =
                isExerciseCompleted
                  ? { centerIcon: "check-circle" as const }
                  : {};

              return (
                <View style={styles.cardWrapper} key={exercise.item.id}>
                  <Card
                    leftLabel={exercise.item.name}
                    source={sourceImage}
                    {...centerIcon}
                    onPress={() => {
                      router.push({
                        pathname:
                          "/(authenticated)/(stacks)/(chartsStacks)/userExerciseStack/",
                        params: {
                          exercise: JSON.stringify(exercise.item),
                          user: userJson,
                        },
                      });
                    }}
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
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
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
  inputSearch: {
    marginBottom: 10,
  },
});
