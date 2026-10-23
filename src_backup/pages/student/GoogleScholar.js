// src/pages/student/GoogleScholar.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { searchScholarPapers } from '../../services/scholarService'; // Google Scholar Service Integration

export default function GoogleScholar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const papers = await searchScholarPapers(query);
      setResults(papers || []);
    } catch (error) {
      console.error("Google Scholar Search Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 p-4 space-y-3">
      {/* Existing Header */}
      <Text className="text-base font-bold text-gray-800">Google Scholar Search</Text>
      
      {/* Search Bar & Action Button */}
      <View className="flex-row space-x-2">
        <TextInput 
          placeholder="Search academic papers..."
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
          className="flex-1 bg-white p-3 rounded-xl text-xs border border-gray-200 text-gray-800" 
        />
        <TouchableOpacity 
          onPress={handleSearch}
          disabled={loading}
          className="bg-blue-600 px-4 justify-center rounded-xl"
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text className="text-white text-xs font-bold">Search</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Results List for Chapter 2 Literature Review */}
      <FlatList
        data={results}
        keyExtractor={(item, index) => item.id || index.toString()}
        showsVerticalScrollIndicator={false}
        className="mt-2"
        renderItem={({ item }) => (
          <View className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm mb-3">
            <Text className="text-xs font-bold text-blue-600 mb-1">{item.title}</Text>
            {item.authors ? (
              <Text className="text-[10px] text-gray-500 mb-1">{item.authors}</Text>
            ) : null}
            <Text className="text-xs text-gray-700">{item.snippet}</Text>
          </View>
        )}
      />
    </View>
  );
}