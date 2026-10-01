import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function DefensePrep() {
  const checklists = [
    { id: 1, task: 'Finalize Presentation Deck', done: true },
    { id: 2, task: 'Print 3 Manuscript Hardcopies', done: false },
    { id: 3, task: 'Rehearse Q&A Session', done: false },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Defense Preparation Checklist</Text>
      {checklists.map((c) => (
        <View key={c.id} style={styles.item}>
          <Text style={styles.checkbox}>{c.done ? '✅' : '⬜'}</Text>
          <Text style={[styles.taskText, c.done && styles.doneText]}>{c.task}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FAFC' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#0F172A' },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', padding: 14, borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  checkbox: { marginRight: 10, fontSize: 16 },
  taskText: { fontSize: 14, color: '#1E293B' },
  doneText: { textDecorationLine: 'line-through', color: '#94A3B8' }
});