import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { auth } from '../../services/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

export default function ForgotPassword({ navigation }) {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your registered email address.');
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        Alert.alert(
          'Email Sent',
          'A password reset link has been sent to your email address. Please check your inbox and reset your password before logging in.',
          [
            {
              text: 'OK',
              onPress: () => navigation?.navigate('Login'),
            },
          ]
        );
      })
      .catch((error) => {
        Alert.alert('Error', error.message);
      });
  };

  return (
    <View className="flex-1 bg-blue-600 p-6 justify-center">
      <View className="bg-white p-6 rounded-3xl space-y-4">
        <Text className="text-xl font-bold text-gray-800">Reset Password</Text>
        <Text className="text-xs text-gray-500">
          Enter your email to receive recovery instructions.
        </Text>

        <TextInput
          placeholder="Your Email"
          value={email}
          onChangeText={setEmail}
          className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TouchableOpacity
          onPress={handleResetPassword}
          className="w-full py-3 bg-blue-600 rounded-xl items-center"
        >
          <Text className="text-white font-bold">Send Reset Link</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation?.goBack()}
          className="w-full py-2 items-center"
        >
          <Text className="text-xs text-gray-500 font-semibold">Back to Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}