// app/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Platform, View, TouchableOpacity } from "react-native";
import { colors } from "@/constants/Colors";

function CustomTabButton({ children, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        top: -20,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: colors.royalBlue,
          justifyContent: "center",
          alignItems: "center",
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 3,
            },
            android: {
              elevation: 5,
            },
          }),
        }}
      >
        {children}
      </View>
    </TouchableOpacity>
  );
}

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.tabbarbg,
          borderTopWidth: 0,
          height: 50,
          marginHorizontal: 2,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          borderTopEndRadius: 20,
          borderTopStartRadius: 20,
          //borderRadius: 20,
          ...Platform.select({
            ios: {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarActiveTintColor: colors.navyBlue,
        tabBarInactiveTintColor: colors.inactiveicon,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="home-outline" size={20} color={color} />
              {focused && (
                <View
                  style={{
                    position: "absolute",
                    top: -7, 
                    width: 6,
                    height: 6,
                    backgroundColor: colors.royalBlue,
                    borderRadius: 4,
                  }}
                />
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="scan"
        options={{
          tabBarIcon: () => (
            <View
              style={{
                // width: 56,
                // height: 56,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons
                name="qr-code-scanner"
                size={30}
                color="#FFF"
                style={{ paddingTop: 2 }}
              />
            </View>
          ),
          tabBarButton: (props) => <CustomTabButton {...props} />,
          title: "",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Ionicons name="person-outline" size={20} color={color} />
              {focused && (
                <View
                  style={{
                    position: "absolute",
                    top: -7,
                    width: 6,
                    height: 6,
                    backgroundColor: colors.royalBlue,
                    borderRadius: 4,
                  }}
                />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
