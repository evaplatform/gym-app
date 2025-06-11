import { createContext, useState, PropsWithChildren } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { Colors } from "@/constants/Colors";

type OverlayState = {
  show: boolean;
  showOverlay: () => void;
  hideOverlay: () => void;
};

export const OverlayContext = createContext<OverlayState | undefined>(
  undefined
);

export function OverlayProvider({ children }: PropsWithChildren) {
  const colorScheme = useColorScheme();
  const [show, setShow] = useState(false);

  const showOverlay = () => setShow(true);
  const hideOverlay = () => setShow(false);

  return (
    <OverlayContext.Provider value={{ show, showOverlay, hideOverlay }}>
      {show && (
        <View style={{ flex: 1 }}>
          <View style={styles.overlay}>
            <ActivityIndicator
              size="large"
              color={Colors[colorScheme ?? "light"].tint}
            />
          </View>
          {children}
        </View>
      )}
      {!show && children}
    </OverlayContext.Provider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    zIndex: 1000,
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    position: "absolute",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
