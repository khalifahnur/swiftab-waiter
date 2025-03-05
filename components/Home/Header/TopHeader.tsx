import { Image, Pressable, StyleSheet, Text, View, Animated } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { colors } from '@/constants/Colors';

export default function TopHeader() {
  // Create animated value for horizontal flip
  const flipAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create horizontal flip animation
    const startFlip = () => {
      Animated.sequence([
        Animated.timing(flipAnim, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(flipAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        })
      ]).start(() => startFlip());
    };

    startFlip();
  }, []);

  const flip = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg']
  });

  return (
    <View style={styles.topHeader}>
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>Hello, Waiter</Text>
        <Text style={styles.welcome}>Welcome to swiftab-waiter</Text>
      </View>
      <Pressable>
        <Animated.View 
        //style={{ transform: [{ rotateY: flip }] }}
        >
          <Image 
            source={require('@/assets/images/icons/user.jpg')} 
            style={styles.userImage}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  textContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  welcome: {
    fontSize: 12,
    color: "#fff",
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#4299E1',
  }
});