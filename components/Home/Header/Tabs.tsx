import { colors } from "@/constants/Colors";
import useStore from "@/store/useStore";
import React, { useRef, useState, useEffect } from "react";
import {
  Pressable,
  Text,
  StyleSheet,
  View,
  Platform,
  UIManager,
  FlatList,
} from "react-native";

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const TasksTabs = ({ active, setActive, children, values }) => {
  const tabsScrollView = useRef();
  const [ind, setInd] = useState(0);

  const {setSelectedTab} = useStore();

  useEffect(() => {
    if (ind >= 0 && ind < values.length) {
      tabsScrollView?.current?.scrollToIndex({ index: ind, viewPosition: 0.5 });
    }
  }, [ind]);

  const onPressHeader = (index, item) => {
    setActive(item);
    setSelectedTab(item);
    tabsScrollView?.current?.scrollToIndex({ index: index, viewPosition: 0.5 });
    setInd(index);
  };

  return (
    <View style={{zIndex:-999}}>
      <FlatList
        ref={tabsScrollView}
        data={values}
        renderItem={({ item, index }) => {
          return (
            <View style={{ padding: 10 }} key={index}>
              <Pressable
                onPress={() => onPressHeader(index, item)}
                style={{
                  backgroundColor:
                    active == item ? colors.royalBlue : "rgba(199,235,255,1)",
                  padding: 12,
                  borderRadius: 14,
                  shadowColor: "#ffff",
                  shadowRadius: 5,
                  shadowOffset: {
                    width: 12,
                    height: 10,
                  },
                  shadowOpacity: 0.7,
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    fontSize: 13,
                    color: active == item ? "#fff" : "#000",
                  }}
                >
                  {item}
                </Text>
              </Pressable>
            </View>
          );
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate={"fast"}
      />
    </View>
  );
};

export default function Tabs() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 10 }}>
        <TasksTabs
          active={activeTab}
          setActive={setActiveTab}
          values={["All", "Latest", "Served", "Not served", "Paid", "Unpaid"]}
          // children={<DisplayItems />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
});
