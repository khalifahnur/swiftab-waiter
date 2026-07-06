import React from 'react';
import { View, Text } from 'react-native';

const PALETTE = ['#FF8A3D', '#0A84FF', '#30D158', '#AF52DE', '#FF375F', '#5E5CE6'];

function hashString(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash);
}

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

interface AvatarProps {
  name: string;
  size?: number;
}

export function Avatar({ name, size = 64 }: AvatarProps) {
  const color = PALETTE[hashString(name || '?') % PALETTE.length];

  return (
    <View
      className="items-center justify-center rounded-full"
      style={{ width: size, height: size, backgroundColor: color }}
    >
      <Text className="font-bold text-white" style={{ fontSize: size * 0.36 }}>
        {getInitials(name)}
      </Text>
    </View>
  );
}
