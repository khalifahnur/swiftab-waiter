// import React, { useEffect, useRef, useState } from 'react';
// import { View, Text, Pressable, Animated } from 'react-native';
// import * as Haptics from 'expo-haptics';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const STORAGE_KEY = 'onDutyStatus';

// function formatElapsed(ms: number) {
//   const mins = Math.max(0, Math.floor(ms / 60000));
//   const h = Math.floor(mins / 60);
//   const m = mins % 60;
//   return h > 0 ? `${h}h ${m}m` : `${m}m`;
// }

// export function DutyStatusCard() {
//   const [onDuty, setOnDuty] = useState(false);
//   const [startedAt, setStartedAt] = useState<number | null>(null);
//   const [elapsedLabel, setElapsedLabel] = useState('0m');
//   const pulse = useRef(new Animated.Value(1)).current;

//   useEffect(() => {
//     (async () => {
//       const raw = await AsyncStorage.getItem(STORAGE_KEY);
//       if (raw) {
//         const parsed = JSON.parse(raw) as { onDuty: boolean; startedAt: number | null };
//         setOnDuty(parsed.onDuty);
//         setStartedAt(parsed.startedAt);
//       }
//     })();
//   }, []);

//   useEffect(() => {
//     if (!onDuty || !startedAt) return;
//     const tick = () => setElapsedLabel(formatElapsed(Date.now() - startedAt));
//     tick();
//     const id = setInterval(tick, 30000);
//     return () => clearInterval(id);
//   }, [onDuty, startedAt]);

//   useEffect(() => {
//     if (!onDuty) return;
//     const loop = Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulse, { toValue: 1.6, duration: 900, useNativeDriver: true }),
//         Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
//       ])
//     );
//     loop.start();
//     return () => loop.stop();
//   }, [onDuty, pulse]);

//   const toggle = async (next: boolean) => {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
//     const nextStartedAt = next ? Date.now() : null;
//     setOnDuty(next);
//     setStartedAt(nextStartedAt);
//     setElapsedLabel('0m');
//     await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify({ onDuty: next, startedAt: nextStartedAt }));
//   };

//   return (
//     <View
//       className="mb-6 flex-row items-center justify-between rounded-2xl px-4 py-4"
//       style={{ backgroundColor: onDuty ? '#0F2E1B' : '#F7F7F8' }}
//     >
//       <View className="flex-1 flex-row items-center">
//         <View className="mr-3 h-2.5 w-2.5 items-center justify-center">
//           {onDuty && (
//             <Animated.View
//               className="absolute h-2.5 w-2.5 rounded-full"
//               style={{ backgroundColor: '#30D158', transform: [{ scale: pulse }], opacity: 0.5 }}
//             />
//           )}
//           <View className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: onDuty ? '#30D158' : '#9A9AA0' }} />
//         </View>
//         <View>
//           <Text className="text-[15px] font-semibold" style={{ color: onDuty ? '#fff' : '#1C1C1E' }}>
//             {onDuty ? 'On Duty' : 'Off Duty'}
//           </Text>
//           <Text className="mt-0.5 text-[12px]" style={{ color: onDuty ? '#8FC9A2' : '#9A9AA0' }}>
//             {onDuty ? `On shift · ${elapsedLabel}` : 'Tap to clock in'}
//           </Text>
//         </View>
//       </View>

//       <Pressable
//         onPress={() => toggle(!onDuty)}
//         className="rounded-full px-4 py-2"
//         style={{ backgroundColor: onDuty ? '#30D158' : '#1C1C1E' }}
//       >
//         <Text className="text-[13px] font-semibold text-white">{onDuty ? 'Clock Out' : 'Clock In'}</Text>
//       </Pressable>
//     </View>
//   );
// }

import { Text, View } from "react-native";

export default function DutyStatusCard() {
  return (
    <View>
      <Text>DutyStatusCard</Text>
    </View>
  );
}
