import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FAQsScreen from '@/components/FaqScreen'
import CustomerCareScreen from '@/components/CustomerCareScreen';

import 'react-native-gesture-handler';
import { enableExperimentalWebImplementation } from 'react-native-gesture-handler';
enableExperimentalWebImplementation(false);


const Tab = createMaterialTopTabNavigator();

const HelpCenterScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
        tabBarIndicatorStyle: { backgroundColor: '#007AFF' },
      }}
    >
      <Tab.Screen name="FAQs" component={FAQsScreen} />
      <Tab.Screen name="Customer Care" component={CustomerCareScreen} />
    </Tab.Navigator>
  );
};

export default HelpCenterScreen;
