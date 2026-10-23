// src/pages/shared/AIMain.js
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { getGeminiFeedback } from '../../services/geminiService'; // Gemini Integration Service

export default function AIMain({ navigation }) {
  const [draft, setDraft] = useState('');
  const [aiFeedback, setAiFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyzeDraft = async () => {
    if (!draft.trim()) return;
    setLoading(true);
    try {
      const result = await getGeminiFeedback(draft);
      setAiFeedback(result);
    } catch (error) {
      console.error("Gemini AI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 space-y-3">
      <Text className="text-base font-bold text-gray-800">ThesisPilot AI Toolkit</Text>
      
      {/* Existing Toolkit Cards */}
      <View className="grid grid-cols-2 gap-2">
        <TouchableOpacity 
          className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
          onPress={() => navigation?.navigate('GrammarChecker')}
        >
          <Text className="text-xs font-bold text-blue-600">Grammar Checker</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
          onPress={() => navigation?.navigate('CitationGenerator')}
        >
          <Text className="text-xs font-bold text-blue-600">Citation Generator</Text>
        </TouchableOpacity>
      </View>

      {/* Gemini AI Assistant Section */}
      <View className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm space-y-2 mt-2">
        <Text className="text-xs font-bold text-gray-700">Quick Chapter AI Review</Text>
        <TextInput
          placeholder="Paste section draft here..."
          value={draft}
          onChangeText={setDraft}
          multiline
          numberOfLines={4}
          className="bg-gray-50 p-3 rounded-xl text-xs border border-gray-200 text-gray-800"
        />
        <TouchableOpacity 
          onPress={handleAnalyzeDraft}
          disabled={loading}
          className="bg-blue-600 p-3 rounded-xl items-center"
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text className="text-white text-xs font-bold">Analyze with Gemini</Text>
          )}
        </TouchableOpacity>

        {aiFeedback ? (
          <View className="p-3 bg-gray-50 rounded-xl border border-gray-100 mt-2">
            <Text className="text-xs text-gray-800 font-semibold mb-1">Gemini Feedback:</Text>
            <Text className="text-xs text-gray-600">{aiFeedback}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}