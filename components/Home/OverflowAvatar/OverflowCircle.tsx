import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const OverflowCircle = ({
    overflow,
    circleSize,
    offset,
    circleStyle,
    overflowStyle,
    overflowLabelStyle,
  }: {
    overflow: number;
    circleSize: number;
    offset: number;
    circleStyle?: object;
    overflowStyle?: object;
    overflowLabelStyle?: object;
  }) => {
    const innerCircleSize = circleSize * 1.8;
    const marginLeft = circleSize * offset - circleSize / 1.6;
  
    return (
      <View style={[styles.circle, circleStyle]}>
        <View
          style={[
            styles.overflow,
            {
              width: innerCircleSize,
              height: innerCircleSize,
              borderRadius: circleSize,
              marginLeft: marginLeft,
            },
            overflowStyle,
          ]}
        >
          <Text
            style={[
              styles.overflowLabel,
              { fontSize: circleSize * 0.7 },
              overflowLabelStyle,
            ]}
          >
            +{overflow}
          </Text>
        </View>
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row-reverse',
      flexWrap: 'nowrap',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
    },
    circleImage: {
      borderWidth: 2,
      borderColor: 'white',
    },
    overflow: {
      backgroundColor: '#b6c0ca',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 10,
    },
    overflowLabel: {
      color: '#fff',
      fontSize: 14,
      letterSpacing: -1,
      marginLeft: 3,
      fontWeight: 'bold',
    },
  });

  export default OverflowCircle;