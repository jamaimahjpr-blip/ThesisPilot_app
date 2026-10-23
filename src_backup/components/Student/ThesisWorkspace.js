import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function ThesisWorkspace() {
  const [activeTab, setActiveTab] = useState('Overview');

  const chapters = [
    { title: 'Chapter 1: Introduction', progress: 1.0, status: '100%' },
    { title: 'Chapter 2: Literature Review', progress: 0.75, status: '75%' },
    { title: 'Chapter 3: Methodology', progress: 0.20, status: '20%' },
    { title: 'Chapter 4: Results', progress: 0.10, status: '10%' },
    { title: 'Chapter 5: Conclusion', progress: 0.0, status: '0%' },
  ];

  const notes = [
    { title: 'Research Problem Ideas', date: 'May 14, 2026', desc: 'Good articulation for the problem statement and background.' },
    { title: 'Interview Questions', date: 'May 12, 2026', desc: 'Draft questions for user study participants.' },
    { title: 'Statistical Methods', date: 'May 10, 2026', desc: 'Notes on ANOVA vs Regression for data analysis.' },
  ];

  const activities = [
    { type: 'comment', text: 'Dr. Elizzette commented on Chapter 2: Literature Review', time: 'Today' },
    { type: 'task', text: 'You completed a task: Design Research Instruments', time: 'Today' },
    { type: 'meeting', text: 'Dr. Elizzette scheduled a meeting: System Review Meeting', time: 'Yesterday' },
  ];

  return (
    <View style={styles.container}>
      {/* Thesis Header */}
      <View style={styles.header}>
        <Text style={styles.subHeader}>Current Thesis</Text>
        <Text style={styles.thesisTitle}>The Impact of AI on Student Learning Outcomes ›</Text>
      </View>

      {/* Sub Tabs */}
      <View style={styles.tabContainer}>
        {['Overview', 'Chapters', 'Notes', 'Activity'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content}>
        {activeTab === 'Overview' && (
          <View>
            <View style={styles.card}>
              <Text style={styles.cardHeader}>About this thesis</Text>
              <Text style={styles.cardBody}>
                This study examines the impact of Artificial Intelligence (AI) tools on academic performance and learning experience of college students.
              </Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardHeader}>Adviser</Text>
              <View style={styles.adviserRow}>
                <View style={styles.avatarPlaceholder} />
                <View>
                  <Text style={styles.adviserName}>Dr. Elizzette Joy Mationg</Text>
                  <Text style={styles.adviserRole}>Primary Thesis Adviser</Text>
                </View>
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.card, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.cardSubHeader}>Target Proposal</Text>
                <Text style={styles.dateText}>July 31, 2026</Text>
              </View>
              <View style={[styles.card, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.cardSubHeader}>Target Defense</Text>
                <Text style={styles.dateText}>August 01, 2026</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'Chapters' && (
          <View>
            <View style={styles.actionRow}>
              <Text style={styles.sectionTitle}>Chapters</Text>
              <TouchableOpacity style={styles.primaryBtn}><Text style={styles.primaryBtnText}>+ Add Chapter</Text></TouchableOpacity>
            </View>
            {chapters.map((ch, i) => (
              <View key={i} style={styles.chapterCard}>
                <View style={styles.actionRow}>
                  <Text style={styles.chapterTitle}>{ch.title}</Text>
                  <Text style={styles.statusPercent}>{ch.status}</Text>
                </View>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: ch.status }]} />
                </View>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'Notes' && (
          <View>
            <View style={styles.actionRow}>
              <Text style={styles.sectionTitle}>Notes</Text>
              <TouchableOpacity style={styles.primaryBtn}><Text style={styles.primaryBtnText}>+ Add Note</Text></TouchableOpacity>
            </View>
            {notes.map((note, i) => (
              <View key={i} style={styles.card}>
                <Text style={styles.chapterTitle}>{note.title}</Text>
                <Text style={styles.dateText}>{note.date}</Text>
                <Text style={styles.cardBody}>{note.desc}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'Activity' && (
          <View>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {activities.map((act, i) => (
              <View key={i} style={styles.activityItem}>
                <Text style={styles.activityDot}>•</Text>
                <View style={styles.activityBody}>
                  <Text style={styles.cardBody}>{act.text}</Text>
                  <Text style={styles.dateText}>{act.time}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#FFFFFF', padding: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  subHeader: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  thesisTitle: { fontSize: 15, fontWeight: 'bold', color: '#0F172A', marginTop: 2 },
  tabContainer: { flexDirection: 'row', backgroundColor: '#FFFFFF', paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  tabButton: { paddingVertical: 12, paddingHorizontal: 12, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTabButton: { borderBottomColor: '#0284C7' },
  tabText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  activeTabText: { color: '#0284C7', fontWeight: 'bold' },
  content: { padding: 16 },
  card: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 12 },
  cardHeader: { fontSize: 14, fontWeight: 'bold', color: '#0F172A', marginBottom: 6 },
  cardSubHeader: { fontSize: 11, color: '#64748B' },
  cardBody: { fontSize: 13, color: '#334155', lineHeight: 18 },
  adviserRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  avatarPlaceholder: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#0284C7', marginRight: 10 },
  adviserName: { fontSize: 13, fontWeight: 'bold', color: '#0F172A' },
  adviserRole: { fontSize: 11, color: '#64748B' },
  row: { flexDirection: 'row' },
  dateText: { fontSize: 12, fontWeight: 'bold', color: '#0284C7', marginTop: 4 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
  primaryBtn: { backgroundColor: '#0284C7', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  primaryBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: 'bold' },
  chapterCard: { backgroundColor: '#FFFFFF', padding: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 10 },
  chapterTitle: { fontSize: 13, fontWeight: 'bold', color: '#0F172A' },
  statusPercent: { fontSize: 12, fontWeight: 'bold', color: '#0284C7' },
  progressBarBg: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3, marginTop: 8 },
  progressBarFill: { height: 6, backgroundColor: '#0284C7', borderRadius: 3 },
  activityItem: { flexDirection: 'row', backgroundColor: '#FFFFFF', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 8 },
  activityDot: { fontSize: 18, color: '#0284C7', marginRight: 8 },
  activityBody: { flex: 1 }
});