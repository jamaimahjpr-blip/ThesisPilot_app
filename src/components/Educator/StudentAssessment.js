import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function StudentAssessment() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Student Assessment & Grading</Text>
      <View style={styles.card}>
        <Text style={styles.studentName}>Jamaimah (Group 1 Lead)</Text>
        <Text style={styles.label}>Manuscript Quality: 88/100</Text>
        <Text style={styles.label}>Defense Readiness: Ready</Text>
        <TouchableOpacity style={styles.btn}>
          <Text style={styles.btnText}>Update Grade</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FAFC' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#0F172A' },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  studentName: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, color: '#0F172A' },
  label: { fontSize: 14, color: '#475569', marginBottom: 4 },
  btn: { backgroundColor: '#0284C7', padding: 10, borderRadius: 6, alignItems: 'center', marginTop: 10 },
  btnText: { color: '#FFFFFF', fontWeight: 'bold' }
});