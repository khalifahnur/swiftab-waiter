import React, { useState, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  SafeAreaView 
} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
  CameraPosition,
  useCameraPermission,
} from 'react-native-vision-camera';
//import { scanBarcodes, BarcodeFormat } from 'vision-camera-code-scanner';
import { runOnJS } from 'react-native-reanimated';

const QRScanner = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const { requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  useEffect(() => {
    const getPermission = async () => {
      const granted = await requestPermission();
      setHasPermission(granted);
    };
    getPermission();
  }, []);

  const onBarcodeDetected = useCallback((qrCode: string) => {
    if (scanned) return;
    setScanned(true);
    alert(`QR code scanned: ${qrCode}`);
  }, [scanned]);

//   const frameProcessor = useFrameProcessor((frame) => {
//     'worklet';
//     const barcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE]);
//     if (barcodes.length > 0 && barcodes[0].displayValue) {
//       runOnJS(onBarcodeDetected)(barcodes[0].displayValue);
//     }
//   }, [onBarcodeDetected]);

//   const frameProcessor = useFrameProcessor((frame) => {
//     'worklet'
//     const objects = detectObjects(frame)
//     const label = objects[0].name
//     console.log(`You're looking at a ${label}.`)
//   }, [])

  if (!hasPermission) {
    return <Text>No access to camera</Text>;
  }

  if (!device) {
    return <Text>No camera device found</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Welcome to Scanner!</Text>
        <Text style={styles.subText}>
          Scan to QR code on your table to start ordering
        </Text>
      </View>

      <View style={styles.cameraContainer}>
        <Camera
          style={styles.camera}
          device={device}
          isActive={!scanned}
          //frameProcessor={frameProcessor}
          //frameProcessorFps={5}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
            </View>
          </View>
        </Camera>
      </View>

      {scanned && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => setScanned(false)}
        >
          <Text style={styles.buttonText}>Not Working?</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  subText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 30,
    borderRadius: 20,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 100,
    borderRadius: 20,
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderColor: '#fff',
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderColor: '#fff',
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#fff',
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRightWidth: 4,
    borderBottomWidth: 4,
    borderColor: '#fff',
  },
  button: {
    backgroundColor: 'transparent',
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default QRScanner;