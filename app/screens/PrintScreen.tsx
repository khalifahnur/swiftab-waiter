import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import PrinterComponent from '@/components/Printer/Printer'
import { useLocalSearchParams } from 'expo-router';

export default function PrintScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useLocalSearchParams();
  
  const orderItems = React.useMemo(() => {
    setIsLoading(true);
    try {
      const parsed = JSON.parse(params.orderData as string);
      setIsLoading(false);
      return parsed;
    } catch (error) {
      setError('Invalid order data');
      setIsLoading(false);
      return [];
    }
  }, [params.orderData]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  console.log(orderItems);
  return (
    <PrinterComponent initialOrderItems={orderItems} />
  );
}