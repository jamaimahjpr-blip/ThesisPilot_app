import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function EventCalendar() {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 space-y-3">
      <Text className="text-base font-bold text-gray-800">Academic Calendar & Defense Dates</Text>
      <View className="bg-white p-3.5 rounded-xl border border-gray-100">
        <Text className="text-xs font-bold text-blue-600">May 25, 2026</Text>
        <Text className="text-xs text-gray-800 font-bold mt-1">Title Defense - Group 1</Text>
      </View>
    </ScrollView>
  );
}