import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function StudentFeedback() {
  const feedbacks = [
    { name: 'Sheldon Lee Cooper', date: 'May 15, 2026', chapter: 'Chapter 2 - Literature Review', rating: '4.5/5' },
    { name: 'Apple David', date: 'Apr 20, 2026', chapter: 'Chapter 3 - Methodology', rating: '4.0/5' },
    { name: 'Jesse Pinkman', date: 'May 08, 2026', chapter: 'Chapter 1 - Introduction', rating: '2.0/5' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Student Feedback</Text>
      {feedbacks.map((item, idx) => (
        <View key={idx} style={styles.card}>
          <Text style={styles.studentName}>{item.name}</Text>
          <Text style={styles.dateText}>{item.date}</Text>
          
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>Your Rating: {item.rating}</Text>
          </View>

          <View style={styles.chapterBox}>
            <Text style={styles.chapterText}>{item.chapter}</Text>
          </View>

          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FAFC' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 14 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  studentName: { fontSize: 15, fontWeight: 'bold', color: '#0F172A' },
  dateText: { fontSize: 11, color: '#94A3B8', marginTop: 2 },
  ratingBadge: { backgroundColor: '#DCFCE7', padding: 6, borderRadius: 6, marginVertical: 8, alignSelf: 'flex-start' },
  ratingText: { color: '#15803D', fontWeight: 'bold', fontSize: 12 },
  chapterBox: { backgroundColor: '#F1F5F9', padding: 10, borderRadius: 6, marginBottom: 10 },
  chapterText: { fontSize: 13, color: '#334155', fontWeight: '600' },
  editBtn: { backgroundColor: '#E0F2FE', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 6, alignSelf: 'flex-start' },
  editBtnText: { color: '#0284C7', fontWeight: 'bold', fontSize: 12 }
});