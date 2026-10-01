import React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

export default function Login({ navigation }) {
  return (
    <View className="flex-1 bg-blue-600">
      <View className="pt-12 px-6 pb-8">
        <Text className="text-3xl font-bold text-white">Welcome</Text>
        <Text className="text-white/80 text-sm mt-1">to Thesis Platform</Text>
      </View>

      <View className="flex-1 bg-white rounded-t-[32px] p-6 justify-between">
        <View className="space-y-4 pt-4">
          <View>
            <Text className="text-xs font-semibold text-gray-500 mb-1">Email</Text>
            <TextInput 
              placeholder="Email" 
              defaultValue="cooper@ipi.edu.ph"
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm"
            />
          </View>
          <View>
            <Text className="text-xs font-semibold text-gray-500 mb-1">Password</Text>
            <TextInput 
              secureTextEntry
              placeholder="Password" 
              defaultValue="••••••••"
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm"
            />
          </View>
          <TouchableOpacity 
            onPress={() => navigation?.navigate('StudentDashboard')}
            className="w-full py-3.5 bg-blue-600 rounded-xl items-center shadow-md mt-2"
          >
            <Text className="text-white font-bold text-base">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}