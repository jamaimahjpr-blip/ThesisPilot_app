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
  { id: 'm1', name: 'Angelyn Tandayu', username: '@angelyn.tandayu.73', role: 'Member', avatar: 'https://i.pravatar.cc/100?img=1', addedBy: 'you' },
  { id: 'm2', name: 'ゆき な', username: '@mikaela.garon', role: 'Member', avatar: 'https://i.pravatar.cc/100?img=3', addedBy: 'you' },
  { id: 'm3', name: 'J Delos Reyes', username: '@jessiedelosreyes0905', role: 'Member', avatar: 'https://i.pravatar.cc/100?img=11', addedBy: 'ゆき な' },
  { id: 'm4', name: '結核明', username: '@jie.he.ming', role: 'Member', avatar: 'https://i.pravatar.cc/100?img=8', addedBy: 'ゆき な' },
  { id: 'm5', name: 'Janna Ramirez', username: '@Jana.Ramirez2007', role: 'Admin', avatar: 'https://i.pravatar.cc/100?img=5', isAdmin: true },
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
  {
    id: 'msg-1',
    senderName: 'You',
    text: "Hi guys! Don't forget to submit your parts for Chapter 3. Thank You!",
    time: 'Today, 11:30 AM',
    isMe: true,
  },
  {
    id: 'msg-2',
    senderName: 'Wally Bayola',
    avatarUrl: 'https://i.pravatar.cc/100?img=12',
    text: "Noted! I'll send mine later today.",
    time: 'Today, 13:43 PM',
    isMe: false,
  },
  {
    id: 'msg-3',
    senderName: 'Apple David',
    avatarUrl: 'https://i.pravatar.cc/100?img=47',
    text: "Here's my work. Please review.",
    time: 'Today, 14:21 PM',
    isMe: false,
    attachment: {
      fileName: 'Chapter 3 Methodology.docx',
      fileSize: '1.2 MB',
    },
  },
  {
    id: 'msg-4',
    senderName: 'Ronald "Bato" Dela Rosa',
    avatarUrl: 'https://i.pravatar.cc/100?img=33',
    text: 'quits mna ak guys keri nyu n yn',
    time: 'Today, 14:23 PM',
    isMe: false,
  },
];

