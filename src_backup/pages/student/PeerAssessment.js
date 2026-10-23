import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function PeerAssessment() {
  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 space-y-3">
      <Text className="text-base font-bold text-gray-800">Peer Evaluation Form</Text>
      <View className="bg-white p-4 rounded-xl border border-gray-100 space-y-2">
        <Text className="text-xs font-bold text-gray-800">Group Member Contribution</Text>
        <TouchableOpacity className="py-2 bg-blue-600 rounded-lg items-center">
          <Text className="text-white text-xs font-bold">Submit Rating</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}