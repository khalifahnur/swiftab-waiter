import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, View, StyleSheet, Text, Animated } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCodeScanner,
} from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import { isIos } from '@/lib/helpers';
import { useAppStateListener } from '@/hooks/useAppStateListener';

interface ICameraScannerProps {
  setIsCameraShown: (value: boolean) => void;
  onReadCode: (value: string) => void;
}

export const CameraScanner = ({
  setIsCameraShown,
  onReadCode,
}: ICameraScannerProps) => {
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const isFocused = useIsFocused();
  const [isCameraInitialized, setIsCameraInitialized] = useState(isIos);
  const [isActive, setIsActive] = useState(isIos);
  const { appState } = useAppStateListener();
  const [codeScanned, setCodeScanned] = useState('');
  const linePosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (codeScanned) {
      onReadCode(codeScanned);
    }
  }, [codeScanned, onReadCode]);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isCameraInitialized) {
      timeout = setTimeout(() => {
        setIsActive(true);
      }, 1000);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isCameraInitialized]);

  useEffect(() => {
    const animateLine = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(linePosition, {
            toValue: 250,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(linePosition, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    animateLine();
  }, [linePosition]);

  const onInitialized = () => {
    setIsCameraInitialized(true);
  };

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (codes.length > 0 && codes[0].value) {
        setIsActive(false);
        setTimeout(() => setCodeScanned(codes[0].value), 500);
      }
    },
  });

  if (!device || !isFocused) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Welcome to Scanner!</Text>
          <Text style={styles.subText}>
            Scan the QR code on your table to start ordering
          </Text>
        </View>

        <Camera
          ref={camera}
          style={styles.camera}
          device={device}
          isActive={isActive && isFocused && appState === 'active' && isCameraInitialized}
          onInitialized={onInitialized}
          codeScanner={codeScanner}
          photo={false}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <View style={styles.cornerTL} />
              <View style={styles.cornerTR} />
              <View style={styles.cornerBL} />
              <View style={styles.cornerBR} />
              <Animated.View
                style={[
                  styles.scanLine,
                  {
                    transform: [{ translateY: linePosition }],
                  },
                ]}
              />
            </View>
          </View>
        </Camera>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Not Working?</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    paddingTop: 40,
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#000',
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
    height: 250,
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
  scanLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#fff',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  footerText: {
    color: '#fff',
    fontSize: 16,
  },
});