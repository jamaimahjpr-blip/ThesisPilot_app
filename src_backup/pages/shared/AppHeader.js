import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function AppHeader({ title = 'ThesisPilot' }) {
  return (
    <View className="bg-blue-600 px-4 pt-10 pb-3 flex-row items-center justify-between">
      <Text className="font-bold text-lg text-white">{title}</Text>
      <TouchableOpacity className="w-8 h-8 rounded-full bg-blue-300 items-center justify-center">
        <Text className="text-blue-900 font-bold text-xs">SC</Text>
      </TouchableOpacity>
    </View>
  );
}