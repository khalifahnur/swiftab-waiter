import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface WaiterData {
  restaurantId: string;
  firstname: string;
  lastname: string;
  phoneNumber: string;
  email: string;
}

const SettingsScreen = () => {
  const [waiter, setWaiterData] = useState<WaiterData>({} as WaiterData);
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);
  const navigation = useRouter()

  useEffect(() => {
    const FetchData = async () => {
      const waiterObj = JSON.parse(
        (await AsyncStorage.getItem("waiterObj")) || "{}"
      );
      setWaiterData(waiterObj.waiter);
    };
    FetchData();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => console.log('User logged out') },
      ]
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.contentContainer}
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.profileHeader}>
        <Image source={require('@/assets/images/icons/user.jpg')} style={styles.profileImage} />
        <Text style={styles.name}>{waiter.firstname} {waiter.lastname}</Text>
        <Text style={styles.role}>Waiter</Text>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <InfoItem label="Phone Number" value={waiter.phoneNumber} />
        <InfoItem label="Email" value={waiter.email} />
        <InfoItem label="Restaurant ID" value={waiter.restaurantId} />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <SettingsItem title="Push Notifications" value={notifications} onValueChange={setNotifications} />
      </View>
      
      <View style={styles.section}>
        <SettingsItem title="About" onPress={() => navigation.navigate('/screens/AboutScreen')} />
        <SettingsItem title="Help Center" onPress={() => navigation.navigate('/help')} />
        <SettingsItem title="Privacy Policy" onPress={() => navigation.navigate('/screens/PrivacyPolicyScreen')} />
        <SettingsItem title="Terms of Service" onPress={() => navigation.navigate('/screens/TermsScreen')} />
      </View>
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoItem}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const SettingsItem = ({ title, onPress, value, onValueChange }: { title: string; onPress?: () => void; value?: boolean; onValueChange?: (value: boolean) => void }) => (
  <TouchableOpacity style={styles.settingsItem} onPress={onPress} disabled={!onPress && !onValueChange}>
    <Text style={styles.settingsItemText}>{title}</Text>
    {
      title !== 'Push Notifications' && <Entypo name="chevron-small-right" size={24} color="black" />
    }
    
    {onValueChange && <Switch value={value} onValueChange={onValueChange} />}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingBottom: 120,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  section: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginLeft: 15,
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingHorizontal: 15,
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    color: '#555',
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ccc',
  },
  settingsItemText: {
    fontSize: 16,
    color: '#000',
  },
  logoutButton: {
    marginTop: 20,
    marginHorizontal: 15,
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;
