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

const STORAGE_GROUPS_KEY = '@thesis_pilot_groups_v3';
const STORAGE_MESSAGES_KEY = '@thesis_pilot_messages_v3';

export interface GroupMember {
  id: string;
  name: string;
  username: string;
  role: string;
  avatar: string;
  addedBy?: string;
  isAdmin?: boolean;
}

export interface GroupItem {
  id: string;
  name: string;
  proposedTopic: string;
  membersCount: number;
  members: GroupMember[];
  lastMessage?: string;
  lastTime?: string;
}

export interface ChatMessage {
  id: string;
  groupId?: string;
  senderName: string;
  avatarUrl?: string;
  text?: string;
  time: string;
  isMe: boolean;
  attachment?: {
    fileName: string;
    fileSize: string;
  };
}

interface ThesisGroupChatScreenProps {
  setStudentDashView?: (view: any) => void;
  setEducatorDashView?: (view: any) => void;
  setIsMenuOpen?: (open: boolean) => void;
  onBackPress?: () => void;
  userRole?: 'Student' | 'Educator';
}

const DEFAULT_MEMBERS: GroupMember[] = [
  { id: 'm1', name: 'Wally Bayola', username: '@wally.bayola', role: 'Member', avatar: 'https://i.pravatar.cc/100?img=1', addedBy: 'educator' },
  { id: 'm2', name: 'Apple David', username: '@apple.david', role: 'Member', avatar: 'https://i.pravatar.cc/100?img=3', addedBy: 'educator' },
  { id: 'm3', name: 'Jesse Pinkman', username: '@jesse.pinkman', role: 'Member', avatar: 'https://i.pravatar.cc/100?img=11', addedBy: 'educator' },
  { id: 'm4', name: 'Sheldon Lee Cooper', username: '@sheldon.lee.cooper', role: 'Member', avatar: 'https://i.pravatar.cc/100?img=8', addedBy: 'educator' },
  { id: 'm5', name: 'Ronal Dela Rosa', username: '@ronald.dela.rosa', role: 'Admin', avatar: 'https://i.pravatar.cc/100?img=5', isAdmin: true },
];

const DEFAULT_GROUPS: GroupItem[] = [
  {
    id: 'grp-1',
    name: "Cooper's Thesis Group",
    proposedTopic: 'AI-Driven Academic Research & Thesis Guidance System',
    membersCount: 5,
    members: DEFAULT_MEMBERS,
    lastMessage: 'quits mna ak guys keri nyu n yn',
    lastTime: 'Today, 14:23 PM',
  },
  {
    id: 'grp-2',
    name: 'Pied Piper AI Group',
    proposedTopic: 'Middle-Out Compression Algorithm for Educational Storage',
    membersCount: 4,
    members: DEFAULT_MEMBERS.slice(0, 4),
    lastMessage: 'Benchmarking results updated in repository.',
    lastTime: 'Yesterday',
  },
];

const INITIAL_GROUP_MESSAGES: ChatMessage[] = [
  { id: 'msg-1', senderName: 'You', text: "Hi guys! Don't forget to submit your parts for Chapter 3. Thank You!", time: 'Today, 11:30 AM', isMe: true },
  { id: 'msg-2', senderName: 'Wally Bayola', avatarUrl: 'https://i.pravatar.cc/100?img=12', text: "Noted! I'll send mine later today.", time: 'Today, 13:43 PM', isMe: false },
  { id: 'msg-3', senderName: 'Apple David', avatarUrl: 'https://i.pravatar.cc/100?img=47', text: "Here's my work. Please review.", time: 'Today, 14:21 PM', isMe: false, attachment: { fileName: 'Chapter 3 Methodology.docx', fileSize: '1.2 MB' } },
  { id: 'msg-4', senderName: 'Ronald "Bato" Dela Rosa', avatarUrl: 'https://i.pravatar.cc/100?img=33', text: 'quits mna ak guys keri nyu n yn', time: 'Today, 14:23 PM', isMe: false },
];

