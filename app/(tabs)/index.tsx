import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Container from '@/components/Home/Container'

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Container />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1
  }
})