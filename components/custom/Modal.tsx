import React, { useMemo } from "react";
import {
  Modal as RNModal,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
  useColorScheme,
} from "react-native";
import { Colors } from "@/shared/constants/Colors";
import { hexToRgba } from "@/shared/utils/hexToRgba";
import { Button } from "./Button";
import { SeverityEnum } from "@/shared/enum/SeverityEnum";

const { width, height } = Dimensions.get("window");

type ModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
  showConfirmButton?: boolean;
  children?: React.ReactNode;
  modalStyle?: object;
  headerStyle?: object;
  footerStyle?: object;
  confirmButtonStyle?: object;
  cancelButtonStyle?: object;
  confirmTextStyle?: object;
  cancelTextStyle?: object;
  titleStyle?: object;
  closeOnBackdropPress?: boolean;
};

function Modal({
  visible,
  onClose,
  onConfirm,
  title,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  showCancelButton = true,
  showConfirmButton = true,
  children,
  modalStyle,
  headerStyle,
  footerStyle,
  confirmButtonStyle,
  cancelButtonStyle,
  confirmTextStyle,
  cancelTextStyle,
  titleStyle,
  closeOnBackdropPress = true,
}: ModalProps) {
  const colorScheme = useColorScheme();
  const theme = useMemo(() => colorScheme ?? "light", [colorScheme]);

  const customStyle = useMemo(() => {
    return {
      centeredView: {
        backgroundColor: hexToRgba(Colors[theme].background, 0.8), // Semi-transparent backdrop
      },
      modalTitle: {
        color: Colors[theme].text,
      },
      modalView: {
        backgroundColor: Colors[theme].gray200,
      },
      modalHeader: {
        borderBottomColor: Colors[theme].gray600,
      },
      modalFooter: {
        borderTopColor: Colors[theme].gray600,
      },
      cancelButton: {
        backgroundColor: Colors[theme].backgroundSecondary,
      },
      cancelText: {
        color: Colors[theme].text,
      },
      confirmButton: {
        backgroundColor: Colors[theme].tint,
      },
      confirmText: {
        color: Colors[theme].text,
      },
    };
  }, [theme]);

  const handleBackdropPress = () => {
    if (closeOnBackdropPress) {
      onClose();
    }
  };

  return (
    <RNModal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/* <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} /> */}
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={[styles.centeredView, customStyle.centeredView]}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalView, customStyle.modalView, modalStyle]}>
              {/* Header */}
              {title && (
                <View
                  style={[
                    styles.modalHeader,
                    customStyle.modalHeader,
                    headerStyle,
                  ]}
                >
                  <Text
                    style={[
                      styles.modalTitle,
                      customStyle.modalTitle,
                      titleStyle,
                    ]}
                  >
                    {title}
                  </Text>
                </View>
              )}

              {/* Content */}
              <View style={styles.modalContent}>{children}</View>

              {/* Footer */}
              {(showCancelButton || showConfirmButton) && (
                <View
                  style={[
                    styles.modalFooter,
                    customStyle.modalFooter,
                    footerStyle,
                  ]}
                >
                  {showCancelButton && (
                    <Button
                      title={cancelText}
                      onPress={onClose}
                      severity={SeverityEnum.SECONDARY}
                      style={{ width: "50%" }}
                    />
                  )}

                  {showConfirmButton && (
                    <Button
                      severity={SeverityEnum.PRIMARY}
                      title={confirmText}
                      onPress={onConfirm}
                      style={{ width: "50%" }}
                    />
                  )}
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: width * 0.85,
    maxHeight: height * 0.7,
    backgroundColor: "white",
    borderRadius: 12,
    overflow: "hidden",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    padding: 16,
    borderBottomWidth: 1,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalContent: {
    padding: 16,
  },
  modalFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    minWidth: 80,
    alignItems: "center",
    marginLeft: 8,
  },
  cancelText: {
    fontWeight: "500",
  },
  confirmText: {
    fontWeight: "500",
  },
});

export default Modal;