export default function ThesisGroupChatScreen({
  setStudentDashView,
  setEducatorDashView,
  setIsMenuOpen,
  onBackPress,
  userRole = 'Educator',
}: ThesisGroupChatScreenProps) {
  // Navigation states: 'groupList' | 'chatRoom' | 'groupInfo' | 'membersList' | 'privateChat'
  const [currentView, setCurrentView] = useState<'groupList' | 'chatRoom' | 'groupInfo' | 'membersList' | 'privateChat'>('groupList');

  const [groups, setGroups] = useState<GroupItem[]>(DEFAULT_GROUPS);
  const [selectedGroup, setSelectedGroup] = useState<GroupItem | null>(null);
  const [selectedDirectMember, setSelectedDirectMember] = useState<GroupMember | null>(null);

  const [allMessages, setAllMessages] = useState<Record<string, ChatMessage[]>>({
    'grp-1': INITIAL_GROUP_MESSAGES,
  });

  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState<{ fileName: string; fileSize: string } | null>(null);

  // Long press options modal states
  const [selectedMsg, setSelectedMsg] = useState<ChatMessage | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editText, setEditText] = useState('');

  // Edit group name modal states (Educator-Only)
  const [showEditGroupNameModal, setShowEditGroupNameModal] = useState(false);
  const [editGroupNameInput, setEditGroupNameInput] = useState('');

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

  const handleSelectMemberForPrivateChat = (member: GroupMember) => {
    setSelectedDirectMember(member);
    setCurrentView('privateChat');
  };

  const activeChatKey =
    currentView === 'privateChat' && selectedDirectMember
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
    const updatedObj = { ...allMessages, [activeChatKey]: updatedList };
    persistMessages(updatedObj);
    setShowOptionsModal(false);
    setSelectedMsg(null);
  };

  const handleDeleteForEveryone = () => {
    if (!selectedMsg) return;
    const updatedList = currentMessages.filter((m) => m.id !== selectedMsg.id);
    const updatedObj = { ...allMessages, [activeChatKey]: updatedList };
    persistMessages(updatedObj);
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
    const updatedObj = { ...allMessages, [activeChatKey]: updatedList };
    persistMessages(updatedObj);
    setShowEditModal(false);
    setSelectedMsg(null);
    setEditText('');
  };

  const handleAttachFile = () => {
    Alert.alert('Attach File', 'Select a document to attach to your chat message:', [
      {
        text: 'Chapter 3 Methodology.docx',
        onPress: () => setAttachedFile({ fileName: 'Chapter 3 Methodology.docx', fileSize: '1.2 MB' }),
      },
      {
        text: 'Thesis Draft V2.pdf',
        onPress: () => setAttachedFile({ fileName: 'Thesis_Draft_V2.pdf', fileSize: '12.5 MB' }),
      },
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
    const updatedObj = { ...allMessages, [activeChatKey]: updatedList };
    persistMessages(updatedObj);

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

  // Educator Edit Group Name Modal Handlers
  const handleSaveGroupName = () => {
    if (!selectedGroup) return;
    const newName = editGroupNameInput.trim() || selectedGroup.name;
    const updatedGroupObj = { ...selectedGroup, name: newName };

    setSelectedGroup(updatedGroupObj);
    const updatedGroupsList = groups.map((g) => (g.id === selectedGroup.id ? updatedGroupObj : g));
    persistGroups(updatedGroupsList);

    setShowEditGroupNameModal(false);
    Alert.alert('Group Updated', 'Group name successfully updated.');
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
      setCurrentView('groupList');
    } else {
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
                    <Text style={styles.groupTopicSubText} numberOfLines={1}>
                      {grp.proposedTopic}
                    </Text>
                    <Text style={styles.groupLastMsgText} numberOfLines={1}>
                      {grp.lastMessage}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* 2. GROUP CHAT ROOM VIEW (With "i" Info Icon) */}
      {currentView === 'chatRoom' && selectedGroup && (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.topHeader}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={handleHeaderBack}>
              <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle} numberOfLines={1}>
                {selectedGroup.name}
              </Text>
              <Text style={styles.headerSubtitle}>{selectedGroup.membersCount} members</Text>
            </View>
            <View style={styles.headerRightActions}>
              {/* "i" INFO ICON */}
              <TouchableOpacity style={styles.headerIconBtn} onPress={() => setCurrentView('groupInfo')}>
                <Ionicons name="information-circle-outline" size={26} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.whiteCardContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 12 }}
            >
              {currentMessages.map((item) => {
                if (item.isMe) {
                  return (
                    <View key={item.id} style={styles.sentMsgWrapper}>
                      <Text style={styles.sentSenderText}>{item.senderName}</Text>
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onLongPress={() => handleLongPressMsg(item)}
                        style={styles.sentMsgBubble}
                      >
                        {item.attachment && (
                          <View style={styles.sentAttachmentRow}>
                            <View style={styles.docIconBox}>
                              <Ionicons name="document-text" size={22} color="#FFFFFF" />
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.attachmentNameTextSent} numberOfLines={1}>
                                {item.attachment.fileName}
                              </Text>
                              <Text style={styles.attachmentSizeTextSent}>{item.attachment.fileSize}</Text>
                            </View>
                          </View>
                        )}
                        {item.text ? <Text style={styles.sentMsgText}>{item.text}</Text> : null}
                      </TouchableOpacity>
                      <Text style={styles.msgTimeTextRight}>{item.time}</Text>
                    </View>
                  );
                }

                return (
                  <View key={item.id} style={styles.receivedMsgWrapper}>
                    <Image
                      source={{
                        uri: item.avatarUrl || 'https://via.placeholder.com/100/1E58A8/FFFFFF?text=User',
                      }}
                      style={styles.avatarImage}
                    />
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.receivedSenderText}>{item.senderName}</Text>
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onLongPress={() => handleLongPressMsg(item)}
                        style={styles.receivedMsgBubble}
                      >
                        {item.attachment && (
                          <View style={styles.receivedAttachmentRow}>
                            <View style={styles.docIconBoxBlue}>
                              <Text style={styles.docxBadgeText}>DOCX</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.attachmentNameTextRec} numberOfLines={1}>
                                {item.attachment.fileName}
                              </Text>
                              <Text style={styles.attachmentSizeTextRec}>{item.attachment.fileSize}</Text>
                            </View>
                          </View>
                        )}
                        {item.text ? <Text style={styles.receivedMsgText}>{item.text}</Text> : null}
                      </TouchableOpacity>
                      <Text style={styles.msgTimeTextLeft}>{item.time}</Text>
                    </View>
                  </View>
                );
              })}
            </ScrollView>

            {attachedFile && (
              <View style={styles.attachedPreviewChip}>
                <Ionicons name="document-attach" size={18} color="#1E58A8" />
                <Text style={styles.attachedPreviewText} numberOfLines={1}>
                  {attachedFile.fileName} ({attachedFile.fileSize})
                </Text>
                <TouchableOpacity onPress={() => setAttachedFile(null)}>
                  <Ionicons name="close-circle" size={18} color="#64748B" />
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.inputBarRow}>
              <View style={styles.textInputPillContainer}>
                <TouchableOpacity onPress={handleAttachFile} style={styles.inputInnerBtn}>
                  <Ionicons name="add-circle-outline" size={26} color="#94A3B8" />
                </TouchableOpacity>
                <TextInput
                  style={styles.chatTextInput}
                  placeholder="Type a message..."
                  placeholderTextColor="#94A3B8"
                  value={inputText}
                  onChangeText={setInputText}
                />
              </View>
              <TouchableOpacity
                style={styles.sendButtonBlue}
                activeOpacity={0.8}
                onPress={handleSendMessage}
              >
                <Ionicons name="send" size={18} color="#FFFFFF" style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      )}

      {/* 3. GROUP INFO VIEW (1st Photo Concept) */}
      {currentView === 'groupInfo' && selectedGroup && (
        <View style={styles.darkInfoContainer}>
          <View style={styles.darkHeaderBar}>
            <TouchableOpacity onPress={handleHeaderBack}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.darkHeaderTitle}>Group Info</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 28, paddingHorizontal: 20 }}>
            <View style={styles.bigAvatarCircle}>
              <Ionicons name="people-circle" size={110} color="#CBD5E1" />
              <View style={styles.onlineBadgeGreen} />
            </View>

            {/* Tap group name to open Edit Modal (Educator-Only) */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.groupNameTouchRow}
              onPress={() => {
                if (userRole === 'Educator') {
                  setEditGroupNameInput(selectedGroup.name);
                  setShowEditGroupNameModal(true);
                } else {
                  Alert.alert('Notice', 'Only the educator can edit group information.');
                }
              }}
            >
              <Text style={styles.groupInfoNameText}>{selectedGroup.name}</Text>
              {userRole === 'Educator' && <Ionicons name="pencil" size={18} color="#94A3B8" style={{ marginLeft: 8 }} />}
            </TouchableOpacity>

            <Text style={styles.groupTopicText}>Topic: {selectedGroup.proposedTopic}</Text>

            <View style={styles.addIconCircleBox}>
              <Ionicons name="person-add" size={22} color="#FFFFFF" />
              <Text style={styles.addIconText}>Add</Text>
            </View>

            <Text style={styles.membersCountLabel}>{selectedGroup.members.length} members</Text>

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

      {/* 4. MEMBERS LIST VIEW (3rd Photo Concept) */}
      {currentView === 'membersList' && selectedGroup && (
        <View style={styles.darkInfoContainer}>
          <View style={styles.darkHeaderBar}>
            <TouchableOpacity onPress={handleHeaderBack}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.darkHeaderTitle}>Members</Text>
              <Text style={styles.memberSubCount}>{selectedGroup.members.length} people</Text>
            </View>
            <TouchableOpacity onPress={() => Alert.alert('Add Member', 'Option to invite student.')}>
              <Text style={{ color: '#3B82F6', fontWeight: 'bold', fontSize: 16 }}>Add</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingTop: 16 }}>
            <Text style={styles.friendsGroupLabel}>Friends</Text>

            {selectedGroup.members.map((member) => (
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
          <View style={styles.topHeader}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={handleHeaderBack}>
              <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Image
              source={{ uri: selectedDirectMember.avatar }}
              style={{ width: 36, height: 36, borderRadius: 18, marginLeft: 8 }}
            />
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>{selectedDirectMember.name}</Text>
              <Text style={styles.headerSubtitle}>Direct Message</Text>
            </View>
          </View>

          <View style={styles.whiteCardContainer}>
            <ScrollView contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 12 }}>
              {currentMessages.map((item) => (
                <View key={item.id} style={item.isMe ? styles.sentMsgWrapper : styles.receivedMsgWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onLongPress={() => handleLongPressMsg(item)}
                    style={item.isMe ? styles.sentMsgBubble : styles.receivedMsgBubble}
                  >
                    <Text style={item.isMe ? styles.sentMsgText : styles.receivedMsgText}>{item.text}</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>

            <View style={styles.inputBarRow}>
              <View style={styles.textInputPillContainer}>
                <TextInput
                  style={styles.chatTextInput}
                  placeholder={`Message ${selectedDirectMember.name}...`}
                  placeholderTextColor="#94A3B8"
                  value={inputText}
                  onChangeText={setInputText}
                />
              </View>
              <TouchableOpacity style={styles.sendButtonBlue} activeOpacity={0.8} onPress={handleSendMessage}>
                <Ionicons name="send" size={18} color="#FFFFFF" style={{ marginLeft: 2 }} />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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

                <TouchableOpacity style={styles.optionRowBtn} onPress={handleDeleteForMe}>
                  <Ionicons name="trash-bin-outline" size={20} color="#475569" />
                  <Text style={styles.optionRowText}>Delete for You</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.optionRowBtn} onPress={handleDeleteForMe}>
                <Ionicons name="trash-bin-outline" size={20} color="#DC2626" />
                <Text style={[styles.optionRowText, { color: '#DC2626' }]}>Delete for You</Text>
              </TouchableOpacity>
            )}

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
            <TextInput
              style={styles.editTextInput}
              value={editText}
              onChangeText={setEditText}
              multiline
            />
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
  container: {
    backgroundColor: '#1E58A8',
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 48,
    paddingBottom: 14,
  },
  headerIconBtn: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#93C5FD',
    marginTop: 1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  whiteCardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    justifyContent: 'space-between',
  },
  groupCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  groupAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  groupTimeText: {
    fontSize: 11,
    color: '#64748B',
  },
  groupTopicSubText: {
    fontSize: 12,
    color: '#1E58A8',
    marginTop: 2,
  },
  groupLastMsgText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  sentMsgWrapper: {
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  sentSenderText: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 3,
    marginRight: 4,
  },
  sentMsgBubble: {
    backgroundColor: '#2563EB',
    borderRadius: 18,
    borderBottomRightRadius: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '82%',
  },
  sentMsgText: {
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  sentAttachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
  },
  docIconBox: {
    marginRight: 8,
  },
  attachmentNameTextSent: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  attachmentSizeTextSent: {
    fontSize: 10,
    color: '#BFDBFE',
    marginTop: 1,
  },
  msgTimeTextRight: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    marginRight: 4,
  },
  receivedMsgWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginTop: 16,
  },
  receivedSenderText: {
    fontSize: 10,
    color: '#475569',
    marginBottom: 3,
    marginLeft: 4,
  },
  receivedMsgBubble: {
    backgroundColor: '#272E3B',
    borderRadius: 18,
    borderTopLeftRadius: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: 'flex-start',
    maxWidth: '92%',
  },
  receivedMsgText: {
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  receivedAttachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
  },
  docIconBoxBlue: {
    width: 32,
    height: 32,
    backgroundColor: '#2563EB',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  docxBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  attachmentNameTextRec: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  attachmentSizeTextRec: {
    fontSize: 10,
    color: '#CBD5E1',
    marginTop: 1,
  },
  msgTimeTextLeft: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    marginLeft: 4,
  },
  attachedPreviewChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 16,
    marginBottom: 6,
    borderRadius: 20,
    gap: 6,
  },
  attachedPreviewText: {
    flex: 1,
    fontSize: 11,
    color: '#1E58A8',
    fontWeight: '600',
  },
  inputBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
  },
  textInputPillContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    paddingHorizontal: 8,
    height: 44,
  },
  inputInnerBtn: {
    padding: 4,
  },
  chatTextInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingHorizontal: 8,
  },
  sendButtonBlue: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
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
  modalOverlayDark: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  optionsModalWhiteCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  optionsModalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 14,
  },
  optionRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  optionRowText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  cancelModalBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
  },
  cancelModalBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
  },
  editTextInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    color: '#0F172A',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveEditBtn: {
    flex: 1,
    backgroundColor: '#1E58A8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveEditBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});