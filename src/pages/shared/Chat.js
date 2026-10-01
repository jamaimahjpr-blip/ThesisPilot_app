// src/pages/shared/Chat.js
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getGeminiFeedback } from '../../services/geminiService'; // Gemini Integration Service

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Please review the updated Methodology draft.",
      sender: "user"
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { id: Date.now(), text: inputText, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setLoading(true);

    try {
      // Call Gemini AI service
      const aiResponseText = await getGeminiFeedback(currentInput);
      const aiMessage = { id: Date.now() + 1, text: aiResponseText, sender: "ai" };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Gemini Chat Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4 space-y-2">
        {messages.map((msg) => (
          <View 
            key={msg.id} 
            className={`p-3 rounded-xl border border-gray-100 mb-2 ${
              msg.sender === 'user' 
                ? 'bg-white self-start' 
                : 'bg-blue-50 self-end border-blue-100'
            }`}
          >
            <Text className={`text-xs ${msg.sender === 'user' ? 'text-gray-800' : 'text-blue-900'}`}>
              {msg.text}
            </Text>
          </View>
        ))}
        {loading && (
          <View className="p-3 bg-gray-100 self-end rounded-xl mb-2">
            <ActivityIndicator size="small" color="#2563eb" />
          </View>
        )}
      </ScrollView>

      {/* Existing Input Bar */}
      <View className="p-3 bg-white border-t border-gray-100 flex-row items-center">
        <TextInput 
          placeholder="Type message..." 
          value={inputText}
          onChangeText={setInputText}
          className="flex-1 bg-gray-100 px-4 py-2 rounded-full text-xs" 
        />
        <TouchableOpacity 
          onPress={handleSendMessage}
          disabled={loading}
          className="ml-2 bg-blue-600 px-4 py-2 rounded-full"
        >
          <Text className="text-white text-xs font-bold">Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}