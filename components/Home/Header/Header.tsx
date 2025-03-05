// import { StyleSheet, View } from "react-native";
// import React from "react";
// import TopHeader from "./TopHeader";
// import SubHeader from "./SubHeader";
// import Tabs from "./Tabs";
// import { colors } from "@/constants/Colors";
// import { LinearGradient, vec } from "@shopify/react-native-skia";

// export default function Header() {
//   return (
//     <View style={styles.container}>
//       <View style={styles.headerContent}>
//         {/* <LinearGradient start={vec(0,0)} end={vec(0,0)} colors={[colors.secondary,colors.primary]} /> */}
//         <TopHeader />
//         <SubHeader />
//       </View>

//       <Tabs />
//     </View>
//   );
// }

// Header.tsx
import { StyleSheet, View } from "react-native";
import React, { useState } from "react";
import TopHeader from "./TopHeader";
import { SubHeader } from "./SubHeader";
import { FilterModal, FilterState } from "./FilterModal";
import Tabs from "./Tabs";
import { colors } from "@/constants/Colors";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    sortBy: 'newest'
  });

  const handleApplyFilters = () => {
    // Implement your filter logic here
    setFilterVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContent}>
          <TopHeader />
          <SubHeader 
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onFilterPress={() => setFilterVisible(true)}
          />
        </View>
      </View>

      <FilterModal
        isVisible={isFilterVisible}
        onClose={() => setFilterVisible(false)}
        filters={filters}
        onFiltersChange={setFilters}
        onApply={handleApplyFilters}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    //zIndex: 10,
  },
  headerContent: {
    backgroundColor: colors.royalBlue,
    paddingBottom: 20,
    borderBottomEndRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  curveContainer: {
    height: 24,
    backgroundColor: "transparent",
    overflow: "hidden",
  },
});
