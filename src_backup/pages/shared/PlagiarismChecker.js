import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function PlagiarismChecker() {
  return (
    <View className="flex-1 bg-gray-50 p-4 space-y-3">
      <Text className="text-base font-bold text-gray-800">Plagiarism Scanner</Text>
      <View className="bg-white p-6 rounded-2xl border border-dashed border-gray-300 items-center">
        <Text className="text-xs text-gray-500">Upload document to scan similarity index</Text>
      </View>
    </View>
  );
}