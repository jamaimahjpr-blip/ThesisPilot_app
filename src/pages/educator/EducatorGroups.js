import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

export default function EducatorGroups() {
  const groups = [
    { id: 'G1', title: 'AI in Education', members: 'Sheldon, Cooper, Penny', progress: '68%' },
    { id: 'G2', title: 'Blockchain Voting', members: 'Leonard, Howard, Raj', progress: '85%' },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4 space-y-3">
      <Text className="text-base font-bold text-gray-800">Assigned Thesis Groups</Text>
      {groups.map((g) => (
        <TouchableOpacity key={g.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-2">
          <Text className="text-xs font-bold text-gray-800">{g.title}</Text>
          <Text className="text-[10px] text-gray-400">{g.members}</Text>
          <Text className="text-[10px] text-blue-600 font-bold">Progress: {g.progress}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}