export default function ThesisGroupChatScreen({
  setStudentDashView,
  setEducatorDashView,
  setIsMenuOpen,
  onBackPress,
  userRole = 'Educator',
}: ThesisGroupChatScreenProps) {
  const [currentView, setCurrentView] = useState<'groupList' | 'chatRoom' | 'groupInfo' | 'membersList' | 'privateChat'>('groupList');

  const [groups, setGroups] = useState<GroupItem[]>(DEFAULT_GROUPS);
  const [selectedGroup, setSelectedGroup] = useState<GroupItem | null>(null);
  const [selectedDirectMember, setSelectedDirectMember] = useState<GroupMember | null>(null);

  const [allMessages, setAllMessages] = useState<Record<string, ChatMessage[]>>({
    'grp-1': INITIAL_GROUP_MESSAGES,
  });

  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ fileName: string; fileSize: string } | null>(null);

  // Modals
  const [selectedMsg, setSelectedMsg] = useState<ChatMessage | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editText, setEditText] = useState('');

  const [showEditGroupNameModal, setShowEditGroupNameModal] = useState(false);
  const [editGroupNameInput, setEditGroupNameInput] = useState('');

  // Add Member Modal
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberUsername, setNewMemberUsername] = useState('');

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedGroups = await AsyncStorage.getItem(STORAGE_GROUPS_KEY);
      const savedMsgs = await AsyncStorage.getItem(STORAGE_MESSAGES_KEY);
      if (savedGroups) setGroups(JSON.parse(savedGroups));
      if (savedMsgs) setAllMessages(JSON.parse(savedMsgs));
    } catch (e) {
      console.log('Error loading saved chat data', e);
    }
  };

  const persistGroups = async (updatedGroups: GroupItem[]) => {
    try {
      setGroups(updatedGroups);
      await AsyncStorage.setItem(STORAGE_GROUPS_KEY, JSON.stringify(updatedGroups));
    } catch (e) {
      console.log('Error persisting groups', e);
    }
  };

  const persistMessages = async (updatedMsgs: Record<string, ChatMessage[]>) => {
    try {
      setAllMessages(updatedMsgs);
      await AsyncStorage.setItem(STORAGE_MESSAGES_KEY, JSON.stringify(updatedMsgs));
    } catch (e) {
      console.log('Error persisting messages', e);
    }
  };

  const handleSelectGroup = (group: GroupItem) => {
    setSelectedGroup(group);
    setCurrentView('chatRoom');
  };

  const handleMemberPress = (member: GroupMember) => {
    if (userRole === 'Educator') {
      Alert.alert(
        member.name,
        'Choose action for this group member:',
        [
          { text: 'Send Direct Message', onPress: () => { setSelectedDirectMember(member); setCurrentView('privateChat'); } },
          { text: 'Remove Member', style: 'destructive', onPress: () => handleRemoveMember(member.id) },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
    } else {
      setSelectedDirectMember(member);
      setCurrentView('privateChat');
    }
  };

  const handleAddMemberPress = () => {
    if (userRole === 'Educator') {
      setShowAddMemberModal(true);
    } else {
      Alert.alert('Access Restricted', 'Only educators have permission to add new members to this thesis group.');
    }
  };

  const handleSaveNewMember = () => {
    if (!selectedGroup || !newMemberName.trim()) return;
    const newMemberObj: GroupMember = {
      id: `m_${Date.now()}`,
      name: newMemberName.trim(),
      username: newMemberUsername.trim() || `@${newMemberName.toLowerCase().replace(/\s+/g, '')}`,
      role: 'Member',
      avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 60) + 1}`,
      addedBy: 'Educator',
    };

    const updatedMembers = [...selectedGroup.members, newMemberObj];
    const updatedGroup = { ...selectedGroup, members: updatedMembers, membersCount: updatedMembers.length };

    setSelectedGroup(updatedGroup);
    const updatedGroups = groups.map((g) => (g.id === selectedGroup.id ? updatedGroup : g));
    persistGroups(updatedGroups);

    setNewMemberName('');
    setNewMemberUsername('');
    setShowAddMemberModal(false);
    Alert.alert('Success', 'New member has been added to the group.');
  };

  const handleRemoveMember = (memberId: string) => {
    if (!selectedGroup) return;
    const updatedMembers = selectedGroup.members.filter((m) => m.id !== memberId);
    const updatedGroup = { ...selectedGroup, members: updatedMembers, membersCount: updatedMembers.length };

    setSelectedGroup(updatedGroup);
    const updatedGroups = groups.map((g) => (g.id === selectedGroup.id ? updatedGroup : g));
    persistGroups(updatedGroups);
    Alert.alert('Member Removed', 'Selected member was removed from this group.');
  };

  const activeChatKey = currentView === 'privateChat' && selectedDirectMember
    ? `dm_${selectedDirectMember.id}`
    : selectedGroup?.id || 'grp-1';

  const currentMessages = allMessages[activeChatKey] || [];

  const handleLongPressMsg = (msg: ChatMessage) => {
    setSelectedMsg(msg);
    setShowOptionsModal(true);
  };

  const handleDeleteForMe = () => {
    if (!selectedMsg) return;
    const updatedList = currentMessages.filter((m) => m.id !== selectedMsg.id);
    persistMessages({ ...allMessages, [activeChatKey]: updatedList });
    setShowOptionsModal(false);
    setSelectedMsg(null);
  };

  const handleDeleteForEveryone = () => {
    if (!selectedMsg) return;
    const updatedList = currentMessages.filter((m) => m.id !== selectedMsg.id);
    persistMessages({ ...allMessages, [activeChatKey]: updatedList });
    setShowOptionsModal(false);
    setSelectedMsg(null);
    Alert.alert('Message Deleted', 'This message was deleted for everyone.');
  };

  const handleOpenEdit = () => {
    if (!selectedMsg) return;
    setEditText(selectedMsg.text || '');
    setShowOptionsModal(false);
    setShowEditModal(true);
  };

  const handleSaveEditSubmit = () => {
    if (!selectedMsg || !editText.trim()) return;
    const updatedList = currentMessages.map((m) =>
      m.id === selectedMsg.id ? { ...m, text: editText.trim() } : m
    );
    persistMessages({ ...allMessages, [activeChatKey]: updatedList });
    setShowEditModal(false);
    setSelectedMsg(null);
    setEditText('');
  };

  const handleAttachFile = () => {
    Alert.alert('Attach File', 'Select a document to attach to your chat message:', [
      { text: 'Chapter 3 Methodology.docx', onPress: () => setAttachedFile({ fileName: 'Chapter 3 Methodology.docx', fileSize: '1.2 MB' }) },
      { text: 'Thesis Draft V2.pdf', onPress: () => setAttachedFile({ fileName: 'Thesis_Draft_V2.pdf', fileSize: '12.5 MB' }) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleSendMessage = () => {
    if (!inputText.trim() && !attachedFile) return;

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      groupId: activeChatKey,
      senderName: 'You',
      text: inputText.trim(),
      time: 'Just now',
      isMe: true,
      attachment: attachedFile || undefined,
    };

    const updatedList = [...currentMessages, newMessage];
    persistMessages({ ...allMessages, [activeChatKey]: updatedList });

    if (currentView === 'chatRoom' && selectedGroup) {
      const updatedGroupsList = groups.map((g) =>
        g.id === selectedGroup.id
          ? { ...g, lastMessage: newMessage.text || 'Attached a document', lastTime: 'Just now' }
          : g
      );
      persistGroups(updatedGroupsList);
    }

    setInputText('');
    setAttachedFile(null);
  };

  const handleSaveGroupName = () => {
    if (!selectedGroup) return;
    const newName = editGroupNameInput.trim() || selectedGroup.name;
    const updatedGroupObj = { ...selectedGroup, name: newName };

    setSelectedGroup(updatedGroupObj);
    persistGroups(groups.map((g) => (g.id === selectedGroup.id ? updatedGroupObj : g)));

    setShowEditGroupNameModal(false);
    Alert.alert('Group Updated', 'Group name successfully updated.');
  };

  const handleHeaderBack = () => {
    if (currentView === 'privateChat') setCurrentView('membersList');
    else if (currentView === 'membersList') setCurrentView('groupInfo');
    else if (currentView === 'groupInfo') setCurrentView('chatRoom');
    else if (currentView === 'chatRoom') setCurrentView('groupList');
    else {
      if (onBackPress) onBackPress();
      else if (setIsMenuOpen) setIsMenuOpen(true);
      else if (setStudentDashView) setStudentDashView('main');
      else if (setEducatorDashView) setEducatorDashView('dashboard');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. GROUPS LIST GATEWAY VIEW */}
      {currentView === 'groupList' && (
        <View style={{ flex: 1 }}>
          <View style={styles.topHeader}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={handleHeaderBack}>
              <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Thesis Groups</Text>
              <Text style={styles.headerSubtitle}>Select group to start chat</Text>
            </View>
          </View>

          <View style={styles.whiteCardContainer}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
              {groups.map((grp) => (
                <TouchableOpacity
                  key={grp.id}
                  style={styles.groupCardItem}
                  activeOpacity={0.8}
                  onPress={() => handleSelectGroup(grp)}
                >
                  <View style={styles.groupAvatarBox}>
                    <Ionicons name="people" size={24} color="#1E58A8" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={styles.groupTitleText}>{grp.name}</Text>
                      <Text style={styles.groupTimeText}>{grp.lastTime}</Text>
                    </View>
                    <Text style={styles.groupTopicSubText} numberOfLines={1}>{grp.proposedTopic}</Text>
                    <Text style={styles.groupLastMsgText} numberOfLines={1}>{grp.lastMessage}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* 2. GROUP CHAT ROOM VIEW */}
      {currentView === 'chatRoom' && selectedGroup && (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.topHeader}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={handleHeaderBack}>
              <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle} numberOfLines={1}>{selectedGroup.name}</Text>
              <Text style={styles.headerSubtitle}>{selectedGroup.members.length} members</Text>
            </View>
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => setCurrentView('groupInfo')}>
              <Ionicons name="information-circle-outline" size={26} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.whiteCardContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 12 }}>
              {currentMessages.map((item) => (
                <View key={item.id} style={item.isMe ? styles.sentMsgWrapper : styles.receivedMsgWrapper}>
                  {!item.isMe && (
                    <Image source={{ uri: item.avatarUrl || 'https://via.placeholder.com/100/1E58A8/FFFFFF?text=User' }} style={styles.avatarImage} />
                  )}
                  <View style={{ flex: 1, marginLeft: item.isMe ? 0 : 8, alignItems: item.isMe ? 'flex-end' : 'flex-start' }}>
                    <Text style={item.isMe ? styles.sentSenderText : styles.receivedSenderText}>{item.senderName}</Text>
                    <TouchableOpacity activeOpacity={0.85} onLongPress={() => handleLongPressMsg(item)} style={item.isMe ? styles.sentMsgBubble : styles.receivedMsgBubble}>
                      {item.attachment && (
                        <View style={item.isMe ? styles.sentAttachmentRow : styles.receivedAttachmentRow}>
                          <Ionicons name="document-text" size={20} color="#FFFFFF" />
                          <Text style={{ color: '#FFFFFF', fontWeight: 'bold', marginLeft: 6 }}>{item.attachment.fileName}</Text>
                        </View>
                      )}
                      {item.text ? <Text style={item.isMe ? styles.sentMsgText : styles.receivedMsgText}>{item.text}</Text> : null}
                    </TouchableOpacity>
                    <Text style={item.isMe ? styles.msgTimeTextRight : styles.msgTimeTextLeft}>{item.time}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <View style={styles.inputBarRow}>
              <View style={styles.textInputPillContainer}>
                <TouchableOpacity onPress={handleAttachFile} style={styles.inputInnerBtn}>
                  <Ionicons name="add-circle-outline" size={26} color="#94A3B8" />
                </TouchableOpacity>
                <TextInput style={styles.chatTextInput} placeholder="Type a message..." placeholderTextColor="#94A3B8" value={inputText} onChangeText={setInputText} />
              </View>
              <TouchableOpacity style={styles.sendButtonBlue} activeOpacity={0.8} onPress={handleSendMessage}>
                <Ionicons name="send" size={18} color="#FFFFFF" style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* 3. GROUP INFO VIEW (DEFAULT BLUE HEADER + WHITE CARD) */}
      {currentView === 'groupInfo' && selectedGroup && (
        <View style={{ flex: 1 }}>
          <View style={styles.topHeader}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={handleHeaderBack}>
              <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Group Details</Text>
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
                  if (userRole === 'Educator') {
                    setEditGroupNameInput(selectedGroup.name);
                    setShowEditGroupNameModal(true);
                  } else {
                    Alert.alert('Notice', 'Only educators can edit group info.');
                  }
                }}
              >
                <Text style={styles.groupInfoNameText}>{selectedGroup.name}</Text>
                {userRole === 'Educator' && <Ionicons name="pencil" size={18} color="#1E58A8" style={{ marginLeft: 8 }} />}
              </TouchableOpacity>

              <Text style={styles.groupTopicText}>Topic: {selectedGroup.proposedTopic}</Text>

              {/* Educator Add Member Action Icon */}
              <TouchableOpacity style={styles.addIconCircleBox} activeOpacity={0.8} onPress={handleAddMemberPress}>
                <View style={styles.plusHumanCircle}>
                  <Ionicons name="person-add" size={22} color="#1E58A8" />
                </View>
                <Text style={styles.addIconText}>Add</Text>
              </TouchableOpacity>

              <Text style={styles.membersCountLabel}>{selectedGroup.members.length} members</Text>

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
      {currentView === 'membersList' && selectedGroup && (
        <View style={{ flex: 1 }}>
          <View style={styles.topHeader}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={handleHeaderBack}>
              <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Members</Text>
              <Text style={styles.headerSubtitle}>{selectedGroup.members.length} people</Text>
            </View>
            <TouchableOpacity onPress={handleAddMemberPress}>
              <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 16 }}>Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.whiteCardContainer}>
            <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
              <Text style={styles.friendsGroupLabel}>Friends</Text>

              {selectedGroup.members.map((member) => (
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
          <View style={styles.topHeader}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={handleHeaderBack}>
              <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Image source={{ uri: selectedDirectMember.avatar }} style={{ width: 36, height: 36, borderRadius: 18, marginLeft: 8 }} />
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>{selectedDirectMember.name}</Text>
              <Text style={styles.headerSubtitle}>Direct Message</Text>
            </View>
          </View>

          <View style={styles.whiteCardContainer}>
            <ScrollView contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 12 }}>
              {currentMessages.map((item) => (
                <View key={item.id} style={item.isMe ? styles.sentMsgWrapper : styles.receivedMsgWrapper}>
                  <TouchableOpacity activeOpacity={0.85} onLongPress={() => handleLongPressMsg(item)} style={item.isMe ? styles.sentMsgBubble : styles.receivedMsgBubble}>
                    <Text style={item.isMe ? styles.sentMsgText : styles.receivedMsgText}>{item.text}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <View style={styles.inputBarRow}>
              <View style={styles.textInputPillContainer}>
                <TextInput style={styles.chatTextInput} placeholder={`Message ${selectedDirectMember.name}...`} placeholderTextColor="#94A3B8" value={inputText} onChangeText={setInputText} />
              </View>
              <TouchableOpacity style={styles.sendButtonBlue} activeOpacity={0.8} onPress={handleSendMessage}>
                <Ionicons name="send" size={18} color="#FFFFFF" style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* ADD MEMBER MODAL (Educator Only) */}
      <Modal visible={showAddMemberModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.optionsModalWhiteCard}>
            <Text style={styles.optionsModalTitle}>Add New Group Member</Text>
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
                <Text style={styles.saveEditBtnText}>Add Member</Text>
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

      {/* LONG PRESS MESSAGE OPTIONS MODAL */}
      <Modal visible={showOptionsModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlayDark} activeOpacity={1} onPress={() => setShowOptionsModal(false)}>
          <View style={styles.optionsModalWhiteCard}>
            <Text style={styles.optionsModalTitle}>Message Options</Text>
            {selectedMsg?.isMe ? (
              <>
                <TouchableOpacity style={styles.optionRowBtn} onPress={handleOpenEdit}>
                  <Ionicons name="create-outline" size={20} color="#1E58A8" />
                  <Text style={styles.optionRowText}>Edit Message</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionRowBtn} onPress={handleDeleteForEveryone}>
                  <Ionicons name="trash-outline" size={20} color="#DC2626" />
                  <Text style={[styles.optionRowText, { color: '#DC2626' }]}>Delete for Everyone</Text>
                </TouchableOpacity>
              </>
            ) : null}
            <TouchableOpacity style={styles.optionRowBtn} onPress={handleDeleteForMe}>
              <Ionicons name="trash-bin-outline" size={20} color="#475569" />
              <Text style={styles.optionRowText}>Delete for You</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelModalBtn} onPress={() => setShowOptionsModal(false)}>
              <Text style={styles.cancelModalBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* EDIT MESSAGE MODAL */}
      <Modal visible={showEditModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.optionsModalWhiteCard}>
            <Text style={styles.optionsModalTitle}>Edit Message</Text>
            <TextInput style={styles.editTextInput} value={editText} onChangeText={setEditText} multiline />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <TouchableOpacity style={[styles.cancelModalBtn, { flex: 1 }]} onPress={() => setShowEditModal(false)}>
                <Text style={styles.cancelModalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveEditBtn} onPress={handleSaveEditSubmit}>
                <Text style={styles.saveEditBtnText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#1E58A8', flex: 1 },
  topHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: Platform.OS === 'android' ? 36 : 48, paddingBottom: 14 },
  headerIconBtn: { padding: 4 },
  headerTitleContainer: { flex: 1, marginLeft: 12 },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#FFFFFF' },
  headerSubtitle: { fontSize: 11, color: '#93C5FD', marginTop: 1 },
  whiteCardContainer: { flex: 1, backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, justifyContent: 'space-between' },
  groupCardItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', padding: 14, borderRadius: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  groupAvatarBox: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#EFF6FF', alignItems: 'center', justifyContent: 'center' },
  groupTitleText: { fontSize: 15, fontWeight: 'bold', color: '#0F172A' },
  groupTimeText: { fontSize: 11, color: '#64748B' },
  groupTopicSubText: { fontSize: 12, color: '#1E58A8', marginTop: 2 },
  groupLastMsgText: { fontSize: 12, color: '#64748B', marginTop: 4 },
  sentMsgWrapper: { alignItems: 'flex-end', marginBottom: 14 },
  sentSenderText: { fontSize: 10, color: '#64748B', marginBottom: 3, marginRight: 4 },
  sentMsgBubble: { backgroundColor: '#2563EB', borderRadius: 18, borderBottomRightRadius: 2, paddingHorizontal: 16, paddingVertical: 12, maxWidth: '82%' },
  sentMsgText: { fontSize: 13, color: '#FFFFFF', lineHeight: 18 },
  sentAttachmentRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: 10, padding: 8, marginBottom: 8 },
  msgTimeTextRight: { fontSize: 10, color: '#94A3B8', marginTop: 4, marginRight: 4 },
  receivedMsgWrapper: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  avatarImage: { width: 38, height: 38, borderRadius: 19, marginTop: 16 },
  receivedSenderText: { fontSize: 10, color: '#475569', marginBottom: 3, marginLeft: 4 },
  receivedMsgBubble: { backgroundColor: '#272E3B', borderRadius: 18, borderTopLeftRadius: 2, paddingHorizontal: 16, paddingVertical: 12, maxWidth: '92%' },
  receivedMsgText: { fontSize: 13, color: '#FFFFFF', lineHeight: 18 },
  receivedAttachmentRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3B82F6', borderRadius: 10, padding: 8, marginBottom: 8 },
  msgTimeTextLeft: { fontSize: 10, color: '#94A3B8', marginTop: 4, marginLeft: 4 },
  inputBarRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#F1F5F9', gap: 8 },
  textInputPillContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#E0F2FE', borderRadius: 12, paddingHorizontal: 8, height: 44 },
  inputInnerBtn: { padding: 4 },
  chatTextInput: { flex: 1, fontSize: 13, color: '#0F172A', paddingHorizontal: 8 },
  sendButtonBlue: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
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
  optionRowBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 12 },
  optionRowText: { fontSize: 13, fontWeight: '600', color: '#0F172A' },
  cancelModalBtn: { paddingVertical: 12, alignItems: 'center', marginTop: 8, borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8 },
  cancelModalBtnText: { fontSize: 13, fontWeight: 'bold', color: '#475569' },
  editTextInput: { borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 8, padding: 10, fontSize: 13, color: '#0F172A', minHeight: 80, textAlignVertical: 'top' },
  saveEditBtn: { flex: 1, backgroundColor: '#1E58A8', paddingVertical: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  saveEditBtnText: { fontSize: 13, fontWeight: 'bold', color: '#FFFFFF' },
});