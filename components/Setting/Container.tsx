import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { Camera } from 'react-native-vision-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

interface SettingsItemProps {
  title: string;
  onPress?: () => void;
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  rightText?: string;
  showArrow?: boolean;
}

const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  onPress,
  value,
  onValueChange,
  rightText,
  showArrow = true,
}) => (
  <TouchableOpacity
    style={styles.settingsItem}
    onPress={onPress}
    disabled={!onPress && !onValueChange}
  >
    <Text style={styles.settingsItemText}>{title}</Text>
    <View style={styles.settingsItemRight}>
      {rightText && <Text style={styles.rightText}>{rightText}</Text>}
      {onValueChange && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={value ? '#f5dd4b' : '#f4f3f4'}
        />
      )}
      {showArrow && !onValueChange && (
        <Text style={styles.arrow}>›</Text>
      )}
    </View>
  </TouchableOpacity>
);

const WaiterProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            // Handle logout logic here
            console.log('User logged out');
          },
        },
      ],
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { paddingTop: insets.top }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image
            source={require('@/assets/images/icons/user.jpg')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.editImageButton}>
            <Text style={styles.editImageText}>Edit</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>John Doe</Text>
        <Text style={styles.role}>Senior Waiter</Text>
      </View>

      {/* Personal Information */}
      <SettingsSection title="Personal Information">
        <SettingsItem
          title="Edit Profile"
          onPress={() => console.log('Edit Profile')}
        />
        <SettingsItem
          title="Change Password"
          onPress={() => console.log('Change Password')}
        />
        <SettingsItem
          title="Employee ID"
          rightText="W123456"
          showArrow={false}
        />
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notifications">
        <SettingsItem
          title="Push Notifications"
          value={notifications}
          onValueChange={setNotifications}
        />
        <SettingsItem
          title="Sound"
          value={soundEnabled}
          onValueChange={setSoundEnabled}
        />
        <SettingsItem
          title="Vibration"
          value={vibrationEnabled}
          onValueChange={setVibrationEnabled}
        />
      </SettingsSection>

      {/* App Settings */}
      <SettingsSection title="App Settings">
        <SettingsItem
          title="Language"
          rightText="English"
          onPress={() => console.log('Change Language')}
        />
        <SettingsItem
          title="Theme"
          rightText="Light"
          onPress={() => console.log('Change Theme')}
        />
        <SettingsItem
          title="App Version"
          rightText="1.0.0"
          showArrow={false}
        />
      </SettingsSection>

      {/* Support */}
      <SettingsSection title="Support">
        <SettingsItem
          title="Help Center"
          onPress={() => console.log('Help Center')}
        />
        <SettingsItem
          title="Contact Support"
          onPress={() => console.log('Contact Support')}
        />
        <SettingsItem
          title="Privacy Policy"
          onPress={() => console.log('Privacy Policy')}
        />
      </SettingsSection>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editImageButton: {
    position: 'absolute',
    right: -10,
    bottom: 0,
    backgroundColor: '#007AFF',
    padding: 8,
    borderRadius: 15,
  },
  editImageText: {
    color: '#fff',
    fontSize: 12,
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
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightText: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
  },
  arrow: {
    fontSize: 20,
    color: '#666',
    marginLeft: 5,
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

export default WaiterProfileScreen;