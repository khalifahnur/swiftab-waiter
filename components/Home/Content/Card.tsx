import { Image, StyleSheet, Text, TouchableOpacity, View, Animated } from 'react-native'
import React, { useState } from 'react'
import Container from '../OverflowAvatar/Container';
import { useRouter } from 'expo-router';

export default function Card({floor = 2, table = 5, paid = '', menu = []}) {
    const [isServed, setIsServed] = useState(false);
    const [scaleValue] = useState(new Animated.Value(1));
    const router = useRouter();
    
    const safeMenu = menu || [];
    
    const menuTitle = Array.isArray(safeMenu) 
        ? safeMenu.map((item) => item?.name).join(' • ')
        : '';
        
    const menuDesc = Array.isArray(safeMenu)
        ? safeMenu.map((item) => item?.description).join(' • ')
        : '';
        
    const MenuImages = Array.isArray(safeMenu)
        ? safeMenu.map((item, index) => ({
            id: index + 1,
            imageUrl: item?.image || '',
          }))
        : [{ id: 1, imageUrl: '' }];

    const handleServePress = () => {
        // Animate the button press
        Animated.sequence([
            Animated.timing(scaleValue, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        setIsServed(!isServed);
    };

    const ReceiptHandler = ()=>{
        router.navigate("/screens/DetailsScreen");
    }

    return (
        <View style={styles.cardWrapper}>
            <TouchableOpacity 
                style={[
                    styles.card,
                    isServed && styles.cardServed
                ]}
                onPress={ReceiptHandler}
            >
                <View>
                    <Container faces={MenuImages} />
                </View>
                
                <View style={styles.detailsContainer}>
                    <View style={styles.detail}>
                        <Text style={styles.floorText}>Floor {floor}</Text>
                        <Text style={styles.tableText}>Table {table}</Text>
                        <Text style={styles.paidText}>{paid}</Text>
                    </View>
                    <View style={styles.textContent}>
                        <Text style={styles.menuTitle} numberOfLines={1} ellipsizeMode='tail'>
                            {menuTitle}
                        </Text>
                        <Text style={styles.menuDescription} numberOfLines={2} ellipsizeMode='tail'>
                            {menuDesc}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.serveButton}
                onPress={handleServePress}
            >
                <Animated.View style={[
                    styles.checkCircle,
                    isServed && styles.checkCircleActive,
                    { transform: [{ scale: scaleValue }] }
                ]}>
                    {isServed && (
                        <Text style={styles.checkMark}>✓</Text>
                    )}
                </Animated.View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    cardWrapper: {
        position: 'relative',
        marginHorizontal: 10,
        marginBottom: 5,
    },
    card: {
        backgroundColor: '#f76a65',
        shadowColor: "#000",
        shadowOffset: { width: 1, height: 2 },
        shadowOpacity: 0.9,
        shadowRadius: 5,
        elevation: 1,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
    },
    cardServed: {
        backgroundColor: '#74f765',
        opacity: 0.8,
    },
    detailsContainer: {
        flex: 0.8,
        marginLeft: 10,
        justifyContent: 'space-between',
    },
    detail: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    floorText: {
        fontSize: 14,
        fontWeight: "600",
        color: '#1a472a',
    },
    tableText: {
        fontSize: 14,
        fontWeight: "500",
        color: '#2d5a3c',
    },
    paidText: {
        fontSize: 13,
        fontWeight: "500",
        color: '#2d5a3c',
        backgroundColor: '#a7f3d0',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    textContent: {
        flexDirection: "column",
        gap: 4,
    },
    menuTitle: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1a472a",
        marginBottom: 2,
        letterSpacing: 0.3,
    },
    menuDescription: {
        fontSize: 13,
        color: "#2d5a3c",
        lineHeight: 18,
        opacity: 0.9,
        letterSpacing: 0.2,
    },
    serveButton: {
        position: 'absolute',
        right: -5,
        top: -5,
        zIndex: 1,
    },
    checkCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#2d5a3c',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkCircleActive: {
        backgroundColor: '#2d5a3c',
        borderColor: '#2d5a3c',
    },
    checkMark: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    }
});