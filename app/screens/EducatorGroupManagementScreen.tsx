import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface StudentMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email?: string;
}

interface EducatorGroupManagementScreenProps {
  onBack?: () => void;
  onOpenChatWithStudent?: (studentName: string) => void;
  setEducatorDashView?: (view: 'dashboard' | 'chat' | 'profile') => void;
}

export default function EducatorGroupManagementScreen({
  onBack,
  onOpenChatWithStudent,
  setEducatorDashView,
}: EducatorGroupManagementScreenProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'profile'>('dashboard');

  // Student Group List State
  const [groupMembers, setGroupMembers] = useState<StudentMember[]>([
    { id: '1', name: 'Wally Bayola', role: 'Student', avatar: 'https://i.pravatar.cc/100?img=12' },
    { id: '2', name: 'Apple David', role: 'Student', avatar: 'https://i.pravatar.cc/100?img=5' },
    { id: '3', name: 'Jesse Pinkman', role: 'Student', avatar: 'https://i.pravatar.cc/100?img=11' },
    { id: '4', name: 'Sheldon Lee Cooper', role: 'Student', avatar: 'https://i.pravatar.cc/100?img=60' },
    { id: '5', name: 'Ronald Dela Rosa', role: 'Student', avatar: 'https://i.pravatar.cc/100?img=9' },
  ]);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');

  // Edit Modal State
  const [editingStudent, setEditingStudent] = useState<StudentMember | null>(null);
  const [editName, setEditName] = useState('');

  const handleAddStudent = () => {
    if (!newStudentName.trim()) {
      Alert.alert('Required', 'Please enter student name.');
      return;
    }
    const newMember: StudentMember = {
      id: Date.now().toString(),
      name: newStudentName.trim(),
      role: 'Student',
      avatar: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}`,
      email: newStudentEmail.trim(),
    };
    setGroupMembers([...groupMembers, newMember]);
    setNewStudentName('');
    setNewStudentEmail('');
    setShowAddModal(false);
    Alert.alert('Success', `${newMember.name} has been added to the thesis group.`);
  };

  const handleSaveEdit = () => {
    if (!editingStudent || !editName.trim()) return;
    setGroupMembers(
      groupMembers.map((m) =>
        m.id === editingStudent.id ? { ...m, name: editName.trim() } : m
      )
    );
    setEditingStudent(null);
    Alert.alert('Updated', 'Student information updated successfully.');
  };

  const handleDeleteStudent = (id: string) => {
    Alert.alert('Remove Student', 'Are you sure you want to remove this student from the group?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setGroupMembers(groupMembers.filter((m) => m.id !== id));
          setEditingStudent(null);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* TOP BAR / HEADER */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity style={styles.headerIconTouch} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Group</Text>
        <View style={styles.headerRightRow}>
          {/* + SIGN BUTTON TO ADD STUDENTS TO GROUP */}
          <TouchableOpacity
            style={styles.plusIconBtn}
            activeOpacity={0.8}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconTouch}>
            <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* MAIN WHITE CARD CONTAINER */}
      <View style={styles.whiteCardContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 90 }}
        >
          {groupMembers.map((student) => (
            <View key={student.id} style={styles.studentItemRow}>
              {/* Avatar Circle */}
              <Image source={{ uri: student.avatar }} style={styles.avatarImage} />
              
              {/* Student Details */}
              <View style={styles.studentInfoCol}>
                <Text style={styles.studentNameText}>{student.name}</Text>
                <Text style={styles.studentRoleText}>{student.role}</Text>
              </View>

              {/* Action Buttons: Chat & Edit */}
              <View style={styles.actionButtonsRow}>
                {/* Chat Bubble Icon */}
                <TouchableOpacity
                  style={styles.actionIconBtn}
                  activeOpacity={0.7}
                  onPress={() => {
                    if (onOpenChatWithStudent) {
                      onOpenChatWithStudent(student.name);
                    } else {
                      Alert.alert('Chat', `Opening direct message with ${student.name}...`);
                    }
                  }}
                >
                  <Ionicons name="chatbox-ellipses-outline" size={24} color="#1E58A8" />
                </TouchableOpacity>

                {/* Edit Pencil Icon */}
                <TouchableOpacity
                  style={styles.actionIconBtn}
                  activeOpacity={0.7}
                  onPress={() => {
                    setEditingStudent(student);
                    setEditName(student.name);
                  }}
                >
                  <Ionicons name="pencil-outline" size={22} color="#1E58A8" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* LOWER NAVIGATOR */}
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
          <Text
            style={[
              styles.tabLabelText,
              activeTab === 'dashboard' && styles.activeTabLabel,
            ]}
          >
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
          <Text
            style={[
              styles.tabLabelText,
              activeTab === 'chat' && styles.activeTabLabel,
            ]}
          >
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
          <Text
            style={[
              styles.tabLabelText,
              activeTab === 'profile' && styles.activeTabLabel,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>

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
            <Text style={[styles.inputLabel, { marginTop: 12 }]}>
              Student Email (Optional)
            </Text>
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
            <TouchableOpacity
              style={styles.cancelOutlineBtn}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.cancelOutlineBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* EDIT STUDENT MODAL */}
      <Modal visible={!!editingStudent} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Edit Student Details</Text>
            <Text style={styles.inputLabel}>Student Name</Text>
            <TextInput
              style={styles.textInputStyle}
              value={editName}
              onChangeText={setEditName}
            />
            <TouchableOpacity style={styles.primaryBlueBtn} onPress={handleSaveEdit}>
              <Text style={styles.primaryBlueBtnText}>Save Changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dangerOutlineBtn}
              onPress={() =>
                editingStudent && handleDeleteStudent(editingStudent.id)
              }
            >
              <Text style={styles.dangeroutlineBtnText}>
                Remove Student from Group
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelOutlineBtn}
              onPress={() => setEditingStudent(null)}
            >
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
    backgroundColor: '#3B82F6',
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
  dangerOutlineBtn: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  dangeroutlineBtnText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 13,
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