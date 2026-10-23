import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function ManageGroups() {
  const groups = [
    { id: '1', name: 'Thesis Group 1 (AI System)', members: '3 Students', status: 'On Track' },
    { id: '2', name: 'Thesis Group 2 (IoT App)', members: '4 Students', status: 'Needs Review' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Manage Advisory Groups</Text>
      {groups.map((g) => (
        <View key={g.id} style={styles.card}>
          <Text style={styles.groupName}>{g.name}</Text>
          <Text style={styles.groupSub}>{g.members}</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{g.status}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FAFC' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#0F172A' },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  groupName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  groupSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#E0F2FE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 8 },
  badgeText: { color: '#0284C7', fontSize: 11, fontWeight: 'bold' }
});