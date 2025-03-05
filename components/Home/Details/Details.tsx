import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Receipt from './Receipt'
import Header from '../Header'

export default function Details({data}) {
  return (
    <View style={styles.container}>
      <Header />
      <Receipt orderData={data} />
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})