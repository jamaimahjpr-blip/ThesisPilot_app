import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export interface MeetingItem {
  id: string;
  title: string;
  month: string;
  day: string;
  fullDate: string;
  time: string;
  scheduledBy: string;
  groupName?: string;
  meetLink?: string;
  status: 'upcoming' | 'concluded';
  summaryNotes?: string;
}

interface EducatorMeetingsScreenProps {
  onBack: () => void;
  setEducatorDashView?: (view: 'dashboard' | 'chat' | 'profile') => void;
  initialTab?: 'Upcoming' | 'Concluded';
}

export default function EducatorMeetingsScreen({
  onBack,
  setEducatorDashView,
  initialTab = 'Upcoming',
}: EducatorMeetingsScreenProps) {
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'Concluded'>(initialTab);

  // Sample Meetings List
  const [meetingsList, setMeetingsList] = useState<MeetingItem[]>([
    // UPCOMING MEETINGS
    {
      id: '1',
      title: 'Adviser Consultation',
      month: 'MAY',
      day: '19',
      fullDate: 'Saturday, May 18, 2026',
      time: '10:00 AM 11:00 AM',
      scheduledBy: 'Scheduled by you',
      groupName: "with Cooper's Thesis Group",
      meetLink: 'https://meet.google.com/abc-defg-hij',
      status: 'upcoming',
    },
    {
      id: '2',
      title: 'System Review Meeting',
      month: 'MAY',
      day: '25',
      fullDate: 'Saturday, May 25, 2026',
      time: '2:00 PM 3:00 PM',
      scheduledBy: 'Scheduled by you',
      groupName: "with Cooper's Thesis Group",
      meetLink: 'https://meet.google.com/xyz-uvwx-rst',
      status: 'upcoming',
    },
    {
      id: '3',
      title: 'Pre-Final Defense',
      month: 'JUN',
      day: '01',
      fullDate: 'Saturday, June 01, 2026',
      time: '1:00 PM 2:00 PM',
      scheduledBy: 'Scheduled by you',
      groupName: "with Cooper's Thesis Group",
      meetLink: 'https://meet.google.com/mno-pqrs-tuv',
      status: 'upcoming',
    },
    // CONCLUDED MEETINGS
    {
      id: '101',
      title: 'Chapter 1 Review',
      month: 'APR',
      day: '25',
      fullDate: 'Friday, April 25, 2026',
      time: '10:00 AM 11:00 AM',
      scheduledBy: 'Scheduled by you',
      groupName: "with Cooper's Thesis Group",
      status: 'concluded',
      summaryNotes: 'Students need to revise background of the study and extend the scope and limitation.',
    },
    {
      id: '102',
      title: 'Research Title Approval',
      month: 'APR',
      day: '10',
      fullDate: 'Thursday, April 10, 2026',
      time: '2:00 PM - 3:00 PM',
      scheduledBy: 'Scheduled by you',
      groupName: "with Cooper's Thesis Group",
      status: 'concluded',
      summaryNotes: 'Title Option 2 was approved. Proceed to Chapter 1 preparation.',
    },
    {
      id: '103',
      title: 'Proposal Discussion',
      month: 'MAR',
      day: '28',
      fullDate: 'Friday, March 28, 2026',
      time: '1:00 PM 2:00 PM',
      scheduledBy: 'Scheduled by you',
      groupName: "with Cooper's Thesis Group",
      status: 'concluded',
      summaryNotes: 'Initial proposal concept reviewed and accepted.',
    },
  ]);

  // Modal Control States
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<MeetingItem | null>(null);
  const [summaryModalMeeting, setSummaryModalMeeting] = useState<MeetingItem | null>(null);

  // Form Inputs
  const [titleInput, setTitleInput] = useState('');
  const [monthInput, setMonthInput] = useState('MAY');
  const [dayInput, setDayInput] = useState('20');
  const [fullDateInput, setFullDateInput] = useState('Wednesday, May 20, 2026');
  const [timeInput, setTimeInput] = useState('10:00 AM 11:00 AM');
  const [meetLinkInput, setMeetLinkInput] = useState('');
  const [summaryNotesInput, setSummaryNotesInput] = useState('');

  // Open Google Meet Link
  const handleOpenMeet = (link?: string) => {
    if (!link) {
      Alert.alert('No Link', 'Google Meet link is missing.');
      return;
    }
    Linking.openURL(link).catch(() => {
      Alert.alert('Error', 'Could not open the Google Meet link.');
    });
  };

  // Add Meeting
  const handleCreateMeeting = () => {
    if (!titleInput.trim()) {
      Alert.alert('Required', 'Please enter a meeting title.');
      return;
    }
    const newMeeting: MeetingItem = {
      id: Date.now().toString(),
      title: titleInput.trim(),
      month: monthInput.trim().toUpperCase() || 'MAY',
      day: dayInput.trim() || '20',
      fullDate: fullDateInput.trim() || 'May 20, 2026',
      time: timeInput.trim() || '10:00 AM 11:00 AM',
      scheduledBy: 'Scheduled by you',
      groupName: "with Cooper's Thesis Group",
      meetLink: meetLinkInput.trim() || 'https://meet.google.com/new-room-link',
      status: 'upcoming',
    };
    setMeetingsList([newMeeting, ...meetingsList]);
    setShowAddModal(false);
    resetForm();
    Alert.alert('Success', 'New meeting scheduled.');
  };

  // Save Edit Meeting
  const handleSaveEdit = () => {
    if (!editingMeeting || !titleInput.trim()) return;
    setMeetingsList(
      meetingsList.map((m) =>
        m.id === editingMeeting.id
          ? {
              ...m,
              title: titleInput.trim(),
              month: monthInput.trim().toUpperCase() || m.month,
              day: dayInput.trim() || m.day,
              fullDate: fullDateInput.trim() || m.fullDate,
              time: timeInput.trim() || m.time,
              meetLink: meetLinkInput.trim() || m.meetLink,
            }
          : m
      )
    );
    setEditingMeeting(null);
    resetForm();
    Alert.alert('Updated', 'Meeting schedule saved.');
  };

  // Save Summary Notes for Concluded Meeting
  const handleSaveSummaryNotes = () => {
    if (!summaryModalMeeting) return;
    setMeetingsList(
      meetingsList.map((m) =>
        m.id === summaryModalMeeting.id
          ? { ...m, summaryNotes: summaryNotesInput.trim() }
          : m
      )
    );
    setSummaryModalMeeting(null);
    Alert.alert('Saved', 'Summary notes updated successfully.');
  };

  // Remove Meeting Item
  const handleRemoveMeeting = (id: string) => {
    Alert.alert('Remove Meeting', 'Are you sure you want to remove this meeting record?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          setMeetingsList(meetingsList.filter((m) => m.id !== id));
        },
      },
    ]);
  };

  const handleOpenEditModal = (item: MeetingItem) => {
    setEditingMeeting(item);
    setTitleInput(item.title);
    setMonthInput(item.month);
    setDayInput(item.day);
    setFullDateInput(item.fullDate);
    setTimeInput(item.time);
    setMeetLinkInput(item.meetLink || '');
  };

  const handleOpenSummaryModal = (item: MeetingItem) => {
    setSummaryModalMeeting(item);
    setSummaryNotesInput(item.summaryNotes || '');
  };

  const resetForm = () => {
    setTitleInput('');
    setMonthInput('MAY');
    setDayInput('20');
    setFullDateInput('Wednesday, May 20, 2026');
    setTimeInput('10:00 AM 11:00 AM');
    setMeetLinkInput('');
  };

  const filteredMeetings = meetingsList.filter((m) =>
    activeTab === 'Upcoming' ? m.status === 'upcoming' : m.status === 'concluded'
  );

  return (
    <View style={styles.container}>
      {/* TOP HEADER BAR */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity style={styles.headerIconTouch} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Meetings</Text>
        <View style={styles.headerRightRow}>
          {activeTab === 'Upcoming' && (
            <TouchableOpacity
              style={styles.addPlusBtnHeader}
              onPress={() => {
                resetForm();
                setShowAddModal(true);
              }}
            >
              <Ionicons name="add" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.headerIconTouch}>
            <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* MAIN WHITE CARD CONTAINER */}
      <View style={styles.whiteCardContainerGroup}>
        {/* TAB SWITCHER */}
        <View style={styles.tabSwitcherContainer}>
          <TouchableOpacity
            style={[styles.switcherTabBtn, activeTab === 'Upcoming' && styles.switcherActiveTabBtn]}
            onPress={() => setActiveTab('Upcoming')}
          >
            <Text
              style={[styles.switcherTabText, activeTab === 'Upcoming' && styles.switcherActiveTabText]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.switcherTabBtn, activeTab === 'Concluded' && styles.switcherActiveTabBtn]}
            onPress={() => setActiveTab('Concluded')}
          >
            <Text
              style={[styles.switcherTabText, activeTab === 'Concluded' && styles.switcherActiveTabText]}
            >
              Concluded
            </Text>
          </TouchableOpacity>
        </View>

        {/* MEETINGS LIST */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
          {filteredMeetings.length === 0 ? (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ fontSize: 13, color: '#94A3B8', fontStyle: 'italic' }}>
                No {activeTab.toLowerCase()} meetings found.
              </Text>
            </View>
          ) : (
            filteredMeetings.map((item) => (
              <View key={item.id} style={styles.meetingCardItem}>
                {/* DATE BADGE */}
                <View style={styles.dateBadgeBox}>
                  <Text style={styles.dateBadgeMonthText}>{item.month}</Text>
                  <Text style={styles.dateBadgeDayText}>{item.day}</Text>
                </View>

                {/* MEETING INFO */}
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.meetingTitleText}>{item.title}</Text>
                  <Text style={styles.meetingDateText}>{item.fullDate}</Text>
                  <Text style={styles.meetingTimeText}>{item.time}</Text>
                  <Text style={styles.meetingSubText}>{item.groupName || item.scheduledBy}</Text>

                  {/* BUTTON ACTIONS FOR UPCOMING VS CONCLUDED */}
                  <View style={styles.cardActionsRow}>
                    {activeTab === 'Upcoming' ? (
                      <>
                        <TouchableOpacity
                          style={styles.actionBtnOutline}
                          activeOpacity={0.7}
                          onPress={() => handleOpenMeet(item.meetLink)}
                        >
                          <Ionicons name="videocam" size={18} color="#22C55E" style={{ marginRight: 6 }} />
                          <Text style={styles.actionBtnTextBlue}>Host</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionBtnOutline}
                          activeOpacity={0.7}
                          onPress={() => handleOpenEditModal(item)}
                        >
                          <Text style={styles.actionBtnTextBlue}>Edit</Text>
                        </TouchableOpacity>
                      </>
                    ) : (
                      <>
                        <TouchableOpacity
                          style={styles.actionBtnOutline}
                          activeOpacity={0.7}
                          onPress={() => handleOpenSummaryModal(item)}
                        >
                          <Ionicons name="document-text-outline" size={16} color="#1E58A8" style={{ marginRight: 4 }} />
                          <Text style={styles.actionBtnTextBlue}>View Summary</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.actionBtnOutline}
                          activeOpacity={0.7}
                          onPress={() => handleRemoveMeeting(item.id)}
                        >
                          <Text style={styles.actionBtnTextRed}>Remove</Text>
                        </TouchableOpacity>
                      </>
                    )}
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* LOWER NAVIGATOR */}
      <View style={styles.bottomTabContainer}>
        <TouchableOpacity style={styles.tabButton} activeOpacity={0.7} onPress={onBack}>
          <Ionicons name="home" size={24} color="#1E58A8" />
          <Text style={[styles.tabLabelText, styles.activeTabLabel]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
          onPress={() => {
            if (setEducatorDashView) setEducatorDashView('chat');
          }}
        >
          <Ionicons name="chatbox-ellipses-outline" size={24} color="#64748B" />
          <Text style={styles.tabLabelText}>Chat</Text>
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

      {/* ADD / EDIT MEETING MODAL */}
      <Modal visible={showAddModal || !!editingMeeting} transparent animationType="slide">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>
              {editingMeeting ? 'Edit Scheduled Meeting' : 'Schedule New Meeting'}
            </Text>
            <Text style={styles.inputLabel}>Meeting / Defense Title</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder="e.g. Pre-Final Defense / Consultation"
              placeholderTextColor="#94A3B8"
              value={titleInput}
              onChangeText={setTitleInput}
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Month (e.g. MAY)</Text>
                <TextInput
                  style={styles.textInputStyle}
                  placeholder="MAY"
                  value={monthInput}
                  onChangeText={setMonthInput}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Day (e.g. 19)</Text>
                <TextInput
                  style={styles.textInputStyle}
                  placeholder="19"
                  keyboardType="numeric"
                  value={dayInput}
                  onChangeText={setDayInput}
                />
              </View>
            </View>
            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Full Date String</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder="e.g. Saturday, May 18, 2026"
              placeholderTextColor="#94A3B8"
              value={fullDateInput}
              onChangeText={setFullDateInput}
            />
            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Time Schedule</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder="e.g. 10:00 AM - 11:00 AM"
              placeholderTextColor="#94A3B8"
              value={timeInput}
              onChangeText={setTimeInput}
            />
            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Google Meet Room Link</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder="https://meet.google.com/..."
              placeholderTextColor="#94A3B8"
              value={meetLinkInput}
              onChangeText={setMeetLinkInput}
            />
            <TouchableOpacity
              style={styles.primaryBlueBtn}
              onPress={editingMeeting ? handleSaveEdit : handleCreateMeeting}
            >
              <Text style={styles.primaryBlueBtnText}>
                {editingMeeting ? 'Save Changes' : 'Schedule Meeting'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelOutlineBtn}
              onPress={() => {
                setShowAddModal(false);
                setEditingMeeting(null);
              }}
            >
              <Text style={styles.cancelOutlineBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* VIEW / EDIT SUMMARY MODAL FOR CONCLUDED MEETINGS */}
      <Modal visible={!!summaryModalMeeting} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Meeting Summary & Notes</Text>
            {summaryModalMeeting && (
              <Text style={{ fontSize: 13, color: '#475569', marginBottom: 12 }}>
                Meeting: <Text style={{ fontWeight: 'bold' }}>{summaryModalMeeting.title}</Text> ({summaryModalMeeting.fullDate})
              </Text>
            )}
            <Text style={styles.inputLabel}>Key Points / Required Revisions for Students</Text>
            <TextInput
              style={[styles.textInputStyle, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Write meeting summary, key points, or paper revision instructions..."
              placeholderTextColor="#94A3B8"
              multiline
              value={summaryNotesInput}
              onChangeText={setSummaryNotesInput}
            />
            <TouchableOpacity style={styles.primaryBlueBtn} onPress={handleSaveSummaryNotes}>
              <Text style={styles.primaryBlueBtnText}>Save Summary</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setSummaryModalMeeting(null)}>
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
    gap: 12,
  },
  addPlusBtnHeader: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconTouch: {
    padding: 4,
  },
  whiteCardContainerGroup: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  tabSwitcherContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  switcherTabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  switcherActiveTabBtn: {
    backgroundColor: '#BFDBFE',
  },
  switcherTabText: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#475569',
  },
  switcherActiveTabText: {
    color: '#1E58A8',
  },
  meetingCardItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 14,
    marginBottom: 14,
  },
  dateBadgeBox: {
    width: 68,
    height: 68,
    borderRadius: 12,
    backgroundColor: '#BFDBFE',
    borderWidth: 1,
    borderColor: '#93C5FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateBadgeMonthText: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#1E58A8',
  },
  dateBadgeDayText: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#000000',
    marginTop: -2,
  },
  meetingTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#000000',
  },
  meetingDateText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#475569',
    marginTop: 2,
  },
  meetingTimeText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#475569',
    marginTop: 2,
  },
  meetingSubText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#94A3B8',
    marginTop: 2,
  },
  cardActionsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionBtnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  actionBtnTextBlue: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#1E58A8',
  },
  actionBtnTextRed: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#EF4444',
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