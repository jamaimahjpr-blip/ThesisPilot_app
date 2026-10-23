import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const STORAGE_GROUPS_KEY = '@educator_chat_groups_v4';
const STORAGE_MESSAGES_KEY = '@educator_chat_messages_v4';

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

export interface GroupMember {
  id: string;
  name: string;
  username: string;
  role: string;
  avatar: string;
  addedBy?: string;
  isAdmin?: boolean;
}

export interface StudentThread {
  id: string;
  studentName: string;
  subtitle: string;
  avatar: string;
  lastMessage: string;
  time: string;
  proposedTopic?: string;
  members?: GroupMember[];
}

interface EducatorChatManagementScreenProps {
  onBack: () => void;
  setEducatorDashView?: (view: 'dashboard' | 'chat' | 'profile') => void;
}

const DEFAULT_MEMBERS: GroupMember[] = [
  { id: 'm1', name: 'Angelyn Tandayu', username: '@angelyn.tandayu.73', role: 'Member', avatar: 'https://i.pravatar.cc/100?img=1', addedBy: 'you' },
  { id: 'm2', name: 'ゆき な', username: '@mikaela.garon', role: 'Member', avatar: 'https://i.pravatar.cc/100?img=3', addedBy: 'you' },
  { id: 'm3', name: 'J Delos Reyes', username: '@jessiedelosreyes0905', role: 'Member', avatar: 'https://i.pravatar.cc/100?img=11', addedBy: 'ゆき な' },
  { id: 'm4', name: '結核明', username: '@jie.he.ming', role: 'Member', avatar: 'https://i.pravatar.cc/100?img=8', addedBy: 'ゆき な' },
  { id: 'm5', name: 'Janna Ramirez', username: '@Jana.Ramirez2007', role: 'Admin', avatar: 'https://i.pravatar.cc/100?img=5', isAdmin: true },
];

const DEFAULT_THREADS: StudentThread[] = [
  {
    id: 'grp-1',
    studentName: "Cooper's Thesis Group",
    subtitle: 'Group Chat (5 members)',
    avatar: 'https://i.pravatar.cc/100?img=12',
    lastMessage: 'Rajesh: Chapter 3 revised copy attached.',
    time: 'Yesterday',
    proposedTopic: 'AI-Driven Academic Research & Thesis Guidance System',
    members: DEFAULT_MEMBERS,
  },
  {
    id: 'dm-1',
    studentName: 'Sheldon Lee Cooper',
    subtitle: 'Private Chat',
    avatar: 'https://i.pravatar.cc/100?img=60',
    lastMessage: 'bazinga',
    time: '16:12 PM',
  },
  {
    id: 'dm-2',
    studentName: 'Penny Hofstadter',
    subtitle: 'Private Chat',
    avatar: 'https://i.pravatar.cc/100?img=5',
    lastMessage: 'Thank you for the review, Teach!',
    time: '14:20 PM',
  },
];

const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'grp-1': [
    { id: '1', sender: 'you', senderName: 'You', text: 'Good work on your papers, team!', time: 'Today, 11:30 AM' },
    { id: '2', sender: 'student', senderName: 'Sheldon Lee Cooper', text: 'bazinga', time: 'Today, 16:12 PM', avatar: 'https://i.pravatar.cc/100?img=60' },
  ],
  'dm-1': [
    { id: '1', sender: 'you', senderName: 'You', text: 'Good work on your papers, Sheldon!', time: 'Today, 11:30 AM' },
    { id: '2', sender: 'student', senderName: 'Sheldon Lee Cooper', text: 'bazinga', time: 'Today, 16:12 PM', avatar: 'https://i.pravatar.cc/100?img=60' },
  ],
  'dm-2': [
    { id: '1', sender: 'student', senderName: 'Penny Hofstadter', text: 'Thank you for the review, Teach!', time: 'Today, 14:20 PM', avatar: 'https://i.pravatar.cc/100?img=5' },
  ],
};

