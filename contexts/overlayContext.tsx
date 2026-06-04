import { Colors } from "@/shared/constants/Colors";
import { createContext, useState, PropsWithChildren, useContext } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  useColorScheme,
} from "react-native";

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
      <>
        {show && (
          <View style={styles.overlay}>
            <ActivityIndicator
              size="large"
              color={Colors[colorScheme ?? "light"].tint}
            />
          </View>
        )}

        {children}
      </>
    </OverlayContext.Provider>
  );
}

export const useOverlay = () => {
  const context = useContext(OverlayContext);
  if (context === undefined) {
    throw new Error("useOverlay must be used within an OverlayProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    zIndex: 1000,
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
