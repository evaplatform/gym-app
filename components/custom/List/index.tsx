import { Skeleton } from "../Skeleton";
import { Pressable, StyleSheet, View } from "react-native";
import Text from "../Text";
import { FontAwesome } from "@expo/vector-icons";
import useCustomStyle from "@/hooks/useCustomStyle";

export type ListItem = {
  id: string;
  name: string;
  onDelete?: () => void;
  onSelect?: () => void;
};

type ListProps = {
  list: ListItem[];
  isLoading?: boolean;
};

export default function List({ list, isLoading = false }: ListProps) {
  const { colors } = useCustomStyle();

  const customStyle = {
    item: {
      borderBottomColor: colors.gray300,
    },
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Skeleton style={styles.list} />
      ) : (
        list.map((item) => (
          <View key={item.id} style={[styles.item, customStyle.item]}>
            <Text style={styles.text}>{item.name}</Text>

            <Pressable onPress={() => item?.onDelete && item.onDelete()}>
              <FontAwesome
                name={"trash-o"}
                size={30}
                color={colors.notification.danger}
              />
            </Pressable>
          </View>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  list: {},
  item: {
    marginVertical: 10,
    flexDirection: "row",
    borderBottomWidth: 1,
    justifyContent: "space-between",
  },
  text: {
    textAlign: "left",
  },
});
