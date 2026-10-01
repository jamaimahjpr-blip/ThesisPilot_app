import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function GoogleScholar() {
  const [filter, setFilter] = useState('All');

  const references = [
    { type: 'Book', title: 'AI in Higher Education: A Systematic Review', author: 'Brown, K.', year: '2025' },
    { type: 'Journal', title: 'The Impact of Artificial Intelligence on Education', author: 'Johnson, L. & Smith, T.', year: '2026' },
    { type: 'Website', title: 'Mobile Learning and Student Performance Outcomes', author: 'Williams, M.', year: '2025' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>References & Citations</Text>

      {/* Category Tabs */}
      <View style={styles.tabRow}>
        {['All', 'Book', 'Journal', 'Website'].map((cat) => (
          <TouchableOpacity key={cat} onPress={() => setFilter(cat)} style={[styles.filterBtn, filter === cat && styles.activeFilter]}>
            <Text style={[styles.filterText, filter === cat && styles.activeFilterText]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Cards List */}
      {references
        .filter((r) => filter === 'All' || r.type === filter)
        .map((item, idx) => (
          <View key={idx} style={styles.card}>
            <View style={styles.badge}><Text style={styles.badgeText}>{item.type}</Text></View>
            <Text style={styles.refTitle}>{item.title}</Text>
            <Text style={styles.refAuthor}>{item.author} ({item.year})</Text>
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FAFC' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#0F172A' },
  tabRow: { flexDirection: 'row', marginBottom: 16 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#E2E8F0', marginRight: 8 },
  activeFilter: { backgroundColor: '#0284C7' },
  filterText: { fontSize: 12, color: '#475569', fontWeight: '600' },
  activeFilterText: { color: '#FFFFFF', fontWeight: 'bold' },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  badge: { alignSelf: 'flex-start', backgroundColor: '#E0F2FE', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginBottom: 6 },
  badgeText: { fontSize: 10, color: '#0284C7', fontWeight: 'bold' },
  refTitle: { fontSize: 15, fontWeight: 'bold', color: '#0F172A' },
  refAuthor: { fontSize: 12, color: '#64748B', marginTop: 4 }
});