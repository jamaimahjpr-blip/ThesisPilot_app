import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function Reference() {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 space-y-2">
      <Text className="text-base font-bold text-gray-800">Thesis References Manager</Text>
      <View className="bg-white p-3 rounded-xl border border-gray-100">
        <Text className="text-xs text-gray-800 font-bold">Smith et al. (2024)</Text>
        <Text className="text-[10px] text-gray-500">Journal of Artificial Intelligence in Education</Text>
      </View>
    </ScrollView>
  );
}