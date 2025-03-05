import { BlurView } from "expo-blur";
import { throttle } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from "react-native-vision-camera";
import { RESULTS } from "react-native-permissions";
import { useRouter } from "expo-router";

import QRFooterButton from "./QRFooterButton";
import QRIndicator from "./QRIndicator";
import { usePermissions } from "@/hooks/usePermissions";
import { EPermissionTypes } from "@/constants";
import { goToSettings } from "@/lib/helpers";
import { CreateOrder } from "@/types";
import { useCreateOrder } from "@/hooks/apihook/orderHook";
import Toast from "react-native-toast-message";

type State = {
  isVisible: boolean;
  url: null | string;
};

const initialState: State = { isVisible: Platform.OS === "ios", url: null };

export default function BarCodeScreen() {
  const [state, setState] = React.useReducer(
    (props: State, state: Partial<State>): State => ({ ...props, ...state }),
    initialState
  );
  const [isLit, setLit] = React.useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const device = useCameraDevice("back");
  const camera = useRef<Camera>(null);
  const router = useRouter();
  const { askPermissions } = usePermissions(EPermissionTypes.CAMERA);
  const { top, bottom } = useSafeAreaInsets();

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (!state.isVisible) {
      timeout = setTimeout(() => {
        setState({ isVisible: true });
      }, 800);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  // Handle permissions
  useEffect(() => {
    const checkPermission = async () => {
      try {
        const response = await askPermissions();
        if (
          response.type === RESULTS.LIMITED ||
          response.type === RESULTS.GRANTED
        ) {
          setHasPermission(true);
        } else {
          handlePermissionDenied(response.type);
        }
      } catch (error: any) {
        handlePermissionError(error);
      }
    };

    checkPermission();
  }, [askPermissions]);

  const handlePermissionDenied = (type: string) => {
    if (type === RESULTS.UNAVAILABLE) {
      Alert.alert("This feature is not supported on this device");
    } else if (type === RESULTS.BLOCKED || type === RESULTS.DENIED) {
      Alert.alert(
        "Permission Denied",
        "Please give permission from settings to continue using camera.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Go To Settings", onPress: goToSettings },
        ]
      );
    }
  };

  const handlePermissionError = (error: any) => {
    if (error.isError) {
      Alert.alert(
        error.errorMessage ||
          "Something went wrong while taking camera permission"
      );
    } else {
      handlePermissionDenied(error.type);
    }
  };

  const onCancel = React.useCallback(() => {
    router.back();
  }, [router]);

  const onFlashToggle = React.useCallback(() => {
    setLit((prev) => !prev);
  }, []);

  // const handleBarCodeScanned = async ({ data }) => {
  //   try {
  //     // Parse QR data (assuming it's a JSON string)
  //     const orderData = JSON.parse(data);

  //     // Send order to backend
  //     await saveOrderToBackend(orderData);

  //     // Navigate to Home Tab
  //     navigation.navigate('Home');

  //     // Show confirmation screen (optional)
  //     navigation.navigate('OrderSuccess');
  //   } catch (error) {
  //     alert('Failed to process order: ' + error.message);
  //   }
  // };

  const {
    mutate: createOrder,
    isPending,
    isError,
    error,
  } = useCreateOrder({
    onSuccess: (data) => {
      Toast.show({
        type: "success",
        text1: "Order created successfully!",
      });
      router.navigate("/(tabs)");
    },
    onError: (error) => {
      console.error("Order creation failed:", error.message);
      Toast.show({
        type: "error",
        text1: "Order creation failed!",
      });
      Alert.alert("Error", error.message);
    },
  });

  const codeScanner = useCodeScanner({
    codeTypes: ["qr"],
    onCodeScanned: throttle((codes) => {
      if (codes.length > 0 && codes[0].value) {
        try {
          const scannedData = JSON.parse(codes[0].value);

          if (!Array.isArray(scannedData) || scannedData.length === 0) {
            throw new Error("Invalid QR Code format");
          }

          const orderData: CreateOrder = {
            menu: scannedData[0].menu,
            userId: scannedData[0].userId, // Replace with actual user ID
            restaurantId: scannedData[0].restaurantId,
            reservationId: scannedData[0].reservationData?.reservationId || "",
            //diningArea: scannedData[0].reservationData?.diningArea || "",
            tableNumber: scannedData[0].reservationData?.tableNumber || 0,
          };

          createOrder(orderData);
        } catch (error) {
          console.error("Invalid QR code format:", error);
          Alert.alert(
            "Invalid QR Code",
            "The scanned QR code is not in the correct format."
          );
        }
      }
    }, 1000),
  });

  return (
    <View style={styles.container}>
      {state.isVisible && device && hasPermission ? (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
          torch={isLit ? "on" : "off"}
        />
      ) : null}

      <View style={[styles.header, { top: 40 + top }]}>
        <Hint>Scan QR code</Hint>
      </View>

      <QRIndicator />

      <View style={[styles.footer, { bottom: 60 + bottom }]}>
        <QRFooterButton
          onPress={onFlashToggle}
          isActive={isLit}
          iconName="flashlight"
        />
        <QRFooterButton onPress={onCancel} iconName="close" iconSize={48} />
      </View>

      <StatusBar barStyle="light-content" backgroundColor="#000" />
    </View>
  );
}

function Hint({ children }: { children: string }) {
  return (
    <BlurView style={styles.hint} intensity={100} tint="dark">
      <Text style={styles.headerText}>{children}</Text>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  hint: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    backgroundColor: "transparent",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: "10%",
  },
});
