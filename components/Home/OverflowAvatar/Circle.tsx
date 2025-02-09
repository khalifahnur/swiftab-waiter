import { Animated, Image, StyleSheet } from "react-native";
import { CirclePropTypes } from "../types";

const Circle = ({ imageStyle, circleSize, face, offset }: CirclePropTypes) => {
    const innerCircleSize = circleSize * 2;
    const marginRight = circleSize * offset + 10;
  
    return (
      <Animated.View style={{ marginRight: -marginRight }}>
        <Image
          style={[
            styles.circleImage,
            {
              width: innerCircleSize,
              height: innerCircleSize,
              borderRadius: circleSize,
            },
            imageStyle,
          ]}
          source={{ uri: face.imageUrl }}
        />
      </Animated.View>
    );
  };
  
  export default Circle;
  
  const styles = StyleSheet.create({
    circleImage: {
      borderWidth: 1,
      borderColor: 'white',
    },
  });
  