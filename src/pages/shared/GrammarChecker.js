import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function GrammarChecker() {
  return (
    <View className="flex-1 bg-gray-50 p-4 space-y-3">
      <Text className="text-base font-bold text-gray-800">AI Grammar & Clarity Checker</Text>
      <TextInput multiline numberOfLines={5} placeholder="Paste paragraph here..." className="bg-white p-3 rounded-xl text-xs border border-gray-200" />
      <TouchableOpacity className="py-3 bg-blue-600 rounded-xl items-center">
        <Text className="text-white font-bold text-xs">Analyze Text</Text>
      </TouchableOpacity>
    </View>
  );
}