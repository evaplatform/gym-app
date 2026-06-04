import { Button } from "@/components/custom/Button";
import {
  View,
  StyleSheet,
  FlatList,
  Pressable,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import Text from "@/components/custom/Text";

import Card from "@/components/custom/Card";
import { useState, useCallback, use, useMemo } from "react";
import { useApi } from "@/hooks/useApi";
import Container from "@/components/custom/Container";
import { ExerciseServices } from "@/services/ExerciseServices";
import { IExercise } from "@/shared/models/IExercise";
import { log } from "@/shared/utils/log";
import { StatusCodeEnum } from "@/shared/enum/StatusCodeEnum";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { useTranslation } from "@/hooks/useTranslation";
import Input from "@/components/custom/Input";
import { IUser } from "@/shared/models/IUser";
import { ITraining } from "@/shared/models/ITraining";
import useAddSkeletonListHOC from "@/hooks/useAddSkeletonListHOC";
import { TrainingByUserServices } from "@/services/TrainingByUserServices";
import { ITrainingByUser } from "@/shared/models/ITrainingByUser";

export default function Page() {
  const { call } = useApi();
  const { t } = useTranslation();
  const {
    user: userJson,
    trainingList: trainingListJson,
    exerciseList: exerciseListJson,
  } = useLocalSearchParams();

  const router = useRouter();
  const [trainingsFromUser, setTrainingsFromUser] = useState<ITraining[]>([]);
  const [trainingsByUser, setTrainingsByUser] = useState<ITrainingByUser[]>([]);

  const [originalTrainingsFromUserList, setOriginalTrainingsFromUserList] =
    useState<ITraining[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const user = useMemo(
    () => JSON.parse(userJson as string) as IUser,
    [userJson]
  );

  const trainingList = useMemo(
    () => JSON.parse(trainingListJson as string) as ITraining[],
    [trainingListJson]
  );

  const exerciseList = useMemo(
    () => JSON.parse(exerciseListJson as string) as IExercise[],
    [exerciseListJson]
  );

  const handleSearch = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const text = e.nativeEvent.text;

    if (text.trim() === "") {
      setTrainingsFromUser(originalTrainingsFromUserList);
      return;
    }

    const filteredTrainings = originalTrainingsFromUserList.filter((training) =>
      training.name.toLowerCase().includes(text.toLowerCase())
    );

    if (filteredTrainings.length === 0) {
      setTrainingsFromUser([]);
      return;
    }

    setTrainingsFromUser(filteredTrainings);
  };

  useFocusEffect(
    useCallback(() => {
      call({
        loading: true,
        try: async () => {
          const trainingByUserList = await TrainingByUserServices.getByUserId(
            user.id
          );

          if (trainingByUserList.length > 0) {
            const trainingsFromUser = trainingByUserList
              .map((tbu) => {
                return trainingList.find(
                  (training) => training.id === tbu.trainingId
                );
              })
              .filter((t) => t !== undefined) as ITraining[];

            setOriginalTrainingsFromUserList(trainingsFromUser);
            setTrainingsFromUser(trainingsFromUser);
            setTrainingsByUser(trainingByUserList);
          } else {
            setOriginalTrainingsFromUserList([]);
            setTrainingsFromUser([]);
            setTrainingsByUser([]);
          }
        },
        finally: () => {
          setIsLoading(false);
        },
      });
    }, [])
  );

  const ListWithSkeleton = useAddSkeletonListHOC({
    isLoading,
    emptyListMessage: t(AppMessagesEnum.DRAWER_NO_USERS_FOUND),
    list: trainingsFromUser,
    component: (
      <>
        {trainingsFromUser && trainingsFromUser.length > 0 && (
          <FlatList
            showsVerticalScrollIndicator
            data={trainingsFromUser}
            keyExtractor={(item) => item.id}
            renderItem={(training) => {

              log("training item", training);
              const sourceImage = training?.item?.imagePath
                ? { uri: training?.item?.imagePath }
                : require("@/assets/images/default-exercise.jpg");


                

              const selectedTrainingByUser = trainingsByUser.find(
                (tbu) => tbu.trainingId === training.item.id
              );

              return (
                <View style={styles.cardWrapper} key={training.item.id}>
                  <Card
                    onPress={() =>
                      router.push({
                        pathname: `/(authenticated)/(stacks)/(trainingByUserStacks)/updateTrainingToUserStack/${user.id}`,
                        params: {
                          userId: user.id,
                          selectedTraining: JSON.stringify(training),
                          selectedTrainingByUser: JSON.stringify(selectedTrainingByUser),
                          trainingsFromUser: JSON.stringify(trainingsFromUser),
                          completeTrainingList: JSON.stringify(trainingList),
                          user: JSON.stringify(user),
                        },
                      })
                    }
                    leftLabel={training.item.name}
                    source={sourceImage}
                    isLoading={isLoading}
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
      {!isLoading && trainingsFromUser.length === 0 && (
        <View style={styles.overlay}>
          <Text>{t(AppMessagesEnum.NO_TRAINING_FOR_USER)}</Text>
        </View>
      )}

      {!isLoading && trainingsFromUser.length > 0 && (
        <View style={styles.view}>
          <Input
            leftIcon="search"
            label={t(AppMessagesEnum.SEARCH)}
            style={styles.inputSearch}
            onChange={handleSearch}
            editable={!isLoading}
          />
          <ListWithSkeleton />
        </View>
      )}

      <Button
        disabled={isLoading}
        title={t(AppMessagesEnum.USER_ADD_TRAINING_TO_USER_BUTTON)}
        onPress={() => {
          router.push({
            pathname: `/(authenticated)/(stacks)/(trainingByUserStacks)/addTrainingToUserStack/${user.id}`,
            params: {
              trainingsFromUser: JSON.stringify(trainingsFromUser),
              trainingList: JSON.stringify(trainingList),
              user: JSON.stringify(user),
              exerciseList: JSON.stringify(exerciseList),
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
    alignItems: "center",
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
