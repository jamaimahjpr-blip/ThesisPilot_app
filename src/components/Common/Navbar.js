import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AuthContext } from '../../context/AuthContext';

export default function Navbar({ title = 'ThesisPilot', onMenuPress }) {
  const { user } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onMenuPress} style={styles.menuBtn}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.roleBadge}>
        <Text style={styles.roleText}>{user?.role?.toUpperCase() || 'GUEST'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  menuBtn: { padding: 4 },
  menuIcon: { fontSize: 20, color: '#0F172A' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#0F172A' },
  roleBadge: { backgroundColor: '#E0F2FE', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  roleText: { color: '#0284C7', fontSize: 10, fontWeight: 'bold' }
});