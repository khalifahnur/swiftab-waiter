import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WaiterHomeScreen = () => {
  const [activeTab, setActiveTab] = useState('tables');
  
  // Sample data
  const tables = [
    { id: '1', number: '12', status: 'occupied', guests: 4, orderTime: '19:22' },
    { id: '2', number: '8', status: 'waiting', guests: 2, orderTime: '19:28' },
    { id: '3', number: '5', status: 'ready', guests: 3, orderTime: '19:15' },
    { id: '4', number: '3', status: 'empty', guests: 0, orderTime: null },
    { id: '5', number: '7', status: 'occupied', guests: 6, orderTime: '19:05' },
    { id: '6', number: '15', status: 'paying', guests: 2, orderTime: '18:45' },
  ];

  const renderTableItem = ({ item }) => {
    // Define status colors
    const statusColors = {
      occupied: '#3498db', // Blue
      waiting: '#f39c12', // Orange
      ready: '#2ecc71',   // Green
      empty: '#95a5a6',   // Gray
      paying: '#9b59b6',  // Purple
    };
    
    // Define status labels
    const statusLabels = {
      occupied: 'Dining',
      waiting: 'Waiting for food',
      ready: 'Food ready',
      empty: 'Available',
      paying: 'Paying',
    };

    return (
      <TouchableOpacity 
        style={[styles.tableCard, { borderLeftColor: statusColors[item.status] }]}
        onPress={() => console.log(`Table ${item.number} pressed`)}
      >
        <View style={styles.tableNumberContainer}>
          <Text style={styles.tableNumber}>{item.number}</Text>
        </View>
        <View style={styles.tableInfo}>
          <Text style={styles.tableInfoTitle}>
            {item.status === 'empty' ? 'Available' : `${item.guests} guests`}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] }]}>
            <Text style={styles.statusText}>{statusLabels[item.status]}</Text>
          </View>
          {item.orderTime && (
            <Text style={styles.timeText}>Order: {item.orderTime}</Text>
          )}
        </View>
        <Ionicons name="chevron-forward" size={24} color="#ccc" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/50' }} 
            style={styles.profileImage} 
          />
          <View>
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.nameText}>Alex</Text>
          </View>
        </View>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="scan-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Ionicons name="people-outline" size={24} color="#3498db" />
          <Text style={styles.summaryNumber}>17</Text>
          <Text style={styles.summaryLabel}>Customers</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Ionicons name="restaurant-outline" size={24} color="#e74c3c" />
          <Text style={styles.summaryNumber}>8</Text>
          <Text style={styles.summaryLabel}>Orders</Text>
        </View>
        
        <View style={styles.summaryCard}>
          <Ionicons name="timer-outline" size={24} color="#f39c12" />
          <Text style={styles.summaryNumber}>2</Text>
          <Text style={styles.summaryLabel}>Waiting</Text>
        </View>
      </View>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'tables' && styles.activeTab]} 
          onPress={() => setActiveTab('tables')}
        >
          <Text style={[styles.tabText, activeTab === 'tables' && styles.activeTabText]}>Tables</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'orders' && styles.activeTab]} 
          onPress={() => setActiveTab('orders')}
        >
          <Text style={[styles.tabText, activeTab === 'orders' && styles.activeTabText]}>Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'menu' && styles.activeTab]} 
          onPress={() => setActiveTab('menu')}
        >
          <Text style={[styles.tabText, activeTab === 'menu' && styles.activeTabText]}>Menu</Text>
        </TouchableOpacity>
      </View>
      
      {/* Main Content - Tables List */}
      <View style={styles.content}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>Tables Overview</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={20} color="#555" />
            <Text style={styles.filterText}>Filter</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={tables}
          renderItem={renderTableItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.tablesList}
        />
      </View>
      
      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.bottomNavItem}>
          <Ionicons name="home" size={24} color="#3498db" />
          <Text style={[styles.bottomNavText, { color: '#3498db' }]}>Home</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomNavItem}>
          <Ionicons name="stats-chart-outline" size={24} color="#777" />
          <Text style={styles.bottomNavText}>Stats</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.qrScanButton}>
          <Ionicons name="scan-outline" size={28} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomNavItem}>
          <Ionicons name="time-outline" size={24} color="#777" />
          <Text style={styles.bottomNavText}>History</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.bottomNavItem}>
          <Ionicons name="person-outline" size={24} color="#777" />
          <Text style={styles.bottomNavText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: '#777',
  },
  nameText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
    backgroundColor: '#f5f7fa',
    borderRadius: 12,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  summaryNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 2,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#777',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  tab: {
    paddingVertical: 15,
    marginRight: 25,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
  },
  tabText: {
    fontSize: 16,
    color: '#777',
  },
  activeTabText: {
    color: '#3498db',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  filterText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#555',
  },
  tablesList: {
    paddingBottom: 20,
  },
  tableCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    borderLeftWidth: 5,
  },
  tableNumberContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#f5f7fa',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  tableNumber: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableInfo: {
    flex: 1,
  },
  tableInfoTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  timeText: {
    fontSize: 12,
    color: '#777',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopColor: '#eee',
    borderTopWidth: 1,
  },
  bottomNavItem: {
    alignItems: 'center',
    paddingVertical: 5,
  },
  bottomNavText: {
    fontSize: 12,
    marginTop: 2,
    color: '#777',
  },
  qrScanButton: {
    backgroundColor: '#3498db',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#3498db',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
});

export default WaiterHomeScreen;