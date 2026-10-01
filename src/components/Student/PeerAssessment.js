import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function PeerAssessment() {
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Peer Assessment</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Contribution Score (1-5):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="e.g. 5"
          value={score}
          onChangeText={setScore}
        />

        <Text style={styles.label}>Feedback / Remarks:</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
          placeholder="Write your feedback here..."
          value={feedback}
          onChangeText={setFeedback}
        />

        <TouchableOpacity style={styles.button} onPress={() => alert('Assessment Submitted!')}>
          <Text style={styles.buttonText}>Submit Evaluation</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FAFC' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0F172A', marginBottom: 16 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 6, marginTop: 10 },
  input: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, backgroundColor: '#FFFFFF' },
  textArea: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: '#0284C7', paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
});