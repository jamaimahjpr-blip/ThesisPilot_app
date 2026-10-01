// src/pages/student/ThesisWorkspace.js
import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking
} from 'react-native';
import { AuthContext } from '../../context/AuthContext'; // Access Google OAuth token
import { createChapterDoc } from '../../services/docsService'; // Google Docs Service Integration
import { listThesisFiles } from '../../services/driveService'; // Google Drive Service Integration

export default function ThesisWorkspace() {
  const { googleTokens } = useContext(AuthContext);
  const [loadingChapter, setLoadingChapter] = useState(null);
  const [driveFiles, setDriveFiles] = useState([]);
  const [loadingDrive, setLoadingDrive] = useState(false);

  const chapters = [
    { id: 1, name: 'Chapter 1: Introduction' },
    { id: 2, name: 'Chapter 2: Literature Review' },
    { id: 3, name: 'Chapter 3: Methodology' },
    { id: 4, name: 'Chapter 4: Results' },
    { id: 5, name: 'Chapter 5: Conclusion' },
  ];

  useEffect(() => {
    if (googleTokens) {
      fetchDriveFiles();
    }
  }, [googleTokens]);

  const fetchDriveFiles = async () => {
    setLoadingDrive(true);
    try {
      const files = await listThesisFiles(googleTokens);
      setDriveFiles(files);
    } catch (error) {
      console.error('Error fetching Google Drive files:', error);
    } finally {
      setLoadingDrive(false);
    }
  };

  const handleCreateOrOpenDoc = async (chapterName) => {
    if (!googleTokens) {
      Alert.alert(
        'Google Auth Required',
        'Please sign in with Google to create or sync chapter documents.'
      );
      return;
    }
    setLoadingChapter(chapterName);
    try {
      const doc = await createChapterDoc(googleTokens, chapterName);
      Alert.alert(
        'Google Doc Ready',
        `Document successfully connected for ${chapterName}!`
      );
      fetchDriveFiles(); // Refresh Google Drive asset list after creating doc
    } catch (error) {
      console.error('Google Docs Error:', error);
      Alert.alert('Error', 'Failed to connect to Google Docs.');
    } finally {
      setLoadingChapter(null);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 space-y-3">
      {/* Existing Active Thesis Card */}
      <View className="bg-white p-3 rounded-xl border border-gray-100">
        <Text className="text-[10px] text-gray-400 uppercase font-bold">
          Active Thesis
        </Text>
        <Text className="text-sm font-bold text-gray-800 mt-1">
          Impact of AI on Student Learning
        </Text>
      </View>

      {/* Google Docs Chapters Section */}
      <View className="space-y-2 mt-2">
        <Text className="text-xs font-bold text-gray-700">
          Google Docs Chapter Documents
        </Text>

        {chapters.map((chap) => (
          <View
            key={chap.id}
            className="p-3 bg-white rounded-xl border border-gray-100 flex-row justify-between items-center mb-1"
          >
            <Text className="text-xs text-gray-800 font-semibold">
              {chap.name}
            </Text>
            <TouchableOpacity
              onPress={() => handleCreateOrOpenDoc(chap.name)}
              disabled={loadingChapter === chap.name}
              className="bg-blue-600 px-3 py-2 rounded-lg"
            >
              {loadingChapter === chap.name ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text className="text-white text-[10px] font-bold">
                  Open in Docs
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Google Drive Synced Attachments Section */}
      <View className="space-y-2 mt-3">
        <View className="flex-row justify-between items-center">
          <Text className="text-xs font-bold text-gray-700">
            Google Drive Synced Assets & PDFs
          </Text>
          <TouchableOpacity onPress={fetchDriveFiles} disabled={loadingDrive}>
            <Text className="text-[10px] text-blue-600 font-bold">Refresh</Text>
          </TouchableOpacity>
        </View>

        {loadingDrive ? (
          <ActivityIndicator size="small" color="#2563EB" />
        ) : driveFiles.length > 0 ? (
          driveFiles.map((file) => (
            <TouchableOpacity
              key={file.id}
              onPress={() => file.webViewLink && Linking.openURL(file.webViewLink)}
              className="p-3 bg-white rounded-xl border border-gray-100 flex-row justify-between items-center mb-1"
            >
              <Text className="text-xs text-gray-800 font-medium" numberOfLines={1}>
                {file.name}
              </Text>
              <Text className="text-[10px] text-blue-600 font-bold">View</Text>
            </TouchableOpacity>
          ))
        ) : (
          <View className="p-3 bg-white rounded-xl border border-gray-100">
            <Text className="text-xs text-gray-400">
              No synced Drive files found.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}