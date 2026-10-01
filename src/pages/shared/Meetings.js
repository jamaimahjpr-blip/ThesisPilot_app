// src/pages/shared/Meetings.js
import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext'; // Access Google OAuth token
import { createConsultationMeeting } from '../../services/meetService'; // Google Meet Service Integration

export default function Meetings() {
  const { googleTokens } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [meetings, setMeetings] = useState([
    {
      id: 1,
      title: 'Adviser Sync Meeting',
      time: 'May 22, 2026 2:00 PM',
      link: null,
    },
  ]);

  const handleCreateGoogleMeet = async () => {
    if (!googleTokens) {
      Alert.alert('Google Auth Required', 'Please sign in with Google to create a consultation link.');
      return;
    }

    setLoading(true);
    try {
      const meetingDetails = {
        topic: 'Thesis Adviser Consultation',
        startTime: new Date(Date.now() + 3600000).toISOString(), // Scheduled 1 hour from now
        endTime: new Date(Date.now() + 7200000).toISOString(),
      };

      const meetLink = await createConsultationMeeting(googleTokens, meetingDetails);

      const newMeeting = {
        id: Date.now(),
        title: 'New Consultation Session',
        time: 'Scheduled (Just now)',
        link: meetLink,
      };

      setMeetings((prev) => [newMeeting, ...prev]);
      Alert.alert('Meeting Created', `Google Meet link generated successfully!\n${meetLink}`);
    } catch (error) {
      console.error('Google Meet Error:', error);
      Alert.alert('Error', 'Failed to create Google Meet session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 space-y-3">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-base font-bold text-gray-800">Scheduled Consultations</Text>
        
        {/* Create Google Meet Link Button */}
        <TouchableOpacity 
          onPress={handleCreateGoogleMeet}
          disabled={loading}
          className="bg-blue-600 px-3 py-2 rounded-xl"
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text className="text-white text-xs font-bold">+ New Meet</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Existing Scheduled Meetings List */}
      {meetings.map((item) => (
        <View key={item.id} className="bg-white p-3 rounded-xl border border-gray-100 mb-2">
          <Text className="text-xs font-bold text-gray-800">{item.title}</Text>
          <Text className="text-[10px] text-gray-400 mt-1">{item.time}</Text>
          {item.link ? (
            <Text className="text-[10px] text-blue-600 font-semibold mt-1">{item.link}</Text>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}