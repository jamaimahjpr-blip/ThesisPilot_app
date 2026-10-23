import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function FeedbackScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 space-y-2">
      <Text className="text-base font-bold text-gray-800">Adviser Feedback History</Text>
      <View className="bg-white p-3 rounded-xl border border-gray-100">
        <Text className="text-xs text-gray-700">"Revise questionnaire format in Chapter 3."</Text>
        <Text className="text-[10px] text-gray-400 mt-1">- Dr. John Doe</Text>
      </View>
    </ScrollView>
  );
}