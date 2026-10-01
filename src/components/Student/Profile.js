import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email || 'student@thesispilot.edu'}</Text>
        
        <Text style={styles.label}>Role:</Text>
        <Text style={styles.value}>{user?.role || 'Student'}</Text>
        
        <Text style={styles.label}>Program:</Text>
        <Text style={styles.value}>BS Computer Science</Text>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Sign Out Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F8FAFC' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#0F172A' },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 16 },
  label: { fontSize: 12, color: '#64748B', marginTop: 8 },
  value: { fontSize: 15, fontWeight: 'bold', color: '#0F172A' },
  logoutBtn: { backgroundColor: '#EF4444', padding: 14, borderRadius: 8, alignItems: 'center' },
  logoutText: { color: '#FFFFFF', fontWeight: 'bold' }
});