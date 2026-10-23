import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function EducatorDashboard() {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 space-y-4">
      <View className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
        <Text className="text-lg font-bold text-gray-800">Hello, Professor! 🎓</Text>
        <Text className="text-xs text-gray-500">Here is your advising and review overview</Text>

        <View className="flex-row space-x-2 mt-3">
          <View className="flex-1 bg-blue-50 p-3 rounded-xl border border-blue-100 items-center">
            <Text className="text-[10px] text-gray-500 uppercase font-bold">To Review</Text>
            <Text className="text-xl font-black text-blue-600">4 Works</Text>
          </View>
          <View className="flex-1 bg-red-50 p-3 rounded-xl border border-red-100 items-center">
            <Text className="text-[10px] text-gray-500 uppercase font-bold">Overdue Reviews</Text>
            <Text className="text-xl font-black text-red-600">1 Task</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}