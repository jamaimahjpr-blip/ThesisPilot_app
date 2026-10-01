import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function Signup({ navigation }) {
  return (
    <View className="flex-1 bg-blue-600">
      <View className="pt-12 px-6 pb-8">
        <Text className="text-3xl font-bold text-white">Create Account</Text>
        <Text className="text-white/80 text-sm mt-1">Join ThesisPilot today</Text>
      </View>

      <View className="flex-1 bg-white rounded-t-[32px] p-6 justify-between">
        <View className="space-y-3 pt-2">
          <TextInput placeholder="Full Name" className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm" />
          <TextInput placeholder="Institutional Email" className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm" />
          <TextInput secureTextEntry placeholder="Password" className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm" />
          <TouchableOpacity 
            onPress={() => navigation?.navigate('Login')}
            className="w-full py-3.5 bg-blue-600 rounded-xl items-center shadow-md mt-2"
          >
            <Text className="text-white font-bold text-base">Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}