import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from './Header/Header'
import { StatusBar } from 'expo-status-bar'
import { Colors, colors } from '@/constants/Colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import ScrollLists from './Content/ScrollLists'

export default function Container() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.secondary} />
      <Header />
      <ScrollLists />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flexGrow:1,
    backgroundColor:colors.bg
  }
})