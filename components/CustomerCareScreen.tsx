import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const CustomerCareScreen = () => {
  const handlePress = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Customer Support</Text>

      <TouchableOpacity style={styles.item} onPress={() => handlePress('tel:+254712345678')}>
        <Ionicons name="call-outline" size={24} color="#007AFF" />
        <Text style={styles.text}>Call Us: +254 712 345 678</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => handlePress('mailto:support@swiftab.com')}>
        <MaterialCommunityIcons name="email-outline" size={24} color="#007AFF" />
        <Text style={styles.text}>Email: support@swiftab.com</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Follow Us</Text>

      <TouchableOpacity style={styles.item} onPress={() => handlePress('https://www.facebook.com/swiftab')}>
        <Ionicons name="logo-facebook" size={24} color="#3b5998" />
        <Text style={styles.text}>Facebook</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => handlePress('https://www.instagram.com/swiftab')}>
        <Ionicons name="logo-instagram" size={24} color="#C13584" />
        <Text style={styles.text}>Instagram</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => handlePress('https://twitter.com/swiftab')}>
        <Ionicons name="logo-twitter" size={24} color="#1DA1F2" />
        <Text style={styles.text}>Twitter</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
});

export default CustomerCareScreen;
