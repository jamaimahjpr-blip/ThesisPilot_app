import { Ionicons, MaterialCommunityIcons, Octicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import React, { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ActivityLogItem,
  ChapterItem,
  FeedbackItem,
  NoteItem,
  NotificationItem,
  ReferenceItem,
  TaskItem,
  ThesisProject,
} from '../types';
import AdviserFeedbackScreen from './AdviserFeedbackScreen';
import AIAssistantScreen from './AIAssistantScreen';
import DefensePreparationScreen from './DefensePreparationScreen';
import FileRepositoryScreen from './FileRepositoryScreen';
import GoogleScholarScreen from './GoogleScholarScreen';
import HelpSupportScreen from './HelpSupportScreen';
import MeetingsScreen from './MeetingsScreen';
import PeerAssessmentScreen from './PeerAssessmentScreen';
import ProfileScreen from './ProfileScreen';
import ReferenceScreen from './ReferenceScreen';
import SettingsScreen from './SettingsScreen';
import TasksScreen from './TasksScreen';
import ThesisGroupChatScreen from './ThesisGroupChatScreen';
import ThesisWorkspaceScreen from './ThesisWorkspaceScreen';

interface StudentDashboardProps {
  studentDashView: any;
  setStudentDashView: (view: any) => void;
  selectedThesis: ThesisProject;
  setSelectedThesis: (thesis: ThesisProject) => void;
  thesisProjectsList: ThesisProject[];
  chaptersList: ChapterItem[];
  setChaptersList: React.Dispatch<React.SetStateAction<ChapterItem[]>>;
  notesList: NoteItem[];
  setNotesList: React.Dispatch<React.SetStateAction<NoteItem[]>>;
  tasksList: TaskItem[];
  setTasksList: React.Dispatch<React.SetStateAction<TaskItem[]>>;
  feedbackList: FeedbackItem[];
  setFeedbackList: React.Dispatch<React.SetStateAction<FeedbackItem[]>>;
  referencesList: ReferenceItem[];
  setReferencesList: React.Dispatch<React.SetStateAction<ReferenceItem[]>>;
  notificationsList: NotificationItem[];
  setNotificationsList: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  activityLogsList: ActivityLogItem[];
  onLogout: () => void;
  userName?: string;
  userEmail?: string;
}

export default function StudentDashboardScreen({
  studentDashView,
  setStudentDashView,
  selectedThesis,
  setSelectedThesis,
  thesisProjectsList,
  chaptersList,
  setChaptersList,
  notesList,
  setNotesList,
  tasksList,
  setTasksList,
  activityLogsList,
  onLogout,
  userName = 'User',
  userEmail = 'user@gmail.com',
}: StudentDashboardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedInspectChapter, setSelectedInspectChapter] = useState<ChapterItem | null>(null);
  const [showFileInspectModal, setShowFileInspectModal] = useState(false);

  const [refSearchActive, setRefSearchActive] = useState(false);
  const [refAddModalActive, setRefAddModalActive] = useState(false);

  const [showProjectSelectModal, setShowProjectSelectModal] = useState(false);
  const [workspaceTab, setWorkspaceTab] = useState<'Overview' | 'Chapters' | 'Notes' | 'Activity'>('Overview');
  const [showAddChapterModal, setShowAddChapterModal] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterFile, setNewChapterFile] = useState<string | null>(null);

  const [searchNoteQuery, setSearchNoteQuery] = useState('');
  const [editingNote, setEditingNote] = useState<NoteItem | null>(null);
  const [noteTitleInput, setNoteTitleInput] = useState('');
  const [noteContentInput, setNoteContentInput] = useState('');
  const [showNoteModal, setShowNoteModal] = useState(false);

  const [searchFileQuery, setSearchFileQuery] = useState('');

  const [feedbackSubTab, setFeedbackSubTab] = useState<'Feedback' | 'Calendar'>('Feedback');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyingFeedback, setReplyingFeedback] = useState<any>(null);
  const [replyTextInput, setReplyTextInput] = useState('');

  const [adviserFeedbacks, setAdviserFeedbacks] = useState([
    {
      id: 'fb1',
      adviserName: 'Dr. Elizzette Joy Mationg',
      date: 'May 15, 2026',
      rating: '4.5/5',
      comment: 'Great progress! The literature review is comprehensive. Please improve the synthesis of related studies.',
      chapterTag: 'Chapter 2 Literature Review',
      replies: [] as string[],
    },
    {
      id: 'fb2',
      adviserName: 'Dr. Elizzette Joy Mationg',
      date: 'Apr 20, 2026',
      rating: '4.0/5',
      comment: 'Good start on the methodology. Consider adding more details on your data collection process.',
      chapterTag: 'Chapter 3 Methodology',
      replies: [] as string[],
    },
  ]);

  const [notificationTab, setNotificationTab] = useState<'all' | 'unread'>('all');

  const completedChapters = chaptersList.filter((c) => c.progress === 100).length;
  const overallProgress = Math.round(
    chaptersList.reduce((acc, c) => acc + c.progress, 0) / (chaptersList.length || 1)
  );

  const dueSoonTasksCount = tasksList.filter((t) => !t.completed).length;
  const overdueTasksCount = 2;

  const getSurname = (name: string) => {
    if (!name || name.trim() === '') return 'User';
    const parts = name.trim().split(' ');
    return parts[parts.length - 1];
  };

  const studentSurname = getSurname(userName);

  const handlePickDocumentFromPhone = async (onSuccess: (fileName: string) => void) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const pickedFileName = result.assets[0].name;
        onSuccess(pickedFileName);
        Alert.alert('File Selected', `Pumili ka ng file: ${pickedFileName}`);
      }
    } catch (error: any) {
      Alert.alert('Error', `Hindi mabuksan ang phone storage: ${error.message}`);
    }
  };

  const repoFolders = [
    { id: 'f1', title: 'Chapter 1 Introduction', count: '15 files' },
    { id: 'f2', title: 'Chapter 2 Literature Review', count: '18 files' },
    { id: 'f3', title: 'Chapter 3 Methodology', count: '6 files' },
    { id: 'f4', title: 'Chapter 4 Results', count: '14 files' },
    { id: 'f5', title: 'Chapter 5 Conclusion', count: '13 files' },
  ];

  const repoFiles = [
    { id: 'rf1', title: 'Thesis Proposal.pdf', date: 'May 05, 2026', size: '2.4 MB', type: 'pdf' },
    { id: 'rf2', title: 'Data Collection.xlsx', date: 'May 12, 2026', size: '1.1 MB', type: 'xlsx' },
    { id: 'rf3', title: 'Research Instrument.docx', date: 'Apr 26, 2026', size: '856 KB', type: 'docx' },
  ];

  const filteredFolders = repoFolders.filter((f) =>
    f.title.toLowerCase().includes(searchFileQuery.toLowerCase())
  );
  const filteredFiles = repoFiles.filter((f) =>
    f.title.toLowerCase().includes(searchFileQuery.toLowerCase())
  );

  const handleMenuSelect = (viewName: string) => {
    if (viewName === 'logout') {
      setShowLogoutModal(true);
    } else {
      setIsMenuOpen(false);
      setStudentDashView(viewName);
      if (viewName === 'workspace') {
        setWorkspaceTab('Overview');
      }
    }
  };

  const handleAddChapterSubmit = () => {
    if (!newChapterTitle.trim()) {
      Alert.alert('Required', 'Please enter a title for the chapter.');
      return;
    }

    const nextChapterNumber = chaptersList.length + 1;
    const newChapterObj: ChapterItem = {
      id: `ch-${Date.now()}`,
      number: nextChapterNumber,
      title: newChapterTitle.trim(),
      progress: newChapterFile ? 20 : 0,
      fileName: newChapterFile || undefined,
      submittedAt: newChapterFile ? 'Just Now' : undefined,
      status: newChapterFile ? 'In Progress' : 'Draft',
    };

    setChaptersList((prev) => [...prev, newChapterObj]);
    setNewChapterTitle('');
    setNewChapterFile(null);
    setShowAddChapterModal(false);
    Alert.alert('Chapter Added', `Chapter ${nextChapterNumber}: ${newChapterTitle} has been created.`);
  };

  const handleReSubmitFile = (chapterId: string) => {
    handlePickDocumentFromPhone((pickedFileName) => {
      setChaptersList((prev) =>
        prev.map((c) =>
          c.id === chapterId
            ? {
                ...c,
                fileName: pickedFileName,
                submittedAt: 'Just Now',
                status: 'In Progress',
                progress: 40,
              }
            : c
        )
      );
      Alert.alert('File Submitted', `Successfully updated file to ${pickedFileName}`);
    });
    setShowFileInspectModal(false);
  };

  const handleDeleteChapter = (chapterId: string) => {
    Alert.alert(
      'Delete Chapter',
      'Are you sure you want to delete this chapter entirely?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setChaptersList((prev) => {
              const filtered = prev.filter((c) => c.id !== chapterId);
              return filtered.map((c, idx) => ({ ...c, number: idx + 1 }));
            });
            setShowFileInspectModal(false);
            Alert.alert('Deleted', 'Chapter has been removed.');
          },
        },
      ]
    );
  };

  const handleDeleteChapterFile = (chapterId: string) => {
    Alert.alert(
      'Delete Attached File',
      'Are you sure you want to delete this attached file?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete File',
          style: 'destructive',
          onPress: () => {
            setChaptersList((prev) =>
              prev.map((c) =>
                c.id === chapterId
                  ? {
                      ...c,
                      fileName: undefined,
                      submittedAt: undefined,
                      status: 'Draft',
                      progress: 0,
                    }
                  : c
              )
            );
            setShowFileInspectModal(false);
            Alert.alert('File Removed', 'Attached file has been deleted from this chapter.');
          },
        },
      ]
    );
  };

  const handleChapterOptions = (ch: ChapterItem) => {
    setSelectedInspectChapter(ch);
    setShowFileInspectModal(true);
  };

  const handleNoteOptions = (note: NoteItem) => {
    setEditingNote(note);
    setNoteTitleInput(note.title);
    setNoteContentInput(note.content);
    setShowNoteModal(true);
  };

  const handleSaveNoteSubmit = () => {
    if (!noteTitleInput.trim()) {
      Alert.alert('Required', 'Please enter a note title.');
      return;
    }

    if (editingNote) {
      setNotesList((prev) =>
        prev.map((n) =>
          n.id === editingNote.id
            ? { ...n, title: noteTitleInput.trim(), content: noteContentInput.trim() }
            : n
        )
      );
      Alert.alert('Success', 'Note updated successfully.');
    } else {
      const newNoteObj: NoteItem = {
        id: `note-${Date.now()}`,
        title: noteTitleInput.trim(),
        content: noteContentInput.trim(),
        date: 'Just Now',
        isStarred: false,
      };
      setNotesList((prev) => [newNoteObj, ...prev]);
      Alert.alert('Success', 'New note created.');
    }

    setShowNoteModal(false);
    setEditingNote(null);
    setNoteTitleInput('');
    setNoteContentInput('');
  };

  const handleDeleteNoteSubmit = () => {
    if (!editingNote) return;

    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setNotesList((prev) => prev.filter((n) => n.id !== editingNote.id));
          setShowNoteModal(false);
          setEditingNote(null);
          setNoteTitleInput('');
          setNoteContentInput('');
          Alert.alert('Deleted', 'Note has been removed.');
        },
      },
    ]);
  };

  const handleSendReply = () => {
    if (!replyTextInput.trim()) {
      Alert.alert('Required', 'Please enter a response.');
      return;
    }

    if (replyingFeedback) {
      setAdviserFeedbacks((prev) =>
        prev.map((fb) =>
          fb.id === replyingFeedback.id
            ? { ...fb, replies: [...fb.replies, replyTextInput.trim()] }
            : fb
        )
      );
      Alert.alert('Reply Sent', 'Your response has been sent to your adviser.');
      setShowReplyModal(false);
      setReplyingFeedback(null);
      setReplyTextInput('');
    }
  };

  const renderActivityIcon = (type: ActivityLogItem['type']) => {
    return <Ionicons name="ellipse" size={16} color="#3B82F6" />;
  };

  const roadmapMilestones = [
    { id: 'ml', title: 'Proposal', date: 'Jan 16, 2026', isDone: true },
    ...chaptersList.map((ch) => ({
      id: ch.id,
      title: `Chapter ${ch.number}: ${ch.title}`,
      date:
        ch.number === 1
          ? 'Feb 10, 2026'
          : ch.number === 2
          ? 'Mar 05, 2026'
          : ch.number === 3
          ? 'Apr 20, 2026'
          : ch.number === 4
          ? 'Jun 10, 2026'
          : 'Aug 05, 2026',
      progress: ch.progress,
      fileName: ch.fileName,
      isDone: ch.progress === 100,
      isInProgress: ch.progress >= 0 && ch.progress < 100,
    })),
    { id: 'm7', title: 'Final Defense', date: 'Nov 20, 2026', isDone: false },
  ];

  const mockNotifications = [
    {
      id: 'n1',
      type: 'feedback',
      targetView: 'feedback',
      title: 'Adviser Feedback',
      message: 'Dr. Mationg reviewed your Chapter 2. Check the feedback in your workspace.',
      timeAgo: '47m ago',
      group: 'Today',
      unread: true,
      iconName: 'person',
      iconBg: '#818CF8',
    },
    {
      id: 'n2',
      type: 'task',
      targetView: 'tasks',
      title: 'Task Reminder',
      message: '"Finalize Chapter 2" is due tomorrow.',
      timeAgo: '2h ago',
      group: 'Today',
      unread: true,
      iconName: 'clipboard-outline',
      iconBg: '#BAE6FD',
    },
    {
      id: 'n3',
      type: 'consultation',
      targetView: 'meetings',
      title: 'Consultation',
      message: 'Your consultation is tomorrow at 2:00 PM.',
      timeAgo: '3h ago',
      group: 'Today',
      unread: true,
      iconName: 'calendar-outline',
      iconBg: '#BAE6FD',
    },
    {
      id: 'n4',
      type: 'ai',
      targetView: 'ai',
      title: 'A.I Tool',
      message: 'Your grammar check for Chapter 1 is complete.',
      timeAgo: '5h ago',
      group: 'Today',
      unread: true,
      iconName: 'robot-outline',
      iconBg: '#BAE6FD',
    },
    {
      id: 'n5',
      type: 'scholar',
      targetView: 'references',
      title: 'Google Scholar',
      message: 'New article saved to your references.',
      timeAgo: '1d ago',
      group: 'Yesterday',
      unread: false,
      iconName: 'school-outline',
      iconBg: '#BAE6FD',
    },
  ];

  const filteredNotifications =
    notificationTab === 'unread'
      ? mockNotifications.filter((n) => n.unread)
      : mockNotifications;

  const handleNotificationPress = (targetView: string) => {
    setStudentDashView(targetView);
  };

  return (
    <View style={styles.screenWrapper}>
      {studentDashView !== 'tasks' &&
        studentDashView !== 'files' &&
        studentDashView !== 'scholar' &&
        studentDashView !== 'meetings' &&
        studentDashView !== 'chat' &&
        studentDashView !== 'ai' &&
        studentDashView !== 'peer' &&
        studentDashView !== 'defense' &&
        studentDashView !== 'settings' &&
        studentDashView !== 'help' &&
        studentDashView !== 'profile' && (
          <View style={styles.dashHeaderBar}>
            <TouchableOpacity
              style={styles.headerIconTouch}
              onPress={() => {
                if (
                  studentDashView === 'roadmap' ||
                  studentDashView === 'deadlines' ||
                  studentDashView === 'activity' ||
                  studentDashView === 'notifications'
                ) {
                  setStudentDashView('workspace');
                } else {
                  setIsMenuOpen(true);
                }
              }}
            >
              <Ionicons
                name={
                  studentDashView === 'roadmap' ||
                  studentDashView === 'deadlines' ||
                  studentDashView === 'activity' ||
                  studentDashView === 'notifications'
                    ? 'arrow-back'
                    : 'menu-outline'
                }
                size={26}
                color="#FFFFFF"
              />
            </TouchableOpacity>

            <Text style={styles.dashHeaderTitle}>
              {studentDashView === 'main'
                ? 'Dashboard'
                : studentDashView === 'roadmap'
                ? 'Roadmap Timeline'
                : studentDashView === 'notifications'
                ? 'Notifications'
                : studentDashView === 'workspace'
                ? 'Thesis Workspace'
                : studentDashView === 'feedback'
                ? 'Adviser Feedback'
                : studentDashView === 'references'
                ? 'References'
                : studentDashView === 'meetings'
                ? 'Meetings'
                : studentDashView === 'chat'
                ? 'Chat'
                : studentDashView === 'ai'
                ? 'A.I Assistant'
                : studentDashView === 'peer'
                ? 'Peers Assessment'
                : studentDashView === 'defense'
                ? 'Defense Preparation'
                : studentDashView === 'settings'
                ? 'Settings'
                : studentDashView === 'help'
                ? 'Help & Support'
                : studentDashView === 'profile'
                ? 'Profile'
                : 'Dashboard'}
            </Text>

            {studentDashView === 'references' ? (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  style={styles.headerIconTouch}
                  onPress={() => setStudentDashView('scholar')}
                >
                  <Ionicons name="search-outline" size={22} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.headerIconTouch}
                  onPress={() => setRefAddModalActive(true)}
                >
                  <Ionicons name="add-circle" size={26} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.headerIconTouch}
                onPress={() => setStudentDashView('notifications')}
              >
                <Ionicons
                  name={
                    studentDashView === 'feedback'
                      ? 'ellipsis-vertical'
                      : 'notifications-outline'
                  }
                  size={22}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            )}
          </View>
        )}

      <View
        style={[
          styles.dashMainCard,
          (studentDashView === 'tasks' ||
            studentDashView === 'files' ||
            studentDashView === 'scholar' ||
            studentDashView === 'meetings' ||
            studentDashView === 'chat' ||
            studentDashView === 'ai' ||
            studentDashView === 'peer' ||
            studentDashView === 'defense' ||
            studentDashView === 'settings' ||
            studentDashView === 'help' ||
            studentDashView === 'profile') && {
            paddingTop: 0,
            paddingHorizontal: 0,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          },
        ]}
      >
        {studentDashView === 'main' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
            <Text style={styles.dashGreetingTitle}>Hello, {studentSurname}!</Text>
            <Text style={styles.dashGreetingSub}>Here's your thesis progress overview</Text>

            <TouchableOpacity
              style={styles.dashWhiteCard}
              activeOpacity={0.85}
              onPress={() => setStudentDashView('roadmap')}
            >
              <View style={styles.rowBetween}>
                <Text style={styles.cardHeaderTitle}>Overall Progress</Text>
                <Text style={styles.trackBadgeText}>On Track</Text>
              </View>
              <Text style={styles.progressPercentLarge}>{overallProgress}%</Text>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${overallProgress}%` }]} />
              </View>
              <Text style={styles.progressSubText}>{overallProgress}% completed</Text>
            </TouchableOpacity>

            <View style={styles.statsRowGrid}>
              <View style={styles.statMiniCard}>
                <Text style={styles.statMiniLabel}>Chapters</Text>
                <Text style={styles.statMiniValue}>
                  {completedChapters}/{chaptersList.length}
                </Text>
              </View>
              <View style={styles.statMiniCard}>
                <Text style={styles.statMiniLabel}>Tasks</Text>
                <Text style={styles.statMiniValue}>{tasksList.length}</Text>
                <Text style={styles.statSubText}>Total</Text>
              </View>
              <View style={styles.statMiniCard}>
                <Text style={styles.statMiniLabel}>Due Soon</Text>
                <Text style={styles.statMiniValue}>{dueSoonTasksCount}</Text>
                <Text style={styles.statSubText}>Tasks</Text>
              </View>
              <View style={styles.statMiniCard}>
                <Text style={[styles.statMiniLabel, { color: '#DC2626' }]}>Overdue</Text>
                <Text style={[styles.statMiniValue, { color: '#DC2626' }]}>{overdueTasksCount}</Text>
                <Text style={styles.statSubText}>Tasks</Text>
              </View>
            </View>

            <View style={styles.dashWhiteCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardHeaderTitle}>Milestone Progress</Text>
                <TouchableOpacity onPress={() => setStudentDashView('roadmap')}>
                  <Text style={styles.blueLinkText}>Roadmap Timeline</Text>
                </TouchableOpacity>
              </View>
              {chaptersList.map((ch) => (
                <View key={ch.id} style={{ marginTop: 12 }}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.chapterNameText}>
                      Chapter {ch.number}: {ch.title}
                    </Text>
                    <Text
                      style={[
                        styles.chapterPercentText,
                        { color: ch.progress === 100 ? '#16A34A' : '#1E58A8' },
                      ]}
                    >
                      {ch.progress}%
                    </Text>
                  </View>
                  <View style={styles.miniBarTrack}>
                    <View
                      style={[
                        styles.miniBarFill,
                        {
                          width: `${ch.progress}%`,
                          backgroundColor: ch.progress === 100 ? '#16A34A' : '#1E58A8',
                        },
                      ]}
                    />
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.dashWhiteCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardHeaderTitle}>Upcoming Deadlines</Text>
                <TouchableOpacity onPress={() => setStudentDashView('deadlines')}>
                  <Text style={styles.blueLinkText}>View all</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.deadlineRowItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deadlineTitleText}>Chapter 3: Methodology</Text>
                  <Text style={styles.deadlineDateText}>May 25, 2026</Text>
                </View>
                <Text style={styles.yellowBadgeText}>3 days left</Text>
              </View>
              <View style={styles.deadlineRowItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deadlineTitleText}>Adviser Consultation</Text>
                  <Text style={styles.deadlineDateText}>May 18, 2026</Text>
                </View>
                <Text style={styles.greenBadgeText}>Today</Text>
              </View>
              <View style={styles.deadlineRowItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.deadlineTitleText}>Pre-Final Defense</Text>
                  <Text style={styles.deadlineDateText}>June 01, 2026</Text>
                </View>
                <Text style={styles.blueBadgeText}>14 days left</Text>
              </View>
            </View>

            <View style={styles.dashWhiteCard}>
              <View style={styles.rowBetween}>
                <Text style={styles.cardHeaderTitle}>Recent Activity</Text>
                <TouchableOpacity
                  onPress={() => {
                    setStudentDashView('workspace');
                    setWorkspaceTab('Activity');
                  }}
                >
                  <Text style={styles.blueLinkText}>View all</Text>
                </TouchableOpacity>
              </View>
              {activityLogsList.slice(0, 2).map((act) => (
                <View key={act.id} style={styles.activityRowItem}>
                  <View style={styles.actAvatarCircle}>
                    <Ionicons name="person" size={20} color="#FFFFFF" />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.activityMainText}>
                      <Text style={{ fontWeight: 'bold' }}>{act.actor}</Text> {act.actionText}{' '}
                      <Text style={{ fontWeight: 'bold' }}>{act.targetText}</Text>
                    </Text>
                    <Text style={styles.activityTimeText}>{act.timeAgo}</Text>
                  </View>
                  <Ionicons name="ellipsis-vertical" size={18} color="#64748B" />
                </View>
              ))}
            </View>
          </ScrollView>
        )}

        {studentDashView === 'workspace' && (
          <ThesisWorkspaceScreen
            selectedThesis={selectedThesis}
            setShowProjectSelectModal={setShowProjectSelectModal}
            workspaceTab={workspaceTab}
            setWorkspaceTab={setWorkspaceTab}
            chaptersList={chaptersList}
            setShowAddChapterModal={setShowAddChapterModal}
            setStudentDashView={setStudentDashView}
            handleChapterOptions={handleChapterOptions}
            notesList={notesList}
            searchNoteQuery={searchNoteQuery}
            setSearchNoteQuery={setSearchNoteQuery}
            setEditingNote={setEditingNote}
            setNoteTitleInput={setNoteTitleInput}
            setNoteContentInput={setNoteContentInput}
            setShowNoteModal={setShowNoteModal}
            handleNoteOptions={handleNoteOptions}
            activityLogsList={activityLogsList}
            renderActivityIcon={renderActivityIcon}
          />
        )}

        {studentDashView === 'feedback' && (
          <AdviserFeedbackScreen setStudentDashView={setStudentDashView} />
        )}

        {studentDashView === 'references' && (
          <ReferenceScreen
            setStudentDashView={setStudentDashView}
            initialTab="Website"
            showSearchExternal={refSearchActive}
            setShowSearchExternal={setRefSearchActive}
            showAddExternal={refAddModalActive}
            setShowAddExternal={setRefAddModalActive}
          />
        )}

        {studentDashView === 'scholar' && (
          <GoogleScholarScreen
            setStudentDashView={setStudentDashView}
            onBackPress={() => setStudentDashView('references')}
          />
        )}

        {studentDashView === 'meetings' && (
          <MeetingsScreen
            setStudentDashView={setStudentDashView}
            setIsMenuOpen={setIsMenuOpen}
            onBackPress={() => setStudentDashView('main')}
          />
        )}

        {studentDashView === 'chat' && (
          <ThesisGroupChatScreen
            setStudentDashView={setStudentDashView}
            setIsMenuOpen={setIsMenuOpen}
            onBackPress={() => setStudentDashView('main')}
          />
        )}

        {studentDashView === 'ai' && (
          <AIAssistantScreen
            setStudentDashView={setStudentDashView}
            setIsMenuOpen={setIsMenuOpen}
            onBackPress={() => setStudentDashView('main')}
          />
        )}

        {studentDashView === 'peer' && (
          <PeerAssessmentScreen
            setStudentDashView={setStudentDashView}
            setIsMenuOpen={setIsMenuOpen}
            onBackPress={() => setStudentDashView('main')}
          />
        )}

        {studentDashView === 'defense' && (
          <DefensePreparationScreen
            setStudentDashView={setStudentDashView}
            setIsMenuOpen={setIsMenuOpen}
            onBackPress={() => setStudentDashView('main')}
          />
        )}

        {studentDashView === 'settings' && (
          <SettingsScreen
            setStudentDashView={setStudentDashView}
            setIsMenuOpen={setIsMenuOpen}
            onBackPress={() => setStudentDashView('main')}
            onLogout={onLogout}
          />
        )}

        {studentDashView === 'help' && (
          <HelpSupportScreen
            setStudentDashView={setStudentDashView}
            setIsMenuOpen={setIsMenuOpen}
            onBackPress={() => setStudentDashView('main')}
          />
        )}

        {studentDashView === 'profile' && (
          <ProfileScreen
            setStudentDashView={setStudentDashView}
            setIsMenuOpen={setIsMenuOpen}
            onBackPress={() => setStudentDashView('main')}
            selectedThesis={selectedThesis}
            onLogout={() => setShowLogoutModal(true)}
            userData={{
              fullName: userName,
              email: userEmail || 'user@gmail.com',
              role: 'Student',
            }}
          />
        )}

        {studentDashView === 'files' && (
          <FileRepositoryScreen
            searchFileQuery={searchFileQuery}
            setSearchFileQuery={setSearchFileQuery}
            filteredFolders={filteredFolders}
            filteredFiles={filteredFiles}
          />
        )}

        {studentDashView === 'tasks' && (
          <TasksScreen
            tasksList={tasksList as any}
            setTasksList={setTasksList as any}
            setStudentDashView={setStudentDashView}
            setIsMenuOpen={setIsMenuOpen}
          />
        )}

        {studentDashView === 'notifications' && (
          <View style={{ flex: 1 }}>
            <View style={styles.notifFilterTabBar}>
              <TouchableOpacity
                style={[
                  styles.notifTabBtn,
                  notificationTab === 'all' && styles.notifTabBtnActive,
                ]}
                onPress={() => setNotificationTab('all')}
              >
                <Text
                  style={[
                    styles.notifTabText,
                    notificationTab === 'all' && styles.notifTabTextActive,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.notifTabBtn,
                  notificationTab === 'unread' && styles.notifTabBtnActive,
                ]}
                onPress={() => setNotificationTab('unread')}
              >
                <Text
                  style={[
                    styles.notifTabText,
                    notificationTab === 'unread' && styles.notifTabTextActive,
                  ]}
                >
                  Unread
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
              {filteredNotifications.filter((item) => item.group === 'Today').length > 0 && (
                <>
                  <Text style={styles.notifGroupHeading}>Today</Text>
                  {filteredNotifications
                    .filter((item) => item.group === 'Today')
                    .map((notif) => (
                      <TouchableOpacity
                        key={notif.id}
                        style={styles.notifCardItem}
                        activeOpacity={0.7}
                        onPress={() => handleNotificationPress(notif.targetView)}
                      >
                        <View style={[styles.notifIconCircle, { backgroundColor: notif.iconBg }]}>
                          {notif.type === 'feedback' ? (
                            <Ionicons name="person" size={24} color="#FFFFFF" />
                          ) : notif.type === 'ai' ? (
                            <MaterialCommunityIcons name="robot-outline" size={24} color="#1E58A8" />
                          ) : (
                            <Ionicons name={notif.iconName as any} size={22} color="#1E58A8" />
                          )}
                        </View>
                        <View style={styles.notifTextContent}>
                          <View style={styles.rowBetween}>
                            <Text style={styles.notifItemTitle}>{notif.title}</Text>
                            <View style={styles.timeBadgeRow}>
                              <Text style={styles.notifTimeText}>{notif.timeAgo}</Text>
                              {notif.unread && <View style={styles.redDotUnread} />}
                            </View>
                          </View>
                          <Text style={styles.notifMessageText}>{notif.message}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                      </TouchableOpacity>
                    ))}
                </>
              )}
            </ScrollView>
          </View>
        )}

        {studentDashView === 'roadmap' && (
          <View style={{ flex: 1 }}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
              <View style={styles.roadmapProgressBox}>
                <View style={styles.rowBetween}>
                  <Text style={styles.roadmapProgressLabel}>Overall Progress</Text>
                  <Text style={styles.roadmapProgressValText}>{overallProgress}%</Text>
                </View>
                <View style={styles.roadmapTrackBar}>
                  <View style={[styles.roadmapFillBar, { width: `${overallProgress}%` }]} />
                </View>
              </View>

              <View style={styles.roadmapDividerLine} />

              <View style={styles.timelineListContainer}>
                {roadmapMilestones.map((item, index) => {
                  const isLast = index === roadmapMilestones.length - 1;
                  return (
                    <View key={item.id} style={styles.timelineRowNode}>
                      <View style={styles.nodeLeftColumn}>
                        {!isLast && (
                          <View
                            style={[
                              styles.nodeConnectingLine,
                              item.isDone && styles.lineCompleted,
                            ]}
                          />
                        )}
                        {item.isDone ? (
                          <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
                        ) : item.isInProgress ? (
                          <Ionicons name="checkmark-circle" size={22} color="#1E58A8" />
                        ) : (
                          <View style={styles.nodePendingCircle} />
                        )}
                      </View>
                      <View style={styles.nodeContentBox}>
                        <Text style={styles.nodeTitleText}>{item.title}</Text>
                        <Text style={styles.nodeDateText}>{item.date}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        )}

        {studentDashView === 'deadlines' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
            <TouchableOpacity style={styles.backButtonRow} onPress={() => setStudentDashView('main')}>
              <Ionicons name="arrow-back" size={20} color="#1E58A8" />
              <Text style={styles.backButtonText}>Back to Dashboard</Text>
            </TouchableOpacity>

            <Text style={styles.sectionHeaderTitle}>All Deadlines & Submissions</Text>
            <Text style={styles.sectionHeaderSub}>
              Check requirements and inspect submitted files
            </Text>

            {chaptersList.map((ch) => (
              <View key={ch.id} style={styles.deadlineCardBox}>
                <View style={styles.rowBetween}>
                  <Text style={styles.deadlineTitleText}>
                    Chapter {ch.number}: {ch.title}
                  </Text>
                  <Text style={ch.progress === 100 ? styles.greenBadgeText : styles.yellowBadgeText}>
                    {ch.progress === 100 ? 'Submitted' : 'Pending'}
                  </Text>
                </View>
                <Text style={styles.deadlineDateText}>Requirement: Final Draft PDF Submission</Text>

                {ch.fileName ? (
                  <TouchableOpacity
                    style={styles.inspectBtnRow}
                    onPress={() => {
                      setSelectedInspectChapter(ch);
                      setShowFileInspectModal(true);
                    }}
                  >
                    <Text style={{ fontSize: 13, color: '#1E58A8', fontWeight: 'bold' }}>
                      View Submitted File ({ch.fileName})
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.submitFileActionBtn}
                    onPress={() => handleReSubmitFile(ch.id)}
                  >
                    <Text style={{ color: '#FFFFFF', fontWeight: 'bold', fontSize: 12 }}>
                      Submit File Now
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
        )}

        {studentDashView === 'activity' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
            <TouchableOpacity style={styles.backButtonRow} onPress={() => setStudentDashView('main')}>
              <Ionicons name="arrow-back" size={20} color="#1E58A8" />
              <Text style={styles.backButtonText}>Back to Dashboard</Text>
            </TouchableOpacity>

            <Text style={styles.sectionHeaderTitle}>Recent Educator Activity</Text>
            <Text style={styles.sectionHeaderSub}>Real-time updates on checks, feedback, and grades</Text>

            {activityLogsList.map((act) => (
              <View key={act.id} style={styles.activityFullCard}>
                <View style={styles.actAvatarCircle}>
                  <Ionicons name="person" size={20} color="#FFFFFF" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.activityMainText}>
                    <Text style={{ fontWeight: 'bold' }}>{act.actor}</Text> {act.actionText}{' '}
                    <Text style={{ fontWeight: 'bold', color: '#1E58A8' }}>{act.targetText}</Text>
                  </Text>
                  <Text style={styles.activityTimeText}>{act.timeAgo}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      {!isMenuOpen && (
        <View style={styles.bottomNavContainer}>
          <TouchableOpacity style={styles.navTabItem} onPress={() => setStudentDashView('main')}>
            <Ionicons
              name="home"
              size={20}
              color={studentDashView === 'main' ? '#1E58A8' : '#64748B'}
            />
            <Text
              style={[
                styles.navTabText,
                studentDashView === 'main' && styles.navTabTextActive,
              ]}
            >
              Dashboard
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navTabItem}
            onPress={() => {
              setStudentDashView('workspace');
              setWorkspaceTab('Overview');
            }}
          >
            <Ionicons
              name="grid"
              size={20}
              color={
                studentDashView === 'workspace' || studentDashView === 'files'
                  ? '#1E58A8'
                  : '#64748B'
              }
            />
            <Text
              style={[
                styles.navTabText,
                (studentDashView === 'workspace' || studentDashView === 'files') &&
                  styles.navTabTextActive,
              ]}
            >
              Workspace
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navTabItem} onPress={() => setStudentDashView('chat')}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={20}
              color={studentDashView === 'chat' ? '#1E58A8' : '#64748B'}
            />
            <Text
              style={[
                styles.navTabText,
                studentDashView === 'chat' && styles.navTabTextActive,
              ]}
            >
              Chat
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navTabItem} onPress={() => setStudentDashView('tasks')}>
            <Octicons
              name="tasklist"
              size={20}
              color={studentDashView === 'tasks' ? '#1E58A8' : '#64748B'}
            />
            <Text
              style={[
                styles.navTabText,
                studentDashView === 'tasks' && styles.navTabTextActive,
              ]}
            >
              Tasks
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navTabItem} onPress={() => setStudentDashView('profile')}>
            <Ionicons
              name="person"
              size={20}
              color={studentDashView === 'profile' ? '#1E58A8' : '#64748B'}
            />
            <Text
              style={[
                styles.navTabText,
                studentDashView === 'profile' && styles.navTabTextActive,
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal visible={isMenuOpen} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.drawerOverlay}>
          <View style={styles.drawerContentCard}>
            <TouchableOpacity style={styles.drawerCloseBtn} onPress={() => setIsMenuOpen(false)}>
              <Ionicons name="arrow-back" size={22} color="#000000" />
            </TouchableOpacity>

            <View style={styles.drawerBrandHeader}>
              <Ionicons name="school" size={44} color="#1E58A8" />
              <Text style={styles.drawerBrandTitle}>ThesisPilot</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              <TouchableOpacity
                style={[
                  styles.drawerMenuItem,
                  studentDashView === 'main' && styles.drawerMenuItemActive,
                ]}
                onPress={() => handleMenuSelect('main')}
              >
                <Ionicons
                  name="home-outline"
                  size={20}
                  color={studentDashView === 'main' ? '#1E58A8' : '#000000'}
                />
                <Text
                  style={[
                    styles.drawerMenuText,
                    studentDashView === 'main' && styles.drawerMenuTextActive,
                  ]}
                >
                  Dashboard
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.drawerMenuItem,
                  studentDashView === 'workspace' && styles.drawerMenuItemActive,
                ]}
                onPress={() => handleMenuSelect('workspace')}
              >
                <Ionicons
                  name="grid-outline"
                  size={20}
                  color={studentDashView === 'workspace' ? '#1E58A8' : '#000000'}
                />
                <Text
                  style={[
                    styles.drawerMenuText,
                    studentDashView === 'workspace' && styles.drawerMenuTextActive,
                  ]}
                >
                  Thesis Workspace
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.drawerMenuItem,
                  studentDashView === 'tasks' && styles.drawerMenuItemActive,
                ]}
                onPress={() => handleMenuSelect('tasks')}
              >
                <Octicons
                  name="tasklist"
                  size={18}
                  color={studentDashView === 'tasks' ? '#1E58A8' : '#000000'}
                />
                <Text
                  style={[
                    styles.drawerMenuText,
                    studentDashView === 'tasks' && styles.drawerMenuTextActive,
                  ]}
                >
                  Tasks
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.drawerMenuItem,
                  studentDashView === 'feedback' && styles.drawerMenuItemActive,
                ]}
                onPress={() => handleMenuSelect('feedback')}
              >
                <Ionicons
                  name="chatbox-ellipses-outline"
                  size={20}
                  color={studentDashView === 'feedback' ? '#1E58A8' : '#000000'}
                />
                <Text
                  style={[
                    styles.drawerMenuText,
                    studentDashView === 'feedback' && styles.drawerMenuTextActive,
                  ]}
                >
                  Adviser Feedback
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.drawerMenuItem,
                  (studentDashView === 'references' || studentDashView === 'scholar') &&
                    styles.drawerMenuItemActive,
                ]}
                onPress={() => handleMenuSelect('references')}
              >
                <Ionicons
                  name="book-outline"
                  size={20}
                  color={
                    studentDashView === 'references' || studentDashView === 'scholar'
                      ? '#1E58A8'
                      : '#000000'
                  }
                />
                <Text
                  style={[
                    styles.drawerMenuText,
                    (studentDashView === 'references' || studentDashView === 'scholar') &&
                      styles.drawerMenuTextActive,
                  ]}
                >
                  References
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.drawerMenuItem,
                  studentDashView === 'meetings' && styles.drawerMenuItemActive,
                ]}
                onPress={() => handleMenuSelect('meetings')}
              >
                <Ionicons
                  name="videocam-outline"
                  size={20}
                  color={studentDashView === 'meetings' ? '#1E58A8' : '#000000'}
                />
                <Text
                  style={[
                    styles.drawerMenuText,
                    studentDashView === 'meetings' && styles.drawerMenuTextActive,
                  ]}
                >
                  Meetings
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.drawerMenuItem,
                  studentDashView === 'chat' && styles.drawerMenuItemActive,
                ]}
                onPress={() => handleMenuSelect('chat')}
              >
                <Ionicons
                  name="chatbubbles-outline"
                  size={20}
                  color={studentDashView === 'chat' ? '#1E58A8' : '#000000'}
                />
                <Text
                  style={[
                    styles.drawerMenuText,
                    studentDashView === 'chat' && styles.drawerMenuTextActive,
                  ]}
                >
                  Chat
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.drawerMenuItem,
                  studentDashView === 'ai' && styles.drawerMenuItemActive,
                ]}
                onPress={() => handleMenuSelect('ai')}
              >
                <MaterialCommunityIcons
                  name="robot-outline"
                  size={20}
                  color={studentDashView === 'ai' ? '#1E58A8' : '#000000'}
                />
                <Text
                  style={[
                    styles.drawerMenuText,
                    studentDashView === 'ai' && styles.drawerMenuTextActive,
                  ]}
                >
                  A.I Assistant
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.drawerMenuItem,
                  studentDashView === 'peer' && styles.drawerMenuItemActive,
                ]}
                onPress={() => handleMenuSelect('peer')}
              >
                <Ionicons
                  name="people-outline"
                  size={20}
                  color={studentDashView === 'peer' ? '#1E58A8' : '#000000'}
                />
                <Text
                  style={[
                    styles.drawerMenuText,
                    studentDashView === 'peer' && styles.drawerMenuTextActive,
                  ]}
                >
                  Peer Assessment
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.drawerMenuItem,
                  studentDashView === 'defense' && styles.drawerMenuItemActive,
                ]}
                onPress={() => handleMenuSelect('defense')}
              >
                <Ionicons
                  name="time-outline"
                  size={20}
                  color={studentDashView === 'defense' ? '#1E58A8' : '#000000'}
                />
                <Text
                  style={[
                    styles.drawerMenuText,
                    studentDashView === 'defense' && styles.drawerMenuTextActive,
                  ]}
                >
                  Defense Preparation
                </Text>
              </TouchableOpacity>

              <View style={styles.drawerDivider} />

              <TouchableOpacity
                style={[
                  styles.drawerMenuItem,
                  studentDashView === 'settings' && styles.drawerMenuItemActive,
                ]}
                onPress={() => handleMenuSelect('settings')}
              >
                <Ionicons
                  name="settings-outline"
                  size={20}
                  color={studentDashView === 'settings' ? '#1E58A8' : '#000000'}
                />
                <Text
                  style={[
                    styles.drawerMenuText,
                    studentDashView === 'settings' && styles.drawerMenuTextActive,
                  ]}
                >
                  Settings
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.drawerMenuItem,
                  studentDashView === 'help' && styles.drawerMenuItemActive,
                ]}
                onPress={() => handleMenuSelect('help')}
              >
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color={studentDashView === 'help' ? '#1E58A8' : '#000000'}
                />
                <Text
                  style={[
                    styles.drawerMenuText,
                    studentDashView === 'help' && styles.drawerMenuTextActive,
                  ]}
                >
                  Help & Support
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerMenuItem}
                onPress={() => handleMenuSelect('logout')}
              >
                <Ionicons name="log-out-outline" size={20} color="#DC2626" />
                <Text style={[styles.drawerMenuText, { color: '#DC2626', fontWeight: 'bold' }]}>
                  Logout
                </Text>
              </TouchableOpacity>

              <Text style={styles.appVersionText}>App Version 1.0.0</Text>
            </ScrollView>
          </View>

          <TouchableOpacity style={styles.drawerDismissArea} onPress={() => setIsMenuOpen(false)} />
        </View>
      </Modal>

      <Modal visible={showNoteModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>
              {editingNote ? 'Edit Thesis Note' : 'Create New Thesis Note'}
            </Text>

            <Text style={styles.inputLabelText}>Note Title</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="e.g., Research Problem Ideas"
              placeholderTextColor="#94A3B8"
              value={noteTitleInput}
              onChangeText={setNoteTitleInput}
            />

            <Text style={styles.inputLabelText}>Initial Ideas / Content</Text>
            <TextInput
              style={[styles.modalTextInput, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Type your thesis notes, thoughts, or questions..."
              placeholderTextColor="#94A3B8"
              multiline
              value={noteContentInput}
              onChangeText={setNoteContentInput}
            />

            <View style={styles.modalActionRow}>
              {editingNote && (
                <TouchableOpacity
                  style={[styles.dangerRedBtn, { flex: 1, paddingHorizontal: 8 }]}
                  onPress={handleDeleteNoteSubmit}
                >
                  <Ionicons name="trash-outline" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.dangerRedBtnText}>Delete</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.cancelOutlineBtn, { flex: 1 }]}
                onPress={() => {
                  setShowNoteModal(false);
                  setEditingNote(null);
                  setNoteTitleInput('');
                  setNoteContentInput('');
                }}
              >
                <Text style={styles.cancelOutlineBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryBlueBtn, { flex: 1 }]}
                onPress={handleSaveNoteSubmit}
              >
                <Text style={styles.primaryBlueBtnText}>
                  {editingNote ? 'Save' : 'Create'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showReplyModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>
              Reply to {replyingFeedback?.adviserName || 'Adviser'}
            </Text>
            <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>
              Re: {replyingFeedback?.chapterTag}
            </Text>

            <TextInput
              style={[styles.modalTextInput, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Type your reply or questions regarding this feedback..."
              placeholderTextColor="#94A3B8"
              multiline
              value={replyTextInput}
              onChangeText={setReplyTextInput}
            />

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={[styles.cancelOutlineBtn, { flex: 1 }]}
                onPress={() => {
                  setShowReplyModal(false);
                  setReplyingFeedback(null);
                  setReplyTextInput('');
                }}
              >
                <Text style={styles.cancelOutlineBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.primaryBlueBtn, { flex: 1 }]} onPress={handleSendReply}>
                <Text style={styles.primaryBlueBtnText}>Send Reply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showAddChapterModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Add New Chapter</Text>

            <Text style={styles.inputLabelText}>Chapter Title</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="e.g., Results and Discussion"
              placeholderTextColor="#94A3B8"
              value={newChapterTitle}
              onChangeText={setNewChapterTitle}
            />

            <TouchableOpacity
              style={styles.uploadDashedBox}
              onPress={() => {
                handlePickDocumentFromPhone((pickedFileName) => {
                  setNewChapterFile(pickedFileName);
                });
              }}
            >
              <Ionicons name="cloud-upload-outline" size={24} color="#1E58A8" />
              <Text style={styles.uploadDashedText}>
                {newChapterFile ? `Attached: ${newChapterFile}` : 'Upload Initial File from Phone'}
              </Text>
            </TouchableOpacity>

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.cancelOutlineBtn}
                onPress={() => {
                  setShowAddChapterModal(false);
                  setNewChapterTitle('');
                  setNewChapterFile(null);
                }}
              >
                <Text style={styles.cancelOutlineBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryBlueBtn} onPress={handleAddChapterSubmit}>
                <Text style={styles.primaryBlueBtnText}>Create Chapter</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showProjectSelectModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Select Thesis Project</Text>

            {thesisProjectsList.map((proj) => (
              <TouchableOpacity
                key={proj.id}
                style={{
                  padding: 12,
                  borderWidth: 1,
                  borderColor: selectedThesis.id === proj.id ? '#1E58A8' : '#CBD5E1',
                  borderRadius: 8,
                  backgroundColor: selectedThesis.id === proj.id ? '#EFF6FF' : '#FFFFFF',
                  marginBottom: 8,
                }}
                onPress={() => {
                  setSelectedThesis(proj);
                  setShowProjectSelectModal(false);
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#0F172A' }}>
                  {proj.title}
                </Text>
                <Text style={{ fontSize: 11, color: '#64748B', marginTop: 2 }}>{proj.adviser}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.cancelOutlineBtn, { marginTop: 8 }]}
              onPress={() => setShowProjectSelectModal(false)}
            >
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showFileInspectModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>
              Chapter {selectedInspectChapter?.number}: {selectedInspectChapter?.title}
            </Text>

            <TouchableOpacity
              style={styles.fileDetailsCardBox}
              activeOpacity={0.75}
              onPress={() => {
                setShowFileInspectModal(false);
                setStudentDashView('files');
              }}
            >
              <Text style={styles.fileDetailsLabel}>Attached File:</Text>
              <Text style={styles.fileDetailsFileNameText}>
                {selectedInspectChapter?.fileName || 'Chapter1_Final.pdf'}
              </Text>
              <Text style={styles.fileDetailsStatusText}>
                Status: {selectedInspectChapter?.status || 'Approved'} ({selectedInspectChapter?.progress || 100}%)
              </Text>
            </TouchableOpacity>

            <View style={styles.modalButtonStack}>
              <TouchableOpacity
                style={styles.primaryBlueBtn}
                activeOpacity={0.85}
                onPress={() => {
                  if (selectedInspectChapter) {
                    handleReSubmitFile(selectedInspectChapter.id);
                  }
                }}
              >
                <Ionicons name="cloud-upload-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.primaryBlueBtnText}>
                  {selectedInspectChapter?.fileName
                    ? 'Re-submit / Choose File from Phone'
                    : 'Upload File Now'}
                </Text>
              </TouchableOpacity>

              {selectedInspectChapter?.fileName && (
                <TouchableOpacity
                  style={styles.deleteFileBtn}
                  activeOpacity={0.85}
                  onPress={() => {
                    if (selectedInspectChapter) {
                      handleDeleteChapterFile(selectedInspectChapter.id);
                    }
                  }}
                >
                  <Ionicons name="document-text-outline" size={18} color="#DC2626" style={{ marginRight: 6 }} />
                  <Text style={styles.deleteFileBtnText}>Delete Attached File Only</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.dangerRedBtn}
                activeOpacity={0.85}
                onPress={() => {
                  if (selectedInspectChapter) {
                    handleDeleteChapter(selectedInspectChapter.id);
                  }
                }}
              >
                <Ionicons name="trash-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.dangerRedBtnText}>Delete Chapter Entirely</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cancelOutlineBtn}
                activeOpacity={0.85}
                onPress={() => setShowFileInspectModal(false)}
              >
                <Text style={styles.cancelOutlineBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showLogoutModal} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.modalOverlayDark}>
          <View style={styles.logoutBlueCard}>
            <Text style={styles.logoutModalTitle}>Log Out</Text>
            <Text style={styles.logoutModalSubText}>Are you sure you want to logout?</Text>
            <View style={styles.logoutModalActionRow}>
              <TouchableOpacity
                style={styles.logoutCancelTextBtn}
                activeOpacity={0.7}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.logoutCancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutConfirmRedBtn}
                activeOpacity={0.85}
                onPress={() => {
                  setShowLogoutModal(false);
                  setIsMenuOpen(false);
                  onLogout();
                }}
              >
                <Text style={styles.logoutConfirmText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: '#1E58A8',
  },
  dashHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 44,
    paddingBottom: 12,
    backgroundColor: '#1E58A8',
  },
  dashHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerIconTouch: {
    padding: 4,
  },
  dashMainCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  dashGreetingTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
  dashGreetingSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  dashWhiteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  trackBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16A34A',
  },
  progressPercentLarge: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginVertical: 4,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1E58A8',
  },
  progressSubText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 6,
  },
  statsRowGrid: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  statMiniCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  statMiniLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  statMiniValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 4,
  },
  statSubText: {
    fontSize: 10,
    color: '#64748B',
  },
  blueLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E58A8',
  },
  chapterNameText: {
    fontSize: 13,
    color: '#475569',
  },
  chapterPercentText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  miniBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginTop: 4,
    overflow: 'hidden',
  },
  miniBarFill: {
    height: '100%',
  },
  deadlineRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  deadlineTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  deadlineDateText: {
    fontSize: 11,
    color: '#64748B',
  },
  yellowBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#D97706',
  },
  greenBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#16A34A',
  },
  blueBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E58A8',
  },
  activityRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  actAvatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1E58A8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityMainText: {
    fontSize: 13,
    color: '#000000',
  },
  activityTimeText: {
    fontSize: 11,
    color: '#64748B',
  },
  backButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E58A8',
    marginLeft: 6,
  },
  sectionHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  sectionHeaderSub: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 16,
  },
  notifFilterTabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 3,
    marginBottom: 16,
  },
  notifTabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
  },
  notifTabBtnActive: {
    backgroundColor: '#BFDBFE',
  },
  notifTabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  notifTabTextActive: {
    color: '#1E58A8',
  },
  notifGroupHeading: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
  },
  notifCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    marginBottom: 10,
    padding: 12,
  },
  notifIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notifTextContent: {
    flex: 1,
    marginRight: 8,
  },
  notifItemTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
  },
  timeBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  notifTimeText: {
    fontSize: 11,
    color: '#64748B',
  },
  redDotUnread: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  notifMessageText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 16,
  },
  roadmapProgressBox: {
    paddingVertical: 8,
    marginBottom: 12,
  },
  roadmapProgressLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
  },
  roadmapProgressValText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
  },
  roadmapTrackBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginTop: 8,
    overflow: 'hidden',
  },
  roadmapFillBar: {
    height: '100%',
    backgroundColor: '#1E58A8',
  },
  roadmapDividerLine: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  timelineListContainer: {
    paddingTop: 8,
  },
  timelineRowNode: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  nodeLeftColumn: {
    width: 32,
    alignItems: 'center',
    position: 'relative',
  },
  nodeConnectingLine: {
    position: 'absolute',
    top: 22,
    bottom: -28,
    width: 2,
    backgroundColor: '#CBD5E1',
    zIndex: 1,
  },
  lineCompleted: {
    backgroundColor: '#16A34A',
  },
  nodePendingCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#94A3B8',
    backgroundColor: '#FFFFFF',
    marginTop: 2,
  },
  nodeContentBox: {
    flex: 1,
    paddingLeft: 12,
  },
  nodeTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
  },
  nodeDateText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 2,
  },
  deadlineCardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  inspectBtnRow: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  submitFileActionBtn: {
    backgroundColor: '#1E58A8',
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    marginTop: 10,
  },
  activityFullCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  bottomNavContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 8,
  },
  navTabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTabText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  navTabTextActive: {
    color: '#1E58A8',
    fontWeight: 'bold',
  },
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    zIndex: 99999,
  },
  drawerContentCard: {
    width: '75%',
    backgroundColor: '#FFFFFF',
    height: '100%',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 12 : 44,
  },
  drawerDismissArea: {
    flex: 1,
  },
  drawerCloseBtn: {
    marginBottom: 10,
  },
  drawerBrandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  drawerBrandTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1E58A8',
    marginLeft: 10,
    fontStyle: 'italic',
  },
  drawerMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 4,
  },
  drawerMenuItemActive: {
    backgroundColor: '#BFDBFE',
  },
  drawerMenuText: {
    fontSize: 14,
    color: '#000000',
    marginLeft: 12,
    fontWeight: 'bold',
  },
  drawerMenuTextActive: {
    color: '#1E58A8',
  },
  drawerDivider: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginVertical: 10,
  },
  appVersionText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 16,
    marginLeft: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  modalOverlayDark: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalWhiteCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 14,
  },
  inputLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 14,
  },
  uploadDashedBox: {
    borderWidth: 1.5,
    borderColor: '#1E58A8',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9FF',
    marginBottom: 18,
  },
  uploadDashedText: {
    fontSize: 12,
    color: '#1E58A8',
    fontWeight: 'bold',
    marginTop: 4,
  },
  fileDetailsCardBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  fileDetailsLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  fileDetailsFileNameText: {
    fontSize: 13,
    color: '#1E58A8',
    fontWeight: 'bold',
    marginTop: 2,
  },
  fileDetailsStatusText: {
    fontSize: 11,
    color: '#475569',
    marginTop: 4,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  modalButtonStack: {
    gap: 10,
  },
  primaryBlueBtn: {
    flexDirection: 'row',
    backgroundColor: '#1E58A8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBlueBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  deleteFileBtn: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteFileBtnText: {
    color: '#DC2626',
    fontWeight: 'bold',
    fontSize: 14,
  },
  dangerRedBtn: {
    flexDirection: 'row',
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerRedBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cancelOutlineBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelOutlineBtnText: {
    color: '#475569',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  logoutBlueCard: {
    width: '82%',
    backgroundColor: '#1E58A8',
    borderRadius: 12,
    padding: 20,
    elevation: 8,
  },
  logoutModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  logoutModalSubText: {
    fontSize: 13,
    color: '#E0F2FE',
    marginBottom: 20,
  },
  logoutModalActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16,
  },
  logoutCancelTextBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  logoutCancelText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  logoutConfirmRedBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutConfirmText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});