import { Image, Pressable, StyleSheet, Text, View, TextInput } from 'react-native';
import React from 'react';

export default function SubHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Image 
          source={require('@/assets/images/icons/search.png')} 
          style={styles.searchIcon}
        />     
        <TextInput
          placeholder="Search for order"
          placeholderTextColor="#9CA3AF"
          style={styles.input}
        />
      </View>
      <Pressable 
        style={({ pressed }) => [
          styles.filterButton,
          { opacity: pressed ? 0.8 : 1 }
        ]}
      >
        <Image
          source={require('@/assets/images/icons/filter.png')}
          style={styles.filterIcon}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#6B7280',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
    padding: 0, // Remove default padding
  },
  filterButton: {
    backgroundColor: '#4299E1',
    borderRadius: 10,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  filterIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFFFFF',
  },
});