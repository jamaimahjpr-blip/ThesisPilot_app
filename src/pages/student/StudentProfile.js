import React from 'react';
import { View, Text } from 'react-native';

export default function StudentProfile() {
  return (
    <View className="flex-1 bg-gray-50 p-4 items-center">
      <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-2">
        <Text className="text-blue-600 text-xl font-bold">SC</Text>
      </View>
      <Text className="text-base font-bold text-gray-800">Sheldon Cooper</Text>
      <Text className="text-xs text-gray-500">BS Computer Science</Text>
    </View>
  );
}