import React, { useState, useRef, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const TermsAndConditionsScreen = () => {
  const scrollY = useRef(new Animated.Value(0)).current;
  const [hasAcknowledged, setHasAcknowledged] = useState(false);

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  );

  const headerHeight = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [120, 80],
    extrapolate: "clamp",
  });

  const titleOpacity = scrollY.interpolate({
    inputRange: [0, 50],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const compactTitleOpacity = scrollY.interpolate({
    inputRange: [50, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const handleAcknowledge = () => {
    setHasAcknowledged(true);
    // Navigate back or to the next screen after acknowledgment
    setTimeout(() => {
      router.back();
    }, 1000);
  };

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown:false
    });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        <Animated.View
          style={[styles.titleContainer, { opacity: titleOpacity }]}
        >
          <Image
            source={{ uri: "https://via.placeholder.com/60" }}
            style={styles.logo}
          />
          <Text style={styles.headerTitle}>Terms and Conditions</Text>
          <Text style={styles.headerSubtitle}>Swiftab Waiter App</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.compactTitleContainer,
            { opacity: compactTitleOpacity },
          ]}
        >
          <Text style={styles.compactTitle}>Swiftab Terms</Text>
        </Animated.View>
      </Animated.View>

      {/* Effective Date */}
      <View style={styles.effectiveDateContainer}>
        <Text style={styles.effectiveDate}>
          Effective Date: February 26, 2025
        </Text>
      </View>

      {/* Main Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <Text style={styles.introText}>
          Please review these terms that govern your use of the Swiftab Waiter
          App. These terms are designed to help you understand your
          responsibilities while using our service.
        </Text>

        {/* Section 1 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="handshake"
              size={24}
              color="#3a86ff"
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>1. Agreement to Terms</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.contentText}>
              These Terms and Conditions ("Terms") constitute a legally binding
              agreement between you ("you," "your," or "User") and Swiftab
              ("we," "our," or "us") regarding your use of the Swiftab Waiter
              App mobile application (the "App").
            </Text>
            <Text style={styles.contentText}>
              By downloading, installing, accessing, or using the App, you
              acknowledge that you have read, understood, and agree to be bound
              by these Terms. If you do not agree to these Terms, please do not
              use the App.
            </Text>
          </View>
        </View>

        {/* Section 2 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="verified-user"
              size={24}
              color="#3a86ff"
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>2. License and App Use</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.contentSubtitle}>2.1 License Grant</Text>
            <Text style={styles.contentText}>
              Subject to your compliance with these Terms, we grant you a
              limited, non-exclusive, non-transferable, revocable license to
              download, install, and use the App on compatible devices that you
              own or control, solely for your professional use in the context of
              restaurant service operations.
            </Text>

            <Text style={styles.contentSubtitle}>2.2 License Restrictions</Text>
            <Text style={styles.contentText}>
              You agree not to, and will not permit others to:
            </Text>
            <Text style={styles.contentListItem}>
              • License, sell, rent, lease, assign, distribute, transmit, host,
              outsource, or otherwise commercially exploit the App
            </Text>
            <Text style={styles.contentListItem}>
              • Modify, make derivative works of, disassemble, reverse engineer,
              or attempt to derive the source code of the App
            </Text>
            <Text style={styles.contentListItem}>
              • Remove, alter, or obscure any proprietary notice on the App
            </Text>
            <Text style={styles.contentListItem}>
              • Use the App for any illegal, unauthorized, or unethical purpose
            </Text>
            <Text style={styles.contentListItem}>
              • Use the App in a way that could damage, disable, or impair the
              App or interfere with other users
            </Text>

            <Text style={styles.contentSubtitle}>
              2.3 Updates and Maintenance
            </Text>
            <Text style={styles.contentText}>
              We may from time to time issue updates, patches, or new versions
              of the App. You agree that we may automatically update the App and
              these Terms will apply to all updates.
            </Text>
          </View>
        </View>

        {/* Section 3 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="person"
              size={24}
              color="#3a86ff"
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>
              3. Account Registration and Security
            </Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.contentSubtitle}>3.1 Account Creation</Text>
            <Text style={styles.contentText}>
              To use the App, you may need to create an account. You agree to
              provide accurate, current, and complete information during
              registration and to update such information to keep it accurate,
              current, and complete.
            </Text>

            <Text style={styles.contentSubtitle}>3.2 Account Security</Text>
            <Text style={styles.contentText}>
              You are responsible for maintaining the confidentiality of your
              account credentials and for all activities that occur under your
              account. You agree to immediately notify us of any unauthorized
              use of your account or any other breach of security.
            </Text>

            <Text style={styles.contentSubtitle}>
              3.3 Restaurant Authorization
            </Text>
            <Text style={styles.contentText}>
              You acknowledge that you must be authorized by your employing
              restaurant to use the App in their establishment. You must only
              use the App for legitimate business purposes of the restaurant.
            </Text>
          </View>
        </View>

        {/* Section 4 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="restaurant"
              size={24}
              color="#3a86ff"
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>
              4. Restaurant Operations and Responsibilities
            </Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.contentSubtitle}>4.1 Order Management</Text>
            <Text style={styles.contentText}>
              The App allows you to manage customer orders, track order status,
              and process payments. You agree to:
            </Text>
            <Text style={styles.contentListItem}>
              • Accurately input order information
            </Text>
            <Text style={styles.contentListItem}>
              • Promptly update order status as appropriate
            </Text>
            <Text style={styles.contentListItem}>
              • Follow restaurant protocols for order handling and customer
              service
            </Text>

            <Text style={styles.contentSubtitle}>4.2 Payment Processing</Text>
            <Text style={styles.contentText}>
              When using the App to process payments, you agree to:
            </Text>
            <Text style={styles.contentListItem}>
              • Handle all payment information securely and in compliance with
              payment card industry standards
            </Text>
            <Text style={styles.contentListItem}>
              • Only process authorized payments
            </Text>
            <Text style={styles.contentListItem}>
              • Accurately record payment information
            </Text>
            <Text style={styles.contentListItem}>
              • Follow all applicable laws and regulations related to payment
              processing
            </Text>

            <Text style={styles.contentSubtitle}>4.3 Receipt Generation</Text>
            <Text style={styles.contentText}>You are responsible for:</Text>
            <Text style={styles.contentListItem}>
              • Generating accurate receipts for customers
            </Text>
            <Text style={styles.contentListItem}>
              • Ensuring receipts contain all legally required information
            </Text>
            <Text style={styles.contentListItem}>
              • Properly handling and storing receipt copies as required by law
              or restaurant policy
            </Text>
          </View>
        </View>

        {/* Section 5 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialIcons
              name="security"
              size={24}
              color="#3a86ff"
              style={styles.sectionIcon}
            />
            <Text style={styles.sectionTitle}>5. Data Usage and Privacy</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={styles.contentSubtitle}>5.1 Customer Information</Text>
            <Text style={styles.contentText}>
              You must treat any customer information you access through the App
              as confidential and in accordance with our Privacy Policy and
              applicable data protection laws.
            </Text>

            <Text style={styles.contentSubtitle}>5.2 Restaurant Data</Text>
            <Text style={styles.contentText}>
              Information related to restaurant operations, menu items, pricing,
              and sales that is processed through the App is confidential
              information of the restaurant. You agree not to disclose this
              information to unauthorized third parties.
            </Text>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>Questions?</Text>
          <Text style={styles.contactText}>Email: legal@swiftab.com</Text>
        </View>

        <View style={styles.spacer} />
      </ScrollView>

      {/* Acknowledgment Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, hasAcknowledged && styles.acknowledgedButton]}
          onPress={handleAcknowledge}
          disabled={hasAcknowledged}
        >
          {hasAcknowledged ? (
            <View style={styles.buttonContent}>
              <MaterialIcons name="check-circle" size={24} color="white" />
              <Text style={styles.buttonText}>Terms Acknowledged</Text>
            </View>
          ) : (
            <Text style={styles.buttonText}>I Understand & Agree</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          By tapping the button above, you confirm that you have read and agree
          to the Terms and Conditions.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#3a86ff",
    paddingHorizontal: 20,
    justifyContent: "flex-end",
    paddingBottom: 15,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  titleContainer: {
    alignItems: "center",
    position: "absolute",
    width: "100%",
    bottom: 15,
    left: 0,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
  },
  compactTitleContainer: {
    position: "absolute",
    bottom: 15,
    left: 20,
  },
  compactTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  effectiveDateContainer: {
    backgroundColor: "#e9f0ff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  effectiveDate: {
    fontSize: 14,
    color: "#4361ee",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  introText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#495057",
    marginVertical: 20,
    textAlign: "center",
  },
  section: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#f0f6ff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  sectionIcon: {
    marginRight: 12,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
  },
  sectionContent: {
    padding: 15,
    backgroundColor: "white",
  },
  contentText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#495057",
    marginBottom: 10,
  },
  contentSubtitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#343a40",
    marginTop: 10,
    marginBottom: 8,
  },
  contentListItem: {
    fontSize: 15,
    lineHeight: 22,
    color: "#495057",
    marginLeft: 10,
    marginBottom: 5,
  },
  contactInfo: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 8,
  },
  contactText: {
    fontSize: 15,
    color: "#3a86ff",
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#dee2e6",
  },
  button: {
    backgroundColor: "#3a86ff",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  acknowledgedButton: {
    backgroundColor: "#2ecc71",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  disclaimer: {
    fontSize: 12,
    color: "#6c757d",
    textAlign: "center",
    marginTop: 15,
  },
  spacer: {
    height: 20,
  },
});

export default TermsAndConditionsScreen;
