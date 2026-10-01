import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function ForgotPassword({ navigation }) {
  return (
    <View className="flex-1 bg-blue-600 p-6 justify-center">
      <View className="bg-white p-6 rounded-3xl space-y-4">
        <Text className="text-xl font-bold text-gray-800">Reset Password</Text>
        <Text className="text-xs text-gray-500">Enter your email to receive recovery instructions.</Text>
        <TextInput placeholder="Your Email" className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm" />
        <TouchableOpacity onPress={() => navigation?.goBack()} className="w-full py-3 bg-blue-600 rounded-xl items-center">
          <Text className="text-white font-bold">Send Reset Link</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}