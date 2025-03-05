import {StyleSheet } from 'react-native'
import React from 'react'
import BarCodeScreen from '@/components/Scan/BarCodeScreen'


export default function ScanScreen() {
  return (
    <BarCodeScreen /> 
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1
  }
})