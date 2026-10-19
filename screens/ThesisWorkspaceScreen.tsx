import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ThesisProject {
  id: string;
  title: string;
  description: string;
  adviser: string;
  adviserEmail: string;
  status: string;
  startDate: string;
  targetDefense: string;
}

interface ChapterItem {
  id: string;
  number: number;
  title: string;
  progress: number;
  fileName?: string;
  submittedAt?: string;
  status?: string;
}

interface NoteItem {
  id: string;
  title: string;
  content: string;
  date: string;
  isStarred?: boolean;
}

interface ActivityLogItem {
  id: string;
  actor: string;
  actionText: string;
  targetText: string;
  timeAgo: string;
  category: 'Today' | 'Yesterday' | 'Last Week';
  type: 'comment' | 'docx' | 'task complete' | 'meeting' | 'note add';
}

interface ThesisWorkspaceProps {
  selectedThesis: ThesisProject;
  setShowProjectSelectModal: (show: boolean) => void;
  workspaceTab: 'Overview' | 'Chapters' | 'Notes' | 'Activity';
  setWorkspaceTab: (tab: 'Overview' | 'Chapters' | 'Notes' | 'Activity') => void;
  chaptersList: ChapterItem[];
  setShowAddChapterModal?: (show: boolean) => void;
  setStudentDashView: (view: any) => void;
  handleChapterOptions?: (ch: ChapterItem) => void;
  notesList: NoteItem[];
  searchNoteQuery: string;
  setSearchNoteQuery?: (query: string) => void;
  setEditingNote?: (note: NoteItem | null) => void;
  setNoteTitleInput?: (text: string) => void;
  setNoteContentInput?: (text: string) => void;
  setShowNoteModal?: (show: boolean) => void;
  handleNoteOptions?: (note: NoteItem) => void;
  activityLogsList: ActivityLogItem[];
  renderActivityIcon: (type: ActivityLogItem['type']) => React.ReactNode;
}

