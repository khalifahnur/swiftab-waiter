import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { Canvas, Path, Group } from "@shopify/react-native-skia";
import AntDesign from '@expo/vector-icons/AntDesign';
import { ActionButtonProps, ReceiptProps } from '@/types';
import calculateTotal from '@/lib/calculateTotal';
import handleShare from '@/lib/handleSharing';
import { router } from 'expo-router';

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, onPress }) => (
  <TouchableOpacity style={styles.actionButton} onPress={onPress}>
    {icon}
    <Text style={styles.actionText}>{label}</Text>
  </TouchableOpacity>
);

const Receipt: React.FC<ReceiptProps> = ({ 
  orderData,
  onShare: customShareHandler,
  onPrint,
  onDownload,
  onEmail,
  onFavorite 
}) => {

  console.log("ordered data",orderData)
  
  const createZigzagPath = (width: number): string => {
    const zigzagHeight = 8;
    const zigzagWidth = 16;
    let path = `M 0 0`;
    
    for (let i = 0; i < width / zigzagWidth; i++) {
      path += ` L ${i * zigzagWidth + zigzagWidth/2} ${zigzagHeight} L ${(i + 1) * zigzagWidth} 0`;
    }
    
    return path;
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      router.replace({
        pathname: '/screens/PrintScreen',
        params: { orderData: JSON.stringify(orderData.menu) }
      });
    }
  };
  

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Receipt</Text>
          <Text style={styles.headerSubText}>Order Details</Text>
          <Text style={styles.headerSubText}>{orderData.orderId}</Text>
        </View>

        <Canvas style={{ height: 10, width: '100%' }}>
          <Group>
            <Path
              path={createZigzagPath(400)}
              color="#E0E0E0"
              style="stroke"
              strokeWidth={1}
            />
          </Group>
        </Canvas>

        <View style={styles.detailsContainer}>
          <Text style={styles.detailText}>Table: {orderData.tableNumber}</Text>
          <Text style={styles.detailText}>Floor: {orderData.floor}</Text>
          <Text style={styles.detailText}>Status: {orderData.paid}</Text>
        </View>

        <View style={styles.menuContainer}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {orderData.menu.map((item, index) => (
            <View key={index} style={styles.menuItem}>
              <View style={styles.menuItemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}> x {item.quantity}</Text>
              </View>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemPrice}>
                Ksh.{(item.cost).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalSection}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalAmount}>
            Ksh.{calculateTotal(orderData.menu).toLocaleString()}
          </Text>
        </View>

        <Canvas style={{ height: 10, width: '100%' }}>
          <Group>
            <Path
              path={createZigzagPath(400)}
              color="#E0E0E0"
              style="stroke"
              strokeWidth={1}
            />
          </Group>
        </Canvas>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for dining with us!</Text>
          <Text style={styles.footerText}>Reservation: {orderData.reservationId}</Text>
        </View>
      </ScrollView>
      <View style={styles.actionContainer}>
          <ActionButton
            icon={<AntDesign name='sharealt' size={24} color="#333" />}
            label="Share"
            onPress={()=>handleShare(orderData)}
          />
          <ActionButton
            icon={<AntDesign name='printer' size={24} color="#333" />}
            label="Print"
            onPress={handlePrint}
          />
          <ActionButton
            icon={<AntDesign name='download' size={24} color="#333" />}
            label="Save"
            onPress={onDownload ?? (() => console.log('Download functionality to be implemented'))}
          />
          <ActionButton
            icon={<AntDesign name='mail' size={24} color="#333" />}
            label="Email"
            onPress={onEmail ?? (() => console.log('Email functionality to be implemented'))}
          />
          <ActionButton
            icon={<AntDesign name='star' size={24} color="#333" />}
            label="Favorite"
            onPress={onFavorite ?? (() => console.log('Favorite functionality to be implemented'))}
          />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal:2
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubText: {
    fontSize: 16,
    color: '#666',
  },
  detailsContainer: {
    padding: 16,
    flexDirection:"row",
    justifyContent:'space-between'
  },
  detailText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#444',
  },
  menuContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  menuItem: {
    marginBottom: 16,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  menuItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    padding: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#f9f9f9',
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    fontSize: 12,
    marginTop: 4,
    color: '#333',
  },
});

export default Receipt;