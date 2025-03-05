import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Slot, Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { colors } from '@/constants/Colors'

export default function OnboardLayout() {
  return (
    <Stack>
        <Stack.Screen name='index' options={{headerShown:false}}/>
        <StatusBar backgroundColor={colors.blueGronto} />
    </Stack>
  )
}

const styles = StyleSheet.create({})