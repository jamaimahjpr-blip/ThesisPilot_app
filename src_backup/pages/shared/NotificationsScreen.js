import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function NotificationsScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 space-y-2">
      <Text className="text-base font-bold text-gray-800">Notifications</Text>
      <View className="bg-blue-50/60 p-3 rounded-xl border border-blue-200">
        <Text className="text-xs font-bold text-gray-800">New feedback received on Chapter 2</Text>
      </View>
    </ScrollView>
  );
}