import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';

export default function EducatorReviewScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 space-y-3">
      <View className="bg-white p-4 rounded-2xl border border-gray-100">
        <Text className="text-xs font-bold text-gray-800">Review Chapter 3 Draft</Text>
        <TextInput multiline numberOfLines={4} placeholder="Add feedback..." className="bg-gray-50 p-3 rounded-xl text-xs mt-2 border border-gray-200" />
        <TouchableOpacity className="mt-3 py-3 bg-blue-600 rounded-xl items-center">
          <Text className="text-white font-bold text-xs">Submit Evaluation</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}