export default function EducatorChatManagementScreen({
  onBack,
  setEducatorDashView,
}: EducatorChatManagementScreenProps) {
  // Navigation states: 'list' | 'chatRoom' | 'groupInfo' | 'membersList' | 'privateChat'
  const [currentView, setCurrentView] = useState<'list' | 'chatRoom' | 'groupInfo' | 'membersList' | 'privateChat'>('list');

  const [threads, setThreads] = useState<StudentThread[]>(DEFAULT_THREADS);
  const [selectedThread, setSelectedThread] = useState<StudentThread | null>(null);
  const [selectedDirectMember, setSelectedDirectMember] = useState<GroupMember | null>(null);

  const [allMessages, setAllMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  // Educator Edit Group Name Modal
  const [showEditGroupNameModal, setShowEditGroupNameModal] = useState(false);
  const [editGroupNameInput, setEditGroupNameInput] = useState('');

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedThreads = await AsyncStorage.getItem(STORAGE_GROUPS_KEY);
      const savedMsgs = await AsyncStorage.getItem(STORAGE_MESSAGES_KEY);
      if (savedThreads) setThreads(JSON.parse(savedThreads));
      if (savedMsgs) setAllMessages(JSON.parse(savedMsgs));
    } catch (e) {
      console.log('Error loading saved chat data:', e);
    }
  };

  const persistThreads = async (updatedThreads: StudentThread[]) => {
    try {
      setThreads(updatedThreads);
      await AsyncStorage.setItem(STORAGE_GROUPS_KEY, JSON.stringify(updatedThreads));
    } catch (e) {
      console.log('Error saving threads:', e);
    }
  };

  const persistMessages = async (updatedMsgs: Record<string, ChatMessage[]>) => {
    try {
      setAllMessages(updatedMsgs);
      await AsyncStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(updatedMsgs));
    } catch (e) {
      console.log('Error saving messages:', e);
    }
  };

  const handleSelectThread = (thread: StudentThread) => {
    setSelectedThread(thread);
    setCurrentView('chatRoom');
  };

  const handleSelectMemberForPrivateChat = (member: GroupMember) => {
    setSelectedDirectMember(member);
    setCurrentView('privateChat');
  };

  const activeChatKey =
    currentView === 'privateChat' && selectedDirectMember
      ? `dm_mem_${selectedDirectMember.id}`
      : selectedThread?.id || 'grp-1';

  const currentMessages = allMessages[activeChatKey] || [];

  const handleSendMessage = (attachment?: { fileName: string; fileType: 'pdf' | 'doc' | 'image' }) => {
    if (!inputText.trim() && !attachment) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'you',
      senderName: 'You',
      text: inputText.trim(),
      time: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      attachment,
    };

    const updatedList = [...currentMessages, newMsg];
    const updatedMsgsObj = { ...allMessages, [activeChatKey]: updatedList };
    persistMessages(updatedMsgsObj);

    if (currentView === 'chatRoom' && selectedThread) {
      const updatedThreadsList = threads.map((t) =>
        t.id === selectedThread.id
          ? { ...t, lastMessage: newMsg.text || 'Sent an attachment', time: 'Just now' }
          : t
      );
      persistThreads(updatedThreadsList);
    }

    setInputText('');
  };

  const handleAttachFile = () => {
    Alert.alert('Attach File', 'Select document or file type to send:', [
      {
        text: 'Thesis Paper (PDF)',
        onPress: () =>
          handleSendMessage({
            fileName: 'Chapter3 Methodology Comments.pdf',
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

  // Save Group Name Changes (Educator Modal)
  const handleSaveGroupName = () => {
    if (!selectedThread) return;
    const newName = editGroupNameInput.trim() || selectedThread.studentName;
    const updatedThreadObj = { ...selectedThread, studentName: newName };

    setSelectedThread(updatedThreadObj);
    const updatedThreadsList = threads.map((t) => (t.id === selectedThread.id ? updatedThreadObj : t));
    persistThreads(updatedThreadsList);

    setShowEditGroupNameModal(false);
    Alert.alert('Group Updated', 'Group name has been saved.');
  };

  const handleRemoveGroupNameInput = () => {
    setEditGroupNameInput('');
  };

  const handleHeaderBack = () => {
    if (currentView === 'privateChat') {
      setCurrentView('membersList');
    } else if (currentView === 'membersList') {
      setCurrentView('groupInfo');
    } else if (currentView === 'groupInfo') {
      setCurrentView('chatRoom');
    } else if (currentView === 'chatRoom') {
      setCurrentView('list');
    } else {
      onBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. THREADS / GROUPS GATEWAY LIST */}
      {currentView === 'list' && (
        <View style={{ flex: 1 }}>
          <View style={styles.topHeaderBar}>
            <TouchableOpacity style={styles.headerIconTouch} onPress={onBack}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitleText}>Educator Chat</Text>
              <Text style={styles.headerSubTitleText}>Select student or thesis group</Text>
            </View>
          </View>

          <View style={styles.whiteCardContainer}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              {threads.map((thread) => (
                <TouchableOpacity
                  key={thread.id}
                  style={styles.threadItemCard}
                  activeOpacity={0.8}
                  onPress={() => handleSelectThread(thread)}
                >
                  <Image source={{ uri: thread.avatar }} style={styles.threadAvatarCircle} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.threadNameText}>{thread.studentName}</Text>
                      <Text style={styles.threadTimeText}>{thread.time}</Text>
                    </View>
                    <Text style={styles.threadSubText}>{thread.subtitle}</Text>
                    <Text style={styles.threadLastMsgText} numberOfLines={1}>
                      {thread.lastMessage}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#1E58A8" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* 2. CONVERSATION VIEW (With "i" Info Icon for Groups) */}
      {currentView === 'chatRoom' && selectedThread && (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.topHeaderBar}>
            <TouchableOpacity style={styles.headerIconTouch} onPress={handleHeaderBack}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitleText} numberOfLines={1}>
                {selectedThread.studentName}
              </Text>
              <Text style={styles.headerSubTitleText}>{selectedThread.subtitle}</Text>
            </View>
            <View style={styles.headerRightRow}>
              {/* Show "i" icon if it is a Group Chat */}
              {selectedThread.members && (
                <TouchableOpacity style={styles.headerIconTouch} onPress={() => setCurrentView('groupInfo')}>
                  <Ionicons name="information-circle-outline" size={26} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.whiteCardContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.messagesScrollContainer}
            >
              {currentMessages.map((item) => {
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
                        source={{ uri: item.avatar || selectedThread.avatar }}
                        style={styles.senderAvatarImage}
                      />
                    )}
                    <View style={[styles.bubbleColumn, isYou ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }]}>
                      <Text style={styles.senderLabelText}>{item.senderName}</Text>
                      <View style={[styles.chatBubbleCard, isYou ? styles.youBubbleStyle : styles.studentBubbleStyle]}>
                        {!!item.text && (
                          <Text style={[styles.bubbleMessageText, isYou ? styles.youText : styles.studentText]}>
                            {item.text}
                          </Text>
                        )}
                        {item.attachment && (
                          <View style={styles.attachmentBox}>
                            <Ionicons
                              name={item.attachment.fileType === 'pdf' ? 'document-text' : 'document'}
                              size={20}
                              color={isYou ? '#FFFFFF' : '#1E58A8'}
                            />
                            <Text style={[styles.attachmentNameText, isYou ? styles.youText : { color: '#0F172A' }]}>
                              {item.attachment.fileName}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.timestampText}>{item.time}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

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
              </View>
              <TouchableOpacity style={styles.sendButtonBlue} onPress={() => handleSendMessage()}>
                <Ionicons name="send" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* 3. GROUP DETAILS VIEW (1st Photo Layout) */}
      {currentView === 'groupInfo' && selectedThread && (
        <View style={styles.darkInfoContainer}>
          <View style={styles.darkHeaderBar}>
            <TouchableOpacity onPress={handleHeaderBack}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.darkHeaderTitle}>Group Details</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 28, paddingHorizontal: 20 }}>
            <View style={styles.bigAvatarCircle}>
              <Ionicons name="people-circle" size={110} color="#CBD5E1" />
              <View style={styles.onlineBadgeGreen} />
            </View>

            {/* Tap Group Name to edit (Educator Only) */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.groupNameTouchRow}
              onPress={() => {
                setEditGroupNameInput(selectedThread.studentName);
                setShowEditGroupNameModal(true);
              }}
            >
              <Text style={styles.groupInfoNameText}>{selectedThread.studentName}</Text>
              <Ionicons name="pencil" size={18} color="#94A3B8" style={{ marginLeft: 8 }} />
            </TouchableOpacity>

            <Text style={styles.groupTopicText}>
              Topic: {selectedThread.proposedTopic || 'Academic Research Topic'}
            </Text>

            <View style={styles.addIconCircleBox}>
              <Ionicons name="person-add" size={22} color="#FFFFFF" />
              <Text style={styles.addIconText}>Add</Text>
            </View>

            <Text style={styles.membersCountLabel}>
              {selectedThread.members ? selectedThread.members.length : 0} members
            </Text>

            {/* "See chat members" Option (3rd Photo Trigger) */}
            <TouchableOpacity
              style={styles.seeMembersRowBtn}
              activeOpacity={0.85}
              onPress={() => setCurrentView('membersList')}
            >
              <Ionicons name="people" size={24} color="#FFFFFF" style={{ marginRight: 14 }} />
              <Text style={styles.seeMembersBtnText}>See chat members</Text>
              <Ionicons name="chevron-forward" size={20} color="#64748B" />
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* 4. MEMBERS LIST VIEW (3rd Photo Layout) */}
      {currentView === 'membersList' && selectedThread && (
        <View style={styles.darkInfoContainer}>
          <View style={styles.darkHeaderBar}>
            <TouchableOpacity onPress={handleHeaderBack}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.darkHeaderTitle}>Members</Text>
              <Text style={styles.memberSubCount}>
                {selectedThread.members ? selectedThread.members.length : 0} people
              </Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert('Add Member', 'Option to invite student.')}>
              <Text style={{ color: '#3B82F6', fontWeight: 'bold', fontSize: 16 }}>Add</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
            <Text style={styles.friendsGroupLabel}>Friends</Text>

            {selectedThread.members?.map((member) => (
              <TouchableOpacity
                key={member.id}
                style={styles.memberRowCard}
                activeOpacity={0.85}
                onPress={() => handleSelectMemberForPrivateChat(member)}
              >
                <View style={{ position: 'relative' }}>
                  <Image source={{ uri: member.avatar }} style={styles.memberAvatarImg} />
                  <View style={styles.memberStatusDot} />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={styles.memberNameText}>{member.name}</Text>
                  <Text style={styles.memberUsernameText}>
                    {member.username} {member.isAdmin ? '• Admin' : member.addedBy ? `• Added by ${member.addedBy}` : ''}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 5. PRIVATE DIRECT 1-ON-1 CHAT VIEW */}
      {currentView === 'privateChat' && selectedDirectMember && (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.topHeaderBar}>
            <TouchableOpacity style={styles.headerIconTouch} onPress={handleHeaderBack}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Image
              source={{ uri: selectedDirectMember.avatar }}
              style={{ width: 36, height: 36, borderRadius: 18, marginLeft: 8 }}
            />
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitleText}>{selectedDirectMember.name}</Text>
              <Text style={styles.headerSubTitleText}>Direct Message</Text>
            </View>
          </View>

          <View style={styles.whiteCardContainer}>
            <ScrollView contentContainerStyle={styles.messagesScrollContainer}>
              {currentMessages.map((item) => {
                const isYou = item.sender === 'you';
                return (
                  <View
                    key={item.id}
                    style={[
                      styles.messageRowWrapper,
                      isYou ? styles.youMessageRow : styles.studentMessageRow,
                    ]}
                  >
                    <View style={[styles.bubbleColumn, isYou ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }]}>
                      <View style={[styles.chatBubbleCard, isYou ? styles.youBubbleStyle : styles.studentBubbleStyle]}>
                        <Text style={[styles.bubbleMessageText, isYou ? styles.youText : styles.studentText]}>
                          {item.text}
                        </Text>
                      </View>
                      <Text style={styles.timestampText}>{item.time}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.chatInputBarWrapper}>
              <View style={styles.inputInnerContainer}>
                <TextInput
                  style={styles.textInputStyle}
                  placeholder={`Message ${selectedDirectMember.name}...`}
                  placeholderTextColor="#94A3B8"
                  value={inputText}
                  onChangeText={setInputText}
                  multiline
                />
              </View>
              <TouchableOpacity style={styles.sendButtonBlue} onPress={() => handleSendMessage()}>
                <Ionicons name="send" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* LOWER NAVIGATION BAR */}
      {currentView === 'list' && (
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
      )}

      {/* EDIT GROUP NAME MODAL (2nd Photo Concept - Educator Only) */}
      <Modal visible={showEditGroupNameModal} transparent animationType="fade">
        <View style={styles.darkModalBackdrop}>
          <View style={styles.editModalDarkCard}>
            <Text style={styles.editModalTitleText}>Edit group name</Text>

            <TextInput
              style={styles.editGroupNameInput}
              value={editGroupNameInput}
              onChangeText={setEditGroupNameInput}
              placeholder="Enter group name"
              placeholderTextColor="#64748B"
              autoFocus
            />

            <View style={styles.editModalActionsRow}>
              <TouchableOpacity onPress={handleRemoveGroupNameInput}>
                <Text style={styles.modalBlueBtnText}>Remove</Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', gap: 20 }}>
                <TouchableOpacity onPress={() => setShowEditGroupNameModal(false)}>
                  <Text style={styles.modalBlueBtnText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={handleSaveGroupName}>
                  <Text style={[styles.modalBlueBtnText, { fontWeight: 'bold' }]}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
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
    justifyContent: 'space-between',
  },
  threadItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  threadAvatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  threadNameText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  threadTimeText: {
    fontSize: 11,
    color: '#64748B',
  },
  threadSubText: {
    fontSize: 12,
    color: '#1E58A8',
    marginTop: 2,
  },
  threadLastMsgText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
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
  darkInfoContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  darkHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  darkHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  bigAvatarCircle: {
    position: 'relative',
    marginBottom: 16,
  },
  onlineBadgeGreen: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#22C55E',
    borderWidth: 3,
    borderColor: '#000000',
  },
  groupNameTouchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  groupInfoNameText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  groupTopicText: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 20,
  },
  addIconCircleBox: {
    alignItems: 'center',
    marginBottom: 28,
  },
  addIconText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
  },
  membersCountLabel: {
    alignSelf: 'flex-start',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#94A3B8',
    marginBottom: 12,
  },
  seeMembersRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 14,
  },
  seeMembersBtnText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  memberSubCount: {
    fontSize: 12,
    color: '#94A3B8',
  },
  friendsGroupLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#94A3B8',
    marginBottom: 16,
  },
  memberRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  memberAvatarImg: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  memberStatusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
  },
  memberNameText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  memberUsernameText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  darkModalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  editModalDarkCard: {
    width: '100%',
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
  },
  editModalTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  editGroupNameInput: {
    borderBottomWidth: 2,
    borderBottomColor: '#3B82F6',
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 6,
    marginBottom: 30,
  },
  editModalActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalBlueBtnText: {
    fontSize: 15,
    color: '#38BDF8',
  },
});