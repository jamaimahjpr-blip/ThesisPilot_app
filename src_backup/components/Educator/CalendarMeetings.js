import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function CalendarMeetings() {
  const meetings = [
    { id: 1, title: 'Group 1 Defense Prep', time: '2:00 PM - 3:30 PM', date: 'Sept 22, 2026' },
    { id: 2, title: 'Chapter 2 Consult - Group 4', time: '10:00 AM - 11:00 AM', date: 'Sept 24, 2026' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Event Calendar & Meetings</Text>
      {meetings.map((m) => (
        <View key={m.id} style={styles.card}>
          <Text style={styles.cardTitle}>{m.title}</Text>
          <Text style={styles.cardSub}>{m.date} | {m.time}</Text>
        </View>
      ))}
      <TouchableOpacity style={styles.addBtn}>
        <Text style={styles.addBtnText}>+ Schedule New Meeting</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FAFC' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#0F172A' },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  cardSub: { fontSize: 13, color: '#64748B', marginTop: 4 },
  addBtn: { backgroundColor: '#0284C7', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  addBtnText: { color: '#FFFFFF', fontWeight: 'bold' }
});