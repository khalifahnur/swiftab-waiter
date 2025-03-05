import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from './Header/Header'
import { StatusBar } from 'expo-status-bar'
import { colors } from '@/constants/Colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import Tabs from './Header/Tabs'
import useStore from '@/store/useStore'
import All from './Content/All/All'
import Latest from './Content/Latest/Latest'
import Served from './Content/Served/Served'
import { FetchOrder } from '@/types'
import NotServed from './Content/NotServed/NotServed'
import Paid from './Content/Paid/Paid'
import Unpaid from './Content/Unpaid/Unpaid'


interface ContainerProps {
  allOrders?: FetchOrder[];
  servedOrders?: FetchOrder[];
  notServedOrders?: FetchOrder[];
  paidOrders?: FetchOrder[];
  unPaidOrders?: FetchOrder[];
  latestOrders?: FetchOrder[];
  refreshing: boolean;
  onRefresh: () => void;
}

export default function Container({allOrders,servedOrders,notServedOrders,paidOrders,unPaidOrders,latestOrders,refreshing ,onRefresh}:ContainerProps) {

  const {selectedTab} = useStore();

  const DisplayItems = () => {
    switch (selectedTab) {
      case "All":
        return <All data={allOrders} refreshing={refreshing} onRefresh={onRefresh}/>;
      case "Latest":
        return <Latest data={latestOrders} refreshing={refreshing} onRefresh={onRefresh}/>;
      case "Served":
        return <Served data={servedOrders} refreshing={refreshing} onRefresh={onRefresh}/>;
      case "Not served":
        return <NotServed data={notServedOrders} refreshing={refreshing} onRefresh={onRefresh} />;
      case "Paid":
        return <Paid data={paidOrders} refreshing={refreshing} onRefresh={onRefresh}/>;
        case "Unpaid":
        return <Unpaid data={unPaidOrders} refreshing={refreshing} onRefresh={onRefresh}/>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.blueGronto} />
      <Header />
      <Tabs />
      <DisplayItems />
      {/* <ScrollLists /> */}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container:{
    flexGrow:1,
    backgroundColor:colors.bg
  }
})