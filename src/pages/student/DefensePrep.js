// src/pages/student/DefensePrep.js
import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext'; // Access Google OAuth token
import { createDefensePresentation } from '../../services/slidesService'; // Google Slides Integration Service

export default function DefensePrep() {
  const { googleTokens } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [slidesUrl, setSlidesUrl] = useState(null);

  const handleGenerateSlides = async () => {
    if (!googleTokens) {
      Alert.alert('Google Auth Required', 'Please sign in with Google to create your presentation deck.');
      return;
    }

    setLoading(true);
    try {
      const presentation = await createDefensePresentation(googleTokens, 'Thesis Defense Deck - Impact of AI');
      setSlidesUrl(presentation.presentationUrl || 'https://slides.google.com');
      Alert.alert('Slides Created', 'Google Slides presentation generated successfully!');
    } catch (error) {
      console.error('Google Slides Error:', error);
      Alert.alert('Error', 'Failed to generate presentation deck in Google Slides.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 space-y-3">
      {/* Existing Header */}
      <Text className="text-base font-bold text-gray-800">Defense Preparation Checklist</Text>

      {/* Existing Deck Checklist Card with Google Slides Integration */}
      <View className="bg-white p-3 rounded-xl border border-gray-100 space-y-2">
        <View className="flex-row justify-between items-center">
          <Text className="text-xs font-bold text-gray-800 flex-1 pr-2">
            1. Prepare Presentation Deck (15 Slides)
          </Text>
          <TouchableOpacity 
            onPress={handleGenerateSlides}
            disabled={loading}
            className="bg-blue-600 px-3 py-1.5 rounded-lg"
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-white text-[10px] font-bold">
                {slidesUrl ? 'Open Slides' : 'Create Deck'}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {slidesUrl && (
          <Text className="text-[10px] text-blue-600 font-semibold mt-1">
            Linked Deck: {slidesUrl}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}