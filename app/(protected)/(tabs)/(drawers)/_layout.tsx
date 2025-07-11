import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Home",
            title: "Home",
          }}
        />
        <Drawer.Screen
          name="exerciseList"
          options={{
            headerTitle: "Lista de Exercícios",
            drawerLabel: "Lista de Exercícios",
            title: "Lista de Exercícios",
          }}
        />
        <Drawer.Screen
          name="blockList"
          options={{
            headerTitle: "Lista de Blocos de exercícios",
            drawerLabel: "Lista de Blocos de exercícios",
            title: "Lista de Blocos de exercícios",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
