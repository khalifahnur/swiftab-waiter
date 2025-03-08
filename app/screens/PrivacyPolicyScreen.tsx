import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useLayoutEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const PrivacyPolicyScreen = ({ navigation }) => {
  const [expandedSections, setExpandedSections] = useState({
    dataCollection: true,
    dataUsage: false,
    dataSecurity: false,
    userRights: false,
    updates: false,
  });

  const navigate = useNavigation();
    

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const PolicySection = ({ title, content, id }) => (
    <View style={styles.sectionContainer}>
      <TouchableOpacity 
        style={styles.sectionHeader} 
        onPress={() => toggleSection(id)}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.expandIcon}>
          {expandedSections[id] ? '−' : '+'}
        </Text>
      </TouchableOpacity>
      
      {expandedSections[id] && (
        <View style={styles.sectionContent}>
          {content}
        </View>
      )}
    </View>
  );

  useLayoutEffect(() => {
    navigate.setOptions({
      headerShown:false
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.header}>
        <Image 
          source={require('@/assets/images/icon.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          <Text style={styles.intro}>
            At SwiftTab, we value your privacy and are committed to protecting your personal information.
            This Privacy Policy explains how we collect, use, and safeguard your data when you use our
            restaurant management application.
          </Text>
          
          <Text style={styles.lastUpdated}>Last Updated: March 8, 2025</Text>
          
          <PolicySection
            id="dataCollection"
            title="1. Information We Collect"
            content={
              <View>
                <Text style={styles.sectionText}>
                  We collect the following types of information when you use SwiftTab:
                </Text>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    <Text style={styles.bold}>Account Information:</Text> Your name, email address, and restaurant details.
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    <Text style={styles.bold}>Usage Data:</Text> Information about how you use the app, including order processing times, table turnover rates, and service metrics.
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    <Text style={styles.bold}>Device Information:</Text> Device type, operating system, and unique device identifiers.
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    <Text style={styles.bold}>Order Data:</Text> Customer orders, preferences, and payment information (we do not store complete payment details).
                  </Text>
                </View>
              </View>
            }
          />
          
          <PolicySection
            id="dataUsage"
            title="2. How We Use Your Information"
            content={
              <View>
                <Text style={styles.sectionText}>
                  We use the collected information for the following purposes:
                </Text>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    To provide and maintain our service
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    To improve the functionality and user experience of SwiftTab
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    To generate analytical insights that help optimize restaurant operations
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    To communicate important updates and information about our service
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    To prevent fraud and ensure secure transactions
                  </Text>
                </View>
              </View>
            }
          />
          
          <PolicySection
            id="dataSecurity"
            title="3. Data Security"
            content={
              <View>
                <Text style={styles.sectionText}>
                  We implement robust security measures to protect your information:
                </Text>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    End-to-end encryption for all data transmission
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Secure cloud storage with regular security audits
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Access controls restricting who can view sensitive information
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Regular security updates and vulnerability assessments
                  </Text>
                </View>
                <Text style={styles.sectionText}>
                  While we implement these safeguards, no method of electronic transmission or storage is 100% secure. We strive to use commercially acceptable means to protect your information.
                </Text>
              </View>
            }
          />
          
          <PolicySection
            id="userRights"
            title="4. Your Rights"
            content={
              <View>
                <Text style={styles.sectionText}>
                  As a SwiftTab user, you have the right to:
                </Text>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Access the personal data we hold about you
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Request correction of inaccurate information
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Request deletion of your data (subject to certain limitations)
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Opt out of certain data collection practices
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Receive your data in a portable format
                  </Text>
                </View>
                <Text style={styles.sectionText}>
                  To exercise these rights, contact us at privacy@swiftab.com.
                </Text>
              </View>
            }
          />
          
          <PolicySection
            id="updates"
            title="5. Changes to This Policy"
            content={
              <View>
                <Text style={styles.sectionText}>
                  We may update our Privacy Policy from time to time. We will notify you of any changes by:
                </Text>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Posting the new Privacy Policy on this page
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Sending you an email notification
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>
                    Displaying a notice in the app
                  </Text>
                </View>
                <Text style={styles.sectionText}>
                  We encourage you to review this Privacy Policy periodically for any changes.
                </Text>
              </View>
            }
          />
          
          <View style={styles.contactContainer}>
            <Text style={styles.contactTitle}>Questions or Concerns?</Text>
            <Text style={styles.contactText}>
              If you have any questions about this Privacy Policy, please contact us:
            </Text>
            <Text style={styles.contactEmail}>privacy@swiftab.com</Text>
            <Text style={styles.contactPhone}>+254 7123-4567</Text>
          </View>
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.acceptButton}
          onPress={() => router.back()}
        >
          <Text style={styles.acceptButtonText}>Accept & Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: "#3a86ff",
  },
  // header: {
  //   backgroundColor: "#3a86ff",
  //   paddingHorizontal: 20,
  //   justifyContent: "flex-end",
  //   paddingBottom: 15,
  //   zIndex: 10,
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 3,
  //   elevation: 5,
  // },
  logo: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c3e50',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  intro: {
    fontSize: 16,
    lineHeight: 24,
    color: '#34495e',
    marginBottom: 16,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 24,
    fontStyle: 'italic',
  },
  sectionContainer: {
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  sectionHeader: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  expandIcon: {
    fontSize: 24,
    color: '#3498db',
    fontWeight: 'bold',
  },
  sectionContent: {
    padding: 16,
  },
  sectionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#34495e',
    marginBottom: 12,
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 15,
    color: '#3498db',
    width: 12,
  },
  bulletText: {
    fontSize: 15,
    lineHeight: 22,
    flex: 1,
    color: '#34495e',
  },
  bold: {
    fontWeight: '600',
  },
  contactContainer: {
    marginTop: 24,
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  contactText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#34495e',
    marginBottom: 12,
  },
  contactEmail: {
    fontSize: 15,
    color: '#3498db',
    marginBottom: 8,
  },
  contactPhone: {
    fontSize: 15,
    color: '#34495e',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  acceptButton: {
    backgroundColor: '#3498db',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default PrivacyPolicyScreen;