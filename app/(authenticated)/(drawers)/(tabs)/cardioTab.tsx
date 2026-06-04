import { View, StyleSheet, FlatList } from "react-native";
import { useRouter } from "expo-router";

import Card from "@/components/custom/Card";
import { useMemo } from "react";
import Container from "@/components/custom/Container";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { useTranslation } from "@/hooks/useTranslation";
import { useSelector } from "react-redux";
import { RootReduxState } from "@/redux";
import useAddSkeletonListHOC from "@/hooks/useAddSkeletonListHOC";
import { TrainingTypeEnum } from "@/shared/enum/TrainingTypeEnum";
import { ITraining } from "@/shared/models/ITraining";
import { IconType } from "@/shared/types/IconType";

export default function CardioTab() {
  const { t } = useTranslation();

  const router = useRouter();
  const { list: exerciseList, loading: loadingExercise } = useSelector(
    (state: RootReduxState) => state.exercise
  );

  const { trainingByUserList, loading: loadingTrainingByUser } = useSelector(
    (state: RootReduxState) => state.trainingByUser
  );

  const { list: trainingList, loading: loadingTrainingList } = useSelector(
    (state: RootReduxState) => state.training
  );

  const isLoading = useMemo(
    () => loadingTrainingList || loadingTrainingByUser || loadingExercise,
    [loadingTrainingList, loadingTrainingByUser, loadingExercise]
  );

  const cardioTrainingList = useMemo(() => {
    return trainingList?.filter(
      (training: ITraining) => training.exerciseType === TrainingTypeEnum.CARDIO
    );
  }, [trainingList]);

  const ListWithSkeleton = useAddSkeletonListHOC({
    isLoading,
    emptyListMessage: t(AppMessagesEnum.TRAINING_ID_NOT_FOUND),
    list: cardioTrainingList ?? [],
    component: (
      <>
        {cardioTrainingList && cardioTrainingList.length > 0 && (
          <FlatList
            showsVerticalScrollIndicator
            data={cardioTrainingList}
            keyExtractor={(item) => item.id}
            renderItem={(training) => {
              const trainingByUser = trainingByUserList?.find(
                (tbu) => tbu.trainingId === training.item.id
              );

              const sourceImage = training?.item?.imagePath
                ? { uri: training?.item?.imagePath }
                : require("@/assets/images/default-exercise.jpg");

              const centerIcon: { centerIcon: IconType } | {} =
                trainingByUser?.completed
                  ? { centerIcon: "check-circle" as const }
                  : {};

              return (
                <View style={styles.cardWrapper} key={training.item.id}>
                  <Card
                    onPress={() => {
                      router.push({
                        pathname:
                          "/(authenticated)/(stacks)/(StacksByExercisesTab)/trainingByUserListStack/",
                        params: {
                          trainingName: training.item.name,
                          trainingId: training.item.id,
                          trainingList: JSON.stringify(trainingList),
                          trainingByUser: JSON.stringify(trainingByUser),
                        },
                      });
                    }}
                    {...centerIcon}
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
      <ListWithSkeleton />
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
});
