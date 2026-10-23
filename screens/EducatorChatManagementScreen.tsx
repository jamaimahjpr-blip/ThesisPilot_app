import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Alert,
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
  { id: 'm1', name: 'Wally Bayola', username: '@wally.bayola', role: 'Member', avatar: 'https://i.pravatar.cc/100?img=1', addedBy: 'educator' },
  { id: 'm2', name: 'Apple David', username: '@apple.david', role: 'Member', avatar: 'https://i.pravatar.cc/100?img=3', addedBy: 'educator' },
  { id: 'm3', name: 'Jesse Pinkman', username: '@jesse.pinkman', role: 'Member', avatar: 'https://i.pravatar.cc/100?img=11', addedBy: 'educator' },
  { id: 'm4', name: 'Sheldon Lee Cooper', username: '@sheldon.lee.cooper', role: 'Member', avatar: 'https://i.pravatar.cc/100?img=8', addedBy: 'educator' },
  { id: 'm5', name: 'Ronald Dela Rosa', username: '@ronald.dela.rosa', role: 'Admin', avatar: 'https://i.pravatar.cc/100?img=5', isAdmin: true },
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
    studentName: 'Wally Bayola',
    subtitle: 'Private Chat',
    avatar: 'https://i.pravatar.cc/100?img=60',
    lastMessage: 'bazinga',
    time: '16:12 PM',
    members:'Wally Bayola',    
  },
  {
    id: 'dm-2',
    studentName: 'Apple David',
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
    { id: '2', sender: 'student', senderName: 'Wally Bayola', text: 'bazinga', time: 'Today, 16:12 PM', avatar: 'https://i.pravatar.cc/100?img=60' },
  ],
  'dm-2': [
    { id: '1', sender: 'student', senderName: 'Apple David', text: 'Thank you for the review, Teach!', time: 'Today, 14:20 PM', avatar: 'https://i.pravatar.cc/100?img=60' },
  ],
};

