import React, { useLayoutEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";


const FeatureCard = ({ icon, title, description }) => {
  return (
    <View style={styles.featureCard}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
};

export default function AboutScreen() {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header with gradient background */}
      <LinearGradient
        colors={["#2c3e50", "#3498db"]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.headerContainer}>
          <Image
            source={require("@/assets/images/icon.png")}
            style={styles.logo}
            defaultSource={require("@/assets/images/icon.png")}
          />
          <Text style={styles.header}>Swiftab Waiter App</Text>
          <Text style={styles.tagline}>
            Streamline Service, Elevate Experience
          </Text>
        </View>
      </LinearGradient>

      {/* App description card */}
      <View style={styles.descriptionCard}>
        <Text style={styles.description}>
          Swiftab Waiter App is a powerful and intuitive tool designed to
          streamline restaurant operations by enabling waiters to efficiently
          manage orders, process payments, and enhance customer service. With
          real-time order tracking and seamless QR code integration, Swiftab
          ensures accuracy, speed, and improved coordination between waitstaff
          and the kitchen.
        </Text>
      </View>

      {/* Features section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionTitleContainer}>
          <MaterialIcons name="stars" size={24} color="#3498db" />
          <Text style={styles.sectionTitle}>
            Key Features & Functionalities
          </Text>
        </View>

        <FeatureCard
          icon={
            <Ionicons name="restaurant-outline" size={28} color="#3498db" />
          }
          title="Effortless Order Management"
          description="View and categorize orders based on All, Latest, Served, Unserved, Paid, and Unpaid. Stay updated with real-time order status, reducing delays and improving workflow efficiency."
        />

        <FeatureCard
          icon={<MaterialIcons name="payment" size={28} color="#3498db" />}
          title="Seamless Payment Processing"
          description="Easily identify paid and unpaid orders, ensuring smooth transaction management. Improve billing accuracy and reduce errors in manual record-keeping."
        />

        <FeatureCard
          icon={<MaterialIcons name="receipt" size={28} color="#3498db" />}
          title="Receipt Printing & Kitchen Coordination"
          description="Generate and print customer receipts instantly. Take the printed receipt to the kitchen, ensuring chefs have an accurate record of incoming orders."
        />

        <FeatureCard
          icon={
            <MaterialIcons name="qr-code-scanner" size={28} color="#3498db" />
          }
          title="QR Code Scanning for Instant Order Retrieval"
          description="Scan QR codes from the Swiftab App, allowing waiters to pull up customer orders instantly. Eliminate confusion and enhance the speed of service by automating order retrieval."
        />
      </View>

      {/* Why choose section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionTitleContainer}>
          <MaterialIcons name="rocket-launch" size={24} color="#3498db" />
          <Text style={styles.sectionTitle}>
            Why Choose Swiftab Waiter App?
          </Text>
        </View>

        <View style={styles.whyChooseContainer}>
          <View style={styles.whyChooseItem}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={18} color="#fff" />
            </View>
            <Text style={styles.whyChooseText}>
              Optimized Workflow – Reduce wait times and improve customer
              satisfaction
            </Text>
          </View>

          <View style={styles.whyChooseItem}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={18} color="#fff" />
            </View>
            <Text style={styles.whyChooseText}>
              Accuracy & Efficiency – Minimize errors and ensure seamless order
              processing
            </Text>
          </View>

          <View style={styles.whyChooseItem}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={18} color="#fff" />
            </View>
            <Text style={styles.whyChooseText}>
              User-Friendly Interface – Simple, intuitive, and easy to navigate
            </Text>
          </View>

          <View style={styles.whyChooseItem}>
            <View style={styles.checkCircle}>
              <Ionicons name="checkmark" size={18} color="#fff" />
            </View>
            <Text style={styles.whyChooseText}>
              Seamless Integration – Works smoothly with the Swiftab ecosystem
            </Text>
          </View>
        </View>
      </View>

      {/* CTA Section */}
      <View style={styles.ctaContainer}>
        <LinearGradient
          colors={["#3498db", "#2c3e50"]}
          style={styles.ctaGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.ctaText}>
            Enhance your service. Elevate your efficiency.
          </Text>
          <Text style={styles.ctaHighlight}>Serve better with Swiftab!</Text>

          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Get Started</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="help-circle-outline" size={20} color="#555" />
          <Text style={styles.footerText}>Help & Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="document-text-outline" size={20} color="#555" />
          <Text style={styles.footerText}>Terms of Service</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerItem}>
          <Ionicons name="shield-checkmark-outline" size={20} color="#555" />
          <Text style={styles.footerText}>Privacy Policy</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.versionText}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  content: {
    paddingBottom: 30,
  },
  headerGradient: {
    paddingVertical: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  headerContainer: {
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
  },
  descriptionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#444",
    textAlign: "center",
  },
  sectionContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#2c3e50",
    marginLeft: 8,
  },
  featureCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "rgba(52, 152, 219, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: "#555",
  },
  whyChooseContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  whyChooseItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  whyChooseText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
    color: "#444",
  },
  ctaContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  ctaGradient: {
    padding: 24,
    alignItems: "center",
  },
  ctaText: {
    fontSize: 18,
    color: "rgba(255,255,255,0.9)",
    textAlign: "center",
  },
  ctaHighlight: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginVertical: 8,
    textAlign: "center",
  },
  ctaButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 30,
    marginTop: 16,
  },
  ctaButtonText: {
    color: "#3498db",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  footerItem: {
    alignItems: "center",
  },
  footerText: {
    color: "#555",
    fontSize: 12,
    marginTop: 4,
  },
  versionText: {
    textAlign: "center",
    color: "#999",
    fontSize: 12,
    marginTop: 20,
  },
});
