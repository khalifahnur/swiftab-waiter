import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import { FlashList } from '@shopify/flash-list'
import placeholderData from '../data'
import Card from './Card'

export default function ScrollLists() {
  const renderItem = ({item}) => {
    return (
      <Card 
        floor={item.floor}
        table={item.tableNumber}
        paid={item.paid}
        menu={item.menu}
      />
    );
  };
  

  return (
    <View style={styles.container}>
      <FlashList 
        data={placeholderData}
        renderItem={renderItem}
        estimatedItemSize={50}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Text>No products found</Text>}
        ListFooterComponent={()=><View style={{height:50}}/>}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,  
        height: Dimensions.get("window").height - 100,
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    }
});