import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  BackHandler,
  StyleSheet,
  Linking,
} from "react-native";
import { usePermissions } from "@/hooks/usePermissions";
import { EPermissionTypes } from "@/constants";
import { RESULTS } from "react-native-permissions";
import { goToSettings } from "@/lib/helpers";
import { CameraScanner } from "@/components/Scan/CameraScanner";

export default function Container() {
  const { askPermissions } = usePermissions(EPermissionTypes.CAMERA);
  const [cameraShown, setCameraShown] = useState(false);
  const [qrText, setQrText] = useState("");

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      handleBackButtonClick
    );
    return () => backHandler.remove();
  }, [cameraShown]);

  function handleBackButtonClick() {
    if (cameraShown) {
      setCameraShown(false);
      return true;
    }
    return false;
  }

  const takePermissions = async () => {
    try {
      const response = await askPermissions();
      if (
        response.type === RESULTS.LIMITED ||
        response.type === RESULTS.GRANTED
      ) {
        setCameraShown(true);
      }
    } catch (error: any) {
      if (error.isError) {
        Alert.alert(
          error.errorMessage ||
          "Something went wrong while taking camera permission"
        );
        return;
      }

      if (error.type === RESULTS.UNAVAILABLE) {
        Alert.alert("This feature is not supported on this device");
      } else if (
        error.type === RESULTS.BLOCKED ||
        error.type === RESULTS.DENIED
      ) {
        Alert.alert(
          "Permission Denied",
          "Please give permission from settings to continue using camera.",
          [
            {
              text: "Cancel",
              style: "cancel",
            },
            { text: "Go To Settings", onPress: goToSettings },
          ]
        );
      }
    }
  };

  const handleReadCode = async (value: string) => {
    setQrText(value);
    setCameraShown(false);
    try {
      await Linking.openURL(value);
    } catch (error) {
      Alert.alert("Invalid URL", "The QR code contains an invalid URL");
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={takePermissions}
        activeOpacity={0.7}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Scan QR Code</Text>
      </TouchableOpacity>
      
      {cameraShown && (
        <CameraScanner
          setIsCameraShown={setCameraShown}
          onReadCode={handleReadCode}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
});