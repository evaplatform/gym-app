import {
  View,
  StyleSheet,
  FlatList,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";

import Card from "@/components/custom/Card";
import { useState, useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import Container from "@/components/custom/Container";
import { IUser } from "@/shared/models/IUser";
import { UserServices } from "@/services/UserServices";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import useAddSkeletonListHOC from "@/hooks/useAddSkeletonListHOC";
import Input from "@/components/custom/Input";
import { TrainingServices } from "@/services/TrainingServices";
import { ITraining } from "@/shared/models/ITraining";
import { ExerciseServices } from "@/services/ExerciseServices";
import { IExercise } from "@/shared/models/IExercise";
import { useSelector } from "react-redux";
import { RootReduxState } from "@/redux";

export default function TrainingByUserListDrawer() {
  const { unifiedGroup } = useSelector((state: RootReduxState) => state.group);
  const router = useRouter();
  const { t } = useTranslation();

  const { safe } = useApi();
  const [userList, setUserList] = useState<IUser[]>([]);
  const [originalUserList, setOriginalUserList] = useState<IUser[]>([]);
  const [trainingList, setTrainingList] = useState<ITraining[]>([]);
  const [exerciseList, setExerciseList] = useState<IExercise[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleSearch = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const text = e.nativeEvent.text;

    if (text.trim() === "") {
      setUserList(originalUserList);
      return;
    }

    const filteredUsers = originalUserList.filter((user) =>
      user.name.toLowerCase().includes(text.toLowerCase()),
    );

    if (filteredUsers.length === 0) {
      setUserList([]);
      return;
    }

    setUserList(filteredUsers);
  };

  useFocusEffect(
    useCallback(() => {
      Promise.all([
        safe(TrainingServices.getAll()),
        safe(UserServices.getAll()),
        safe(ExerciseServices.getAll()),
      ]).then((results) => {
        results.forEach((result, i) => {
          if (i === 0 && Array.isArray(result)) {
            const data = result as ITraining[];
            setTrainingList(data);
          }
          if (i === 1 && Array.isArray(result)) {
            const data = result as IUser[];
            setUserList(data);
            setOriginalUserList(data);
          }
          if (i === 2 && Array.isArray(result)) {
            const data = result as IExercise[];
            setExerciseList(data);
          }
        });
        setIsLoading(false);
      });
    }, []),
  );

  const ListWithSkeleton = useAddSkeletonListHOC({
    isLoading,
    emptyListMessage: t(AppMessagesEnum.DRAWER_NO_USERS_FOUND),
    list: userList,
    component: (
      <>
        {userList && userList.length > 0 && (
          <FlatList
            showsVerticalScrollIndicator
            data={userList}
            keyExtractor={(item) => item.id}
            renderItem={(user) => {
              const sourceImage = user?.item?.profilePhoto
                ? { uri: user?.item?.profilePhoto }
                : require("@/assets/images/default-profile-photo.png");

              return (
                <View style={styles.cardWrapper} key={user.item.id}>
                  <Card
                    onPress={() =>
                      router.push({
                        pathname: `/(authenticated)/(stacks)/(trainingByUserStacks)/trainingByUserListStack/${user.item.id}`,
                        params: {
                          trainingList: JSON.stringify(trainingList),
                          user: JSON.stringify(user.item),
                          exerciseList: JSON.stringify(exerciseList),
                        },
                      })
                    }
                    leftLabel={user.item.name}
                    source={sourceImage}
                    isLoading={isLoading}
                    roundedImage={true}
                    disabled={
                      !unifiedGroup.drawerMenu.trainingByUserList.visualize
                        .permitted
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