export default function EducatorChatManagementScreen({
  onBack,
  setEducatorDashView,
}: EducatorChatManagementScreenProps) {
  const [currentView, setCurrentView] = useState<'list' | 'chatRoom' | 'groupInfo' | 'membersList' | 'privateChat'>('list');

  const [threads, setThreads] = useState<StudentThread[]>(DEFAULT_THREADS);
  const [selectedThread, setSelectedThread] = useState<StudentThread | null>(null);
  const [selectedDirectMember, setSelectedDirectMember] = useState<GroupMember | null>(null);

  const [allMessages, setAllMessages] = useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');

  // Edit Group Name Modal
  const [showEditGroupNameModal, setShowEditGroupNameModal] = useState(false);
  const [editGroupNameInput, setEditGroupNameInput] = useState('');

  // Add Member Modal
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberUsername, setNewMemberUsername] = useState('');

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

  const handleMemberPress = (member: GroupMember) => {
    Alert.alert(
      member.name,
      'Educator Action:',
      [
        { text: 'Send Direct Message', onPress: () => { setSelectedDirectMember(member); setCurrentView('privateChat'); } },
        { text: 'Remove from Group', style: 'destructive', onPress: () => handleRemoveMember(member.id) },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleSaveNewMember = () => {
    if (!selectedThread || !newMemberName.trim()) return;
    const currentMembers = selectedThread.members || [];
    const newMemberObj: GroupMember = {
      id: `m_${Date.now()}`,
      name: newMemberName.trim(),
      username: newMemberUsername.trim() || `@${newMemberName.toLowerCase().replace(/\s+/g, '')}`,
      role: 'Member',
      avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 60) + 1}`,
      addedBy: 'Educator',
    };

    const updatedMembers = [...currentMembers, newMemberObj];
    const updatedThread = { ...selectedThread, members: updatedMembers, subtitle: `Group Chat (${updatedMembers.length} members)` };

    setSelectedThread(updatedThread);
    persistThreads(threads.map((t) => (t.id === selectedThread.id ? updatedThread : t)));

    setNewMemberName('');
    setNewMemberUsername('');
    setShowAddMemberModal(false);
    Alert.alert('Success', 'Student added to thesis group.');
  };

  const handleRemoveMember = (memberId: string) => {
    if (!selectedThread || !selectedThread.members) return;
    const updatedMembers = selectedThread.members.filter((m) => m.id !== memberId);
    const updatedThread = { ...selectedThread, members: updatedMembers, subtitle: `Group Chat (${updatedMembers.length} members)` };

    setSelectedThread(updatedThread);
    persistThreads(threads.map((t) => (t.id === selectedThread.id ? updatedThread : t)));
    Alert.alert('Member Removed', 'Student was removed from this group.');
  };

  const activeChatKey = currentView === 'privateChat' && selectedDirectMember
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
    persistMessages({ ...allMessages, [activeChatKey]: updatedList });

    if (currentView === 'chatRoom' && selectedThread) {
      persistThreads(
        threads.map((t) => (t.id === selectedThread.id ? { ...t, lastMessage: newMsg.text || 'Sent an attachment', time: 'Just now' } : t))
      );
    }

    setInputText('');
  };

  const handleSaveGroupName = () => {
    if (!selectedThread) return;
    const newName = editGroupNameInput.trim() || selectedThread.studentName;
    const updatedThreadObj = { ...selectedThread, studentName: newName };

    setSelectedThread(updatedThreadObj);
    persistThreads(threads.map((t) => (t.id === selectedThread.id ? updatedThreadObj : t)));

    setShowEditGroupNameModal(false);
    Alert.alert('Group Updated', 'Group name successfully updated.');
  };

  const handleHeaderBack = () => {
    if (currentView === 'privateChat') setCurrentView('membersList');
    else if (currentView === 'membersList') setCurrentView('groupInfo');
    else if (currentView === 'groupInfo') setCurrentView('chatRoom');
    else if (currentView === 'chatRoom') setCurrentView('list');
    else onBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. THREADS LIST */}
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
                <TouchableOpacity key={thread.id} style={styles.threadItemCard} activeOpacity={0.8} onPress={() => handleSelectThread(thread)}>
                  <Image source={{ uri: thread.avatar }} style={styles.threadAvatarCircle} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.threadNameText}>{thread.studentName}</Text>
                      <Text style={styles.threadTimeText}>{thread.time}</Text>
                    </View>
                    <Text style={styles.threadSubText}>{thread.subtitle}</Text>
                    <Text style={styles.threadLastMsgText} numberOfLines={1}>{thread.lastMessage}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#1E58A8" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* 2. CHAT ROOM */}
      {currentView === 'chatRoom' && selectedThread && (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.topHeaderBar}>
            <TouchableOpacity style={styles.headerIconTouch} onPress={handleHeaderBack}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitleText} numberOfLines={1}>{selectedThread.studentName}</Text>
              <Text style={styles.headerSubTitleText}>{selectedThread.subtitle}</Text>
            </View>
            <View style={styles.headerRightRow}>
              {selectedThread.members && (
                <TouchableOpacity style={styles.headerIconTouch} onPress={() => setCurrentView('groupInfo')}>
                  <Ionicons name="information-circle-outline" size={26} color="#FFFFFF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.whiteCardContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.messagesScrollContainer}>
              {currentMessages.map((item) => {
                const isYou = item.sender === 'you';
                return (
                  <View key={item.id} style={[styles.messageRowWrapper, isYou ? styles.youMessageRow : styles.studentMessageRow]}>
                    {!isYou && <Image source={{ uri: item.avatar || selectedThread.avatar }} style={styles.senderAvatarImage} />}
                    <View style={[styles.bubbleColumn, isYou ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }]}>
                      <Text style={styles.senderLabelText}>{item.senderName}</Text>
                      <View style={[styles.chatBubbleCard, isYou ? styles.youBubbleStyle : styles.studentBubbleStyle]}>
                        <Text style={[styles.bubbleMessageText, isYou ? styles.youText : styles.studentText]}>{item.text}</Text>
                      </View>
                      <Text style={styles.timestampText}>{item.time}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.chatInputBarWrapper}>
              <View style={styles.inputInnerContainer}>
                <TextInput style={styles.textInputStyle} placeholder="Type a message..." placeholderTextColor="#94A3B8" value={inputText} onChangeText={setInputText} multiline />
              </View>
              <TouchableOpacity style={styles.sendButtonBlue} onPress={() => handleSendMessage()}>
                <Ionicons name="send" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* 3. GROUP DETAILS VIEW (DEFAULT THEME) */}
      {currentView === 'groupInfo' && selectedThread && (
        <View style={{ flex: 1 }}>
          <View style={styles.topHeaderBar}>
            <TouchableOpacity style={styles.headerIconTouch} onPress={handleHeaderBack}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitleText}>Group Details</Text>
            </View>
          </View>

          <View style={styles.whiteCardContainer}>
            <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 28, paddingHorizontal: 20 }}>
              <View style={styles.bigAvatarCircle}>
                <Ionicons name="people-circle" size={100} color="#1E58A8" />
                <View style={styles.onlineBadgeGreen} />
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.groupNameTouchRow}
                onPress={() => {
                  setEditGroupNameInput(selectedThread.studentName);
                  setShowEditGroupNameModal(true);
                }}
              >
                <Text style={styles.groupInfoNameText}>{selectedThread.studentName}</Text>
                <Ionicons name="pencil" size={18} color="#1E58A8" style={{ marginLeft: 8 }} />
              </TouchableOpacity>

              <Text style={styles.groupTopicText}>Topic: {selectedThread.proposedTopic || 'Academic Research Topic'}</Text>

              {/* Add Member Button */}
              <TouchableOpacity style={styles.addIconCircleBox} activeOpacity={0.8} onPress={() => setShowAddMemberModal(true)}>
                <View style={styles.plusHumanCircle}>
                  <Ionicons name="person-add" size={22} color="#1E58A8" />
                </View>
                <Text style={styles.addIconText}>Add</Text>
              </TouchableOpacity>

              <Text style={styles.membersCountLabel}>{selectedThread.members ? selectedThread.members.length : 0} members</Text>

              <TouchableOpacity style={styles.seeMembersRowBtn} activeOpacity={0.85} onPress={() => setCurrentView('membersList')}>
                <Ionicons name="people" size={24} color="#1E58A8" style={{ marginRight: 14 }} />
                <Text style={styles.seeMembersBtnText}>See chat members</Text>
                <Ionicons name="chevron-forward" size={20} color="#64748B" />
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      )}

      {/* 4. MEMBERS LIST VIEW */}
      {currentView === 'membersList' && selectedThread && (
        <View style={{ flex: 1 }}>
          <View style={styles.topHeaderBar}>
            <TouchableOpacity style={styles.headerIconTouch} onPress={handleHeaderBack}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitleText}>Members</Text>
              <Text style={styles.headerSubTitleText}>{selectedThread.members ? selectedThread.members.length : 0} people</Text>
            </View>
            <TouchableOpacity onPress={() => setShowAddMemberModal(true)}>
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.whiteCardContainer}>
            <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
              <Text style={styles.friendsGroupLabel}>Friends</Text>

              {selectedThread.members?.map((member) => (
                <TouchableOpacity key={member.id} style={styles.memberRowCard} activeOpacity={0.85} onPress={() => handleMemberPress(member)}>
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
        </View>
      )}

      {/* 5. PRIVATE DIRECT CHAT VIEW */}
      {currentView === 'privateChat' && selectedDirectMember && (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.topHeaderBar}>
            <TouchableOpacity style={styles.headerIconTouch} onPress={handleHeaderBack}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Image source={{ uri: selectedDirectMember.avatar }} style={{ width: 36, height: 36, borderRadius: 18, marginLeft: 8 }} />
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
                  <View key={item.id} style={[styles.messageRowWrapper, isYou ? styles.youMessageRow : styles.studentMessageRow]}>
                    <View style={[styles.bubbleColumn, isYou ? { alignItems: 'flex-end' } : { alignItems: 'flex-start' }]}>
                      <View style={[styles.chatBubbleCard, isYou ? styles.youBubbleStyle : styles.studentBubbleStyle]}>
                        <Text style={[styles.bubbleMessageText, isYou ? styles.youText : styles.studentText]}>{item.text}</Text>
                      </View>
                      <Text style={styles.timestampText}>{item.time}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.chatInputBarWrapper}>
              <View style={styles.inputInnerContainer}>
                <TextInput style={styles.textInputStyle} placeholder={`Message ${selectedDirectMember.name}...`} placeholderTextColor="#94A3B8" value={inputText} onChangeText={setInputText} multiline />
              </View>
              <TouchableOpacity style={styles.sendButtonBlue} onPress={() => handleSendMessage()}>
                <Ionicons name="send" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* ADD MEMBER MODAL */}
      <Modal visible={showAddMemberModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.optionsModalWhiteCard}>
            <Text style={styles.optionsModalTitle}>Add Student to Group</Text>
            <TextInput
              style={styles.modalInputStyle}
              placeholder="Full Name (e.g., Juan Dela Cruz)"
              placeholderTextColor="#94A3B8"
              value={newMemberName}
              onChangeText={setNewMemberName}
            />
            <TextInput
              style={[styles.modalInputStyle, { marginTop: 10 }]}
              placeholder="Username (e.g., @juan.delacruz)"
              placeholderTextColor="#94A3B8"
              value={newMemberUsername}
              onChangeText={setNewMemberUsername}
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity style={[styles.cancelModalBtn, { flex: 1 }]} onPress={() => setShowAddMemberModal(false)}>
                <Text style={styles.cancelModalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveEditBtn} onPress={handleSaveNewMember}>
                <Text style={styles.saveEditBtnText}>Add Student</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* EDIT GROUP NAME MODAL */}
      <Modal visible={showEditGroupNameModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.optionsModalWhiteCard}>
            <Text style={styles.optionsModalTitle}>Edit group name</Text>
            <TextInput style={styles.modalInputStyle} value={editGroupNameInput} onChangeText={setEditGroupNameInput} placeholder="Enter group name" placeholderTextColor="#64748B" autoFocus />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <TouchableOpacity onPress={() => setEditGroupNameInput('')}>
                <Text style={{ color: '#2563EB', fontSize: 14 }}>Remove</Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <TouchableOpacity onPress={() => setShowEditGroupNameModal(false)}>
                  <Text style={{ color: '#64748B', fontSize: 14 }}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSaveGroupName}>
                  <Text style={{ color: '#2563EB', fontWeight: 'bold', fontSize: 14 }}>Save</Text>
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
  container: { flex: 1, backgroundColor: '#1E58A8' },
  topHeaderBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 40 : 52, paddingBottom: 16 },
  headerIconTouch: { padding: 4 },
  headerTitleContainer: { flex: 1, marginLeft: 12 },
  headerTitleText: { fontSize: 18, fontWeight: 'bold', color: '#FFFFFF' },
  headerSubTitleText: { fontSize: 11, color: '#BFDBFE', marginTop: 1 },
  headerRightRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  whiteCardContainer: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 28, borderTopRightRadius: 28, justifyContent: 'space-between' },
  threadItemCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  threadAvatarCircle: { width: 44, height: 44, borderRadius: 22 },
  threadNameText: { fontSize: 15, fontWeight: 'bold', color: '#0F172A' },
  threadTimeText: { fontSize: 11, color: '#64748B' },
  threadSubText: { fontSize: 12, color: '#1E58A8', marginTop: 2 },
  threadLastMsgText: { fontSize: 12, color: '#64748B', marginTop: 4 },
  messagesScrollContainer: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 20 },
  messageRowWrapper: { flexDirection: 'row', marginBottom: 16 },
  youMessageRow: { justifyContent: 'flex-end' },
  studentMessageRow: { justifyContent: 'flex-start' },
  senderAvatarImage: { width: 36, height: 36, borderRadius: 18, marginRight: 10, marginTop: 4 },
  bubbleColumn: { maxWidth: '80%' },
  senderLabelText: { fontSize: 10, color: '#64748B', marginBottom: 3 },
  chatBubbleCard: { borderRadius: 18, paddingHorizontal: 16, paddingVertical: 12 },
  youBubbleStyle: { backgroundColor: '#1E58A8', borderBottomRightRadius: 2 },
  studentBubbleStyle: { backgroundColor: '#334155', borderBottomLeftRadius: 2 },
  bubbleMessageText: { fontSize: 14 },
  youText: { color: '#FFFFFF' },
  studentText: { color: '#FFFFFF' },
  timestampText: { fontSize: 10, color: '#94A3B8', marginTop: 4 },
  chatInputBarWrapper: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#E2E8F0', backgroundColor: '#FFFFFF', gap: 10 },
  inputInnerContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#E0F2FE', borderRadius: 14, paddingHorizontal: 10, paddingVertical: Platform.OS === 'ios' ? 8 : 2 },
  textInputStyle: { flex: 1, fontSize: 13, color: '#000000', maxHeight: 80 },
  sendButtonBlue: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#1E58A8', alignItems: 'center', justifyContent: 'center' },
  bigAvatarCircle: { position: 'relative', marginBottom: 16 },
  onlineBadgeGreen: { position: 'absolute', bottom: 4, right: 4, width: 18, height: 18, borderRadius: 9, backgroundColor: '#22C55E', borderWidth: 2, borderColor: '#FFFFFF' },
  groupNameTouchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  groupInfoNameText: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
  groupTopicText: { fontSize: 13, color: '#64748B', textAlign: 'center', marginBottom: 20 },
  addIconCircleBox: { alignItems: 'center', marginBottom: 24 },
  plusHumanCircle: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  addIconText: { fontSize: 12, color: '#1E58A8', fontWeight: 'bold', marginTop: 4 },
  membersCountLabel: { alignSelf: 'flex-start', fontSize: 14, fontWeight: 'bold', color: '#64748B', marginBottom: 12 },
  seeMembersRowBtn: { flexDirection: 'row', alignItems: 'center', width: '100%', paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  seeMembersBtnText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#0F172A' },
  friendsGroupLabel: { fontSize: 14, fontWeight: 'bold', color: '#64748B', marginBottom: 16 },
  memberRowCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  memberAvatarImg: { width: 44, height: 44, borderRadius: 22 },
  memberStatusDot: { position: 'absolute', bottom: 2, right: 2, width: 10, height: 10, borderRadius: 5, backgroundColor: '#22C55E' },
  memberNameText: { fontSize: 15, fontWeight: 'bold', color: '#0F172A' },
  memberUsernameText: { fontSize: 12, color: '#64748B', marginTop: 2 },
  modalOverlayDark: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  optionsModalWhiteCard: { width: '100%', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, elevation: 10 },
  optionsModalTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 14 },
  modalInputStyle: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 10, fontSize: 14, color: '#0F172A' },
  cancelModalBtn: { paddingVertical: 12, alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8 },
  cancelModalBtnText: { fontSize: 13, fontWeight: 'bold', color: '#475569' },
  saveEditBtn: { flex: 1, backgroundColor: '#1E58A8', paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  saveEditBtnText: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' },
});