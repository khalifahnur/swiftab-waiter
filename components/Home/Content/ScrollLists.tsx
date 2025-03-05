import { StyleSheet, Text, View, Dimensions, RefreshControl } from 'react-native';
import React from 'react';
import { FlashList } from '@shopify/flash-list';
import Card from './Card';
import { FetchOrder } from '@/types';
import LottieView from 'lottie-react-native';
import { colors } from '@/constants/Colors';

interface ScrollListsProps {
  placeholderData?: FetchOrder[];
  refreshing: boolean;
  onRefresh: () => void;
}

export default function ScrollLists({ placeholderData = [],refreshing, onRefresh }: ScrollListsProps) {
  const renderItem = ({ item }: { item: FetchOrder }) => {
    return (
      <Card 
        tableNumber={item.tableNumber}
        paid={item.paid} 
        menu={item.menu}
        status={item.status}
        orderId={item.orderId}
        reservationId={item.reservationId}
      />
    );
  };

  if (placeholderData?.orders == undefined) {
      return (
        <View style={styles.lottieStyle}>
          <LottieView
            source={require("@/assets/images/lottie/Animation - 1740148681908.json")}
            autoPlay
            loop
            style={{ width: 100, height: 100 }}
          />
        </View>
      );
    }
  return (
    <View style={styles.container}>
      <FlashList 
        data={placeholderData?.orders} 
        renderItem={renderItem} 
        estimatedItemSize={150}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => <View style={{ height: 50 }} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.navyBlue]} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: Dimensions.get("window").height - 100,
    zIndex: -999,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  lottieStyle: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
