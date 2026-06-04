import React, { useState, useEffect, useMemo, use } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { IGroup } from "@/shared/models/IGroup";
import PermissionsTree from "@/components/custom/PermissionsTree";
import useCustomStyle from "@/hooks/useCustomStyle";
import Input from "@/components/custom/Input";
import { useTranslation } from "@/hooks/useTranslation";
import { AppMessagesEnum } from "@/shared/enum/AppMessagesEnum";
import { Button } from "@/components/custom/Button";
import { SeverityEnum } from "@/shared/enum/SeverityEnum";
import { useApi } from "@/hooks/useApi";
import { ApiRequestType } from "@/shared/types/ApiRequestType";
import { INITIAL_GROUP_DATA } from "../../../app/(authenticated)/(stacks)/(groupsStacks)/constants";
import Dropdown from "@/components/custom/Dropdown";
import { generateDropdownOptions } from "@/shared/utils/generateDropdownOptions";
import { IAcademy } from "@/shared/models/IAcademy";
import { Dispatch } from "@/shared/types/ReducerTypes";
import { GroupState } from "@/app/(authenticated)/(stacks)/(groupsStacks)/groupReducer";

// Função para propagar permissões (quando um pai é desativado, todos os filhos são desativados)
const propagatePermissions = (obj: any, permitted: boolean): any => {
  if (typeof obj !== "object" || obj === null) return obj;

  // Cria uma cópia do objeto para não modificar o original
  const result: any = { ...obj };

  // Se o objeto tem a propriedade "permitted", atualiza-a
  if ("permitted" in result) {
    result.permitted = permitted;
  }

  // Recursivamente propaga para todos os filhos
  for (const key in result) {
    if (
      key !== "permitted" &&
      typeof result[key] === "object" &&
      result[key] !== null
    ) {
      result[key] = propagatePermissions(result[key], permitted);
    }
  }

  return result;
};

type GroupScreenProps = {
  handleSave: () => Promise<void>;
  handleRemove?: () => Promise<void>;
  dispatch: Dispatch<GroupState>;
  group?: ApiRequestType<IGroup>;
  isEditing?: boolean;
};

export default function GroupScreen({
  handleSave,
  dispatch,
  isEditing = false,
  group,
  handleRemove,
}: GroupScreenProps) {
  const { call } = useApi();
  const router = useRouter();
  const { t } = useTranslation();
  const {
    groupId,
    academyList: academyListJson,
    user: userJson,
  } = useLocalSearchParams();
  const { colors } = useCustomStyle();

  const [loading, setLoading] = useState(true);

  const user = useMemo(() => {
    return userJson ? (JSON.parse(userJson as string) as any) : null;
  }, [userJson]);

  const [academyItems, _] = useMemo(() => {
    const academyList = academyListJson
      ? (JSON.parse(academyListJson as string) as IAcademy[])
      : [];

    return [generateDropdownOptions({ list: academyList }), academyList];
  }, [academyListJson]);

  const customStyles = useMemo(
    () => ({
      container: {
        backgroundColor: colors.background,
      },
      loadingText: {
        color: colors.text,
      },
    }),
    [colors],
  );
  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);

        dispatch({ type: "LOAD_ALL", payload: group || INITIAL_GROUP_DATA });
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar o grupo");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId]);

  const handleUpdatePermission = (path: string[], permitted: boolean) => {
    if (!group) return;

    // Faz uma cópia profunda do grupo para evitar problemas de referência
    const updatedGroup = JSON.parse(JSON.stringify(group));

    // Constrói o caminho completo para a propriedade
    const fullPath = ["permissions", ...path];

    // Se o último elemento do caminho é "permitted"
    if (path[path.length - 1] === "permitted") {
      // Obtém o objeto pai para propagar as permissões
      let parentObj = updatedGroup;
      for (let i = 0; i < fullPath.length - 1; i++) {
        parentObj = parentObj[fullPath[i]];
      }

      // Atualiza a propriedade permitted
      parentObj.permitted = permitted;

      // Se estiver desabilitando, propaga para todos os filhos
      if (!permitted) {
        // Percorre todas as chaves do objeto pai
        Object.keys(parentObj).forEach((key) => {
          if (
            typeof parentObj[key] === "object" &&
            parentObj[key] !== null &&
            key !== "permitted"
          ) {
            // Propaga recursivamente para os filhos
            parentObj[key] = propagatePermissions(parentObj[key], false);
          }
        });
      }
    } else {
      // Atualiza apenas a propriedade específica
      let current = updatedGroup;
      for (let i = 0; i < fullPath.length - 1; i++) {
        current = current[fullPath[i]];
      }
      current[fullPath[fullPath.length - 1]] = permitted;
    }

    dispatch({ type: "permissions", payload: updatedGroup.permissions });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.tint} />
        <Text style={[styles.loadingText, customStyles.loadingText]}>
          Carregando...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, customStyles.container]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Input
            label={t(AppMessagesEnum.GROUP_NAME)}
            style={styles.nameInput}
            value={group?.name || ""}
            onChange={(e) =>
              dispatch({ type: "name", payload: e.nativeEvent.text })
            }
            placeholder={t(AppMessagesEnum.GROUP_NAME_EXAMPLE)}
          />
        </View>

        <Dropdown
          items={academyItems}
          label={t(AppMessagesEnum.ACADEMY_LIST)}
          selectedValue={user?.academyId || ""}
          setSelectedValue={(value) =>
            dispatch({ type: "academyId", payload: value })
          }
        />

        {group && (
          <PermissionsTree
            data={group.permissions}
            path={[]}
            onUpdatePermission={handleUpdatePermission}
            t={t}
          />
        )}

        <View style={styles.buttonContainer}>
          <Button title={t(AppMessagesEnum.SAVE)} onPress={handleSave} />

          {isEditing && (
            <Button
              title={t(AppMessagesEnum.REMOVE)}
              severity={SeverityEnum.DANGER}
              onPress={handleRemove}
            />
          )}

          <Button
            title={t(AppMessagesEnum.CANCEL)}
            onPress={() => router.back()}
            severity={SeverityEnum.SECONDARY}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    marginBottom: 20,
  },
  nameInput: {},
  buttonContainer: {
    gap: 10,
  },
});
