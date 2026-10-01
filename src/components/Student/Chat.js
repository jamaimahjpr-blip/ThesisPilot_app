import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello Group! Don\'t forget our meeting later.', sender: 'Adviser' },
    { id: 2, text: 'Noted Sir! We already updated Chapter 2.', sender: 'You' },
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, sender: 'You' }]);
    setInput('');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.msgContainer}>
        {messages.map((m) => (
          <View key={m.id} style={[styles.bubble, m.sender === 'You' ? styles.myBubble : styles.otherBubble]}>
            <Text style={styles.sender}>{m.sender}</Text>
            <Text style={m.sender === 'You' ? styles.myText : styles.otherText}>{m.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputRow}>
        <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="Type a message..." />
        <TouchableOpacity style={styles.sendBtn} onPress={send}>
          <Text style={styles.sendText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  msgContainer: { flex: 1, padding: 16 },
  bubble: { padding: 10, borderRadius: 8, marginBottom: 8, maxWidth: '80%' },
  myBubble: { backgroundColor: '#0284C7', alignSelf: 'flex-end' },
  otherBubble: { backgroundColor: '#E2E8F0', alignSelf: 'flex-start' },
  sender: { fontSize: 10, color: '#94A3B8', marginBottom: 2 },
  myText: { color: '#FFFFFF' },
  otherText: { color: '#0F172A' },
  inputRow: { flexDirection: 'row', padding: 10, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  input: { flex: 1, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 20, paddingHorizontal: 16, height: 40 },
  sendBtn: { justifyContent: 'center', paddingHorizontal: 16 },
  sendText: { color: '#0284C7', fontWeight: 'bold' }
});