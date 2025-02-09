import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Receipt from './Receipt'

const placeholderData =  {
    restaurantId: "resto_23456",
    userId: "user_78901",
    reservationId: "res_87654",
    paid: "unpaid",
    served: false,
    menu: [
      {
        name: "Margherita Pizza",
        description:
          "Classic pizza topped with fresh mozzarella, tomatoes, and basil.",
        amount: 800,
        image: "https://res.cloudinary.com/dfuh1q6ic/image/upload/v1734006432/menu/opowtxfamuj3sthsed8x.png",
        quantity: 1,
      },
    ],
    floor: 2,
    tableNumber: 12,
  }

export default function Details() {
  return (
    <View style={styles.container}>
      <Receipt orderData={placeholderData} />
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1
    }
})