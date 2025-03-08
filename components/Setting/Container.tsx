import { Ionicons, MaterialIcons, Feather } from '@expo/vector-icons';
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
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

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
  const [darkMode, setDarkMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
  const router = useRouter();
  const windowWidth = Dimensions.get('window').width;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const waiterObj = JSON.parse(
          (await AsyncStorage.getItem("waiterObj")) || "{}"
        );
        setWaiterData(waiterObj.waiter || {});
      } catch (error) {
        console.error("Error fetching waiter data:", error);
      }
    };
    fetchData();
  }, []);

  const getInitials = () => {
    if (!waiter.firstname || !waiter.lastname) return "SW";
    return `${waiter.firstname.charAt(0)}${waiter.lastname.charAt(0)}`;
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: async () => {
            try {
              // Clear all data from AsyncStorage
              await AsyncStorage.clear();
              console.log('AsyncStorage data cleared successfully');
              
              router.replace('/(auth)/SigninScreen');
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <LinearGradient
        colors={['#3498db', '#2980b9']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Settings</Text>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.profileSection}>
          {waiter.firstname ? (
            <View style={styles.profileImageContainer}>
              <Image 
                source={require('@/assets/images/icons/user.jpg')} 
                style={styles.profileImage} 
                defaultSource={require('@/assets/images/icons/user.jpg')}
              />
            </View>
          ) : (
            <View style={styles.initialsContainer}>
              <Text style={styles.initialsText}>{getInitials()}</Text>
            </View>
          )}
          
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{waiter.firstname || ''} {waiter.lastname || ''}</Text>
            <Text style={styles.role}>Waiter</Text>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Feather name="user" size={18} color="#3498db" style={styles.sectionIcon} /> 
            Personal Information
          </Text>
          <View style={styles.cardContent}>
            <InfoItem 
              icon="call-outline" 
              label="Phone Number" 
              value={waiter.phoneNumber || 'Not set'} 
            />
            <InfoItem 
              icon="mail-outline" 
              label="Email" 
              value={waiter.email || 'Not set'} 
            />
            <InfoItem 
              icon="business-outline" 
              label="Restaurant ID" 
              value={waiter.restaurantId || 'Not set'} 
            />
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Feather name="settings" size={18} color="#3498db" style={styles.sectionIcon} /> 
            App Settings
          </Text>
          <View style={styles.cardContent}>
            <SettingsToggleItem 
              icon="notifications-outline" 
              title="Push Notifications" 
              value={notifications} 
              onValueChange={setNotifications} 
            />
            <SettingsToggleItem 
              icon="moon-outline" 
              title="Dark Mode" 
              value={darkMode} 
              onValueChange={setDarkMode} 
            />
            <SettingsToggleItem 
              icon="volume-high-outline" 
              title="Sound Effects" 
              value={soundEffects} 
              onValueChange={setSoundEffects} 
            />
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            <Feather name="info" size={18} color="#3498db" style={styles.sectionIcon} /> 
            About & Help
          </Text>
          <View style={styles.cardContent}>
            <SettingsLinkItem 
              icon="information-circle-outline" 
              title="About SwiftTab" 
              onPress={() => router.push('/screens/AboutScreen')} 
            />
            <SettingsLinkItem 
              icon="help-circle-outline" 
              title="Help Center" 
              onPress={() => router.push('/screens/help')} 
            />
            <SettingsLinkItem 
              icon="shield-checkmark-outline" 
              title="Privacy Policy" 
              onPress={() => router.push('/screens/PrivacyPolicyScreen')} 
            />
            <SettingsLinkItem 
              icon="document-text-outline" 
              title="Terms of Service" 
              onPress={() => router.push('/screens/TermsScreen')} 
            />
            <SettingsLinkItem 
              icon="star-outline" 
              title="Rate SwiftTab" 
              onPress={() => Alert.alert('Rate Us', 'This would open the app store rating page')} 
            />
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
          activeOpacity={0.8}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>
          SwiftTab v1.0.0
        </Text>
      </ScrollView>
    </View>
  );
};

const InfoItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon as any} size={22} color="#7f8c8d" style={styles.infoIcon} />
    <View style={styles.infoContent}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  </View>
);

const SettingsToggleItem = ({ 
  icon, 
  title, 
  value, 
  onValueChange 
}: { 
  icon: string; 
  title: string; 
  value: boolean; 
  onValueChange: (value: boolean) => void 
}) => (
  <View style={styles.settingsItem}>
    <View style={styles.settingsItemLeft}>
      <Ionicons name={icon as any} size={22} color="#7f8c8d" style={styles.settingsIcon} />
      <Text style={styles.settingsItemText}>{title}</Text>
    </View>
    <Switch 
      value={value} 
      onValueChange={onValueChange}
      trackColor={{ false: '#e0e0e0', true: '#a8d5ff' }}
      thumbColor={value ? '#3498db' : '#f4f4f4'}
      ios_backgroundColor="#e0e0e0"
    />
  </View>
);

const SettingsLinkItem = ({ 
  icon, 
  title, 
  onPress 
}: { 
  icon: string; 
  title: string; 
  onPress: () => void 
}) => (
  <TouchableOpacity style={styles.settingsItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.settingsItemLeft}>
      <Ionicons name={icon as any} size={22} color="#7f8c8d" style={styles.settingsIcon} />
      <Text style={styles.settingsItemText}>{title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={20} color="#bdc3c7" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  contentContainer: {
    paddingBottom: 30,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    backgroundColor: '#e1e8ed',
    borderWidth: 3,
    borderColor: '#3498db',
  },
  initialsContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#2980b9',
  },
  initialsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  editProfileButton: {
    backgroundColor: '#f0f4f8',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  editProfileText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    marginRight: 6,
  },
  cardContent: {
    paddingHorizontal: 0,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoIcon: {
    marginRight: 10,
  },
  infoContent: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  value: {
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
    marginTop: 2,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsIcon: {
    marginRight: 12,
  },
  settingsItemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 10,
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 14,
    color: '#95a5a6',
  },
});

export default SettingsScreen;