import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';

const FAQsScreen = () => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const toggleExpand = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <ScrollView style={styles.container}>
      <List.Section>
        <List.Subheader>Frequently Asked Questions</List.Subheader>

        <List.Accordion
          title="How do I view my assigned orders?"
          expanded={expanded['orders']}
          onPress={() => toggleExpand('orders')}
        >
          <List.Item title="Go to the orders section and select a category (All, Latest, Served, etc.)." />
        </List.Accordion>

        <List.Accordion
          title="How do I scan a QR code to retrieve an order?"
          expanded={expanded['qr']}
          onPress={() => toggleExpand('qr')}
        >
          <List.Item title="Use the Scan feature to scan the QR code from the customer's Swiftab App." />
        </List.Accordion>

        <List.Accordion
          title="Can I reprint a receipt?"
          expanded={expanded['receipt']}
          onPress={() => toggleExpand('receipt')}
        >
          <List.Item title="Yes, go to the order details and select 'Reprint Receipt'." />
        </List.Accordion>

        <List.Accordion
          title="What should I do if an order is not showing?"
          expanded={expanded['missing']}
          onPress={() => toggleExpand('missing')}
        >
          <List.Item title="Ensure you have a stable internet connection or refresh the orders page." />
        </List.Accordion>

      </List.Section>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
  },
});

export default FAQsScreen;
