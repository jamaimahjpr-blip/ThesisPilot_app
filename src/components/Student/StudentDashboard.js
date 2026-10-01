// src/components/Student/StudentDashboard.js
import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function StudentDashboardContent() {
  const chapters = [
    { id: 1, title: 'Chapter 1: Problem and Its Background', date: 'Sept 10, 2026', status: 'Approved', badgeColor: '#DCFCE7', textColor: '#166534' },
    { id: 2, title: 'Chapter 2: Review of Related Literature', date: 'Sept 15, 2026', status: 'Under Review', badgeColor: '#FEF3C7', textColor: '#92400E' },
    { id: 3, title: 'Chapter 3: Technical Methodology', date: 'Pending', status: 'Draft', badgeColor: '#F1F5F9', textColor: '#475569' },
    { id: 4, title: 'Chapter 4: Results and Discussion', date: 'Pending', status: 'Locked', badgeColor: '#F1F5F9', textColor: '#94A3B8' },
    { id: 5, title: 'Chapter 5: Summary and Recommendation', date: 'Pending', status: 'Locked', badgeColor: '#F1F5F9', textColor: '#94A3B8' },
  ];

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#0F172A' }}>Welcome back, Jamaimah!</Text>
      <Text style={{ fontSize: 14, color: '#64748B', marginBottom: 16 }}>BSCS Thesis Pilot Progress</Text>

      <View style={{ backgroundColor: '#0284C7', borderRadius: 16, padding: 16, marginBottom: 24 }}>
        <Text style={{ color: '#E0F2FE', fontSize: 12, fontWeight: '500' }}>Overall Progress</Text>
        <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginVertical: 4 }}>40% Completed</Text>
        <View style={{ height: 8, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 4, marginTop: 8 }}>
          <View style={{ height: 8, backgroundColor: '#FFFFFF', borderRadius: 4, width: '40%' }} />
        </View>
      </View>

      <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 12 }}>Manuscript Chapters</Text>

      {chapters.map((item) => (
        <View key={item.id} style={{ backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, flexDirection: 'row', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#1E293B' }}>{item.title}</Text>
            <Text style={{ fontSize: 12, color: '#94A3B8', marginTop: 2 }}>{item.date}</Text>
          </View>
          <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: item.badgeColor }}>
            <Text style={{ fontSize: 11, fontWeight: 'bold', color: item.textColor }}>{item.status}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}