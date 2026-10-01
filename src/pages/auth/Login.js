import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { auth, GoogleAuthProvider, signInWithCredential } from '../../services/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

WebBrowser.maybeCompleteAuthSession();

export default function Login({ navigation }) {
  const [email, setEmail] = useState('cooper@ipi.edu.ph');
  const [password, setPassword] = useState('••••••••');

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then((userCredential) => {
          console.log('User signed in with Google:', userCredential.user);
          navigation?.navigate('Student Dashboard');
        })
        .catch((error) => {
          console.error('Firebase Auth Error:', error);
        });
    }
  }, [response]);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password.');
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigation?.navigate('Student Dashboard');
      })
      .catch((error) => {
        Alert.alert('Login Failed', error.message);
      });
  };

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
              defaultValue={email}
              onChangeText={setEmail}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm"
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View>
            <Text className="text-xs font-semibold text-gray-500 mb-1">Password</Text>
            <TextInput
              secureTextEntry
              placeholder="Password"
              defaultValue={password}
              onChangeText={setPassword}
              className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm"
            />
            <TouchableOpacity 
              onPress={() => navigation?.navigate('ForgotPassword')}
              className="mt-2 align-self-end"
            >
              <Text className="text-xs text-blue-600 font-semibold text-right">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            className="w-full py-3.5 bg-blue-600 rounded-xl items-center shadow-md mt-2"
          >
            <Text className="text-white font-bold text-base">Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            disabled={!request}
            onPress={() => promptAsync()}
            className="w-full py-3 bg-gray-200 rounded-xl items-center shadow-sm mt-2"
          >
            <Text className="text-gray-800 font-semibold text-sm">Sign in with Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}