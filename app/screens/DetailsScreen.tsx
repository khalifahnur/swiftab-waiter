import { StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";
import Details from "@/components/Home/Details/Details";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

export default function DetailsScreen() {
  const navigation = useNavigation();

  const params = useLocalSearchParams();
  const orderData = params.data ? JSON.parse(params.data as string) : null;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Details data={orderData}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
