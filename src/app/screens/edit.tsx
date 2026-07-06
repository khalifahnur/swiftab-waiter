// import React, { useEffect, useState } from 'react';
// import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
// import { router } from 'expo-router';
// import { Ionicons } from '@react-native-vector-icons/ionicons';
// import { AuthInput } from '@/components/ui/AuthInput';
// import { AuthButton } from '@/components/ui/AuthButton';
// import { Avatar } from '@/components/profile/Avatar';
// import { useWaiterProfile, useUpdateProfile } from '@/hooks/useProfile';

// export default function EditProfile() {
//   const { profile } = useWaiterProfile();
//   const { mutate: updateProfile, isPending } = useUpdateProfile();

//   const [restaurantName, setRestaurantName] = useState('');
//   const [email, setEmail] = useState('');
//   const [errors, setErrors] = useState<{ restaurantName?: string; email?: string }>({});

//   useEffect(() => {
//     if (profile) {
//       setRestaurantName(profile.restaurantName ?? '');
//       setEmail(profile.email ?? '');
//     }
//   }, [profile]);

//   const validate = () => {
//     const next: typeof errors = {};
//     if (!restaurantName.trim()) next.restaurantName = 'Restaurant name is required';
//     if (!email.trim()) next.email = 'Email is required';
//     else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = 'Enter a valid email';
//     setErrors(next);
//     return Object.keys(next).length === 0;
//   };

//   const onSave = () => {
//     if (!validate()) return;
//     updateProfile(
//       { restaurantName: restaurantName.trim(), email: email.trim() },
//       { onSuccess: () => router.back() }
//     );
//   };

//   return (
//     <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1 bg-white">
//       <View className="flex-row items-center px-4 pt-4">
//         <Pressable
//           onPress={() => router.back()}
//           className="h-9 w-9 items-center justify-center rounded-full bg-gray-100"
//           hitSlop={8}
//         >
//           <Ionicons name="chevron-back" size={20} color="#1C1C1E" />
//         </Pressable>
//         <Text className="ml-3 text-[17px] font-semibold text-gray-900">Edit Profile</Text>
//       </View>

//       <ScrollView contentContainerStyle={{ padding: 20 }} keyboardShouldPersistTaps="handled">
//         <View className="mb-8 items-center">
//           <View>
//             <Avatar name={restaurantName || 'Restaurant'} size={88} />
//             <Pressable
//               // TODO: wire to expo-image-picker if you want real photo uploads
//               className="absolute -bottom-1 -right-1 h-8 w-8 items-center justify-center rounded-full"
//               style={{ backgroundColor: '#0A84FF', borderWidth: 3, borderColor: '#fff' }}
//             >
//               <Ionicons name="camera" size={14} color="#fff" />
//             </Pressable>
//           </View>
//         </View>

//         <AuthInput
//           label="Restaurant Name"
//           leftIcon="storefront-outline"
//           value={restaurantName}
//           onChangeText={setRestaurantName}
//           error={errors.restaurantName}
//         />
//         <AuthInput
//           label="Email"
//           leftIcon="mail-outline"
//           autoCapitalize="none"
//           keyboardType="email-address"
//           value={email}
//           onChangeText={setEmail}
//           error={errors.email}
//         />

//         <View className="mt-4">
//           <AuthButton label="Save Changes" onPress={onSave} loading={isPending} />
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

import { Text, View } from "react-native";

export default function EditScreen() {
  return (
    <View>
      <Text>EditScreen</Text>
    </View>
  );
}
