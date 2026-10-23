import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function Settings() {
  return (
    <View className="flex-1 bg-gray-50 p-4 space-y-2">
      <Text className="text-base font-bold text-gray-800 mb-2">App Settings</Text>
      <TouchableOpacity className="p-3 bg-white rounded-xl border border-gray-100">
        <Text className="text-xs text-gray-700">Dark Mode Toggle</Text>
      </TouchableOpacity>
      <TouchableOpacity className="p-3 bg-white rounded-xl border border-gray-100">
        <Text className="text-xs text-gray-700">Notification Preferences</Text>
      </TouchableOpacity>
    </View>
  );
}