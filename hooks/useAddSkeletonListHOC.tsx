import { View, StyleSheet } from "react-native";
import Text from "@/components/custom/Text";
import Card from "@/components/custom/Card";
import { ReactElement, ReactNode } from "react";

type Props = {
  numberOfList?: number;
  component: ReactElement; // Mudei de Element para ReactElement
  isLoading: boolean;
  emptyListMessage: string;
  list: any[];
};

export default function useAddSkeletonListHOC({
  numberOfList = 10,
  component,
  isLoading,
  emptyListMessage,
  list,
}: Props) {
  return ({ ...props }) => (
    <>
      {!isLoading && list && list.length === 0 && (
        <View style={styles.overlay}>
          <Text>{emptyListMessage}</Text>
        </View>
      )}
      {isLoading && list && list.length === 0 ? (
        <View style={styles.view}>
          {Array.from({ length: numberOfList }).map((_, index) => (
            <View key={index} style={styles.cardWrapper}>
              <Card isLoading={isLoading} roundedImage={true} />
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.view}>
          {component}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
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