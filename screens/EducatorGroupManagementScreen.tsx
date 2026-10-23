import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface StudentMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email?: string;
}

interface ThesisGroup {
  id: string;
  title: string;
  chapter: string;
  members: StudentMember[];
}

interface ChatMessage {
  id: string;
  sender: 'educator' | 'student';
  text: string;
  time: string;
}

interface EducatorGroupManagementScreenProps {
  onBack?: () => void;
  onOpenChatWithStudent?: (studentName: string) => void;
  setEducatorDashView?: (view: 'dashboard' | 'chat' | 'profile') => void;
}

const STORAGE_GROUPS_KEY = '@educator_persistent_groups_v3';
const STORAGE_CHATS_KEY = '@educator_persistent_chats_v3';

const INITIAL_GROUPS: ThesisGroup[] = [
  {
    id: '1',
    title: "Cooper's Thesis Group",
    chapter: 'Chapter 3: Methodology',
    members: [
      { id: '1', name: 'Wally Bayola', role: 'Student', avatar: 'https://i.pravatar.cc/100?img=12' },
      { id: '2', name: 'Apple David', role: 'Student', avatar: 'https://i.pravatar.cc/100?img=5' },
      { id: '3', name: 'Jesse Pinkman', role: 'Student', avatar: 'https://i.pravatar.cc/100?img=11' },
      { id: '4', name: 'Sheldon Lee Cooper', role: 'Student', avatar: 'https://i.pravatar.cc/100?img=60' },
      { id: '5', name: 'Ronald Dela Rosa', role: 'Student', avatar: 'https://i.pravatar.cc/100?img=9' },
    ],
  },
  {
    id: '2',
    title: 'Pied Piper AI Group',
    chapter: 'Chapter 2: Literature Review',
    members: [
      { id: '6', name: 'Richard Hendricks', role: 'Student', avatar: 'https://i.pravatar.cc/100?img=13' },
    ],
  },
  {
    id: '3',
    title: 'BioTech Health Research',
    chapter: 'Chapter 4: Data Results',
    members: [
      { id: '7', name: 'Penny Hofstadter', role: 'Student', avatar: 'https://i.pravatar.cc/100?img=25' },
    ],
  },
  {
    id: '4',
    title: 'EcoTech Innovations',
    chapter: 'Chapter 1: Proposal',
    members: [
      { id: '8', name: 'Howard Wolowitz', role: 'Student', avatar: 'https://i.pravatar.cc/100?img=33' },
    ],
  },
];

