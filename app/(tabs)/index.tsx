import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Container from '@/components/Home/Container'
import useStore from '@/store/useStore';
import { FetchOrder } from '@/types';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { fetchAllOrders, fetchLatestOrders, fetchNotServedOrders, fetchPaidOrders, fetchServedOrders, fetchUnPaidOrders } from '@/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';

interface WaiterData {
  restaurantId: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  email: string;
}

export default function HomeScreen() {
  const [waiterData, setWaiterData] = useState<WaiterData>({} as WaiterData);
  const [refreshing, setRefreshing] = useState(false);
  const [loading,setLoading] = useState(false);
  

  //const { setHasActiveReservation } = useStore();

  const { restaurantId } = waiterData;
  
  const { data:allOrders, isLoading:isLoadingAll } = useQuery<
    FetchOrder[],
    Error
  >({
    queryKey: ["allOrders", restaurantId],
    queryFn: () => fetchAllOrders(restaurantId),
    staleTime: 10 * 60 * 1000,
    // onSuccess: (data: any) => {
    //   setHasActiveReservation(data.length > 0);
    // },
  } as UseQueryOptions<FetchOrder[], Error>);

  const { data:servedOrders, isLoading:isLoadingServed } = useQuery<
    FetchOrder[],
    Error
  >({
    queryKey: ["servedOrders", restaurantId],
    queryFn: () => fetchServedOrders(restaurantId),
    staleTime: 10 * 60 * 1000,
    // onSuccess: (data: any) => {
    //   setHasActiveReservation(data.length > 0);
    // },
  } as UseQueryOptions<FetchOrder[], Error>);

  const { data: notServedOrders, isLoading: isLoadingNotServed } = useQuery<
    FetchOrder[],
    Error
  >({
    queryKey: ["notServedOrders", restaurantId],
    queryFn: () => fetchNotServedOrders(restaurantId),
    staleTime: 10 * 60 * 1000,
    // onSuccess: (data: any) => {
    //   setHasActiveReservation(data.length > 0);
    // },
  } as UseQueryOptions<FetchOrder[], Error>);

  const { data: paidOrders, isLoading: isLoadingPaid } = useQuery<
    FetchOrder[],
    Error
  >({
    queryKey: ["paidOrders", restaurantId],
    queryFn: () => fetchPaidOrders(restaurantId),
    staleTime: 10 * 60 * 1000,
  } as UseQueryOptions<FetchOrder[], Error>);

  const { data: unPaidOrders, isLoading: isLoadingUnPaid,refetch } = useQuery<
    FetchOrder[],
    Error
  >({
    queryKey: ["unPaidOrders", restaurantId],
    queryFn: () => fetchUnPaidOrders(restaurantId),
    staleTime: 10 * 60 * 1000,
  } as UseQueryOptions<FetchOrder[], Error>);

  const { data: latestOrders, isLoading: isLoadingLatest } = useQuery<
    FetchOrder[],
    Error
  >({
    queryKey: ["latestOrders", restaurantId],
    queryFn: () => fetchLatestOrders(restaurantId),
    staleTime: 10 * 60 * 1000,
  } as UseQueryOptions<FetchOrder[], Error>);

  useEffect(() => {
    const FetchData = async () => {
      const waiterObj = JSON.parse(
        (await AsyncStorage.getItem("waiterObj")) || "{}"
      );
      setWaiterData(waiterObj.waiter);
      setLoading(true)
    };
    FetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (!allOrders || !servedOrders || !unPaidOrders || !paidOrders || !latestOrders ||!notServedOrders) {
      refetch();
    }
  }, [allOrders,servedOrders,unPaidOrders,paidOrders,latestOrders,notServedOrders, refetch]);

  const isLoading = isLoadingAll || isLoadingServed || isLoadingNotServed || isLoadingPaid || isLoadingUnPaid || isLoadingLatest;


  if (isLoading) {
    return (
      <View style={styles.lottieStyle}>
        <LottieView
          source={require("@/assets/images/lottie/plate.json")}
          autoPlay
          loop
          style={{ width: 100, height: 100 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Container
        allOrders={allOrders}
        servedOrders={servedOrders}
        notServedOrders={notServedOrders}
        paidOrders={paidOrders}
        unPaidOrders={unPaidOrders}
        latestOrders={latestOrders}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  lottieStyle: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
})