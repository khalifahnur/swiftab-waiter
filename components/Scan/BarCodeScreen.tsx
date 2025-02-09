import { BlurView } from 'expo-blur';
import { throttle } from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import { Linking, Platform, StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';

import QRFooterButton from './QRFooterButton';
import QRIndicator from './QRIndicator';
import { useRouter } from 'expo-router';


type State = {
  isVisible: boolean;
  url: null | string;
};

const initialState: State = { isVisible: Platform.OS === 'ios', url: null };

export default function BarCodeScreen() {
  const [state, setState] = React.useReducer(
    (props: State, state: Partial<State>): State => ({ ...props, ...state }),
    initialState
  );
  const [isLit, setLit] = React.useState(false);
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: throttle((codes) => {
      if (codes.length > 0 && codes[0].value) {
        setState({ isVisible: false, url: codes[0].value });
      }
    }, 1000),
  });

  React.useEffect(() => {
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

//   React.useEffect(() => {
//     if (!state.isVisible && state.url) {
//       openUrl(state.url);
//     }
//   }, [state.isVisible, state.url]);

//   const openUrl = (url: string) => {
//     props.navigation.pop();

//     setTimeout(
//       () => {
//         StatusBar.setBarStyle('default');
//         Linking.openURL(url);
//       },
//       Platform.select({
//         ios: 16,
//         default: 500,
//       })
//     );
//   };

const router = useRouter()
  const onCancel = React.useCallback(() => {
    router.back()
  }, []);

  const onFlashToggle = React.useCallback(() => {
    setLit((isLit) => !isLit);
  }, []);

  const { top, bottom } = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {state.isVisible && device ? (
        <Camera
          ref={camera}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
          torch={isLit ? 'on' : 'off'}
        />
      ) : null}

      <View style={[styles.header, { top: 40 + top }]}>
        <Hint>Scan an Expo QR code</Hint>
      </View>

      <QRIndicator />

      <View style={[styles.footer, { bottom: 30 + bottom }]}>
        <QRFooterButton onPress={onFlashToggle} isActive={isLit} iconName="flashlight" />
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
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hint: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderRadius: 16,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    backgroundColor: 'transparent',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '10%',
  },
});