export default function EducatorGroupManagementScreen({
  onBack,
  onOpenChatWithStudent,
  setEducatorDashView,
}: EducatorGroupManagementScreenProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'profile'>('dashboard');

  // Group Data State
  const [groupsList, setGroupsList] = useState<ThesisGroup[]>(INITIAL_GROUPS);
  const [selectedGroup, setSelectedGroup] = useState<ThesisGroup | null>(null);

  // Modals & Navigation Views
  const [showSelectGroupModal, setShowSelectGroupModal] = useState<boolean>(true);
  const [showMemberPenModal, setShowMemberPenModal] = useState<boolean>(false);
  const [selectedMemberForPen, setSelectedMemberForPen] = useState<StudentMember | null>(null);

  // Three Vertical Dots Options & Confirmation Modals
  const [showThreeDotsModal, setShowThreeDotsModal] = useState<boolean>(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState<boolean>(false);

  // Batch Remove Student State
  const [isBatchRemoveMode, setIsBatchRemoveMode] = useState<boolean>(false);
  const [selectedBatchStudentIds, setSelectedBatchStudentIds] = useState<string[]>([]);

  // Add Student Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [newStudentEmail, setNewStudentEmail] = useState<string>('');

  // Create New Group Modal State (NEW)
  const [showCreateGroupModal, setShowCreateGroupModal] = useState<boolean>(false);
  const [newProposedTopic, setNewProposedTopic] = useState<string>('');
  const [newGroupChapter, setNewGroupChapter] = useState<string>('Chapter 1: Proposal');

  // Individual Student Direct Chat Screen & Message State
  const [activeChatStudent, setActiveChatStudent] = useState<StudentMember | null>(null);
  const [chatsMap, setChatsMap] = useState<{ [studentId: string]: ChatMessage[] }>({
    '2': [
      { id: 'm1', sender: 'student', text: 'Good morning adviser! Update on Ch 2 draft.', time: '8:00 AM' },
      { id: 'm2', sender: 'educator', text: 'Good morning Apple, reviewing it now.', time: '8:05 AM' },
    ],
  });
  const [inputChatText, setInputChatText] = useState<string>('');
  const [selectedMsgForAction, setSelectedMsgForAction] = useState<ChatMessage | null>(null);
  const [showMsgOptionModal, setShowMsgOptionModal] = useState<boolean>(false);
  const [isEditingMsg, setIsEditingMsg] = useState<boolean>(false);

  useEffect(() => {
    loadPersistentData();
  }, []);

  const loadPersistentData = async () => {
    try {
      const savedGroups = await AsyncStorage.getItem(STORAGE_GROUPS_KEY);
      if (savedGroups !== null) {
        setGroupsList(JSON.parse(savedGroups));
      }
      const savedChats = await AsyncStorage.getItem(STORAGE_CHATS_KEY);
      if (savedChats !== null) {
        setChatsMap(JSON.parse(savedChats));
      }
    } catch (error) {
      console.log('Failed loading persistent group data:', error);
    }
  };

  const saveGroupsData = async (updatedGroups: ThesisGroup[]) => {
    try {
      setGroupsList(updatedGroups);
      await AsyncStorage.setItem(STORAGE_GROUPS_KEY, JSON.stringify(updatedGroups));
    } catch (error) {
      console.log('Failed saving groups:', error);
    }
  };

  const saveChatsData = async (updatedChats: { [studentId: string]: ChatMessage[] }) => {
    try {
      setChatsMap(updatedChats);
      await AsyncStorage.setItem(STORAGE_CHATS_KEY, JSON.stringify(updatedChats));
    } catch (error) {
      console.log('Failed saving chats:', error);
    }
  };

  // Create Group Handler
  const handleCreateNewGroup = () => {
    if (!newProposedTopic.trim()) {
      Alert.alert('Required', 'Please enter proposed topic title.');
      return;
    }
    const newGroup: ThesisGroup = {
      id: Date.now().toString(),
      title: newProposedTopic.trim(),
      chapter: newGroupChapter.trim() || 'Chapter 1: Proposal',
      members: [],
    };
    const updated = [...groupsList, newGroup];
    saveGroupsData(updated);

    setSelectedGroup(newGroup);
    setNewProposedTopic('');
    setShowCreateGroupModal(false);
    setShowSelectGroupModal(false);
  };

  const handleSelectGroup = (group: ThesisGroup) => {
    setSelectedGroup(group);
    setShowSelectGroupModal(false);
    setIsBatchRemoveMode(false);
    setSelectedBatchStudentIds([]);
  };

  const handleRemoveSingleStudent = () => {
    if (!selectedGroup || !selectedMemberForPen) return;
    const updatedMembers = selectedGroup.members.filter((m) => m.id !== selectedMemberForPen.id);
    const updatedGroup = { ...selectedGroup, members: updatedMembers };
    const updatedGroups = groupsList.map((g) => (g.id === selectedGroup.id ? updatedGroup : g));

    setSelectedGroup(updatedGroup);
    saveGroupsData(updatedGroups);
    setShowMemberPenModal(false);
    setSelectedMemberForPen(null);
  };

  const handleConfirmDeleteGroup = () => {
    if (!selectedGroup) return;
    const updatedGroups = groupsList.filter((g) => g.id !== selectedGroup.id);
    saveGroupsData(updatedGroups);

    setShowDeleteConfirmModal(false);
    setShowThreeDotsModal(false);
    setSelectedGroup(null);
    setShowSelectGroupModal(true);
  };

  const toggleBatchSelectStudent = (id: string) => {
    if (selectedBatchStudentIds.includes(id)) {
      setSelectedBatchStudentIds((prev) => prev.filter((item) => item !== id));
    } else {
      setSelectedBatchStudentIds((prev) => [...prev, id]);
    }
  };

  const handleExecuteBatchDelete = () => {
    if (!selectedGroup) return;
    const updatedMembers = selectedGroup.members.filter((m) => !selectedBatchStudentIds.includes(m.id));
    const updatedGroup = { ...selectedGroup, members: updatedMembers };
    const updatedGroups = groupsList.map((g) => (g.id === selectedGroup.id ? updatedGroup : g));

    setSelectedGroup(updatedGroup);
    saveGroupsData(updatedGroups);
    setIsBatchRemoveMode(false);
    setSelectedBatchStudentIds([]);
  };

  const handleAddStudent = () => {
    if (!newStudentName.trim()) {
      Alert.alert('Required', 'Please enter student name.');
      return;
    }
    if (!selectedGroup) return;

    const newMember: StudentMember = {
      id: Date.now().toString(),
      name: newStudentName.trim(),
      role: 'Student',
      avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 60) + 1}`,
      email: newStudentEmail.trim(),
    };

    const updatedMembers = [...selectedGroup.members, newMember];
    const updatedGroup = { ...selectedGroup, members: updatedMembers };
    const updatedGroups = groupsList.map((g) => (g.id === selectedGroup.id ? updatedGroup : g));

    setSelectedGroup(updatedGroup);
    saveGroupsData(updatedGroups);

    setNewStudentName('');
    setNewStudentEmail('');
    setShowAddModal(false);
  };

  // Chat Handlers
  const handleOpenStudentChat = (student: StudentMember) => {
    if (onOpenChatWithStudent) {
      onOpenChatWithStudent(student.name);
    }
    setActiveChatStudent(student);
    if (!chatsMap[student.id]) {
      const initialMap = {
        ...chatsMap,
        [student.id]: [
          { id: 'c0', sender: 'student', text: `Hello adviser, I am ${student.name}.`, time: '8:00 AM' },
        ],
      };
      saveChatsData(initialMap);
    }
  };

  const handleSendChatMessage = () => {
    if (!inputChatText.trim() || !activeChatStudent) return;

    if (isEditingMsg && selectedMsgForAction) {
      const studentMsgs = chatsMap[activeChatStudent.id] || [];
      const updatedMsgs = studentMsgs.map((m) =>
        m.id === selectedMsgForAction.id ? { ...m, text: inputChatText.trim() } : m
      );
      saveChatsData({ ...chatsMap, [activeChatStudent.id]: updatedMsgs });

      setIsEditingMsg(false);
      setSelectedMsgForAction(null);
      setInputChatText('');
      return;
    }

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'educator',
      text: inputChatText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentMsgs = chatsMap[activeChatStudent.id] || [];
    saveChatsData({ ...chatsMap, [activeChatStudent.id]: [...currentMsgs, newMsg] });
    setInputChatText('');
  };

  const handleDeleteChatMessage = () => {
    if (!selectedMsgForAction || !activeChatStudent) return;
    const currentMsgs = chatsMap[activeChatStudent.id] || [];
    const updatedMsgs = currentMsgs.filter((m) => m.id !== selectedMsgForAction.id);

    saveChatsData({ ...chatsMap, [activeChatStudent.id]: updatedMsgs });
    setShowMsgOptionModal(false);
    setSelectedMsgForAction(null);
  };

  const handleStartEditChatMessage = () => {
    if (!selectedMsgForAction) return;
    setInputChatText(selectedMsgForAction.text);
    setIsEditingMsg(true);
    setShowMsgOptionModal(false);
  };

  if (activeChatStudent) {
    const messages = chatsMap[activeChatStudent.id] || [];
    return (
      <View style={styles.container}>
        <View style={styles.chatHeaderBar}>
          <TouchableOpacity onPress={() => setActiveChatStudent(null)} style={{ padding: 4 }}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Image source={{ uri: activeChatStudent.avatar }} style={styles.chatAvatar} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.chatHeaderTitle}>{activeChatStudent.name}</Text>
            <Text style={styles.chatHeaderSubTitle}>{activeChatStudent.role}</Text>
          </View>
        </View>

        <ScrollView style={styles.chatScrollContainer} contentContainerStyle={{ padding: 16 }}>
          {messages.map((msg) => {
            const isEducator = msg.sender === 'educator';
            return (
              <TouchableOpacity
                key={msg.id}
                activeOpacity={0.85}
                onLongPress={() => {
                  setSelectedMsgForAction(msg);
                  setShowMsgOptionModal(true);
                }}
                style={[
                  styles.msgAlignWrapper,
                  isEducator ? styles.msgAlignRight : styles.msgAlignLeft,
                ]}
              >
                <View style={[styles.msgBox, isEducator ? styles.msgEducatorBg : styles.msgStudentBg]}>
                  <Text style={[styles.msgText, isEducator ? styles.msgEducatorText : styles.msgStudentText]}>
                    {msg.text}
                  </Text>
                  <Text style={[styles.msgTime, isEducator ? styles.msgEducatorTime : styles.msgStudentTime]}>
                    {msg.time}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.chatInputContainer}>
          <TextInput
            style={styles.chatInput}
            placeholder={isEditingMsg ? 'Edit message...' : 'Type a message...'}
            value={inputChatText}
            onChangeText={setInputChatText}
            placeholderTextColor="#94A3B8"
          />
          <TouchableOpacity style={styles.sendIconBtn} onPress={handleSendChatMessage}>
            <Ionicons name={isEditingMsg ? 'checkmark' : 'send'} size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <Modal visible={showMsgOptionModal} transparent animationType="fade">
          <TouchableOpacity
            style={styles.modalOverlayDark}
            activeOpacity={1}
            onPress={() => setShowMsgOptionModal(false)}
          >
            <View style={styles.modalWhiteCard}>
              <Text style={styles.modalHeaderTitle}>Message Options</Text>
              {selectedMsgForAction?.sender === 'educator' && (
                <TouchableOpacity style={styles.optionRowBtn} onPress={handleStartEditChatMessage}>
                  <Ionicons name="pencil-outline" size={20} color="#1E58A8" />
                  <Text style={styles.optionRowText}>Edit</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.optionRowBtn} onPress={handleDeleteChatMessage}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
                <Text style={[styles.optionRowText, { color: '#EF4444' }]}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowMsgOptionModal(false)}>
                <Text style={styles.cancelOutlineBtnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.topHeaderBar}>
        <TouchableOpacity style={styles.headerIconTouch} onPress={() => setShowSelectGroupModal(true)}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectedGroup ? selectedGroup.title : 'Manage Group'}
        </Text>
        <View style={styles.headerRightRow}>
          <TouchableOpacity
            style={styles.plusIconBtn}
            activeOpacity={0.8}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconTouch}
            onPress={() => setShowThreeDotsModal(true)}
          >
            <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.whiteCardContainer}>
        {isBatchRemoveMode && (
          <View style={styles.batchHeaderBar}>
            <Text style={styles.batchHeaderText}>Tap student profile to remove</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={styles.batchCancelBtn} onPress={() => setIsBatchRemoveMode(false)}>
                <Text style={styles.batchCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.batchDeleteBtn} onPress={handleExecuteBatchDelete}>
                <Text style={styles.batchDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 90 }}
        >
          {selectedGroup && selectedGroup.members.length > 0 ? (
            selectedGroup.members.map((student) => {
              const isSelectedForBatch = selectedBatchStudentIds.includes(student.id);
              return (
                <TouchableOpacity
                  key={student.id}
                  activeOpacity={isBatchRemoveMode ? 0.7 : 1}
                  onPress={() => isBatchRemoveMode && toggleBatchSelectStudent(student.id)}
                  style={[
                    styles.studentItemRow,
                    isBatchRemoveMode && isSelectedForBatch && styles.studentRowSelected,
                  ]}
                >
                  <Image source={{ uri: student.avatar }} style={styles.avatarImage} />

                  <View style={styles.studentInfoCol}>
                    <Text style={styles.studentNameText}>{student.name}</Text>
                    <Text style={styles.studentRoleText}>{student.role}</Text>
                  </View>

                  {!isBatchRemoveMode ? (
                    <View style={styles.actionButtonsRow}>
                      <TouchableOpacity
                        style={styles.actionIconBtn}
                        activeOpacity={0.7}
                        onPress={() => handleOpenStudentChat(student)}
                      >
                        <Ionicons name="chatbox-ellipses-outline" size={24} color="#1E58A8" />
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.actionIconBtn}
                        activeOpacity={0.7}
                        onPress={() => {
                          setSelectedMemberForPen(student);
                          setShowMemberPenModal(true);
                        }}
                      >
                        <Ionicons name="pencil-outline" size={22} color="#1E58A8" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <Ionicons
                      name={isSelectedForBatch ? 'checkbox' : 'square-outline'}
                      size={22}
                      color="#1E58A8"
                    />
                  )}
                </TouchableOpacity>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="people-outline" size={48} color="#94A3B8" />
              <Text style={styles.emptyText}>No students in this group.</Text>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.bottomTabContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
          onPress={() => {
            setActiveTab('dashboard');
            if (onBack) onBack();
          }}
        >
          <Ionicons
            name={activeTab === 'dashboard' ? 'home' : 'home-outline'}
            size={24}
            color={activeTab === 'dashboard' ? '#1E58A8' : '#64748B'}
          />
          <Text style={[styles.tabLabelText, activeTab === 'dashboard' && styles.activeTabLabel]}>
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
          onPress={() => {
            setActiveTab('chat');
            if (setEducatorDashView) setEducatorDashView('chat');
          }}
        >
          <Ionicons
            name={activeTab === 'chat' ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'}
            size={24}
            color={activeTab === 'chat' ? '#1E58A8' : '#64748B'}
          />
          <Text style={[styles.tabLabelText, activeTab === 'chat' && styles.activeTabLabel]}>
            Chat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
          onPress={() => {
            setActiveTab('profile');
            if (setEducatorDashView) setEducatorDashView('profile');
          }}
        >
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={24}
            color={activeTab === 'profile' ? '#1E58A8' : '#64748B'}
          />
          <Text style={[styles.tabLabelText, activeTab === 'profile' && styles.activeTabLabel]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* SELECT THESIS GROUP MODAL WITH "+" BUTTON TO CREATE NEW GROUP */}
      <Modal visible={showSelectGroupModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={styles.modalHeaderTitle}>Select Thesis Group</Text>
              <TouchableOpacity
                style={styles.createGroupPlusBtn}
                onPress={() => setShowCreateGroupModal(true)}
              >
                <Ionicons name="add" size={22} color="#1E58A8" />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 280, marginVertical: 10 }}>
              {groupsList.map((group) => {
                const isSelected = selectedGroup?.id === group.id;
                return (
                  <TouchableOpacity
                    key={group.id}
                    style={[styles.groupCardItem, isSelected && styles.groupCardActive]}
                    onPress={() => handleSelectGroup(group)}
                  >
                    <Text style={styles.groupCardTitle}>{group.title}</Text>
                    <Text style={styles.groupCardSub}>{group.chapter}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelOutlineBtn}
              onPress={() => {
                setShowSelectGroupModal(false);
                if (onBack) onBack();
              }}
            >
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CREATE NEW GROUP MODAL */}
      <Modal visible={showCreateGroupModal} transparent animationType="slide">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Create New Thesis Group</Text>

            <Text style={styles.inputLabel}>Proposed Topic / Group Name</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder="e.g. AI Smart Campus Research"
              placeholderTextColor="#94A3B8"
              value={newProposedTopic}
              onChangeText={setNewProposedTopic}
            />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Current Chapter Progress</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder="e.g. Chapter 1: Proposal"
              placeholderTextColor="#94A3B8"
              value={newGroupChapter}
              onChangeText={setNewGroupChapter}
            />

            <TouchableOpacity style={styles.primaryBlueBtn} onPress={handleCreateNewGroup}>
              <Text style={styles.primaryBlueBtnText}>Create Group</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelOutlineBtn}
              onPress={() => setShowCreateGroupModal(false)}
            >
              <Text style={styles.cancelOutlineBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MEMBER PEN OPTIONS MODAL */}
      <Modal visible={showMemberPenModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlayDark}
          activeOpacity={1}
          onPress={() => setShowMemberPenModal(false)}
        >
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Options for {selectedMemberForPen?.name}</Text>
            <TouchableOpacity style={styles.optionRowBtn} onPress={handleRemoveSingleStudent}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text style={[styles.optionRowText, { color: '#EF4444' }]}>Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowMemberPenModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* THREE DOTS MODAL */}
      <Modal visible={showThreeDotsModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlayDark}
          activeOpacity={1}
          onPress={() => setShowThreeDotsModal(false)}
        >
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Group Options</Text>
            <TouchableOpacity
              style={styles.optionRowBtn}
              onPress={() => {
                setShowThreeDotsModal(false);
                setShowDeleteConfirmModal(true);
              }}
            >
              <Ionicons name="trash-bin-outline" size={20} color="#EF4444" />
              <Text style={[styles.optionRowText, { color: '#EF4444' }]}>Delete Group</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionRowBtn}
              onPress={() => {
                setShowThreeDotsModal(false);
                setIsBatchRemoveMode(true);
              }}
            >
              <Ionicons name="person-remove-outline" size={20} color="#1E58A8" />
              <Text style={styles.optionRowText}>Remove Student</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowThreeDotsModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* DELETE GROUP CONFIRMATION MODAL */}
      <Modal visible={showDeleteConfirmModal} transparent animationType="fade">
        <View style={styles.modalOverlayDarkBlur}>
          <View style={styles.deleteBlueCard}>
            <Text style={styles.deleteCardTitle}>Delete Group</Text>
            <Text style={styles.deleteCardSubtitle}>
              Are you sure you want to delete this group? All members and progress will be removed.
            </Text>
            <View style={styles.deleteActionsRow}>
              <TouchableOpacity
                style={styles.deleteCancelBtn}
                onPress={() => setShowDeleteConfirmModal(false)}
              >
                <Text style={styles.deleteCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteConfirmBtn} onPress={handleConfirmDeleteGroup}>
                <Text style={styles.deleteConfirmText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ADD STUDENT MODAL */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Add Student to Group</Text>

            <Text style={styles.inputLabel}>Student Name</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder="e.g. John Doe"
              placeholderTextColor="#94A3B8"
              value={newStudentName}
              onChangeText={setNewStudentName}
            />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Student Email (Optional)</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder="e.g. student@tip.edu.ph"
              placeholderTextColor="#94A3B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={newStudentEmail}
              onChangeText={setNewStudentEmail}
            />

            <TouchableOpacity style={styles.primaryBlueBtn} onPress={handleAddStudent}>
              <Text style={styles.primaryBlueBtnText}>Add Student</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowAddModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E58A8',
    flex: 1,
  },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 52,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 12,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  plusIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIconTouch: {
    padding: 4,
  },
  whiteCardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
  },
  studentItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  studentRowSelected: {
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingHorizontal: 8,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  studentInfoCol: {
    flex: 1,
    marginLeft: 14,
  },
  studentNameText: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#000000',
  },
  studentRoleText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#64748B',
    marginTop: 2,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionIconBtn: {
    padding: 6,
  },
  batchHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  batchHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  batchCancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 6,
  },
  batchCancelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
  },
  batchDeleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EF4444',
    borderRadius: 6,
  },
  batchDeleteText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 10,
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
  },
  createGroupPlusBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  groupCardItem: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  groupCardActive: {
    borderColor: '#1E58A8',
    backgroundColor: '#EFF6FF',
  },
  groupCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  groupCardSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  optionRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  optionRowText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    marginLeft: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 6,
  },
  textInputStyle: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000000',
  },
  primaryBlueBtn: {
    backgroundColor: '#1E58A8',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 18,
  },
  primaryBlueBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
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
  modalOverlayDarkBlur: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  deleteBlueCard: {
    width: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    elevation: 10,
  },
  deleteCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  deleteCardSubtitle: {
    fontSize: 13,
    color: '#E0F2FE',
    textAlign: 'center',
    marginBottom: 18,
  },
  deleteActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    gap: 16,
  },
  deleteCancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  deleteCancelText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteConfirmBtn: {
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteConfirmText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  chatHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E58A8',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 52,
    paddingBottom: 14,
  },
  chatAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginLeft: 8,
  },
  chatHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  chatHeaderSubTitle: {
    fontSize: 11,
    color: '#E0F2FE',
  },
  chatScrollContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  msgAlignWrapper: {
    marginBottom: 10,
    maxWidth: '80%',
  },
  msgAlignRight: {
    alignSelf: 'flex-end',
  },
  msgAlignLeft: {
    alignSelf: 'flex-start',
  },
  msgBox: {
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  msgEducatorBg: {
    backgroundColor: '#1E58A8',
    borderBottomRightRadius: 2,
  },
  msgStudentBg: {
    backgroundColor: '#E2E8F0',
    borderBottomLeftRadius: 2,
  },
  msgText: {
    fontSize: 14,
    lineHeight: 20,
  },
  msgEducatorText: {
    color: '#FFFFFF',
  },
  msgStudentText: {
    color: '#0F172A',
  },
  msgTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  msgEducatorTime: {
    color: '#BFDBFE',
  },
  msgStudentTime: {
    color: '#64748B',
  },
  chatInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0F172A',
    marginRight: 8,
  },
  sendIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1E58A8',
    alignItems: 'center',
    justifyContent: 'center',
  },
});