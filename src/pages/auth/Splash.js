import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export default function Splash({ navigation }) {
  return (
    <View className="flex-1 bg-gradient-to-b from-blue-700 to-blue-900 justify-between p-6 items-center">
      <View className="flex-1 justify-center items-center">
        <View className="w-24 h-24 bg-white/10 rounded-3xl justify-center items-center mb-4 border border-white/20">
          <Text className="text-white text-4xl font-bold">📖</Text>
        </View>
        <Text className="text-3xl font-extrabold text-white tracking-wide">ThesisPilot</Text>
      </View>

      <View className="w-full space-y-3 mb-8">
        <TouchableOpacity 
          onPress={() => navigation?.navigate('Login')}
          className="w-full py-3.5 bg-white rounded-xl items-center shadow-lg"
        >
          <Text className="text-blue-700 font-bold text-base">Sign up with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation?.navigate('Login')}
          className="w-full py-3.5 bg-white/10 border border-white/30 rounded-xl items-center"
        >
          <Text className="text-white font-bold text-base">Login with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}