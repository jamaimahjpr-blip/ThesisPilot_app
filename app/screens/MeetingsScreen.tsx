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

export interface ActionItem {
  id: string;
  text: string;
  dueDate: string;
  completed: boolean;
}

export interface MeetingSummary {
  discussionSummary: string;
  educatorImprovements: string;
  studentQuestionsAnswers: string;
  requiredRevisions: string;
  notesList?: string[];
  attachmentName?: string;
  attachmentSize?: string;
  actionItems?: ActionItem[];
}

export interface MeetingItem {
  id: string;
  title: string;
  month: string;
  day: string;
  fullDate: string;
  time: string;
  adviser: string;
  meetUrl: string;
  status: 'Upcoming' | 'Concluded';
  summary?: MeetingSummary;
}

interface MeetingsScreenProps {
  setStudentDashView?: (view: any) => void;
  setIsMenuOpen?: (open: boolean) => void;
  onBackPress?: () => void;
}

export default function MeetingsScreen({
  setStudentDashView,
  setIsMenuOpen,
  onBackPress,
}: MeetingsScreenProps) {
  const [meetingTab, setMeetingTab] = useState<'Upcoming' | 'Concluded'>('Upcoming');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedSummaryMeeting, setSelectedSummaryMeeting] = useState<MeetingItem | null>(null);

  // PDF Viewer Modal States
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [activePdfName, setActivePdfName] = useState('CHAPTER1_COMMENTS.PDF');

  // Accordion Section States for Summary Details View
  const [isNotesOpen, setIsNotesOpen] = useState(true);
  const [isAttachmentsOpen, setIsAttachmentsOpen] = useState(true);
  const [isActionItemsOpen, setIsActionItemsOpen] = useState(true);

  // Form states for creating a new meeting
  const [newTitle, setNewTitle] = useState('');
  const [newAdviser, setNewAdviser] = useState('Dr. Elizzette Joy Mationg');
  const [newDateStr, setNewDateStr] = useState('Saturday, May 30, 2026');
  const [newTimeStr, setNewTimeStr] = useState('10:00 AM - 11:00 AM');
  const [newCustomMeetUrl, setNewCustomMeetUrl] = useState('');

  // Initial Meetings List
  const [meetingsList, setMeetingsList] = useState<MeetingItem[]>([
    {
      id: 'm1',
      title: 'Adviser Consultation',
      month: 'MAY',
      day: '18',
      fullDate: 'Saturday, May 18, 2026',
      time: '10:00 AM - 11:00 AM',
      adviser: 'Dr. Elizzette Joy Mationg',
      meetUrl: 'https://meet.google.com/abc-defg-hij',
      status: 'Upcoming',
    },
    {
      id: 'm2',
      title: 'System Review Meeting',
      month: 'MAY',
      day: '25',
      fullDate: 'Saturday, May 25, 2026',
      time: '12:00 PM - 3:00 PM',
      adviser: 'Dr. Elizzette Joy Mationg',
      meetUrl: 'https://meet.google.com/xyz-uvwx-rst',
      status: 'Upcoming',
    },
    {
      id: 'm3',
      title: 'Pre-Final Defense',
      month: 'JUN',
      day: '01',
      fullDate: 'Saturday, June 01, 2026',
      time: '1:00 PM - 2:00 PM',
      adviser: 'Dr. Elizzette Joy Mationg',
      meetUrl: 'https://meet.google.com/pqr-stuv-wxy',
      status: 'Upcoming',
    },
    {
      id: 'm4',
      title: 'Chapter 1 Review',
      month: 'APR',
      day: '25',
      fullDate: 'Friday, April 25, 2026',
      time: '10:00 AM - 11:00 AM',
      adviser: 'Dr. Elizzette Joy Mationg',
      meetUrl: 'https://meet.google.com/old-meet-link-1',
      status: 'Concluded',
      summary: {
        discussionSummary:
          'Reviewed Chapter 1 Problem Statement, Research Objectives, and Scope & Delimitation.',
        educatorImprovements:
          'Strengthen the background of the study by adding recent local research references from 2024-2026.',
        studentQuestionsAnswers:
          'Q: Should we include hardware constraints?\nA: Yes, explicitly detail mobile OS compatibility limits in Scope & Delimitation.',
        requiredRevisions:
          '1. Update statistical background data in Section 1.1.\n2. Rephrase Specific Objective #3 for measurable outcomes.',
        notesList: [
          'Revised the structure of Chapter 1 (Introduction)',
          'Added more recent references for the background of the study.',
          'Adviser suggested to clarify the research objectives in the second paragraph.',
          'Next meeting Chapter 2 discussion (tentative date: April 30, 2026)',
        ],
        attachmentName: 'Chapter1_Comments.pdf',
        attachmentSize: '245 KB',
        actionItems: [
          {
            id: 'act-1',
            text: "Revised Chapter 1 based on adviser's comments",
            dueDate: 'April 30, 2026',
            completed: false,
          },
          {
            id: 'act-2',
            text: 'Update Scope & Delimitation section on Mobile OS limits',
            dueDate: 'May 02, 2026',
            completed: false,
          },
        ],
      },
    },
    {
      id: 'm5',
      title: 'Research Title Approval',
      month: 'APR',
      day: '10',
      fullDate: 'Thursday, April 10, 2026',
      time: '2:00 PM - 3:00 PM',
      adviser: 'Dr. Elizzette Joy Mationg',
      meetUrl: 'https://meet.google.com/old-meet-link-2',
      status: 'Concluded',
      summary: {
        discussionSummary:
          'Finalized and approved the proposed thesis project title "Thesis Pilot: Mobile Thesis Management System".',
        educatorImprovements:
          'Ensure target user roles (Student, Adviser, Panel) are clearly mapped out in system architecture.',
        studentQuestionsAnswers:
          'Q: Is the title specific enough?\nA: Yes, it accurately represents the core mobile features.',
        requiredRevisions: 'Proceed to draft Chapter 1 and submit initial outline by next week.',
        notesList: [
          'Approved proposed title: Thesis Pilot Mobile Management System.',
          'Identified core functional scopes.',
        ],
        attachmentName: 'Approved_Title_Form.pdf',
        attachmentSize: '180 KB',
        actionItems: [
          {
            id: 'act-3',
            text: 'Draft initial Chapter 1 outline',
            dueDate: 'April 18, 2026',
            completed: true,
          },
        ],
      },
    },
    {
      id: 'm6',
      title: 'Proposal Discussion',
      month: 'MAR',
      day: '28',
      fullDate: 'Friday, March 28, 2026',
      time: '1:00 PM - 2:00 PM',
      adviser: 'Dr. Elizzette Joy Mationg',
      meetUrl: 'https://meet.google.com/old-meet-link-3',
      status: 'Concluded',
      summary: {
        discussionSummary:
          'Initial orientation regarding thesis timeline, adviser availability, and module requirements.',
        educatorImprovements:
          'Focus on real-time features such as Google Meet link redirection and task progress tracking.',
        studentQuestionsAnswers:
          'Q: How often are consultation schedules?\nA: Weekly progress check-ins via scheduled Google Meet calls.',
        requiredRevisions: 'Prepare initial topic proposal slides for title defense.',
        notesList: ['Discussed consultation requirements and schedule expectations.'],
        attachmentName: 'Thesis_Guidelines_2026.pdf',
        attachmentSize: '512 KB',
        actionItems: [
          {
            id: 'act-4',
            text: 'Prepare topic presentation slides',
            dueDate: 'April 05, 2026',
            completed: true,
          },
        ],
      },
    },
  ]);

  // Toggle Checkbox for Action Items
  const handleToggleActionItem = (meetingId: string, actionId: string) => {
    setMeetingsList((prev) =>
      prev.map((m) => {
        if (m.id === meetingId && m.summary?.actionItems) {
          const updatedActionItems = m.summary.actionItems.map((act) =>
            act.id === actionId ? { ...act, completed: !act.completed } : act
          );
          return {
            ...m,
            summary: {
              ...m.summary,
              actionItems: updatedActionItems,
            },
          };
        }
        return m;
      })
    );

    if (selectedSummaryMeeting && selectedSummaryMeeting.id === meetingId) {
      setSelectedSummaryMeeting((prev) => {
        if (!prev || !prev.summary?.actionItems) return prev;
        const updatedItems = prev.summary.actionItems.map((act) =>
          act.id === actionId ? { ...act, completed: !act.completed } : act
        );
        return {
          ...prev,
          summary: {
            ...prev.summary,
            actionItems: updatedItems,
          },
        };
      });
    }
  };

  // Handle joining Google Meet link
  const handleJoinGoogleMeet = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Google Meet Link', `Opening Google Meet session:\n${url}`);
    });
  };

  // Open PDF Viewer Modal
  const handleDownloadAttachment = (filename?: string) => {
    const nameToUse = filename ? filename.toUpperCase() : 'CHAPTER1_COMMENTS.PDF';
    setActivePdfName(nameToUse);
    setShowPdfViewer(true);
  };

  // Submit Handler for Creating New Meeting
  const handleCreateMeetingSubmit = () => {
    if (!newTitle.trim()) {
      Alert.alert('Required Field', 'Please enter a meeting title.');
      return;
    }

    let finalMeetUrl = newCustomMeetUrl.trim();
    if (!finalMeetUrl) {
      const randomCode =
        Math.random().toString(36).substring(2, 5) +
        Math.random().toString(36).substring(2, 6) +
        Math.random().toString(36).substring(2, 5);
      finalMeetUrl = `https://meet.google.com/${randomCode}`;
    }

    const newMeetingObj: MeetingItem = {
      id: `m-${Date.now()}`,
      title: newTitle.trim(),
      month: 'MAY',
      day: '30',
      fullDate: newDateStr,
      time: newTimeStr,
      adviser: newAdviser,
      meetUrl: finalMeetUrl,
      status: 'Upcoming',
    };

    setMeetingsList((prev) => [newMeetingObj, ...prev]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewCustomMeetUrl('');
    Alert.alert(
      'Meeting Created!',
      `Your meeting "${newMeetingObj.title}" has been scheduled.\n\nGoogle Meet Link Attached:\n${finalMeetUrl}`
    );
  };

  const filteredMeetings = meetingsList.filter((m) => m.status === meetingTab);

  return (
    <View style={styles.container}>
      {/* TOP HEADER BAR */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => {
            if (selectedSummaryMeeting) {
              setSelectedSummaryMeeting(null);
            } else if (setIsMenuOpen) {
              setIsMenuOpen(true);
            } else if (onBackPress) {
              onBackPress();
            } else if (setStudentDashView) {
              setStudentDashView('main');
            }
          }}
        >
          <Ionicons
            name={selectedSummaryMeeting ? 'arrow-back-outline' : 'menu-outline'}
            size={26}
            color="#FFFFFF"
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectedSummaryMeeting ? 'Meeting Summary' : 'Meetings'}
        </Text>
        <TouchableOpacity style={styles.headerIconBtn}>
          <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* MAIN WHITE CARD CONTAINER */}
      <View style={styles.whiteCardContainer}>
        {selectedSummaryMeeting ? (
          /* DETAILED MEETING SUMMARY VIEW */
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40, paddingTop: 4 }}
          >
            {/* TOP CARD DETAILS */}
            <View style={styles.summaryTopCard}>
              <View style={styles.cardMainRow}>
                <View style={styles.dateBadgeContainer}>
                  <Text style={styles.dateBadgeMonthText}>{selectedSummaryMeeting.month}</Text>
                  <Text style={styles.dateBadgeDayText}>{selectedSummaryMeeting.day}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.cardMeetingTitle}>{selectedSummaryMeeting.title}</Text>
                  <Text style={styles.cardDateSubtext}>{selectedSummaryMeeting.fullDate}</Text>
                  <Text style={styles.cardTimeSubtext}>{selectedSummaryMeeting.time}</Text>
                  <Text style={styles.cardAdviserSubtext}>with {selectedSummaryMeeting.adviser}</Text>
                  <TouchableOpacity
                    style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}
                    onPress={() => handleJoinGoogleMeet(selectedSummaryMeeting.meetUrl)}
                  >
                    <Text style={{ fontSize: 11, color: '#1E58A8', fontWeight: 'bold' }}>
                      Via Google Meet{' '}
                    </Text>
                    <Ionicons name="open-outline" size={13} color="#1E58A8" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* COMPLETED BANNER */}
            <View style={styles.completedBannerBox}>
              <Ionicons
                name="megaphone-outline"
                size={20}
                color="#1E58A8"
                style={{ marginRight: 8, marginTop: 2 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.completedBannerTitle}>Meeting Completed</Text>
                <Text style={styles.completedBannerSubtext}>
                  Thank you for attending! You can view the notes and summary below.
                </Text>
              </View>
            </View>

            {/* ACCORDION 1: MEETING NOTES */}
            <View style={styles.accordionCard}>
              <TouchableOpacity
                style={styles.accordionHeaderRow}
                activeOpacity={0.7}
                onPress={() => setIsNotesOpen(!isNotesOpen)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons
                    name="document-text-outline"
                    size={20}
                    color="#1E58A8"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.accordionTitle}>Meeting Notes</Text>
                </View>
                <Ionicons
                  name={isNotesOpen ? 'chevron-up' : 'chevron-forward'}
                  size={18}
                  color="#475569"
                />
              </TouchableOpacity>
              {isNotesOpen && (
                <View style={styles.accordionContentBox}>
                  {selectedSummaryMeeting.summary?.notesList &&
                  selectedSummaryMeeting.summary.notesList.length > 0 ? (
                    selectedSummaryMeeting.summary.notesList.map((note, idx) => (
                      <Text key={idx} style={styles.noteBulletText}>
                        • {note}
                      </Text>
                    ))
                  ) : (
                    <Text style={styles.noteBulletText}>
                      {selectedSummaryMeeting.summary?.discussionSummary || 'General consultation.'}
                    </Text>
                  )}
                </View>
              )}
            </View>

            {/* ACCORDION 2: ATTACHMENTS */}
            <View style={styles.accordionCard}>
              <TouchableOpacity
                style={styles.accordionHeaderRow}
                activeOpacity={0.7}
                onPress={() => setIsAttachmentsOpen(!isAttachmentsOpen)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons
                    name="attach-outline"
                    size={20}
                    color="#1E58A8"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.accordionTitle}>Attachments</Text>
                </View>
                <Ionicons
                  name={isAttachmentsOpen ? 'chevron-up' : 'chevron-forward'}
                  size={18}
                  color="#475569"
                />
              </TouchableOpacity>
              {isAttachmentsOpen && (
                <View style={styles.accordionContentBox}>
                  <View style={styles.attachmentFileRow}>
                    <Ionicons
                      name="document-attach"
                      size={28}
                      color="#EF4444"
                      style={{ marginRight: 10 }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.attachmentFileName}>
                        {selectedSummaryMeeting.summary?.attachmentName || 'Chapter1_Comments.pdf'}
                      </Text>
                      <Text style={styles.attachmentFileSize}>
                        {selectedSummaryMeeting.summary?.attachmentSize || '245 KB'}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.downloadIconBtn}
                      onPress={() =>
                        handleDownloadAttachment(selectedSummaryMeeting.summary?.attachmentName)
                      }
                    >
                      <Ionicons name="download-outline" size={20} color="#1E58A8" />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>

            {/* ACCORDION 3: ACTION ITEMS */}
            <View style={styles.accordionCard}>
              <TouchableOpacity
                style={styles.accordionHeaderRow}
                activeOpacity={0.7}
                onPress={() => setIsActionItemsOpen(!isActionItemsOpen)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color="#1E58A8"
                    style={{ marginRight: 8 }}
                  />
                  <Text style={styles.accordionTitle}>Action Items</Text>
                </View>
                <Ionicons
                  name={isActionItemsOpen ? 'chevron-up' : 'chevron-forward'}
                  size={18}
                  color="#475569"
                />
              </TouchableOpacity>
              {isActionItemsOpen && (
                <View style={styles.accordionContentBox}>
                  {selectedSummaryMeeting.summary?.actionItems &&
                  selectedSummaryMeeting.summary.actionItems.length > 0 ? (
                    selectedSummaryMeeting.summary.actionItems.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={styles.actionItemRow}
                        activeOpacity={0.8}
                        onPress={() =>
                          handleToggleActionItem(selectedSummaryMeeting.id, item.id)
                        }
                      >
                        <Ionicons
                          name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                          size={22}
                          color={item.completed ? '#22C55E' : '#64748B'}
                          style={{ marginRight: 10 }}
                        />
                        <View style={{ flex: 1 }}>
                          <Text
                            style={[
                              styles.actionItemText,
                              item.completed && styles.actionItemTextCompleted,
                            ]}
                          >
                            {item.text}
                          </Text>
                          <Text style={styles.actionItemDueDate}>
                            Due: {item.dueDate}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={styles.noteBulletText}>No action items required.</Text>
                  )}
                </View>
              )}
            </View>

            {/* BACK / CLOSE BUTTON */}
            <TouchableOpacity
              style={styles.backToListBtn}
              onPress={() => setSelectedSummaryMeeting(null)}
            >
              <Text style={styles.backToListBtnText}>Back to Meetings</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          /* DEFAULT MEETINGS LIST VIEW */
          <>
            {/* SUB TABS */}
            <View style={styles.tabBarRow}>
              <TouchableOpacity
                style={[styles.tabButton, meetingTab === 'Upcoming' && styles.tabButtonActive]}
                onPress={() => setMeetingTab('Upcoming')}
              >
                <Text
                  style={[styles.tabText, meetingTab === 'Upcoming' && styles.tabTextActive]}
                >
                  Upcoming
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, meetingTab === 'Concluded' && styles.tabButtonActive]}
                onPress={() => setMeetingTab('Concluded')}
              >
                <Text
                  style={[styles.tabText, meetingTab === 'Concluded' && styles.tabTextActive]}
                >
                  Concluded
                </Text>
              </TouchableOpacity>
            </View>

            {/* MEETINGS LIST VIEW */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 110, paddingTop: 10 }}
            >
              {filteredMeetings.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Ionicons name="calendar-outline" size={48} color="#CBD5E1" />
                  <Text style={styles.emptyBoxText}>
                    No {meetingTab.toLowerCase()} meetings found.
                  </Text>
                </View>
              ) : (
                filteredMeetings.map((item) => (
                  <View key={item.id} style={styles.meetingCard}>
                    <View style={styles.cardMainRow}>
                      <View style={styles.dateBadgeContainer}>
                        <Text style={styles.dateBadgeMonthText}>{item.month}</Text>
                        <Text style={styles.dateBadgeDayText}>{item.day}</Text>
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.cardMeetingTitle}>{item.title}</Text>
                        <Text style={styles.cardDateSubtext}>{item.fullDate}</Text>
                        <Text style={styles.cardTimeSubtext}>{item.time}</Text>
                        <Text style={styles.cardAdviserSubtext}>with {item.adviser}</Text>

                        {item.status === 'Upcoming' && (
                          <TouchableOpacity
                            style={styles.googleMeetBtn}
                            activeOpacity={0.8}
                            onPress={() => handleJoinGoogleMeet(item.meetUrl)}
                          >
                            <View style={styles.meetIconContainer}>
                              <Ionicons name="videocam" size={16} color="#34A853" />
                            </View>
                            <Text style={styles.googleMeetBtnText}>Join with Google Meet</Text>
                          </TouchableOpacity>
                        )}

                        {item.status === 'Concluded' && (
                          <TouchableOpacity
                            style={styles.viewSummaryBtn}
                            activeOpacity={0.8}
                            onPress={() => setSelectedSummaryMeeting(item)}
                          >
                            <Ionicons
                              name="document-text-outline"
                              size={16}
                              color="#1E58A8"
                              style={{ marginRight: 6 }}
                            />
                            <Text style={styles.viewSummaryBtnText}>View Summary</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                ))
              )}
            </ScrollView>

            {/* FLOATING + CREATE MEETING BUTTON */}
            <TouchableOpacity
              style={styles.createMeetingFloatingBtn}
              activeOpacity={0.85}
              onPress={() => setShowCreateModal(true)}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" style={{ marginRight: 4 }} />
              <Text style={styles.createMeetingFloatingBtnText}>Create Meeting</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* DOWNLOADED ATTACHMENT PDF PREVIEW MODAL */}
      <Modal visible={showPdfViewer} transparent animationType="slide">
        <View style={styles.pdfOverlayContainer}>
          <View style={styles.pdfHeaderBar}>
            <TouchableOpacity onPress={() => setShowPdfViewer(false)} style={{ padding: 4 }}>
              <Ionicons name="close-outline" size={26} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.pdfHeaderTitle} numberOfLines={1}>
              {activePdfName}
            </Text>
            <Text style={styles.pdfPageIndicator}>Page 1 of 1</Text>
          </View>

          <View style={styles.pdfBodyViewport}>
            <View style={styles.pdfSinglePaperPage}>
              <View style={styles.pdfDocumentHeaderRow}>
                <Ionicons name="document-text" size={24} color="#EF4444" />
                <Text style={styles.pdfDocTypeLabel}>PDF Document View</Text>
              </View>
              <View style={styles.pdfContentDivider} />

              <View style={styles.pdfDummyBox}>
                <Text style={styles.pdfDummyMainText}>DUMMY OF {activePdfName}</Text>
              </View>
              <Text style={styles.pdfFooterPageNote}>-- End of Document (Page 1) --</Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* CREATE MEETING MODAL */}
      <Modal visible={showCreateModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Schedule New Meeting</Text>

            <Text style={styles.inputLabelText}>Meeting Title</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="e.g., Adviser Consultation"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <Text style={styles.inputLabelText}>Adviser</Text>
            <TextInput
              style={styles.modalTextInput}
              value={newAdviser}
              onChangeText={setNewAdviser}
            />

            <Text style={styles.inputLabelText}>Date</Text>
            <TextInput
              style={styles.modalTextInput}
              value={newDateStr}
              onChangeText={setNewDateStr}
            />

            <Text style={styles.inputLabelText}>Time</Text>
            <TextInput
              style={styles.modalTextInput}
              value={newTimeStr}
              onChangeText={setNewTimeStr}
            />

            <Text style={styles.inputLabelText}>Google Meet Link</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="Paste link e.g., https://meet.google.com/..."
              value={newCustomMeetUrl}
              onChangeText={setNewCustomMeetUrl}
              autoCapitalize="none"
            />

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.cancelOutlineBtn}
                onPress={() => setShowCreateModal(false)}
              >
                <Text style={styles.cancelOutlineBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryBlueBtn} onPress={handleCreateMeetingSubmit}>
                <Text style={styles.primaryBlueBtnText}>Schedule</Text>
              </TouchableOpacity>
            </View>
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 48,
    paddingBottom: 14,
  },
  headerIconBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  whiteCardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    position: 'relative',
  },
  tabBarRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: '#BFDBFE',
    borderBottomColor: '#1E58A8',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tabTextActive: {
    color: '#1E58A8',
    fontWeight: 'bold',
  },
  meetingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  cardMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dateBadgeContainer: {
    width: 68,
    height: 72,
    backgroundColor: '#BFDBFE',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#93C5FD',
  },
  dateBadgeMonthText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E58A8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  dateBadgeDayText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: -2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  cardMeetingTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  cardDateSubtext: {
    fontSize: 11,
    color: '#475569',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  cardTimeSubtext: {
    fontSize: 11,
    color: '#475569',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  cardAdviserSubtext: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  googleMeetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E58A8',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  meetIconContainer: {
    marginRight: 6,
  },
  googleMeetBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E58A8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  viewSummaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E58A8',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
    marginTop: 8,
  },
  viewSummaryBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E58A8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  summaryTopCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
  },
  completedBannerBox: {
    flexDirection: 'row',
    backgroundColor: '#BFDBFE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
  },
  completedBannerTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E58A8',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  completedBannerSubtext: {
    fontSize: 11,
    color: '#1E3A8A',
    lineHeight: 15,
  },
  accordionCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  accordionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  accordionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  accordionContentBox: {
    paddingHorizontal: 12,
    paddingBottom: 12,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
  },
  noteBulletText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  attachmentFileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
  },
  attachmentFileName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  attachmentFileSize: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  downloadIconBtn: {
    padding: 6,
  },
  actionItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  actionItemText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actionItemTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  actionItemDueDate: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  backToListBtn: {
    backgroundColor: '#1E58A8',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  backToListBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  createMeetingFloatingBtn: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    flexDirection: 'row',
    backgroundColor: '#1E58A8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  createMeetingFloatingBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyBoxText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 8,
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
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 14,
  },
  inputLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 12,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  cancelOutlineBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  cancelOutlineBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
  },
  primaryBlueBtn: {
    flex: 1,
    backgroundColor: '#1E58A8',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBlueBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  pdfOverlayContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  pdfHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 48,
    paddingBottom: 14,
    backgroundColor: '#1E293B',
  },
  pdfHeaderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginHorizontal: 10,
  },
  pdfPageIndicator: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  pdfBodyViewport: {
    flex: 1,
    backgroundColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  pdfSinglePaperPage: {
    width: '100%',
    height: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 24,
    elevation: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pdfDocumentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pdfDocTypeLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
  },
  pdfContentDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  pdfDummyBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  pdfDummyMainText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E58A8',
    textAlign: 'center',
    letterSpacing: 0.8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  pdfFooterPageNote: {
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});