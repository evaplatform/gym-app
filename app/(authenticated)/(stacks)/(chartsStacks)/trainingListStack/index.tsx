import { View, StyleSheet, FlatList } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";

import Card from "@/components/custom/Card";
import { useCallback, useState } from "react";
import Container from "@/components/custom/Container";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { useTranslation } from "@/hooks/useTranslation";
import useAddSkeletonListHOC from "@/hooks/useAddSkeletonListHOC";
import { TrainingServices } from "@/services/TrainingServices";
import { ITraining } from "@/shared/models/ITraining";

export default function TrainingListStack() {
  const { userId, user: userJson } = useLocalSearchParams();
  const { t } = useTranslation();
  const router = useRouter();

  const [trainingList, setTrainingList] = useState<ITraining[]>([]);
  const [loadingTrainingList, setLoadingTrainingList] = useState<boolean>(true);

  useFocusEffect(
    useCallback(() => {
      TrainingServices.getAllByUserId(String(userId)).then((res) => {
        setTrainingList(res ?? []);
        setLoadingTrainingList(false);
      });
    }, []),
  );

  const ListWithSkeleton = useAddSkeletonListHOC({
    isLoading: loadingTrainingList,
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
              const sourceImage = training?.item?.imagePath
                ? { uri: training?.item?.imagePath }
                : require("@/assets/images/default-exercise.jpg");

              return (
                <View style={styles.cardWrapper} key={training.item.id}>
                  <Card
                    onPress={() => {
                      router.push({
                        pathname:
                          "/(authenticated)/(stacks)/(chartsStacks)/exercisesByTrainingListStack/",
                        params: {
                          trainingName: training.item.name,
                          trainingId: training.item.id,
                          trainingList: JSON.stringify(trainingList),
                          user: userJson,
                        },
                      });
                    }}
                    leftLabel={training.item.name}
                    source={sourceImage}
                    isLoading={loadingTrainingList}
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
