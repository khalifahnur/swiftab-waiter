import { SafeAreaView, StyleSheet } from 'react-native'
import React from 'react'
import Container from '@/components/Scan/Container'
import BarCodeScreen from '@/components/Scan/BarCodeScreen'


export default function ScanScreen() {
  return (
    // <SafeAreaView style={styles.container}>
    //   <Container />
    // </SafeAreaView>
    <BarCodeScreen />
    
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1
  }
})