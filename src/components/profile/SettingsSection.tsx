import React from 'react';
import { View, Text } from 'react-native';

export function SettingsSection({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <View className="mb-6">
      {!!title && (
        <Text
          className="mb-2 ml-1 text-[12px] font-semibold uppercase text-gray-400"
          style={{ letterSpacing: 0.5 }}
        >
          {title}
        </Text>
      )}
      <View className="overflow-hidden rounded-2xl" style={{ borderWidth: 1, borderColor: '#EFEFF1' }}>
        {children}
      </View>
    </View>
  );
}
