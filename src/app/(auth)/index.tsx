import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");
const isIOS = Platform.OS === "ios";

type Slide = {
  key: string;
  title: string;
  subtitle: string;
  image: string;
};

const SLIDES: Slide[] = [
  {
    key: "1",
    title: "Every table,\nunder control",
    subtitle:
      "See open tables, active orders, and status at a glance — no more running back to the POS.",
    image:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1000&auto=format&fit=crop",
  },
  {
    key: "2",
    title: "Orders fire to\nthe kitchen instantly",
    subtitle:
      "Tap in the order, send it, and watch it move from ticket to table in real time.",
    image:
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1000&auto=format&fit=crop",
  },
  {
    key: "3",
    title: "Your shift,\nyour numbers",
    subtitle:
      "Track tips, covers, and sales as they happen — clock out knowing exactly how you did.",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1000&auto=format&fit=crop",
  },
];

export default function Onboarding() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);

  const isLast = index === SLIDES.length - 1;
  const goToAuth = () => router.replace("/(auth)/signin");

  const goNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isLast) {
      goToAuth();
    } else {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
    }
  };

  const CardContent = ({ item }: { item: Slide }) => (
    <>
      <Text className="text-[28px] font-extrabold leading-9 text-white">
        {item.title}
      </Text>
      <Text className="mt-3 text-[16px] leading-6 text-gray-200">
        {item.subtitle}
      </Text>
    </>
  );

  return (
    <View className="flex-1 bg-black">
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          },
        )}
        onMomentumScrollEnd={(e) =>
          setIndex(Math.round(e.nativeEvent.contentOffset.x / width))
        }
        renderItem={({ item }) => (
          <View style={{ width, height }}>
            <Image
              source={{ uri: item.image }}
              style={StyleSheet.absoluteFill}
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-black/30" />

            <View className="flex-1 justify-end px-6 pb-[140px]">
              {isIOS ? (
                <BlurView
                  intensity={40}
                  tint="dark"
                  className="overflow-hidden rounded-3xl border border-white/20 p-8"
                >
                  <CardContent item={item} />
                </BlurView>
              ) : (
                <View className="overflow-hidden rounded-3xl border border-white/20 bg-black/70 p-8">
                  <CardContent item={item} />
                </View>
              )}
            </View>
          </View>
        )}
      />

      <View className="absolute top-14 right-6">
        {!isLast && (
          <Pressable
            onPress={goToAuth}
            hitSlop={10}
            className="active:opacity-70"
          >
            {isIOS ? (
              <BlurView
                intensity={30}
                tint="dark"
                className="overflow-hidden rounded-full px-5 py-2 border border-white/20"
              >
                <Text className="text-[14px] font-bold text-white">Skip</Text>
              </BlurView>
            ) : (
              <View className="overflow-hidden rounded-full border border-white/20 bg-black/70 px-5 py-2">
                <Text className="text-[14px] font-bold text-white">Skip</Text>
              </View>
            )}
          </Pressable>
        )}
      </View>

      <View className="absolute bottom-0 w-full px-6 pb-12 pt-4">
        <View className="mb-8 flex-row items-center justify-center">
          {SLIDES.map((_, i) => {
            const dotWidth = scrollX.interpolate({
              inputRange: [width * (i - 1), width * i, width * (i + 1)],
              outputRange: [8, 24, 8],
              extrapolate: "clamp",
            });
            const opacity = scrollX.interpolate({
              inputRange: [width * (i - 1), width * i, width * (i + 1)],
              outputRange: [0.4, 1, 0.4],
              extrapolate: "clamp",
            });
            const bgColor = scrollX.interpolate({
              inputRange: [width * (i - 1), width * i, width * (i + 1)],
              outputRange: ["#ffffff", "#0d9488", "#ffffff"],
              extrapolate: "clamp",
            });
            return (
              <Animated.View
                key={i}
                className="mx-1 h-2 rounded-full"
                style={{
                  width: dotWidth,
                  opacity,
                  backgroundColor: bgColor as any,
                }}
              />
            );
          })}
        </View>

        <Pressable
          onPress={goNext}
          className="h-[56px] items-center justify-center rounded-2xl active:opacity-90"
          style={{ backgroundColor: "#0d9488" }}
        >
          <Text className="text-[17px] font-bold text-white">
            {isLast ? "Get Started" : "Next"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
