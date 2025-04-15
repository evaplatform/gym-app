import { Text, View } from "react-native";
import { API_URL, APP_VERSION } from '@env';

console.log(API_URL);

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
