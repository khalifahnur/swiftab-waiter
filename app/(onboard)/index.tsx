import { router } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import LottieView from 'lottie-react-native';
import { colors } from "@/constants/Colors";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const OnboardingScreen = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const window = useWindowDimensions();
  const width = window.width - 50;
  const slides = [
    {
      id: 1,
      title: 'Welcome to WaiterApp',
      description: 'Manage orders efficiently and provide excellent service',
      image: require('@/assets/images/lottie/waiter.json')
    },
    {
      id: 2,
      title: 'Quick Authentication',
      description: 'Secure access with PIN or fingerprint',
      image: require('@/assets/images/lottie/easy-login.json')
    },
    {
      id: 3,
      title: 'Start Working',
      description: 'Ready to provide great service?',
      image: require('@/assets/images/lottie/good-service.json')
    }
  ];

  const HandleLastOnboard =async ()=> {
    router.replace('/(auth)')
    await AsyncStorage.setItem('hasSeenOnboard', 'true');
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={colors.blueGronto}/>
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={e => {
          const x = e.nativeEvent.contentOffset.x;
          setCurrentPage(Math.round(x / width));
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            {/* <Image source={item.image} style={styles.image} /> */}
            <LottieView
        source={item.image}
        autoPlay
        loop
        style={styles.image}
      />
            <Text style={styles.title}>{item.title}</Text>
            <Text>{item.description}</Text>
          </View>
        )}
      />
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentPage && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
      {currentPage === slides.length - 1 && (
        <TouchableOpacity
          style={styles.getStartedButton}
          onPress={HandleLastOnboard}>
          <Text style={styles.getStartedText}>Get Started</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor:colors.blueGronto
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 30,
    },
    input: {
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      paddingHorizontal: 15,
      marginBottom: 15,
    },
    button: {
      width: '100%',
      height: 50,
      backgroundColor: '#007AFF',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
    pinContainer: {
      width: '80%',
      marginVertical: 20,
    },
    cell: {
      width: 50,
      height: 50,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    focusCell: {
      borderColor: '#007AFF',
    },
    cellText: {
      fontSize: 24,
    },
    forgotText: {
      color: '#007AFF',
      marginTop: 15,
    },
    biometricButton: {
      padding: 15,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      marginBottom: 15,
    },
    orText: {
      marginVertical: 15,
      fontSize: 16,
    },
    slide: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: 200,
      height: 200,
      resizeMode: 'contain',
    },
    pagination: {
      flexDirection: 'row',
      position: 'absolute',
      bottom: 100,
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#ccc',
      marginHorizontal: 4,
    },
    paginationDotActive: {
      backgroundColor: '#007AFF',
    },
    getStartedButton: {
      position: 'absolute',
      bottom: 40,
      width: '80%',
      height: 50,
      backgroundColor: '#007AFF',
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    getStartedText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

  export default OnboardingScreen;