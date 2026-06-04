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
import { IconType } from "@/shared/types/IconType";

export default function ExercisesTab() {
  const { t } = useTranslation();

  const router = useRouter();

  const {
    list: trainingList,
    loading: loadingTrainingList,
    error,
  } = useSelector((state: RootReduxState) => state.training);



  const { trainingByUserList, loading: loadingTrainingByUser } = useSelector(
    (state: RootReduxState) => state.trainingByUser
  );

  const isLoading = useMemo(
    () =>
      Boolean(
        loadingTrainingList || loadingTrainingByUser
      ),
    [loadingTrainingList, loadingTrainingByUser]
  );

  const ListWithSkeleton = useAddSkeletonListHOC({
    isLoading,
    emptyListMessage: t(AppMessagesEnum.TRAINING_ID_NOT_FOUND),
    list: trainingList ?? [],
    component: (
      <>
        {trainingList && trainingList.length > 0 && (
          <FlatList
            showsVerticalScrollIndicator
            data={trainingList ?? []}
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
