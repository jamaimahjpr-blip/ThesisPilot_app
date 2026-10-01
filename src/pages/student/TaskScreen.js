// src/pages/student/TaskScreen.js
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../../context/AuthContext'; // Access Google OAuth token
import { getCalendarTasks } from '../../services/calendarService'; // Google Calendar Integration Service
import { getClassroomAssignments } from '../../services/classroomService'; // Google Classroom Integration Service

export default function TaskScreen() {
  const { googleTokens } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Submit Chapter 3 Draft',
      dueDate: 'Due May 19',
      source: 'Local',
    },
  ]);

  useEffect(() => {
    if (googleTokens) {
      fetchGoogleTasks();
    }
  }, [googleTokens]);

  const fetchGoogleTasks = async () => {
    setLoading(true);
    try {
      // Fetch upcoming events & assignments from Google Calendar and Classroom
      const [calendarEvents, classroomTasks] = await Promise.all([
        getCalendarTasks(googleTokens),
        getClassroomAssignments(googleTokens),
      ]);

      const formattedCalendar = (calendarEvents || []).map((event, index) => ({
        id: `cal-${index}`,
        title: event.summary || 'Google Calendar Event',
        dueDate: event.start?.dateTime ? new Date(event.start.dateTime).toLocaleDateString() : 'Upcoming',
        source: 'Google Calendar',
      }));

      const formattedClassroom = (classroomTasks || []).map((task, index) => ({
        id: `cls-${index}`,
        title: task.title || 'Classroom Assignment',
        dueDate: task.dueDate ? `Due ${task.dueDate.month}/${task.dueDate.day}` : 'No Due Date',
        source: 'Google Classroom',
      }));

      setTasks((prev) => [
        ...prev.filter((t) => t.source === 'Local'), // Retain existing local task
        ...formattedCalendar,
        ...formattedClassroom,
      ]);
    } catch (error) {
      console.error('Error fetching Google tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncGoogle = () => {
    if (!googleTokens) {
      Alert.alert('Google Auth Required', 'Please sign in with Google to sync Calendar and Classroom tasks.');
      return;
    }
    fetchGoogleTasks();
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 space-y-2">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-base font-bold text-gray-800">Pending Tasks</Text>
        <TouchableOpacity 
          onPress={handleSyncGoogle}
          disabled={loading}
          className="bg-blue-600 px-3 py-1.5 rounded-lg"
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text className="text-white text-xs font-bold">Sync Google</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* List of Tasks (Local + Google Calendar/Classroom) */}
      {tasks.map((task) => (
        <View key={task.id} className="bg-white p-3 rounded-xl border border-gray-100 flex-row justify-between items-center mb-2">
          <View className="flex-1 pr-2">
            <Text className="text-xs font-bold text-gray-800">{task.title}</Text>
            {task.source !== 'Local' && (
              <Text className="text-[9px] text-gray-400 mt-0.5">{task.source}</Text>
            )}
          </View>
          <Text className="text-[10px] text-blue-600 font-bold">{task.dueDate}</Text>
        </View>
      ))}
    </ScrollView>
  );
}