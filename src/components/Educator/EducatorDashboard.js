import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function EducatorDashboard() {
  const groups = [
    { id: 1, name: 'BSCS Thesis Group 1', topic: 'ThesisPilot App', chapter: 'Chapter 2 Review', status: 'Action Needed' },
    { id: 2, name: 'BSCS Thesis Group 2', topic: 'AI E-Commerce', chapter: 'Chapter 1 Approved', status: 'Up to Date' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Educator Overview</Text>
      <Text style={styles.subtitle}>Manage student submissions and consultations.</Text>

      {groups.map((group) => (
        <View key={group.id} style={styles.card}>
          <Text style={styles.groupName}>{group.name}</Text>
          <Text style={styles.topic}>{group.topic}</Text>
          <View style={styles.row}>
            <Text style={styles.chapter}>{group.chapter}</Text>
            <TouchableOpacity style={styles.reviewBtn}>
              <Text style={styles.btnText}>Review Draft</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0F172A' },
  subtitle: { fontSize: 12, color: '#64748B', marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  groupName: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
  topic: { fontSize: 13, color: '#64748B', marginVertical: 4 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  chapter: { fontSize: 12, fontWeight: '600', color: '#0284C7' },
  reviewBtn: { backgroundColor: '#0F172A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  btnText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
});