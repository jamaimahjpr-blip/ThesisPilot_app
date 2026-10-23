import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Tasks() {
  const tasks = [
    { id: 1, task: 'Complete Chapter 2 Review of Related Lit', due: 'Tomorrow' },
    { id: 2, task: 'Submit Survey Form Draft to Adviser', due: 'Sept 25' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Assigned Tasks</Text>
      {tasks.map((t) => (
        <View key={t.id} style={styles.card}>
          <Text style={styles.taskName}>{t.task}</Text>
          <Text style={styles.dueText}>Due: {t.due}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FAFC' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#0F172A' },
  card: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  taskName: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  dueText: { fontSize: 12, color: '#EF4444', marginTop: 4, fontWeight: '500' }
});