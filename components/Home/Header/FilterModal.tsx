// // SubHeader.tsx
// import { Image, Pressable, StyleSheet, Text, View, TextInput } from 'react-native';
// import React from 'react';

// interface SubHeaderProps {
//   searchQuery: string;
//   onSearchChange: (query: string) => void;
//   onFilterPress: () => void;
// }

// export function SubHeader({ searchQuery, onSearchChange, onFilterPress }: SubHeaderProps) {
//   return (
//     <View style={styles.container}>
//       <View style={styles.searchContainer}>
//         <Image
//           source={require('@/assets/images/icons/search.png')}
//           style={styles.searchIcon}
//         />
//         <TextInput
//           placeholder="Search for order"
//           placeholderTextColor="#9CA3AF"
//           style={styles.input}
//           value={searchQuery}
//           onChangeText={onSearchChange}
//         />
//       </View>
//       <Pressable
//         style={({ pressed }) => [
//           styles.filterButton,
//           { opacity: pressed ? 0.8 : 1 }
//         ]}
//         onPress={onFilterPress}
//       >
//         <Image
//           source={require('@/assets/images/icons/filter.png')}
//           style={styles.filterIcon}
//         />
//       </Pressable>
//     </View>
//   );
// }

// FilterModal.tsx
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  TextInput,
  useWindowDimensions,
} from "react-native";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/constants/Colors";

export type OrderStatus =
  | "all"
  | "pending"
  | "preparing"
  | "ready"
  | "delivered";
export type SortBy = "newest" | "oldest" | "highest" | "lowest";

export interface FilterState {
  status: OrderStatus;
  sortBy: SortBy;
}

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onApply: () => void;
}

export function FilterModal({
  isVisible,
  onClose,
  filters,
  onFiltersChange,
  onApply,
}: FilterModalProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { bottom } = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["50%", "75%"], []);

  const [searchQuery, setSearchQuery] = useState("");

  // const window = useWindowDimensions();
  // const MAX_HEIGHT = window.height;

  const handleSheetChanges = useCallback(
    (index: number) => {
      if (index === -1) onClose();
    },
    [onClose]
  );

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const handleReset = () => {
    onFiltersChange({
      status: "all",
      sortBy: "newest",
    });
  };

  const FilterButton = ({
    isActive,
    onPress,
    children,
  }: {
    isActive: boolean;
    onPress: () => void;
    children: React.ReactNode;
  }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.filterOption,
        isActive && styles.filterOptionActive,
        { opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <Text
        style={[
          styles.filterOptionText,
          isActive && styles.filterOptionTextActive,
        ]}
      >
        {children}
      </Text>
    </Pressable>
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backdropComponent={renderBackdrop}
      enablePanDownToClose
      style={styles.bottomSheet}
      keyboardBehavior="interactive"
      keyboardBlurBehavior='restore'
    >
      <BottomSheetScrollView
        contentContainerStyle={[styles.sheetContent, { paddingBottom: bottom }]}
        
      >
        <View style={styles.filterSection}>
          <View style={styles.searchContainer}>
            <Image
              source={require("@/assets/images/icons/search.png")}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder="Search by Table No, Order ID, or Status"
              placeholderTextColor="#9CA3AF"
              style={styles.input}
              value={searchQuery}
              onChangeText={(t) => setSearchQuery(t)}
            />
          </View>
          <Text style={styles.filterTitle}>Order Status</Text>
          <View style={styles.filterOptions}>
            {(
              [
                "all",
                "pending",
                "preparing",
                "ready",
                "delivered",
              ] as OrderStatus[]
            ).map((status) => (
              <FilterButton
                key={status}
                isActive={filters.status === status}
                onPress={() => onFiltersChange({ ...filters, status })}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </FilterButton>
            ))}
          </View>
        </View>

        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Sort By</Text>
          <View style={styles.filterOptions}>
            {(
              [
                { key: "newest", label: "Newest First" },
                { key: "oldest", label: "Oldest First" },
                { key: "highest", label: "Highest Amount" },
                { key: "lowest", label: "Lowest Amount" },
              ] as { key: SortBy; label: string }[]
            ).map(({ key, label }) => (
              <FilterButton
                key={key}
                isActive={filters.sortBy === key}
                onPress={() => onFiltersChange({ ...filters, sortBy: key })}
              >
                {label}
              </FilterButton>
            ))}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.resetButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={handleReset}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.applyButton,
              { opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={onApply}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </Pressable>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  // SubHeader styles
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom:10
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: "#6B7280",
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1F2937",
    padding: 0,
  },
  filterButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  filterIcon: {
    width: 24,
    height: 24,
    tintColor: "#FFFFFF",
  },

  // FilterModal styles
  bottomSheet: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  sheetContent: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterOptionActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    color: "#4B5563",
  },
  filterOptionTextActive: {
    color: "#FFFFFF",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  resetButton: {
    backgroundColor: "#F3F4F6",
  },
  applyButton: {
    backgroundColor: colors.primary,
  },
  resetButtonText: {
    color: "#4B5563",
    fontSize: 16,
    fontWeight: "600",
  },
  applyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
