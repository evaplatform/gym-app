import Text from "@/components/custom/Text";
import { View, StyleSheet, ScrollView } from "react-native";
import { ExerciseVideo } from "@/components/custom/ExerciseVideo";
import { TabProps } from "..";

export default function DescriptionTab({ hook, t }: TabProps) {
  return (
    <View style={styles.contentContainer}>
      <ScrollView contentContainerStyle={styles.scrollViewContentContainer}>
        <ExerciseVideo
          isLoading={false}
          object={hook.exercise}
          newRegister={false}
        />
        <Text style={styles.description}>{hook.exercise?.description}</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
  },
  scrollViewContentContainer: {
    width: "100%",
    paddingRight: 10,
    alignItems: "center",
    paddingBottom: 100,
  },
  description: {
    paddingRight: 15,
    marginTop: 10,
    textAlign: "justify",
  },
});
