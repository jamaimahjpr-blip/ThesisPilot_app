import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';

export default function AITools() {
  const [activeTool, setActiveTool] = useState('Dashboard');
  const [citationFormat, setCitationFormat] = useState('APA 7th');

  return (
    <View style={styles.container}>
      {activeTool === 'Dashboard' && (
        <ScrollView style={styles.padding}>
          <Text style={styles.headerTitle}>How can I help you today?</Text>
          <View style={styles.grid}>
            <TouchableOpacity style={[styles.gridCard, { backgroundColor: '#FEE2E2' }]} onPress={() => setActiveTool('Plagiarism')}>
              <Text style={styles.gridIcon}>📝</Text>
              <Text style={styles.gridLabel}>Plagiarism Checker</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridCard, { backgroundColor: '#DCFCE7' }]} onPress={() => setActiveTool('Grammar')}>
              <Text style={styles.gridIcon}>🔍</Text>
              <Text style={styles.gridLabel}>Grammar Checker</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridCard, { backgroundColor: '#FEF9C3' }]} onPress={() => setActiveTool('Citation')}>
              <Text style={styles.gridIcon}>📚</Text>
              <Text style={styles.gridLabel}>Citation Generator</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.gridCard, { backgroundColor: '#E0F2FE' }]} onPress={() => setActiveTool('Chatbot')}>
              <Text style={styles.gridIcon}>🤖</Text>
              <Text style={styles.gridLabel}>Chatbot Assistant</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Citation Generator Tool */}
      {activeTool === 'Citation' && (
        <ScrollView style={styles.padding}>
          <TouchableOpacity onPress={() => setActiveTool('Dashboard')}><Text style={styles.backBtn}>← Back to Suite</Text></TouchableOpacity>
          <Text style={styles.toolTitle}>Citation Generator</Text>

          <View style={styles.formatRow}>
            {['APA 7th', 'MLA 9th', 'Chicago'].map((fmt) => (
              <TouchableOpacity
                key={fmt}
                onPress={() => setCitationFormat(fmt)}
                style={[styles.formatBtn, citationFormat === fmt && styles.activeFormatBtn]}
              >
                <Text style={[styles.formatText, citationFormat === fmt && styles.activeFormatText]}>{fmt}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.successCard}>
            <Text style={styles.successTitle}>✓ Citation Generated!</Text>
            <Text style={styles.citationResult}>
              {citationFormat === 'APA 7th' && 'Matti, J. (2022). The impact of social media on consumer behavior. Journal of Marketing Research, 45(3), 123-136.'}
              {citationFormat === 'MLA 9th' && 'Kapoor, Kawaljeet, et al. "Advances in Social Media Research." Information Systems Frontiers, vol. 20, 2018, pp. 531-558.'}
              {citationFormat === 'Chicago' && 'Appel, Gil, Lauren Grewal, Rhonda Hadi, and Andrew T. Stephen. "The Future of Social Media in Marketing." Journal of AMS 48 (2020): 79-95.'}
            </Text>
            <TouchableOpacity style={styles.copyBtn}><Text style={styles.copyBtnText}>Copy Citation</Text></TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Plagiarism Checker Tool */}
      {activeTool === 'Plagiarism' && (
        <ScrollView style={styles.padding}>
          <TouchableOpacity onPress={() => setActiveTool('Dashboard')}><Text style={styles.backBtn}>← Back to Suite</Text></TouchableOpacity>
          <Text style={styles.toolTitle}>Plagiarism Checker</Text>
          <View style={styles.card}>
            <Text style={styles.scoreText}>92% Original Content</Text>
            <Text style={styles.subScoreText}>8% Potentially Plagiarized</Text>
          </View>
        </ScrollView>
      )}

      {/* Grammar Checker Tool */}
      {activeTool === 'Grammar' && (
        <ScrollView style={styles.padding}>
          <TouchableOpacity onPress={() => setActiveTool('Dashboard')}><Text style={styles.backBtn}>← Back to Suite</Text></TouchableOpacity>
          <Text style={styles.toolTitle}>Grammar Checker</Text>
          <View style={styles.card}>
            <Text style={styles.cardHeader}>12 Issues Detected</Text>
            <Text style={styles.cardBody}>Original: The results shows that the data are significant.</Text>
            <Text style={[styles.cardBody, { color: '#16A34A', marginTop: 4 }]}>Suggestion: The results show that the data are significant.</Text>
          </View>
        </ScrollView>
      )}

      {/* Chatbot Assistant */}
      {activeTool === 'Chatbot' && (
        <View style={styles.chatbotContainer}>
          <TouchableOpacity onPress={() => setActiveTool('Dashboard')} style={{ padding: 16 }}><Text style={styles.backBtn}>← Back to Suite</Text></TouchableOpacity>
          <ScrollView style={styles.chatScroll}>
            <View style={styles.botMsg}><Text style={styles.chatText}>Buenos días! How can I help you with your thesis today?</Text></View>
          </ScrollView>
          <View style={styles.inputRow}>
            <TextInput style={styles.textInput} placeholder="Type your message..." />
            <TouchableOpacity style={styles.sendBtn}><Text style={{ color: '#FFF' }}>Send</Text></TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  padding: { padding: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridCard: { width: '48%', height: 110, padding: 16, borderRadius: 12, marginBottom: 12, justifyContent: 'center', alignItems: 'center' },
  gridIcon: { fontSize: 28, marginBottom: 6 },
  gridLabel: { fontSize: 13, fontWeight: 'bold', color: '#0F172A', textAlign: 'center' },
  backBtn: { fontSize: 13, color: '#0284C7', fontWeight: 'bold', marginBottom: 12 },
  toolTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 12 },
  formatRow: { flexDirection: 'row', marginBottom: 16 },
  formatBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#E2E8F0', marginRight: 8 },
  activeFormatBtn: { backgroundColor: '#0284C7' },
  formatText: { fontSize: 12, color: '#475569', fontWeight: '600' },
  activeFormatText: { color: '#FFFFFF', fontWeight: 'bold' },
  successCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 10, borderWidth: 1, borderColor: '#BBF7D0' },
  successTitle: { fontSize: 14, fontWeight: 'bold', color: '#16A34A', marginBottom: 8 },
  citationResult: { fontSize: 13, color: '#334155', lineHeight: 18, marginBottom: 12 },
  copyBtn: { backgroundColor: '#0284C7', paddingVertical: 8, borderRadius: 6, alignItems: 'center' },
  copyBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  cardHeader: { fontSize: 14, fontWeight: 'bold', color: '#0F172A', marginBottom: 6 },
  cardBody: { fontSize: 13, color: '#334155' },
  scoreText: { fontSize: 18, fontWeight: 'bold', color: '#16A34A' },
  subScoreText: { fontSize: 12, color: '#DC2626', marginTop: 4 },
  chatbotContainer: { flex: 1 },
  chatScroll: { flex: 1, paddingHorizontal: 16 },
  botMsg: { backgroundColor: '#E0F2FE', padding: 12, borderRadius: 10, alignSelf: 'flex-start', maxWidth: '80%' },
  chatText: { fontSize: 13, color: '#0369A1' },
  inputRow: { flexDirection: 'row', padding: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  textInput: { flex: 1, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 20, paddingHorizontal: 14, height: 40 },
  sendBtn: { backgroundColor: '#0284C7', justifyContent: 'center', paddingHorizontal: 16, borderRadius: 20, marginLeft: 8 }
});