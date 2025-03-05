import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  Alert,
  FlatList,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from "react-native";
import { ThermalPrinter, PrinterType } from "react-native-thermal-receipt-printer";
import { formatReceipt } from "./FormattedReceipt";

interface PrinterDevice {
  name: string;
  type: PrinterType;
  status?: "connected" | "disconnected" | "error";
  ipAddress?: string; // For Wi-Fi printers
}

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
}

interface PrinterComponentProps {
  onPrinterConnect?: (printer: PrinterDevice) => void;
  onPrinterError?: (error: Error) => void;
  onPrintComplete?: () => void;
  initialOrderItems?: OrderItem[];
}

const PrinterComponent: React.FC<PrinterComponentProps> = ({
  onPrinterConnect,
  onPrinterError,
  onPrintComplete,
  initialOrderItems = [],
}) => {
  const [printers, setPrinters] = useState<PrinterDevice[]>([]);
  const [currentPrinter, setCurrentPrinter] = useState<PrinterDevice | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [orderItems] = useState<OrderItem[]>(initialOrderItems);

  useEffect(() => {
    const requestPermissions = async () => {
      if (Platform.OS === "android" && Platform.Version >= 23) {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        ]);

        return Object.values(granted).every(
          (permission) => permission === PermissionsAndroid.RESULTS.GRANTED
        );
      }
      return true;
    };

    requestPermissions();
  }, []);

  const handleError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error(errorMessage);
    onPrinterError?.(new Error(errorMessage));
    Alert.alert("Error", errorMessage);
  };

  const scanPrinters = async () => {
    if (isScanning) return;

    try {
      setIsScanning(true);
      setPrinters([]);

      // Scan for Bluetooth printers
      const bluetoothPrinters = await ThermalPrinter.getBluetoothDeviceList();
      const formattedBluetoothPrinters = bluetoothPrinters.map((printer) => ({
        name: printer.name,
        type: "bluetooth" as PrinterType,
        status: "disconnected",
      }));

      // Scan for Wi-Fi printers (if supported by your network setup)
      const wifiPrinters: PrinterDevice[] = [
        { name: "Wi-Fi Printer 1", type: "wifi", ipAddress: "192.168.1.100", status: "disconnected" },
      ];

      setPrinters([...formattedBluetoothPrinters, ...wifiPrinters]);
    } catch (error) {
      handleError(error);
    } finally {
      setIsScanning(false);
    }
  };

  const connectToPrinter = async (printer: PrinterDevice) => {
    if (isConnecting) return;

    setIsConnecting(true);
    try {
      if (currentPrinter) {
        // Disconnect any currently connected printer
        await ThermalPrinter.disconnectPrinter();
      }

      if (printer.type === "bluetooth") {
        // Connect to a Bluetooth printer
        await ThermalPrinter.connectBluetoothPrinter(printer.name);
      } else if (printer.type === "wifi" && printer.ipAddress) {
        // Connect to a Wi-Fi printer
        await ThermalPrinter.connectWifiPrinter(printer.ipAddress, 9100); // Default port is 9100
      } else {
        throw new Error("Unsupported printer type or missing IP address");
      }

      setCurrentPrinter({ ...printer, status: "connected" });
      onPrinterConnect?.(printer);
      Alert.alert("Success", `Connected to ${printer.name}`);
    } catch (error) {
      handleError(error);
      setCurrentPrinter(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const printReceipt = async () => {
    if (!currentPrinter) {
      Alert.alert("Error", "No printer connected");
      return;
    }

    try {
      const receipt = formatReceipt(orderItems);

      // Send the receipt text to the connected printer
      await ThermalPrinter.printText(receipt);

      Alert.alert("Success", "Receipt printed successfully");
      onPrintComplete?.();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Button
        title={isScanning ? "Scanning..." : "Scan for Printers"}
        onPress={scanPrinters}
        disabled={isScanning || isConnecting}
      />
      <FlatList
        data={printers}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 10,
              backgroundColor: item === currentPrinter ? "#e6e6ff" : "#f0f0f0",
              marginVertical: 5,
              borderRadius: 5,
              opacity: isConnecting ? 0.5 : 1,
            }}
            onPress={() => connectToPrinter(item)}
            disabled={isConnecting || isScanning}
          >
            <Text>
              {item.name} ({item.type})
              {item.status && ` - ${item.status}`}
            </Text>
          </TouchableOpacity>
        )}
      />
      {currentPrinter && (
        <Text style={{ marginVertical: 10 }}>
          Connected to: {currentPrinter.name}
          {currentPrinter.status && ` (${currentPrinter.status})`}
        </Text>
      )}
      <Button
        title="Print Receipt"
        onPress={printReceipt}
        disabled={!currentPrinter || isConnecting || isScanning}
      />
    </View>
  );
};

export default PrinterComponent;
