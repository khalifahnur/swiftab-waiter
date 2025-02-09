import { StyleSheet, Text, View } from 'react-native'
import React, { useLayoutEffect } from 'react'
import Details from '@/components/Home/Details/Details'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function DetailsScreen() {
  const navigation = useNavigation()
  useLayoutEffect(()=>{
    navigation.setOptions({
      headerShown:false
    })
  },[])
  return (
    <SafeAreaView style={styles.container}>
      <Details />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    //marginTop:10
  }
})