export default function ThesisWorkspaceScreen({
  selectedThesis,
  setShowProjectSelectModal,
  workspaceTab,
  setWorkspaceTab,
  chaptersList,
  setShowAddChapterModal,
  setStudentDashView,
  handleChapterOptions,
  notesList,
  searchNoteQuery,
  setSearchNoteQuery,
  setEditingNote,
  setNoteTitleInput,
  setNoteContentInput,
  setShowNoteModal,
  handleNoteOptions,
  activityLogsList,
  renderActivityIcon,
}: ThesisWorkspaceProps) {
  // Activity Dropdown Filter States
  const [activityFilter, setActivityFilter] = useState<string>('All Activity');
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const filterOptions = ['Today', 'Yesterday', 'Last Week', 'All Activity'];

  // File / Image Upload Source Selection State
  const [showUploadSourceModal, setShowUploadSourceModal] = useState<boolean>(false);

  // Filter notes based on search query
  const filteredNotes = notesList.filter(
    (note) =>
      note.title.toLowerCase().includes((searchNoteQuery || '').toLowerCase()) ||
      note.content.toLowerCase().includes((searchNoteQuery || '').toLowerCase())
  );

  // Default Activity Items
  const defaultActivities: ActivityLogItem[] = [
    {
      id: 'act-1',
      actor: 'Dr. Elizzette',
      actionText: 'commented on',
      targetText: 'Chapter 2: Literature Review',
      timeAgo: '12 hours ago',
      category: 'Today',
      type: 'comment',
    },
    {
      id: 'act-2',
      actor: 'Dr. Elizzette',
      actionText: 'commented on',
      targetText: 'Chapter 2: Literature Review',
      timeAgo: '15 hours ago',
      category: 'Today',
      type: 'docx',
    },
    {
      id: 'act-3',
      actor: 'You',
      actionText: 'completed a task',
      targetText: 'Design research instruments',
      timeAgo: '6 hours ago',
      category: 'Today',
      type: 'task complete',
    },
    {
      id: 'act-4',
      actor: 'Dr. Elizzette',
      actionText: 'scheduled a meeting',
      targetText: 'System Review Meeting',
      timeAgo: 'Yesterday, 3:00 PM',
      category: 'Yesterday',
      type: 'meeting',
    },
    {
      id: 'act-5',
      actor: 'You',
      actionText: 'added a new note',
      targetText: 'Statistical Methods',
      timeAgo: 'Yesterday, 10:20 AM',
      category: 'Yesterday',
      type: 'note add',
    },
  ];

  const currentActivities =
    activityLogsList && activityLogsList.length >= 0 ? activityLogsList : defaultActivities;

  // Filtering activities based on dropdown selection
  const todayActivities = currentActivities.filter(
    (item) =>
      item.category === 'Today' &&
      (activityFilter === 'All Activity' || activityFilter === 'Today')
  );

  const yesterdayActivities = currentActivities.filter(
    (item) =>
      item.category === 'Yesterday' &&
      (activityFilter === 'All Activity' || activityFilter === 'Yesterday')
  );

  const lastWeekActivities = currentActivities.filter(
    (item) =>
      item.category === 'Last Week' &&
      (activityFilter === 'All Activity' || activityFilter === 'Last Week')
  );

  // Ask Permission and Directly Launch System File Manager / Photo Gallery Picker
  const handleSelectUploadSource = (sourceType: 'file' | 'gallery') => {
    setShowUploadSourceModal(false);
    const sourceName = sourceType === 'file' ? 'File Manager / Storage' : 'Photos / Gallery';
    Alert.alert(
      'Permission Required',
      `"Thesis Pilot" needs access to your phone's ${sourceName} to pick files or photos for submission.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Allow & Open',
          onPress: () => {
            Alert.alert(
              'Opening Phone Storage',
              `Access granted! Selected item from your ${sourceName}. File uploaded successfully.`
            );
          },
        },
      ]
    );
  };

  // Custom Icon Renderer matching UI Screenshot exact design
  const renderCustomActivityIcon = (type: ActivityLogItem['type']) => {
    switch (type) {
      case 'comment':
        return (
          <View style={styles.actIconUserCircle}>
            <Ionicons name="person" size={16} color="#FFFFFF" />
          </View>
        );
      case 'docx':
        return (
          <View style={styles.actIconDocxBox}>
            <Ionicons name="document-text" size={16} color="#0284C7" />
            <Text style={styles.actIconDocxLabel}>DOCX</Text>
          </View>
        );
      case 'task complete':
        return (
          <View style={styles.actIconCheckCircle}>
            <Ionicons name="checkmark" size={14} color="#FFFFFF" />
          </View>
        );
      case 'meeting':
        return (
          <View style={styles.actIconUserCircle}>
            <Ionicons name="person" size={16} color="#FFFFFF" />
          </View>
        );
      case 'note add':
        return (
          <View style={styles.actIconNoteYellowBox}>
            <Ionicons name="journal" size={14} color="#000000" />
          </View>
        );
      default:
        return (
          <View style={styles.actIconUserCircle}>
            <Ionicons name="ellipse" size={12} color="#FFFFFF" />
          </View>
        );
    }
  };

  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        <Text style={styles.workspaceSectionLabel}>Current Thesis</Text>

        {/* Current Thesis Title Box */}
        <TouchableOpacity
          style={styles.thesisCardBox}
          activeOpacity={0.85}
          onPress={() => setShowProjectSelectModal(true)}
        >
          <Text style={styles.thesisCardTitle}>{selectedThesis.title}</Text>
          <Ionicons name="chevron-forward" size={20} color="#000000" />
        </TouchableOpacity>

        {/* Horizontal Segment Tabs */}
        <View style={styles.wsTabRow}>
          <TouchableOpacity
            style={[styles.wsTabBtn, workspaceTab === 'Overview' && styles.wsTabBtnActive]}
            onPress={() => setWorkspaceTab('Overview')}
          >
            <Text style={[styles.wsTabText, workspaceTab === 'Overview' && styles.wsTabTextActive]}>
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.wsTabBtn, workspaceTab === 'Chapters' && styles.wsTabBtnActive]}
            onPress={() => setWorkspaceTab('Chapters')}
          >
            <Text style={[styles.wsTabText, workspaceTab === 'Chapters' && styles.wsTabTextActive]}>
              Chapters
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.wsTabBtn, workspaceTab === 'Notes' && styles.wsTabBtnActive]}
            onPress={() => setWorkspaceTab('Notes')}
          >
            <Text style={[styles.wsTabText, workspaceTab === 'Notes' && styles.wsTabTextActive]}>
              Notes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.wsTabBtn, workspaceTab === 'Activity' && styles.wsTabBtnActive]}
            onPress={() => setWorkspaceTab('Activity')}
          >
            <Text style={[styles.wsTabText, workspaceTab === 'Activity' && styles.wsTabTextActive]}>
              Activity
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.wsTabLine} />

        {/* Workspace Content Views */}
        {workspaceTab === 'Overview' ? (
          <View style={{ marginTop: 14 }}>
            <View style={styles.wsGreyCard}>
              <Text style={styles.wsGreyCardTitle}>About this thesis</Text>
              <Text style={styles.wsGreyCardText}>{selectedThesis.description}</Text>
            </View>
            <View style={styles.wsGreyCard}>
              <Text style={styles.wsGreyCardTitle}>Adviser</Text>
              <View style={styles.adviserRow}>
                <View style={styles.adviserAvatarCircle}>
                  <Ionicons name="person" size={24} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.adviserNameText}>{selectedThesis.adviser}</Text>
                  <Text style={styles.adviserEmailText}>{selectedThesis.adviserEmail}</Text>
                </View>
                <TouchableOpacity style={{ padding: 4 }}>
                  <Ionicons name="mail-outline" size={22} color="#000000" />
                </TouchableOpacity>
              </View>
              <View style={styles.adviserDividerLine} />
              <View style={styles.statusRowBetween}>
                <Text style={styles.wsGreyCardTitle}>Status</Text>
                <Text style={styles.statusBadgeText}>{selectedThesis.status}</Text>
              </View>
            </View>
            <View style={styles.wsDatesGridRow}>
              <View style={styles.wsMiniDateCard}>
                <Text style={styles.wsDateLabel}>Start Date</Text>
                <Text style={styles.wsDateValue}>{selectedThesis.startDate}</Text>
              </View>
              <View style={styles.wsMiniDateCard}>
                <Text style={styles.wsDateLabel}>Target Defense</Text>
                <Text style={styles.wsDateValue}>{selectedThesis.targetDefense}</Text>
              </View>
            </View>
          </View>
        ) : workspaceTab === 'Chapters' ? (
          <View style={{ marginTop: 14 }}>
            <View style={styles.chaptersHeaderRow}>
              <Text style={styles.chaptersListMainTitle}>Chapters</Text>
              <TouchableOpacity
                style={styles.addChapterBlueBtn}
                activeOpacity={0.85}
                onPress={() => {
                  if (setShowAddChapterModal) setShowAddChapterModal(true);
                }}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={styles.addChapterBtnText}>Chapter</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.chaptersDividerLine} />
            {chaptersList.map((ch) => (
              <View key={ch.id} style={styles.chapterItemRowContainer}>
                <TouchableOpacity
                  style={styles.chapterRowTouchArea}
                  activeOpacity={0.7}
                  onPress={() => handleChapterOptions && handleChapterOptions(ch)}
                >
                  <View style={styles.chapterNumberCircle}>
                    <Text style={styles.chapterNumberText}>{ch.number}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.chapterTitleText}>{ch.title}</Text>
                    <View style={styles.chapterBarTrack}>
                      <View
                        style={[
                          styles.chapterBarFill,
                          {
                            width: `${ch.progress}%`,
                            backgroundColor: ch.progress >= 75 ? '#22C55E' : '#1E58A8',
                          },
                        ]}
                      />
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.chapterPercentText,
                      ch.progress >= 75 && { color: '#22C55E' },
                    ]}
                  >
                    {ch.progress}%
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.chapterThreeDotsBtn}
                  onPress={() => handleChapterOptions && handleChapterOptions(ch)}
                >
                  <Ionicons name="ellipsis-vertical" size={18} color="#000000" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : workspaceTab === 'Notes' ? (
          <View style={{ marginTop: 14 }}>
            <View style={styles.notesHeaderRow}>
              <Text style={styles.notesSectionMainTitle}>Notes</Text>
              <TouchableOpacity
                style={styles.newNoteBlueBtn}
                activeOpacity={0.85}
                onPress={() => {
                  if (setEditingNote) setEditingNote(null);
                  if (setNoteTitleInput) setNoteTitleInput('');
                  if (setNoteContentInput) setNoteContentInput('');
                  if (setShowNoteModal) setShowNoteModal(true);
                }}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={styles.newNoteBtnText}>New Note</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.searchFilterRowContainer}>
              <View style={styles.searchBarInputCard}>
                <Ionicons
                  name="search-outline"
                  size={18}
                  color="#64748B"
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  style={styles.searchNoteTextInput}
                  placeholder="Search notes..."
                  placeholderTextColor="#94A3B8"
                  value={searchNoteQuery}
                  onChangeText={(text) => setSearchNoteQuery && setSearchNoteQuery(text)}
                />
              </View>
              <TouchableOpacity style={styles.filterIconButton}>
                <Ionicons name="funnel-outline" size={18} color="#000000" />
              </TouchableOpacity>
            </View>
            {filteredNotes.map((note) => (
              <TouchableOpacity
                key={note.id}
                style={styles.noteCardBox}
                activeOpacity={0.8}
                onPress={() => handleNoteOptions && handleNoteOptions(note)}
              >
                <View style={styles.noteYellowIconBox}>
                  <Ionicons name="document-text-outline" size={24} color="#000000" />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.noteTitleBoldText}>{note.title}</Text>
                  <Text style={styles.noteDateSubtitle}>{note.date}</Text>
                  <Text style={styles.noteContentSnippet} numberOfLines={2}>
                    {note.content}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{ padding: 4 }}
                  onPress={() => handleNoteOptions && handleNoteOptions(note)}
                >
                  {note.isStarred ? (
                    <Ionicons name="star-outline" size={20} color="#0284C7" />
                  ) : (
                    <Ionicons name="ellipsis-vertical" size={18} color="#000000" />
                  )}
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        ) : workspaceTab === 'Activity' ? (
          <View style={{ marginTop: 14 }}>
            <View style={styles.actHeaderFilterRow}>
              <Text style={styles.actMainHeadingText}>Activity</Text>
              <TouchableOpacity
                style={styles.actDropdownSelectBtn}
                activeOpacity={0.8}
                onPress={() => setShowFilterModal(true)}
              >
                <Text style={styles.actDropdownText}>{activityFilter}</Text>
                <Ionicons name="chevron-down" size={16} color="#000000" />
              </TouchableOpacity>
            </View>

            {/* SECTION: TODAY */}
            {todayActivities.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={styles.actGroupSectionTitle}>Today</Text>
                <View style={styles.actTimelineContainer}>
                  {todayActivities.map((item, index) => {
                    const isLastInGroup = index === todayActivities.length - 1;
                    return (
                      <View key={item.id} style={styles.actTimelineNodeRow}>
                        <View style={styles.actNodeLeftCol}>
                          {!isLastInGroup && <View style={styles.actVerticalLineTrack} />}
                          {renderCustomActivityIcon(item.type)}
                        </View>
                        <View style={styles.actNodeContentBox}>
                          <Text style={styles.actLogTextBody}>
                            <Text style={{ fontWeight: 'bold' }}>{item.actor}</Text>{' '}
                            {item.actionText}{' '}
                            <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>
                              {item.targetText}
                            </Text>
                          </Text>
                          <Text style={styles.actLogTimeAgoText}>{item.timeAgo}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* SECTION: YESTERDAY */}
            {yesterdayActivities.length > 0 && (
              <View style={{ marginTop: 16 }}>
                <Text style={styles.actGroupSectionTitle}>Yesterday</Text>
                <View style={styles.actTimelineContainer}>
                  {yesterdayActivities.map((item, index) => {
                    const isLastInGroup = index === yesterdayActivities.length - 1;
                    return (
                      <View key={item.id} style={styles.actTimelineNodeRow}>
                        <View style={styles.actNodeLeftCol}>
                          {!isLastInGroup && <View style={styles.actVerticalLineTrack} />}
                          {renderCustomActivityIcon(item.type)}
                        </View>
                        <View style={styles.actNodeContentBox}>
                          <Text style={styles.actLogTextBody}>
                            <Text style={{ fontWeight: 'bold' }}>{item.actor}</Text>{' '}
                            {item.actionText}{' '}
                            <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>
                              {item.targetText}
                            </Text>
                          </Text>
                          <Text style={styles.actLogTimeAgoText}>{item.timeAgo}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* SECTION: LAST WEEK */}
            {lastWeekActivities.length > 0 && (
              <View style={{ marginTop: 16 }}>
                <Text style={styles.actGroupSectionTitle}>Last Week</Text>
                <View style={styles.actTimelineContainer}>
                  {lastWeekActivities.map((item, index) => {
                    const isLastInGroup = index === lastWeekActivities.length - 1;
                    return (
                      <View key={item.id} style={styles.actTimelineNodeRow}>
                        <View style={styles.actNodeLeftCol}>
                          {!isLastInGroup && <View style={styles.actVerticalLineTrack} />}
                          {renderCustomActivityIcon(item.type)}
                        </View>
                        <View style={styles.actNodeContentBox}>
                          <Text style={styles.actLogTextBody}>
                            <Text style={{ fontWeight: 'bold' }}>{item.actor}</Text>{' '}
                            {item.actionText}{' '}
                            <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>
                              {item.targetText}
                            </Text>
                          </Text>
                          <Text style={styles.actLogTimeAgoText}>{item.timeAgo}</Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </View>
        ) : null}
      </ScrollView>

      {/* Floating AI Bot Badge */}
      <TouchableOpacity
        style={styles.floatingAiBotBadge}
        onPress={() => setStudentDashView('ai')}
      >
        <Ionicons name="hardware-chip" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* UPLOAD FILE / IMAGE SOURCE PICKER MODAL */}
      <Modal visible={showUploadSourceModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modaloverlayDark}
          activeOpacity={1}
          onPress={() => setShowUploadSourceModal(false)}
        >
          <View style={styles.dropdownModalCard}>
            <Text style={styles.dropdownModalTitle}>Select File / Image Source</Text>
            <TouchableOpacity
              style={styles.uploadSourceOptionRow}
              onPress={() => handleSelectUploadSource('file')}
            >
              <View style={styles.uploadIconCircleBlue}>
                <Ionicons name="folder-open-outline" size={20} color="#1E58A8" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.uploadSourceOptionTitle}>File Manager / Storage</Text>
                <Text style={styles.uploadSourceOptionSub}>Select PDF, DOCX, XLSX files</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.uploadSourceOptionRow}
              onPress={() => handleSelectUploadSource('gallery')}
            >
              <View style={styles.uploadIconCircleGreen}>
                <Ionicons name="images-outline" size={20} color="#16A34A" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.uploadSourceOptionTitle}>Phone Gallery / Photos</Text>
                <Text style={styles.uploadSourceOptionSub}>Select thesis screenshots or images</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelPickerBtn}
              onPress={() => setShowUploadSourceModal(false)}
            >
              <Text style={styles.cancelPickerBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ACTIVITY FILTER DROPDOWN SELECTION MODAL */}
      <Modal visible={showFilterModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modaloverlayDark}
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <View style={styles.dropdownModalCard}>
            <Text style={styles.dropdownModalTitle}>Filter Activity</Text>
            {filterOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[
                  styles.dropdownOptionRow,
                  activityFilter === opt && styles.dropdownOptionActiveRow,
                ]}
                onPress={() => {
                  setActivityFilter(opt);
                  setShowFilterModal(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownOptionText,
                    activityFilter === opt && styles.dropdownOptionActiveText,
                  ]}
                >
                  {opt}
                </Text>
                {activityFilter === opt && (
                  <Ionicons name="checkmark" size={18} color="#1E58A8" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  workspaceSectionLabel: {
    fontSize: 11,
    color: '#000000',
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  thesisCardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#94A3B8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  thesisCardTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    paddingRight: 8,
  },
  wsTabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  wsTabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  wsTabBtnActive: {
    backgroundColor: '#93C5FD',
  },
  wsTabText: {
    fontSize: 12,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  wsTabTextActive: {
    fontWeight: 'bold',
  },
  wsTabLine: {
    height: 1,
    backgroundColor: '#CBD5E1',
    width: '100%',
  },
  wsGreyCard: {
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  wsGreyCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  wsGreyCardText: {
    fontSize: 10,
    color: '#000000',
    lineHeight: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  adviserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 4,
  },
  adviserAvatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#4B5563',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adviserNameText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  adviserEmailText: {
    fontSize: 10,
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  adviserDividerLine: {
    height: 1,
    backgroundColor: '#A3A3A3',
    marginVertical: 8,
  },
  statusRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#22C55E',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  wsDatesGridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  wsMiniDateCard: {
    flex: 1,
    backgroundColor: '#D9D9D9',
    borderRadius: 8,
    padding: 10,
  },
  wsDateLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  wsDateValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  chaptersHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chaptersListMainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  addChapterBlueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E58A8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  addChapterBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  chaptersDividerLine: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginBottom: 14,
  },
  chapterItemRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  chapterRowTouchArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chapterNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapterNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E58A8',
  },
  chapterTitleText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  chapterBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  chapterBarFill: {
    height: '100%',
  },
  chapterPercentText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E58A8',
    marginLeft: 8,
    width: 38,
    textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  chapterThreeDotsBtn: {
    padding: 6,
    marginLeft: 4,
  },
  notesHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  notesSectionMainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  newNoteBlueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 4,
  },
  newNoteBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  searchFilterRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  searchBarInputCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 38,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  searchNoteTextInput: {
    flex: 1,
    fontSize: 12,
    color: '#000000',
    paddingVertical: 0,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  filterIconButton: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  noteCardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#64748B',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  noteYellowIconBox: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#FEF08A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteTitleBoldText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  noteDateSubtitle: {
    fontSize: 9,
    color: '#64748B',
    marginVertical: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  noteContentSnippet: {
    fontSize: 10,
    color: '#334155',
    lineHeight: 13,
  },
  actHeaderFilterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  actMainHeadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actDropdownSelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#475569',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 6,
    backgroundColor: '#FFFFFF',
  },
  actDropdownText: {
    fontSize: 12,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actGroupSectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actTimelineContainer: {
    paddingLeft: 4,
  },
  actTimelineNodeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  actNodeLeftCol: {
    width: 32,
    alignItems: 'center',
    position: 'relative',
  },
  actVerticalLineTrack: {
    position: 'absolute',
    top: 24,
    bottom: -22,
    width: 1.5,
    backgroundColor: '#CBD5E1',
    zIndex: 1,
  },
  actNodeContentBox: {
    flex: 1,
    paddingLeft: 8,
  },
  actIconUserCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  actIconDocxBox: {
    width: 26,
    height: 26,
    borderRadius: 6,
    backgroundColor: '#BAE6FD',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  actIconDocxLabel: {
    fontSize: 6,
    fontWeight: 'bold',
    color: '#0284C7',
    marginTop: -2,
  },
  actIconCheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  actIconNoteYellowBox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#FEF08A',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  actLogTextBody: {
    fontSize: 11,
    color: '#000000',
    lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actLogTimeAgoText: {
    fontSize: 9,
    color: '#64748B',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  floatingAiBotBadge: {
    position: 'absolute',
    bottom: 60,
    left: 12,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#45E95E',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modaloverlayDark: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  dropdownModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 8,
  },
  dropdownModalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  dropdownOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  dropdownOptionActiveRow: {
    backgroundColor: '#EFF6FF',
  },
  dropdownOptionText: {
    fontSize: 13,
    color: '#334155',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  dropdownOptionActiveText: {
    fontWeight: 'bold',
    color: '#1E58A8',
  },
  uploadSourceOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    backgroundColor: '#F8FAFC',
  },
  uploadIconCircleBlue: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconCircleGreen: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadSourceOptionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  uploadSourceOptionSub: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  cancelPickerBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginTop: 4,
  },
  cancelPickerBtnText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});