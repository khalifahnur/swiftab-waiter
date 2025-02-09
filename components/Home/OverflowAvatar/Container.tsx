import React from "react";
import { View, StyleSheet } from "react-native";
import { renderFacePile } from "./FacePile";
import Circle from "./Circle";
import { FacePilePropTypes } from "../types";
import OverflowCircle from "./OverflowCircle";

export default function Container({
  faces,
  circleSize = 30,
  numFaces = 2,
  offset = 1,
  hideOverflow = false,
  containerStyle,
  circleStyle,
  imageStyle,
  overflowStyle,
  overflowLabelStyle,
  render,
}: FacePilePropTypes) {
    
  const renderFace = (
    face: { id: number; imageUrl: string },
    index: number
  ) => {
    if (face && !face.imageUrl) return null;

    return (
      <Circle
        key={face.id || index}
        face={face}
        circleStyle={circleStyle}
        imageStyle={imageStyle}
        circleSize={circleSize}
        offset={offset}
      />
    );
  };

  if (render) return render();

  const { facesToRender, overflow } = renderFacePile(faces, numFaces);

  return (
    <View style={[styles.container, containerStyle]}>
      {overflow > 0 && !hideOverflow && (
        <OverflowCircle
          overflow={overflow}
          circleSize={circleSize}
          offset={offset}
          circleStyle={circleStyle}
          overflowStyle={overflowStyle}
          overflowLabelStyle={overflowLabelStyle}
        />
      )}
      {Array.isArray(facesToRender) && facesToRender.map(renderFace)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});
