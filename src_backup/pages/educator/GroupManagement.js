import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function GroupManagement() {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 space-y-3">
      <Text className="text-base font-bold text-gray-800">Manage Thesis Groups</Text>
      <TouchableOpacity className="p-3 bg-blue-600 rounded-xl items-center">
        <Text className="text-white font-bold text-xs">+ Add New Group</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}