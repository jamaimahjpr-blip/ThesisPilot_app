import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export interface ChatMessage {
  id: string;
  sender: 'you' | 'student';
  senderName: string;
  text: string;
  time: string;
  avatar?: string;
  attachment?: {
    fileName: string;
    fileType: 'pdf' | 'doc' | 'image';
  };
}

export interface StudentThread {
  id: string;
  studentName: string;
  subtitle: string;
  avatar: string;
  lastMessage: string;
  time: string;
}

interface EducatorChatManagementScreenProps {
  onBack: () => void;
  setEducatorDashView?: (view: 'dashboard' | 'chat' | 'profile') => void;
}

export default function EducatorChatManagementScreen({
  onBack,
  setEducatorDashView,
}: EducatorChatManagementScreenProps) {
  // Selected Chat Thread State (Default: Sheldon Lee Cooper)
  const [selectedStudent, setSelectedStudent] = useState<StudentThread>({
    id: '1',
    studentName: 'Sheldon Lee Cooper',
    subtitle: 'Private Chat',
    avatar: 'https://i.pravatar.cc/100?img=60',
    lastMessage: 'bazinga',
    time: '16:12 PM',
  });

  const [showThreadSelectorModal, setShowThreadSelectorModal] = useState(false);

  // Available Threads List
  const availableThreads: StudentThread[] = [
    {
      id: '1',
      studentName: 'Sheldon Lee Cooper',
      subtitle: 'Private Chat',
      avatar: 'https://i.pravatar.cc/100?img=60',
      lastMessage: 'bazinga',
      time: '16:12 PM',
    },
    {
      id: '2',
      studentName: 'Penny Hofstadter',
      subtitle: 'Private Chat',
      avatar: 'https://i.pravatar.cc/100?img=5',
      lastMessage: 'Thank you for the review, Teach!',
      time: '14:20 PM',
    },
    {
      id: '3',
      studentName: "Cooper's Thesis Group",
      subtitle: 'Group Chat (5 members)',
      avatar: 'https://i.pravatar.cc/100?img=12',
      lastMessage: 'Rajesh: Chapter 3 revised copy attached.',
      time: 'Yesterday',
    },
  ];

  // Chat Messages State
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'you',
      senderName: 'You',
      text: 'Good work on your papers, Sheldon!',
      time: 'Today, 11:30 AM',
    },
    {
      id: '2',
      sender: 'student',
      senderName: 'Sheldon Lee Cooper',
      text: 'bazinga',
      time: 'Today, 16:12 PM',
      avatar: 'https://i.pravatar.cc/100?img=60',
    },
  ]);

  const [inputText, setInputText] = useState('');

  // Send Message Logic
  const handleSendMessage = (attachment?: {
    fileName: string;
    fileType: 'pdf' | 'doc' | 'image';
  }) => {
    if (!inputText.trim() && !attachment) return;
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'you',
      senderName: 'You',
      text: inputText.trim(),
      time:
        'Today, ' +
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment,
    };
    setMessages([...messages, newMsg]);
    setInputText('');
  };

  // Attach File Logic
  const handleAttachFile = () => {
    Alert.alert('Attach File', 'Select document or file type to send:', [
      {
        text: 'Thesis Paper (PDF)',
        onPress: () =>
          handleSendMessage({
            fileName: 'Chapter3_Methodology_Comments.pdf',
            fileType: 'pdf',
          }),
      },
      {
        text: 'Document (DOCX)',
        onPress: () =>
          handleSendMessage({
            fileName: 'Thesis_Revisions_Adviser.docx',
            fileType: 'doc',
          }),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* TOP HEADER BAR */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity style={styles.headerIconTouch} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.headerTitleContainer}
          activeOpacity={0.8}
          onPress={() => setShowThreadSelectorModal(true)}
        >
          <Text style={styles.headerTitleText}>{selectedStudent.studentName}</Text>
          <Text style={styles.headerSubTitleText}>{selectedStudent.subtitle}</Text>
        </TouchableOpacity>
        <View style={styles.headerRightRow}>
          <TouchableOpacity style={styles.headerIconTouch}>
            <Ionicons name="search-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconTouch}
            onPress={() => setShowThreadSelectorModal(true)}
          >
            <Ionicons name="ellipsis-horizontal" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* MAIN WHITE CONTAINER */}
      <View style={styles.whiteCardContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesScrollContainer}
        >
          {messages.map((item) => {
            const isYou = item.sender === 'you';
            return (
              <View
                key={item.id}
                style={[
                  styles.messageRowWrapper,
                  isYou ? styles.youMessageRow : styles.studentMessageRow,
                ]}
              >
                {!isYou && (
                  <Image
                    source={{ uri: item.avatar || selectedStudent.avatar }}
                    style={styles.senderAvatarImage}
                  />
                )}
                <View
                  style={[
                    styles.bubbleColumn,
                    isYou ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' },
                  ]}
                >
                  {/* SENDER LABEL */}
                  <Text style={styles.senderLabelText}>{item.senderName}</Text>

                  {/* CHAT BUBBLE */}
                  <View
                    style={[
                      styles.chatBubbleCard,
                      isYou ? styles.youBubbleStyle : styles.studentBubbleStyle,
                    ]}
                  >
                    {!!item.text && (
                      <Text
                        style={[
                          styles.bubbleMessageText,
                          isYou ? styles.youText : styles.studentText,
                        ]}
                      >
                        {item.text}
                      </Text>
                    )}

                    {/* ATTACHMENT DISPLAY */}
                    {item.attachment && (
                      <View style={styles.attachmentBox}>
                        <Ionicons
                          name={
                            item.attachment.fileType === 'pdf'
                              ? 'document-text'
                              : 'document'
                          }
                          size={20}
                          color={isYou ? '#FFFFFF' : '#1E58A8'}
                        />
                        <Text
                          style={[
                            styles.attachmentNameText,
                            isYou ? styles.youText : { color: '#0F172A' },
                          ]}
                        >
                          {item.attachment.fileName}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* TIMESTAMP */}
                  <Text style={styles.timestampText}>{item.time}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* CHAT INPUT BAR */}
        <View style={styles.chatInputBarWrapper}>
          <View style={styles.inputInnerContainer}>
            <TouchableOpacity style={styles.plusIconTouch} onPress={handleAttachFile}>
              <Ionicons name="add-circle-outline" size={26} color="#64748B" />
            </TouchableOpacity>
            <TextInput
              style={styles.textInputStyle}
              placeholder="Type a message..."
              placeholderTextColor="#94A3B8"
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
            <TouchableOpacity style={styles.smileyIconTouch}>
              <Ionicons name="happy-outline" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.sendButtonBlue}
            onPress={() => handleSendMessage()}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* LOWER NAVIGATOR */}
      <View style={styles.bottomTabContainer}>
        <TouchableOpacity style={styles.tabButton} activeOpacity={0.7} onPress={onBack}>
          <Ionicons name="home-outline" size={24} color="#64748B" />
          <Text style={styles.tabLabelText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} activeOpacity={0.7}>
          <Ionicons name="chatbox-ellipses" size={24} color="#1E58A8" />
          <Text style={[styles.tabLabelText, styles.activeTabLabel]}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
          onPress={() => {
            if (setEducatorDashView) setEducatorDashView('profile');
          }}
        >
          <Ionicons name="person-outline" size={24} color="#64748B" />
          <Text style={styles.tabLabelText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* THREAD SELECTOR MODAL */}
      <Modal visible={showThreadSelectorModal} transparent animationType="slide">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Select Student or Group</Text>
            <ScrollView style={{ maxHeight: 300, marginVertical: 10 }}>
              {availableThreads.map((thread) => (
                <TouchableOpacity
                  key={thread.id}
                  style={styles.threadItemRow}
                  onPress={() => {
                    setSelectedStudent(thread);
                    setShowThreadSelectorModal(false);
                  }}
                >
                  <Image
                    source={{ uri: thread.avatar }}
                    style={styles.threadAvatarCircle}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.threadNameText}>{thread.studentName}</Text>
                    <Text style={styles.threadSubText}>{thread.subtitle}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#1E58A8" />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelOutlineBtn}
              onPress={() => setShowThreadSelectorModal(false)}
            >
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E58A8',
  },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 52,
    paddingBottom: 16,
  },
  headerIconTouch: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubTitleText: {
    fontSize: 11,
    color: '#BFDBFE',
    marginTop: 1,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  whiteCardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  messagesScrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
  },
  messageRowWrapper: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  youMessageRow: {
    justifyContent: 'flex-end',
  },
  studentMessageRow: {
    justifyContent: 'flex-start',
  },
  senderAvatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
    marginTop: 4,
  },
  bubbleColumn: {
    maxWidth: '80%',
  },
  senderLabelText: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 3,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  chatBubbleCard: {
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  youBubbleStyle: {
    backgroundColor: '#1E58A8',
    borderBottomRightRadius: 2,
  },
  studentBubbleStyle: {
    backgroundColor: '#334155',
    borderBottomLeftRadius: 2,
  },
  bubbleMessageText: {
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  youText: {
    color: '#FFFFFF',
  },
  studentText: {
    color: '#FFFFFF',
  },
  timestampText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  attachmentBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  attachmentNameText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  chatInputBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  inputInnerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 8 : 2,
  },
  plusIconTouch: {
    marginRight: 6,
  },
  smileyIconTouch: {
    marginLeft: 6,
  },
  textInputStyle: {
    flex: 1,
    fontSize: 13,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    maxHeight: 80,
  },
  sendButtonBlue: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#1E58A8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomTabContainer: {
    flexDirection: 'row',
    height: 62,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 12 : 4,
    paddingTop: 6,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabelText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
    fontWeight: '500',
  },
  activeTabLabel: {
    fontWeight: 'bold',
    color: '#1E58A8',
  },
  modalOverlayDark: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalWhiteCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    elevation: 8,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
  },
  threadItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  threadAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  threadNameText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  threadSubText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  cancelOutlineBtn: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  cancelOutlineBtnText: {
    color: '#475569',
    fontWeight: 'bold',
    fontSize: 14,
  },
});