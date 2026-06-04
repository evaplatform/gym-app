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
import { useState, useCallback } from "react";
import { useApi } from "@/hooks/useApi";
import Container from "@/components/custom/Container";
import { ITraining } from "@/shared/models/ITraining";
import { AcademyServices } from "@/services/AcademyServices";
import { IAcademy } from "@/shared/models/IAcademy";
import useFetchUser from "@/hooks/useFetchUser";
import { IUser } from "@/shared/models/IUser";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { useTranslation } from "@/hooks/useTranslation";
import useAddSkeletonListHOC from "@/hooks/useAddSkeletonListHOC";
import Input from "@/components/custom/Input";
import { IGroup } from "@/shared/models/IGroup";
import { GroupServices } from "@/services/GroupServices";

export default function GroupsDrawer() {
  const router = useRouter();
  const { t } = useTranslation();
  const { safe } = useApi();
  const { getUser } = useFetchUser();
  const [GroupList, setGroupList] = useState<IGroup[]>([]);
  const [originalGroupList, setOriginalGroupList] = useState<IGroup[]>([]);
  const [trainingList, setTrainingList] = useState<ITraining[]>([]);
  const [academyList, setAcademyList] = useState<IAcademy[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleSearch = (e: NativeSyntheticEvent<TextInputChangeEventData>) => {
    const text = e.nativeEvent.text;

    if (text.trim() === "") {
      setGroupList(originalGroupList);
      return;
    }

    const filteredGroups = originalGroupList.filter((group) =>
      group.name.toLowerCase().includes(text.toLowerCase()),
    );

    if (filteredGroups.length === 0) {
      setGroupList([]);
      return;
    }

    setGroupList(filteredGroups);
  };

  useFocusEffect(
    useCallback(() => {
      Promise.all([
        safe(GroupServices.getAll()),
        safe(AcademyServices.getAll()),
        safe(getUser()),
      ]).then((results) => {
        results.forEach((result, i) => {
          if (i === 0 && Array.isArray(result)) {
            const data = result as IGroup[];
            setGroupList(data);
            setOriginalGroupList(data);
          }
          if (i === 1 && Array.isArray(result)) {
            const data = result as IAcademy[];
            setAcademyList(data);
          }
          if (i === 2) {
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
    emptyListMessage: t(AppMessagesEnum.DRAWER_NO_GROUPS_FOUND),
    list: GroupList,
    component: (
      <>
        {GroupList && GroupList.length > 0 && (
          <FlatList
            showsVerticalScrollIndicator
            data={GroupList}
            keyExtractor={(item) => item.id}
            renderItem={(group) => {
              return (
                <View style={styles.cardWrapper} key={group.item.id}>
                  <Card
                    onPress={() =>
                      router.push({
                        pathname: `/(authenticated)/(stacks)/(groupsStacks)/updateGroupStack/`,
                        params: {
                          groupId: group.item.id,
                          trainingList: JSON.stringify(trainingList),
                          academyList: JSON.stringify(academyList),
                          user: JSON.stringify(user),
                        },
                      })
                    }
                    leftLabel={group.item.name}
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
      <Input
        leftIcon="search"
        label={t(AppMessagesEnum.SEARCH)}
        style={styles.inputSearch}
        onChange={handleSearch}
        editable={!isLoading}
      />
      <ListWithSkeleton />

      <Button
        disabled={isLoading}
        title={t(AppMessagesEnum.DRAWER_ADD_GROUP_TITLE)}
        onPress={() => {
          router.push({
            pathname: "/(authenticated)/(stacks)/(groupsStacks)/addGroupStack",
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
