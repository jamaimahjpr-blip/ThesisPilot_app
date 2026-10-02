import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  PixelRatio,
  StatusBar,
  Platform,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
  Feather,
  SimpleLineIcons,
} from '@expo/vector-icons';

const SCREEN_WIDTH = Dimensions.get('window').width;
const scaleFont = (size: number) => {
  const scale = SCREEN_WIDTH / 375;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  isUnread: boolean;
  section: 'Today' | 'Yesterday';
  iconType: 'person' | 'task' | 'calendar' | 'ai' | 'scholar';
  iconBgColor: string;
  iconColor: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'Adviser Feedback',
    description: 'Dr. Mationg reviewed your Chapter 2. Check the feedback in your workspace.',
    time: '47m ago',
    isUnread: true,
    section: 'Today',
    iconType: 'person',
    iconBgColor: '#4F46E5',
    iconColor: '#FFFFFF',
  },
  {
    id: '2',
    title: 'Task Reminder',
    description: '"Finalize Chapter 2" is due tomorrow.',
    time: '2h ago',
    isUnread: false,
    section: 'Today',
    iconType: 'task',
    iconBgColor: '#BAE6FD',
    iconColor: '#0284C7',
  },
  {
    id: '3',
    title: 'Consultation',
    description: 'Your consultation is tomorrow at 2:00 PM.',
    time: '3h ago',
    isUnread: true,
    section: 'Today',
    iconType: 'calendar',
    iconBgColor: '#BAE6FD',
    iconColor: '#0284C7',
  },
  {
    id: '4',
    title: 'AI Tool',
    description: 'Your grammar check for Chapter 1 is complete.',
    time: '5h ago',
    isUnread: true,
    section: 'Today',
    iconType: 'ai',
    iconBgColor: '#BAE6FD',
    iconColor: '#0284C7',
  },
  {
    id: '5',
    title: 'Google Scholar',
    description: 'New article saved to your references.',
    time: '1d ago',
    isUnread: false,
    section: 'Yesterday',
    iconType: 'scholar',
    iconBgColor: '#BAE6FD',
    iconColor: '#0284C7',
  },
];

interface ReferenceItem {
  id: string;
  type: 'Book' | 'Journal' | 'Website';
  title: string;
  author: string;
  details: string;
}

const REFERENCES_DATA: ReferenceItem[] = [
  {
    id: '1',
    type: 'Journal',
    title: 'The Impact of Artificial Intelligence on Education',
    author: 'Johnson, R., & Smith, T.',
    details: 'Journal of Educational Technology, 45(2), 123-145.',
  },
  {
    id: '2',
    type: 'Book',
    title: 'AI in Higher Education: A Systematic Review',
    author: 'Brown, A.',
    details: 'International Journal of Learning Technology, 15(3), 200-215.',
  },
  {
    id: '3',
    type: 'Website',
    title: 'Mobile Learning and Student Performance',
    author: 'Williams, K., et al.',
    details: 'Computers & Education, 128, 80-65.',
  },
];

interface ScholarSearchItem {
  id: string;
  title: string;
  authors: string;
  publication: string;
  snippet: string;
  citedBy: number;
  pdfAvailable: boolean;
  isSaved: boolean;
}

const INITIAL_SCHOLAR_RESULTS: ScholarSearchItem[] = [
  {
    id: 's1',
    title: 'Artificial Intelligence in Higher Education: Promises and Pitfalls',
    authors: 'Zawacki-Richter, O., Marín, V. I., Bond, M., & Gouverneur, F.',
    publication: 'International Journal of Educational Technology in Higher Education, 2019',
    snippet:
      'This systematic review synthesizes research on AI applications in higher education and categorizes them into profiling, assessment, and tutoring systems.',
    citedBy: 1420,
    pdfAvailable: true,
    isSaved: false,
  },
  {
    id: 's2',
    title: 'Impact of AI-Powered Learning Support Tools on Academic Performance',
    authors: 'Chen, L., Chen, P., & Lin, Z.',
    publication: 'Computers & Education, 162, 104084, 2021',
    snippet:
      'We investigate how student engagement with conversational AI assistants improves conceptual understanding and reduces study friction in STEM courses.',
    citedBy: 389,
    pdfAvailable: true,
    isSaved: true,
  },
  {
    id: 's3',
    title: 'Ethics and Governance of Artificial Intelligence in Student Workflows',
    authors: 'Holmes, W., Bialik, M., & Fadel, C.',
    publication: 'Center for Curriculum Redesign, 2020',
    snippet:
      'An exploration of ethical considerations, academic integrity, and policy frameworks surrounding automated writing and search tools in universities.',
    citedBy: 512,
    pdfAvailable: false,
    isSaved: false,
  },
];

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('Cooper');
  const [fullName, setFullName] = useState('Cooper Vance');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Student');

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedUser = await AsyncStorage.getItem('@user_data');
      if (savedUser !== null) {
        const parsed = JSON.parse(savedUser);
        if (parsed.username) setUsername(parsed.username);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.role) setRole(parsed.role);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogin = async () => {
    if (username.trim()) {
      try {
        const userData = { username, fullName, role };
        await AsyncStorage.setItem('@user_data', JSON.stringify(userData));
        setIsLoggedIn(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsMenuOpen(false);
  };

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'Dashboard' | 'Workspace' | 'Chat' | 'Tasks' | 'Profile' | 'Files' | 'Feedback'
  >('Dashboard');
  const [currentView, setCurrentView] = useState<
    'main' | 'notifications' | 'roadmap' | 'references' | 'defensePrep' | 'googleScholar'
  >('main');
  const [notifFilterTab, setNotifFilterTab] = useState<'All' | 'Unread'>('All');
  const [workspaceSubTab, setWorkspaceSubTab] = useState<
    'Overview' | 'Chapters' | 'Notes' | 'Activity'
  >('Activity');
  const [taskSubTab, setTaskSubTab] = useState<'My Tasks' | 'All Tasks' | 'Calendar'>('My Tasks');
  const [feedbackSubTab, setFeedbackSubTab] = useState<'Feedback' | 'Calendar'>('Feedback');
  const [refTab, setRefTab] = useState<'All' | 'Book' | 'Journal' | 'Website'>('All');
  const [scholarQuery, setScholarQuery] = useState('Artificial Intelligence in Education');
  const [scholarFilter, setScholarFilter] = useState<'Any time' | 'Since 2023' | 'Since 2026'>('Any time');
  const [scholarResults, setScholarResults] = useState<ScholarSearchItem[]>(INITIAL_SCHOLAR_RESULTS);
  const [selectedPaper, setSelectedPaper] = useState<ScholarSearchItem | null>(null);

  const [checklist, setChecklist] = useState([
    { id: '1', title: 'Finalize thesis manuscript', checked: true },
    { id: '2', title: 'Finalize thesis manuscript', checked: true },
    { id: '3', title: 'Finalize thesis manuscript', checked: true },
    { id: '4', title: 'Finalize thesis manuscript', checked: false },
    { id: '5', title: 'Finalize thesis manuscript', checked: true },
    { id: '6', title: 'Finalize thesis manuscript', checked: false },
    { id: '7', title: 'Finalize thesis manuscript', checked: false },
    { id: '8', title: 'Finalize thesis manuscript', checked: false },
  ]);

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const [selectedDate, setSelectedDate] = useState<number>(19);
  const [currentMonth, setCurrentMonth] = useState<number>(4);
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [isYearPickerVisible, setIsYearPickerVisible] = useState(false);

  const [appOpenDates] = useState<string[]>([
    '2026-05-01',
    '2026-05-03',
    '2026-05-05',
    '2026-05-08',
    '2026-05-10',
    '2026-05-12',
    '2026-05-15',
    '2026-05-18',
    '2026-05-19',
    '2026-05-21',
  ]);

  const monthsList = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const toggleSaveScholarItem = (id: string) =>
    setScholarResults((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isSaved: !item.isSaved } : item))
    );

  const filteredNotifications = INITIAL_NOTIFICATIONS.filter((item) => {
    if (notifFilterTab === 'Unread') return item.isUnread;
    return true;
  });

  const todayNotifications = filteredNotifications.filter((item) => item.section === 'Today');
  const yesterdayNotifications = filteredNotifications.filter((item) => item.section === 'Yesterday');

  const filteredReferences = REFERENCES_DATA.filter((item) => {
    if (refTab === 'All') return true;
    return item.type === refTab;
  });

  const renderNotifIcon = (type: NotificationItem['iconType'], color: string) => {
    switch (type) {
      case 'person':
        return <Ionicons name="person" size={scaleFont(22)} color={color} />;
      case 'task':
        return (
          <MaterialCommunityIcons
            name="clipboard-check-outline"
            size={scaleFont(20)}
            color={color}
          />
        );
      case 'calendar':
        return <Feather name="calendar" size={scaleFont(20)} color={color} />;
      case 'ai':
        return (
          <MaterialCommunityIcons
            name="robot-outline"
            size={scaleFont(20)}
            color={color}
          />
        );
      case 'scholar':
        return <Ionicons name="school-outline" size={scaleFont(20)} color={color} />;
      default:
        return <Ionicons name="notifications-outline" size={scaleFont(20)} color={color} />;
    }
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.loginContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1D61E7" />
        <ScrollView
          contentContainerStyle={styles.loginScrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.loginHeaderSection}>
            <View style={styles.loginIconBox}>
              <Ionicons name="school" size={scaleFont(40)} color="#1D61E7" />
            </View>
            <Text style={styles.loginAppTitle}>Thesis Pilot</Text>
            <Text style={styles.loginSubtitle}>Your AI-Powered Academic Companion</Text>
          </View>
          <View style={styles.loginCard}>
            <Text style={styles.loginCardTitle}>Sign In</Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Username or Email</Text>
              <View style={styles.textInputWrapper}>
                <Ionicons name="person-outline" size={scaleFont(18)} color="#64748B" />
                <TextInput
                  style={styles.textInput}
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter username"
                  placeholderTextColor="#94A3B8"
                  autoCapitalize="none"
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.textInputWrapper}>
                <Ionicons name="card-outline" size={scaleFont(18)} color="#64748B" />
                <TextInput
                  style={styles.textInput}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter full name"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.textInputWrapper}>
                <Feather name="lock" size={scaleFont(18)} color="#64748B" />
                <TextInput
                  style={styles.textInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="........"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                />
              </View>
            </View>
            <TouchableOpacity
              style={styles.loginSubmitBtn}
              onPress={handleLogin}
              activeOpacity={0.8}
            >
              <Text style={styles.loginSubmitBtnText}>Log In</Text>
            </TouchableOpacity>
            <View style={styles.loginFooterRow}>
              <Text style={styles.loginFooterText}>Saved credentials are stored locally</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1D61E7" />
      {/* 1. HEADER BAR */}
      <View style={styles.dashboardHeader}>
        {currentView === 'main' ? (
          <>
            <TouchableOpacity onPress={() => setIsMenuOpen(true)} style={styles.headerLeft}>
              <Ionicons name="menu-outline" size={scaleFont(24)} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.dashboardTitle}>
              {activeTab === 'Workspace'
                ? 'Thesis Workspace'
                : activeTab === 'Tasks'
                ? 'Tasks'
                : activeTab === 'Files'
                ? 'Files'
                : activeTab === 'Feedback'
                ? 'Adviser Feedback'
                : 'Dashboard'}
            </Text>
            <View style={styles.headerRightIcons}>
              <TouchableOpacity
                style={styles.headerCircleBtn}
                onPress={() => setCurrentView('notifications')}
              >
                <Ionicons name="notifications-outline" size={scaleFont(16)} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.headerCircleBtn, { backgroundColor: '#238B5C' }]}>
                <Text style={{ color: '#FFF', fontSize: scaleFont(12), fontWeight: 'bold' }}>
                  {username ? username.charAt(0).toUpperCase() : 'C'}
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : currentView === 'roadmap' ? (
          <>
            <TouchableOpacity onPress={() => setCurrentView('main')} style={styles.headerLeft}>
              <Ionicons name="arrow-back" size={scaleFont(22)} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.dashboardTitle}>Roadmap Timeline</Text>
            <TouchableOpacity style={styles.headerLeft}>
              <Ionicons name="ellipsis-vertical" size={scaleFont(20)} color="#FFF" />
            </TouchableOpacity>
          </>
        ) : currentView === 'references' ? (
          <>
            <TouchableOpacity onPress={() => setIsMenuOpen(true)} style={styles.headerLeft}>
              <Ionicons name="menu-outline" size={scaleFont(24)} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.dashboardTitle}>References</Text>
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <TouchableOpacity onPress={() => setCurrentView('googleScholar')}>
                <Ionicons name="search" size={scaleFont(20)} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="add" size={scaleFont(26)} color="#FFF" />
              </TouchableOpacity>
            </View>
          </>
        ) : currentView === 'defensePrep' ? (
          <>
            <TouchableOpacity onPress={() => setIsMenuOpen(true)} style={styles.headerLeft}>
              <Ionicons name="menu-outline" size={scaleFont(24)} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.dashboardTitle}>Defense Preparation</Text>
            <TouchableOpacity style={{ paddingLeft: 12 }}>
              <Ionicons name="ellipsis-vertical" size={scaleFont(20)} color="#FFF" />
            </TouchableOpacity>
          </>
        ) : currentView === 'googleScholar' ? (
          <>
            <TouchableOpacity onPress={() => setCurrentView('references')} style={styles.headerLeft}>
              <Ionicons name="arrow-back" size={scaleFont(22)} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.dashboardTitle}>Google Scholar</Text>
            <TouchableOpacity style={{ paddingLeft: 12 }}>
              <Ionicons name="school-outline" size={scaleFont(22)} color="#FFF" />
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity onPress={() => setCurrentView('main')} style={styles.headerLeft}>
              <Ionicons name="arrow-back" size={scaleFont(22)} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.dashboardTitle}>Notifications</Text>
            <TouchableOpacity style={styles.headerLeft}>
              <Ionicons name="ellipsis-vertical" size={scaleFont(20)} color="#FFF" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* 2. MAIN CONTENT VIEW */}
      {currentView === 'notifications' ? (
        <View style={styles.notifContentContainer}>
          <View style={styles.notifTabContainer}>
            <TouchableOpacity
              style={[styles.notifTabBtn, notifFilterTab === 'All' && styles.notifActiveTabBtn]}
              onPress={() => setNotifFilterTab('All')}
            >
              <Text style={[styles.notifTabText, notifFilterTab === 'All' && styles.notifActiveTabText]}>
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.notifTabBtn, notifFilterTab === 'Unread' && styles.notifActiveTabBtn]}
              onPress={() => setNotifFilterTab('Unread')}
            >
              <Text style={[styles.notifTabText, notifFilterTab === 'Unread' && styles.notifActiveTabText]}>
                Unread
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={styles.notifScrollList} showsVerticalScrollIndicator={false}>
            {todayNotifications.length > 0 && (
              <View>
                <Text style={styles.notifSectionHeader}>Today</Text>
                {todayNotifications.map((item) => (
                  <View key={item.id} style={styles.notifCard}>
                    <View style={[styles.notifIconContainer, { backgroundColor: item.iconBgColor }]}>
                      {renderNotifIcon(item.iconType, item.iconColor)}
                    </View>
                    <View style={styles.notifTextContainer}>
                      <View style={styles.notifCardHeaderRow}>
                        <Text style={styles.notifItemTitle}>{item.title}</Text>
                        <View style={styles.notifRightHeaderGroup}>
                          <Text style={styles.notifTimeText}>{item.time}</Text>
                          {item.isUnread && <View style={styles.notifRedDot} />}
                        </View>
                      </View>
                      <Text style={styles.notifItemDescription} numberOfLines={2}>
                        {item.description}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={scaleFont(16)} color="#94A3B8" />
                  </View>
                ))}
              </View>
            )}
            {yesterdayNotifications.length > 0 && (
              <View style={{ marginTop: 12 }}>
                <Text style={styles.notifSectionHeader}>Yesterday</Text>
                {yesterdayNotifications.map((item) => (
                  <View key={item.id} style={styles.notifCard}>
                    <View style={[styles.notifIconContainer, { backgroundColor: item.iconBgColor }]}>
                      {renderNotifIcon(item.iconType, item.iconColor)}
                    </View>
                    <View style={styles.notifTextContainer}>
                      <View style={styles.notifCardHeaderRow}>
                        <Text style={styles.notifItemTitle}>{item.title}</Text>
                        <View style={styles.notifRightHeaderGroup}>
                          <Text style={styles.notifTimeText}>{item.time}</Text>
                          {item.isUnread && <View style={styles.notifRedDot} />}
                        </View>
                      </View>
                      <Text style={styles.notifItemDescription} numberOfLines={2}>
                        {item.description}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={scaleFont(16)} color="#94A3B8" />
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
          <TouchableOpacity style={styles.fabButton} activeOpacity={0.8}>
            <MaterialCommunityIcons name="robot" size={scaleFont(22)} color="#FFF" />
          </TouchableOpacity>
        </View>
      ) : currentView === 'roadmap' ? (
        <View style={styles.roadmapContentContainer}>
          <ScrollView contentContainerStyle={styles.roadmapScrollList} showsVerticalScrollIndicator={false}>
            <View style={styles.roadmapProgressHeader}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.roadmapProgressTitle}>Overall Progress</Text>
                <Text style={styles.roadmapProgressPercent}>68%</Text>
              </View>
              <View style={styles.roadmapProgressBarTrack}>
                <View style={[styles.roadmapProgressBarFill, { width: '68%' }]} />
              </View>
            </View>
            <View style={styles.roadmapDivider} />
            <View style={styles.roadmapTimelineContainer}>
              {[
                { id: '1', title: 'Proposal', date: 'Jan 16, 2026', status: 'completed' },
                { id: '2', title: 'Chapter 1: Introduction', date: 'Feb 10, 2026', status: 'completed' },
                { id: '3', title: 'Chapter 2: Literature Review', date: 'Mar 05, 2026', status: 'completed' },
                { id: '4', title: 'Chapter 3: Methodology', date: 'Apr 20, 2026', status: 'in-progress' },
                { id: '5', title: 'Chapter 4: Results', date: 'Jun 10, 2026', status: 'pending' },
                { id: '6', title: 'Chapter 5: Conclusion', date: 'Aug 05, 2026', status: 'pending' },
                { id: '7', title: 'Final Defense', date: 'Nov 20, 2026', status: 'pending' },
              ].map((item, index, array) => {
                const isLast = index === array.length - 1;
                return (
                  <View key={item.id} style={styles.roadmapItemRow}>
                    <View style={styles.roadmapNodeColumn}>
                      {item.status === 'completed' ? (
                        <Ionicons name="checkmark-circle" size={scaleFont(22)} color="#22C55E" />
                      ) : item.status === 'in-progress' ? (
                        <Ionicons name="checkmark-circle" size={scaleFont(22)} color="#3B82F6" />
                      ) : (
                        <View style={styles.roadmapCirclePending} />
                      )}
                      {!isLast && (
                        <View
                          style={[
                            styles.roadmapConnectingLine,
                            {
                              backgroundColor:
                                item.status === 'completed' ? '#22C55E' : '#CBD5E1',
                            },
                          ]}
                        />
                      )}
                    </View>
                    <View style={styles.roadmapTextColumn}>
                      <Text style={styles.roadmapItemTitle}>{item.title}</Text>
                      <Text style={styles.roadmapItemDate}>{item.date}</Text>
                    </View>
                    <View style={styles.roadmapRightStatusColumn}>
                      {item.status === 'completed' && (
                        <Ionicons name="checkmark-circle" size={scaleFont(22)} color="#22C55E" />
                      )}
                      {item.status === 'in-progress' && (
                        <Ionicons name="checkmark-circle" size={scaleFont(22)} color="#3B82F6" />
                      )}
                    </View>
                  </View>
                );
              })}
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.fabButton} activeOpacity={0.8}>
            <MaterialCommunityIcons name="robot" size={scaleFont(22)} color="#FFF" />
          </TouchableOpacity>
        </View>
      ) : currentView === 'references' ? (
        <View style={styles.workspaceContainer}>
          <View style={styles.refTabsRow}>
            {(
              [
                { label: 'All (22)', key: 'All' },
                { label: 'Book (8)', key: 'Book' },
                { label: 'Journal (6)', key: 'Journal' },
                { label: 'Website (6)', key: 'Website' },
              ] as const
            ).map((tab) => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.refTabBtn, refTab === tab.key && styles.refTabBtnActive]}
                onPress={() => setRefTab(tab.key)}
              >
                <Text style={[styles.refTabText, refTab === tab.key && styles.refTabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <ScrollView
            contentContainerStyle={styles.workspaceScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {filteredReferences.map((ref) => (
              <View key={ref.id} style={styles.refCard}>
                <View style={styles.refCardHeader}>
                  <View
                    style={[
                      styles.refTypeBadge,
                      {
                        backgroundColor:
                          ref.type === 'Journal'
                            ? '#BFDBFE'
                            : ref.type === 'Book'
                            ? '#FEF08A'
                            : '#E2E8F0',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.refTypeBadgeText,
                        {
                          color:
                            ref.type === 'Journal'
                              ? '#1D61E7'
                              : ref.type === 'Book'
                              ? '#854D0E'
                              : '#475569',
                        },
                      ]}
                    >
                      {ref.type}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={styles.apaBadge}>
                      <Text style={styles.apaBadgeText}>APA</Text>
                    </View>
                    <TouchableOpacity>
                      <Ionicons name="ellipsis-vertical" size={scaleFont(16)} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.refTitle}>{ref.title}</Text>
                <Text style={styles.refAuthor}>{ref.author}</Text>
                <Text style={styles.refDetails}>{ref.details}</Text>
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.mockupFabBot} activeOpacity={0.8}>
            <View style={styles.mockupBotCircle}>
              <MaterialCommunityIcons name="robot-outline" size={scaleFont(22)} color="#1D61E7" />
            </View>
            <View style={styles.mockupBotBubble1} />
            <View style={styles.mockupBotBubble2} />
          </TouchableOpacity>
        </View>
      ) : currentView === 'googleScholar' ? (
        <View style={styles.workspaceContainer}>
          <View style={styles.scholarSearchHeader}>
            <View style={styles.scholarInputWrapper}>
              <Ionicons name="search" size={scaleFont(18)} color="#4285F4" />
              <TextInput
                style={styles.scholarInput}
                value={scholarQuery}
                onChangeText={setScholarQuery}
                placeholder="Search Google Scholar articles..."
                placeholderTextColor="#94A3B8"
              />
              {scholarQuery.length > 0 && (
                <TouchableOpacity onPress={() => setScholarQuery('')}>
                  <Ionicons name="close-circle" size={scaleFont(16)} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.scholarFilterBar}
            >
              {(['Any time', 'Since 2023', 'Since 2026'] as const).map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={[
                    styles.scholarFilterChip,
                    scholarFilter === filter && styles.scholarFilterChipActive,
                  ]}
                  onPress={() => setScholarFilter(filter)}
                >
                  <Text
                    style={[
                      styles.scholarFilterText,
                      scholarFilter === filter && styles.scholarFilterTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <ScrollView
            contentContainerStyle={styles.workspaceScrollContent}
            showsVerticalScrollIndicator={false}
          >
            {scholarResults.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.scholarCard}
                activeOpacity={0.8}
                onPress={() => setSelectedPaper(item)}
              >
                <View style={styles.scholarCardTopRow}>
                  <Text style={styles.scholarTitle}>{item.title}</Text>
                  {item.pdfAvailable && (
                    <View style={styles.pdfBadge}>
                      <Text style={styles.pdfBadgeText}>[PDF]</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.scholarAuthors}>{item.authors}</Text>
                <Text style={styles.scholarPublication}>{item.publication}</Text>
                <Text style={styles.scholarSnippet} numberOfLines={3}>
                  {item.snippet}
                </Text>
                <View style={styles.scholarFooterRow}>
                  <Text style={styles.scholarCitations}>Cited by {item.citedBy}</Text>
                  <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => toggleSaveScholarItem(item.id)}>
                      <Ionicons
                        name={item.isSaved ? 'star' : 'star-outline'}
                        size={scaleFont(18)}
                        color={item.isSaved ? '#EAB308' : '#64748B'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.scholarImportBtn}
                      onPress={() => toggleSaveScholarItem(item.id)}
                    >
                      <Text style={styles.scholarImportBtnText}>
                        {item.isSaved ? 'Saved to References' : 'Save to References'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Modal
            visible={!!selectedPaper}
            transparent
            animationType="slide"
            onRequestClose={() => setSelectedPaper(null)}
          >
            <View style={styles.scholarModalOverlay}>
              <View style={styles.scholarModalContent}>
                <View style={styles.scholarModalHeader}>
                  <Text style={styles.scholarModalHeaderTitle}>Academic Article Detail</Text>
                  <TouchableOpacity onPress={() => setSelectedPaper(null)}>
                    <Ionicons name="close" size={scaleFont(22)} color="#0F172A" />
                  </TouchableOpacity>
                </View>
                {selectedPaper && (
                  <ScrollView showsVerticalScrollIndicator={false}>
                    <Text style={styles.scholarModalArticleTitle}>{selectedPaper.title}</Text>
                    <Text style={styles.scholarModalAuthors}>{selectedPaper.authors}</Text>
                    <Text style={styles.scholarModalPub}>{selectedPaper.publication}</Text>
                    <View style={styles.scholarModalDivider} />
                    <Text style={styles.scholarModalSectionLabel}>Abstract Snippet</Text>
                    <Text style={styles.scholarModalSnippet}>{selectedPaper.snippet}</Text>
                    <View style={styles.scholarModalActions}>
                      <TouchableOpacity
                        style={[styles.scholarModalBtn, styles.scholarModalBtnPrimary]}
                        onPress={() => {
                          if (selectedPaper) toggleSaveScholarItem(selectedPaper.id);
                          setSelectedPaper(null);
                        }}
                      >
                        <Ionicons name="add-circle-outline" size={scaleFont(18)} color="#FFF" />
                        <Text style={styles.scholarModalBtnTextPrimary}>
                          {selectedPaper.isSaved
                            ? 'In References'
                            : 'Save to Reference Manager'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </ScrollView>
                )}
              </View>
            </View>
          </Modal>
          <TouchableOpacity style={styles.fabButton} activeOpacity={0.8}>
            <MaterialCommunityIcons name="robot" size={scaleFont(22)} color="#FFF" />
          </TouchableOpacity>
        </View>
      ) : currentView === 'defensePrep' ? (
        <View style={styles.workspaceContainer}>
          <ScrollView
            contentContainerStyle={styles.workspaceScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.defenseCard}>
              <Text style={styles.defenseCardTitle}>Your Defense</Text>
              <View style={styles.defenseDateTimeRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Feather name="calendar" size={scaleFont(14)} color="#1D61E7" />
                  <Text style={styles.defenseDateText}>Nov 20, 2026</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Feather name="clock" size={scaleFont(14)} color="#94A3B8" />
                  <Text style={styles.defenseTimeText}>10:00 AM</Text>
                </View>
              </View>
              <View style={styles.timerGrid}>
                <View style={styles.timerBox}>
                  <Text style={styles.timerVal}>90</Text>
                  <Text style={styles.timerSub}>Days</Text>
                </View>
                <View style={styles.timerBox}>
                  <Text style={styles.timerVal}>12</Text>
                  <Text style={styles.timerSub}>Hours</Text>
                </View>
                <View style={styles.timerBox}>
                  <Text style={styles.timerVal}>45</Text>
                  <Text style={styles.timerSub}>Minutes</Text>
                </View>
                <View style={styles.timerBox}>
                  <Text style={styles.timerVal}>30</Text>
                  <Text style={styles.timerSub}>Seconds</Text>
                </View>
              </View>
            </View>
            <View style={styles.defenseCard}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={styles.defenseCardTitle}>Checklist</Text>
                <Text style={styles.checklistCountText}>
                  {checklist.filter((c) => c.checked).length}/{checklist.length}
                </Text>
              </View>
              <View style={styles.checklistBarTrack}>
                <View
                  style={[
                    styles.checklistBarFill,
                    {
                      width: `${(checklist.filter((c) => c.checked).length / checklist.length) * 100}%`,
                    },
                  ]}
                />
              </View>
              <View style={{ marginTop: 10 }}>
                {checklist.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.checkRow}
                    activeOpacity={0.7}
                    onPress={() => toggleChecklist(item.id)}
                  >
                    <MaterialCommunityIcons
                      name={item.checked ? 'checkbox-marked' : 'checkbox-blank-outline'}
                      size={scaleFont(18)}
                      color={item.checked ? '#1D61E7' : '#94A3B8'}
                    />
                    <Text style={styles.checkText}>{item.title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          <TouchableOpacity style={styles.mockupFabBot} activeOpacity={0.8}>
            <View style={styles.mockupBotCircle}>
              <MaterialCommunityIcons name="robot-outline" size={scaleFont(22)} color="#1D61E7" />
            </View>
            <View style={styles.mockupBotBubble1} />
            <View style={styles.mockupBotBubble2} />
          </TouchableOpacity>
        </View>
      ) : activeTab === 'Workspace' ? (
        <View style={styles.workspaceContainer}>
          <View style={styles.workspaceHeaderCard}>
            <Text style={styles.workspaceHeaderLabel}>Current Thesis</Text>
            <TouchableOpacity style={styles.workspaceTitleRow}>
              <Text style={styles.workspaceThesisTitle}>
                The Impact of AI on Student Learning Outcomes
              </Text>
              <Ionicons name="chevron-forward" size={scaleFont(18)} color="#000" />
            </TouchableOpacity>
          </View>
          <View style={styles.workspaceSubTabsRow}>
            {(['Overview', 'Chapters', 'Notes', 'Activity'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.workspaceSubTabBtn,
                  workspaceSubTab === tab && styles.workspaceSubTabBtnActive,
                ]}
                onPress={() => setWorkspaceSubTab(tab)}
              >
                <Text
                  style={[
                    styles.workspaceSubTabText,
                    workspaceSubTab === tab && styles.workspaceSubTabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            {workspaceSubTab === 'Overview' && (
              <ScrollView
                contentContainerStyle={styles.workspaceScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.overviewBox}>
                  <Text style={styles.overviewBoxTitle}>About this thesis</Text>
                  <Text style={styles.overviewBoxDesc}>
                    This study explores the impact of Artificial Intelligence (AI) tools on the
                    academic performance and learning experience of college students.
                  </Text>
                </View>
                <View style={styles.overviewBox}>
                  <Text style={styles.overviewBoxTitle}>Adviser</Text>
                  <View style={styles.adviserRow}>
                    <View style={styles.adviserAvatar}>
                      <Ionicons name="person" size={scaleFont(22)} color="#2563EB" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.adviserName}>Dr. Elizzette Joy Mationg</Text>
                      <Text style={styles.adviserEmail}>ejmationg@tip.edu.ph</Text>
                    </View>
                    <TouchableOpacity style={styles.emailIconBtn}>
                      <Ionicons name="mail-outline" size={scaleFont(20)} color="#000" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.statusRow}>
                  <Text style={styles.statusLabel}>Status</Text>
                  <Text style={styles.statusValue}>In Progress</Text>
                </View>
                <View style={styles.datesGrid}>
                  <View style={styles.dateCard}>
                    <Text style={styles.dateLabel}>Start Date</Text>
                    <Text style={styles.dateValue}>July 31, 2026</Text>
                  </View>
                  <View style={styles.dateCard}>
                    <Text style={styles.dateLabel}>Target Defense</Text>
                    <Text style={styles.dateValue}>August 01, 2026</Text>
                  </View>
                </View>
              </ScrollView>
            )}
            {workspaceSubTab === 'Chapters' && (
              <ScrollView
                contentContainerStyle={styles.workspaceScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.chaptersHeaderRow}>
                  <Text style={styles.sectionHeaderTitle}>Chapters</Text>
                  <TouchableOpacity style={styles.addChapterBtn}>
                    <Ionicons name="add" size={scaleFont(16)} color="#FFF" />
                    <Text style={styles.addChapterBtnText}>Add Chapter</Text>
                  </TouchableOpacity>
                </View>
                {[
                  { id: '1', title: 'Introduction', progress: '100%', color: '#22C55E' },
                  { id: '2', title: 'Literature Review', progress: '75%', color: '#22C55E' },
                  { id: '3', title: 'Methodology', progress: '40%', color: '#3B82F6' },
                  { id: '4', title: 'Results', progress: '20%', color: '#94A3B8' },
                  { id: '5', title: 'Conclusion', progress: '0%', color: '#CBD5E1' },
                ].map((chap) => (
                  <TouchableOpacity
                    key={chap.id}
                    style={styles.chapterCard}
                    activeOpacity={0.7}
                    onPress={() => setActiveTab('Files')}
                  >
                    <View style={styles.chapNumberBadge}>
                      <Text style={styles.chapNumberText}>{chap.id}</Text>
                    </View>
                    <View style={styles.chapBody}>
                      <View style={styles.chapTitleRow}>
                        <Text style={styles.chapTitleText}>{chap.title}</Text>
                        <Text
                          style={[
                            styles.chapPercentText,
                            { color: chap.progress === '100%' ? '#22C55E' : chap.color },
                          ]}
                        >
                          {chap.progress}
                        </Text>
                      </View>
                      <View style={styles.progressBarTrack}>
                        <View
                          style={[
                            styles.progressBarFill,
                            { width: chap.progress, backgroundColor: chap.color },
                          ]}
                        />
                      </View>
                    </View>
                    <TouchableOpacity style={{ paddingLeft: 6 }}>
                      <Ionicons name="ellipsis-vertical" size={scaleFont(18)} color="#64748B" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            {workspaceSubTab === 'Notes' && (
              <ScrollView
                contentContainerStyle={styles.workspaceScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.chaptersHeaderRow}>
                  <Text style={styles.sectionHeaderTitle}>Notes</Text>
                  <TouchableOpacity style={styles.addChapterBtn}>
                    <Ionicons name="add" size={scaleFont(16)} color="#FFF" />
                    <Text style={styles.addChapterBtnText}>New Note</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.notesSearchRow}>
                  <View style={styles.notesSearchBox}>
                    <Ionicons name="search-outline" size={scaleFont(16)} color="#64748B" />
                    <TextInput
                      placeholder="Search notes..."
                      style={styles.notesInput}
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                  <TouchableOpacity style={styles.filterBtn}>
                    <Ionicons name="options-outline" size={scaleFont(18)} color="#000" />
                  </TouchableOpacity>
                </View>
                <View style={styles.noteItemCard}>
                  <View style={styles.noteIconBox}>
                    <MaterialCommunityIcons
                      name="file-document-outline"
                      size={scaleFont(22)}
                      color="#15803D"
                    />
                  </View>
                  <View style={styles.noteContent}>
                    <View style={styles.noteTitleRow}>
                      <Text style={styles.noteTitle}>Research Problem Ideas</Text>
                      <Ionicons name="star-outline" size={scaleFont(18)} color="#3B82F6" />
                    </View>
                    <Text style={styles.noteDate}>May 10, 2026 10:30 AM</Text>
                    <Text style={styles.noteSnippet} numberOfLines={2}>
                      Some initial ideas for the research problem and background...
                    </Text>
                  </View>
                </View>
                <View style={styles.noteItemCard}>
                  <View style={styles.noteIconBox}>
                    <MaterialCommunityIcons
                      name="file-document-outline"
                      size={scaleFont(22)}
                      color="#15803D"
                    />
                  </View>
                  <View style={styles.noteContent}>
                    <View style={styles.noteTitleRow}>
                      <Text style={styles.noteTitle}>Interview Question</Text>
                      <Ionicons name="ellipsis-vertical" size={scaleFont(18)} color="#64748B" />
                    </View>
                    <Text style={styles.noteDate}>May 8, 2026 2:15 PM</Text>
                    <Text style={styles.noteSnippet} numberOfLines={2}>
                      Questions to ask during the interview with participants.
                    </Text>
                  </View>
                </View>
                <View style={styles.noteItemCard}>
                  <View style={styles.noteIconBox}>
                    <MaterialCommunityIcons
                      name="file-document-outline"
                      size={scaleFont(22)}
                      color="#15803D"
                    />
                  </View>
                  <View style={styles.noteContent}>
                    <View style={styles.noteTitleRow}>
                      <Text style={styles.noteTitle}>Statistical Methods</Text>
                      <Ionicons name="ellipsis-vertical" size={scaleFont(18)} color="#64748B" />
                    </View>
                    <Text style={styles.noteDate}>May 10, 2026 10:30 AM</Text>
                    <Text style={styles.noteSnippet} numberOfLines={2}>
                      Some initial ideas for the research problem and background...
                    </Text>
                  </View>
                </View>
              </ScrollView>
            )}
            {workspaceSubTab === 'Activity' && (
              <ScrollView
                contentContainerStyle={styles.workspaceScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {/* Fixed and aligned section header for Thesis Workspace (Activity) */}
                <View style={styles.chaptersHeaderRow}>
                  <Text style={styles.sectionHeaderTitle}>Activity</Text>
                  <TouchableOpacity style={styles.activityDropdownBtn}>
                    <Text style={styles.activityDropdownText}>All</Text>
                    <Ionicons name="chevron-down" size={scaleFont(14)} color="#000" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.timelineSectionTitle}>Today</Text>
                <View style={styles.timelineList}>
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineLeftColumn}>
                      <View style={styles.timelineDotIconBlue}>
                        <Ionicons name="person" size={scaleFont(12)} color="#FFF" />
                      </View>
                      <View style={styles.timelineLine} />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineText}>
                        <Text style={{ fontWeight: 'bold', color: '#1E293B' }}>Dr. Elizzette</Text>{' '}
                        commented on{' '}
                        <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>
                          Chapter 2: Literature Review
                        </Text>
                      </Text>
                      <Text style={styles.timelineTime}>2 hours ago</Text>
                    </View>
                  </View>
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineLeftColumn}>
                      <View style={styles.timelineDotIconFile}>
                        <Text
                          style={{
                            color: '#2563EB',
                            fontSize: scaleFont(7.5),
                            fontWeight: 'bold',
                          }}
                        >
                          DOCX
                        </Text>
                      </View>
                      <View style={styles.timelineLine} />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineText}>
                        <Text style={{ fontWeight: 'bold', color: '#1E293B' }}>Dr. Elizzette</Text>{' '}
                        commented on{' '}
                        <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>
                          Chapter 2: Literature Review
                        </Text>
                      </Text>
                      <Text style={styles.timelineTime}>5 hours ago</Text>
                    </View>
                  </View>
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineLeftColumn}>
                      <View style={styles.timelineDotIconGreen}>
                        <Ionicons name="checkmark" size={scaleFont(12)} color="#FFF" />
                      </View>
                      <View style={styles.timelineLine} />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineText}>
                        You completed a task{' '}
                        <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>
                          Design research instruments
                        </Text>
                      </Text>
                      <Text style={styles.timelineTime}>6 hours ago</Text>
                    </View>
                  </View>
                </View>
                <Text style={[styles.timelineSectionTitle, { marginTop: 16 }]}>Yesterday</Text>
                <View style={styles.timelineList}>
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineLeftColumn}>
                      <View style={styles.timelineDotIconBlue}>
                        <Ionicons name="person" size={scaleFont(12)} color="#FFF" />
                      </View>
                      <View style={styles.timelineLine} />
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineText}>
                        <Text style={{ fontWeight: 'bold', color: '#1E293B' }}>Dr. Elizzette</Text>{' '}
                        scheduled a meeting{' '}
                        <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>
                          System Review Meeting
                        </Text>
                      </Text>
                      <Text style={styles.timelineTime}>Yesterday, 3:00 PM</Text>
                    </View>
                  </View>
                  <View style={styles.timelineItem}>
                    <View style={styles.timelineLeftColumn}>
                      <View style={styles.timelineDotIconNote}>
                        <MaterialCommunityIcons
                          name="file-document-outline"
                          size={scaleFont(12)}
                          color="#15803D"
                        />
                      </View>
                    </View>
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineText}>
                        You added a new note{' '}
                        <Text style={{ color: '#2563EB', fontWeight: 'bold' }}>
                          Statistical Methods
                        </Text>
                      </Text>
                      <Text style={styles.timelineTime}>Yesterday, 10:20 AM</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
          <TouchableOpacity style={styles.fabButton} activeOpacity={0.8}>
            <MaterialCommunityIcons name="robot" size={scaleFont(22)} color="#FFF" />
          </TouchableOpacity>
        </View>
      ) : activeTab === 'Tasks' ? (
        <View style={styles.workspaceContainer}>
          <View style={styles.workspaceSubTabsRow}>
            {(['My Tasks', 'All Tasks', 'Calendar'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.workspaceSubTabBtn,
                  taskSubTab === tab && styles.workspaceSubTabBtnActive,
                ]}
                onPress={() => setTaskSubTab(tab)}
              >
                <Text
                  style={[
                    styles.workspaceSubTabText,
                    taskSubTab === tab && styles.workspaceSubTabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            {taskSubTab === 'Calendar' ? (
              <ScrollView
                contentContainerStyle={styles.workspaceScrollContent}
                showsVerticalScrollIndicator={false}
              >
                {isYearPickerVisible ? (
                  <View style={styles.yearPickerContainer}>
                    <Text style={styles.yearPickerTitle}>Select Year</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      style={styles.yearScrollView}
                    >
                      {[2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030].map((year) => (
                        <TouchableOpacity
                          key={year}
                          style={[
                            styles.yearChip,
                            currentYear === year && styles.yearChipActive,
                          ]}
                          onPress={() => {
                            setCurrentYear(year);
                            setIsYearPickerVisible(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.yearChipText,
                              currentYear === year && styles.yearChipTextActive,
                            ]}
                          >
                            {year}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                ) : null}
                <View style={styles.calendarHeaderRow}>
                  <TouchableOpacity onPress={handlePrevMonth} style={styles.calNavBtn}>
                    <Ionicons name="chevron-back" size={scaleFont(18)} color="#1D61E7" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setIsYearPickerVisible(!isYearPickerVisible)}
                    style={styles.monthYearSelector}
                  >
                    <Text style={styles.calendarMonthTitle}>
                      {monthsList[currentMonth]} {currentYear}
                    </Text>
                    <Ionicons
                      name="caret-down"
                      size={scaleFont(12)}
                      color="#1D61E7"
                      style={{ marginLeft: 4 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleNextMonth} style={styles.calNavBtn}>
                    <Ionicons name="chevron-forward" size={scaleFont(18)} color="#1D61E7" />
                  </TouchableOpacity>
                </View>
                <View style={styles.calendarDaysHeader}>
                  {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, idx) => (
                    <Text key={idx} style={styles.dayHeaderCell}>
                      {day}
                    </Text>
                  ))}
                </View>
                <View style={styles.calendarGrid}>
                  {[26, 27, 28, 29, 30].map((d) => (
                    <Text key={`prev-${d}`} style={styles.dimmedDateCell}>
                      {d}
                    </Text>
                  ))}
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => {
                    const isSelected =
                      selectedDate === date && currentMonth === 4 && currentYear === 2026;
                    const monthStr = String(currentMonth + 1).padStart(2, '0');
                    const dateStr = String(date).padStart(2, '0');
                    const formattedDate = `currentYear-{monthStr}-${dateStr}`;
                    const isAppOpened = appOpenDates.includes(formattedDate);
                    return (
                      <TouchableOpacity
                        key={date}
                        style={[
                          styles.dateCell,
                          isSelected && styles.selectedDateCell,
                        ]}
                        onPress={() => setSelectedDate(date)}
                      >
                        <Text
                          style={[
                            styles.dateCellText,
                            isSelected && styles.selectedDateText,
                          ]}
                        >
                          {date}
                        </Text>
                        {isAppOpened && (
                          <View
                            style={[
                              styles.appOpenedDot,
                              isSelected && styles.appOpenedDotSelected,
                            ]}
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <View style={styles.selectedDateEventsHeader}>
                  <Text style={styles.selectedDateTitle}>
                    {monthsList[currentMonth]} {selectedDate}, {currentYear}
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedDate(19)}>
                    <Text style={styles.todayBtnText}>Today</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.taskCardItem}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="ellipse" size={scaleFont(8)} color="#2563EB" />
                    <Text style={styles.taskCardTitle}>Adviser Consultation</Text>
                  </View>
                  <Text style={styles.taskCardSub}>Dr. Elizzette Joy Mationg</Text>
                  <View style={styles.taskCardFooter}>
                    <MaterialCommunityIcons name="google-drive" size={scaleFont(16)} color="#34A853" />
                    <Text style={styles.taskCardTime}>10:00 AM</Text>
                  </View>
                </View>
                <View style={styles.taskCardItem}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="ellipse" size={scaleFont(8)} color="#3B82F6" />
                    <Text style={styles.taskCardTitle}>Continue writing Chapter 3</Text>
                  </View>
                  <View style={styles.taskCardFooter}>
                    <Text style={styles.taskStatusInProgress}>In Progress</Text>
                  </View>
                </View>
                <View style={styles.taskCardItem}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="ellipse" size={scaleFont(8)} color="#64748B" />
                    <Text style={styles.taskCardTitle}>Collect survey responses</Text>
                  </View>
                  <Text style={styles.taskCardSub}>Chapter 3</Text>
                  <View style={styles.taskCardFooter}>
                    <Text style={styles.taskCardTime}>10:00 AM</Text>
                  </View>
                </View>
              </ScrollView>
            ) : (
              <ScrollView
                contentContainerStyle={styles.workspaceScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.taskSectionRow}>
                  <Text style={styles.taskSectionHeader}>Overdue</Text>
                  <TouchableOpacity style={styles.addTaskBtn}>
                    <Ionicons name="add" size={scaleFont(14)} color="#FFF" />
                    <Text style={styles.addTaskBtnText}>Add Task</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.taskListItem}>
                  <Ionicons name="ellipse-outline" size={scaleFont(20)} color="#EF4444" />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.taskListTitle}>Review the Literature Review</Text>
                    <Text style={styles.taskListSub}>Chapter 2</Text>
                  </View>
                  <Text style={styles.taskDueDateOverdue}>May 18</Text>
                </View>
                <Text style={[styles.taskSectionHeader, { marginTop: 16 }]}>In Progress</Text>
                <View style={styles.taskListItem}>
                  <Ionicons name="ellipse-outline" size={scaleFont(20)} color="#3B82F6" />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.taskListTitle}>Collect and Analyze Data</Text>
                    <Text style={styles.taskListSub}>Chapter 3</Text>
                  </View>
                  <Text style={styles.taskDueDateNormal}>May 20</Text>
                </View>
                <View style={styles.taskListItem}>
                  <Ionicons name="ellipse-outline" size={scaleFont(20)} color="#3B82F6" />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.taskListTitle}>Create Methodology Diagram</Text>
                    <Text style={styles.taskListSub}>Chapter 3</Text>
                  </View>
                  <Text style={styles.taskDueDateNormal}>May 25</Text>
                </View>
                <Text style={[styles.taskSectionHeader, { marginTop: 16 }]}>To Do</Text>
                <View style={styles.taskListItem}>
                  <Ionicons name="ellipse-outline" size={scaleFont(20)} color="#94A3B8" />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.taskListTitle}>Write Results and Discussion</Text>
                    <Text style={styles.taskListSub}>Chapter 4</Text>
                  </View>
                  <Text style={styles.taskDueDateNormal}>Jun 10</Text>
                </View>
                <View style={styles.taskListItem}>
                  <Ionicons name="ellipse-outline" size={scaleFont(20)} color="#94A3B8" />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.taskListTitle}>Prepare Presentation Slides</Text>
                    <Text style={styles.taskListSub}>Defense</Text>
                  </View>
                  <Text style={styles.taskDueDateNormal}>Nov 10</Text>
                </View>
              </ScrollView>
            )}
          </View>
          <TouchableOpacity style={styles.fabButton} activeOpacity={0.8}>
            <MaterialCommunityIcons name="robot" size={scaleFont(22)} color="#FFF" />
          </TouchableOpacity>
        </View>
      ) : activeTab === 'Files' ? (
        <View style={styles.workspaceContainer}>
          <ScrollView
            contentContainerStyle={styles.workspaceScrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.notesSearchRow}>
              <View style={styles.notesSearchBox}>
                <Ionicons name="search-outline" size={scaleFont(16)} color="#64748B" />
                <TextInput
                  placeholder="Search files..."
                  style={styles.notesInput}
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <TouchableOpacity style={styles.filterBtn}>
                <Ionicons name="options-outline" size={scaleFont(18)} color="#000" />
              </TouchableOpacity>
            </View>
            {[
              { id: '1', title: 'Chapter 1 Introduction', count: '13 Files' },
              { id: '2', title: 'Chapter 2 Literature Review', count: '15 Files' },
              { id: '3', title: 'Chapter 3 - Methodology', count: '14 Files' },
              { id: '4', title: 'Chapter 4 - Results', count: '2 Files' },
              { id: '5', title: 'Chapter 5 Conclusion', count: '1 File' },
            ].map((folder) => (
              <TouchableOpacity
                key={folder.id}
                style={styles.folderRowCard}
                activeOpacity={0.7}
                onPress={() => setCurrentView('references')}
              >
                <Ionicons name="folder" size={scaleFont(26)} color="#EAB308" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.folderTitle}>{folder.title}</Text>
                  <Text style={styles.folderCount}>{folder.count}</Text>
                </View>
                <TouchableOpacity>
                  <Ionicons name="ellipsis-vertical" size={scaleFont(18)} color="#64748B" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.fileRowCard}
              activeOpacity={0.7}
              onPress={() => setCurrentView('references')}
            >
              <MaterialCommunityIcons name="file-pdf-box" size={scaleFont(28)} color="#EF4444" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.fileTitle}>Thesis_Proposal.pdf</Text>
                <Text style={styles.fileDate}>May 12, 2026 2.4 MB</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-vertical" size={scaleFont(18)} color="#64748B" />
              </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fileRowCard}
              activeOpacity={0.7}
              onPress={() => setCurrentView('references')}
            >
              <MaterialCommunityIcons name="file-excel-box" size={scaleFont(28)} color="#16A34A" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.fileTitle}>Data_Collection.xlsx</Text>
                <Text style={styles.fileDate}>May 10, 2026 850 KB</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-vertical" size={scaleFont(18)} color="#64748B" />
              </TouchableOpacity>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.fileRowCard}
              activeOpacity={0.7}
              onPress={() => setCurrentView('references')}
            >
              <MaterialCommunityIcons name="file-word-box" size={scaleFont(28)} color="#2563EB" />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.fileTitle}>Research Instrument.docx</Text>
                <Text style={styles.fileDate}>May 08, 2026 320 KB</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-vertical" size={scaleFont(18)} color="#64748B" />
              </TouchableOpacity>
            </TouchableOpacity>
          </ScrollView>
          <TouchableOpacity style={styles.fabButton} activeOpacity={0.8}>
            <MaterialCommunityIcons name="robot" size={scaleFont(22)} color="#FFF" />
          </TouchableOpacity>
        </View>
      ) : activeTab === 'Feedback' ? (
        <View style={styles.workspaceContainer}>
          <View style={styles.workspaceSubTabsRow}>
            {(['Feedback', 'Calendar'] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.workspaceSubTabBtn,
                  feedbackSubTab === tab && styles.workspaceSubTabBtnActive,
                ]}
                onPress={() => setFeedbackSubTab(tab)}
              >
                <Text
                  style={[
                    styles.workspaceSubTabText,
                    feedbackSubTab === tab && styles.workspaceSubTabTextActive,
                  ]}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ flex: 1 }}>
            {feedbackSubTab === 'Feedback' ? (
              <ScrollView
                contentContainerStyle={styles.workspaceScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.feedbackCard}>
                  <View style={styles.adviserHeaderRow}>
                    <View style={styles.adviserAvatarCircle}>
                      <Ionicons name="person" size={scaleFont(20)} color="#2563EB" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.adviserNameText}>Dr. Elizzette Joy Mationg</Text>
                      <Text style={styles.adviserDateText}>May 18, 2026</Text>
                    </View>
                    <TouchableOpacity>
                      <Ionicons name="ellipsis-vertical" size={scaleFont(18)} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.ratingBadgeRow}>
                    <Text style={styles.overallRatingLabel}>Overall Rating</Text>
                    <Text style={styles.ratingValueText}>4.5/5</Text>
                  </View>
                  <Text style={styles.feedbackBodyText}>
                    Great progress! The literature review is comprehensive. Please improve the synthesis of related studies.
                  </Text>
                  <View style={styles.chapterTagBox}>
                    <Text style={styles.chapterTagTitle}>Chapter 2 - Literature Review</Text>
                  </View>
                  <TouchableOpacity style={styles.replyBtn}>
                    <Text style={styles.replyBtnText}>Reply</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.feedbackCard}>
                  <View style={styles.adviserHeaderRow}>
                    <View style={styles.adviserAvatarCircle}>
                      <Ionicons name="person" size={scaleFont(20)} color="#2563EB" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.adviserNameText}>Dr. Elizzette Joy Mationg</Text>
                      <Text style={styles.adviserDateText}>May 10, 2026</Text>
                    </View>
                    <TouchableOpacity>
                      <Ionicons name="ellipsis-vertical" size={scaleFont(18)} color="#64748B" />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.ratingBadgeRow}>
                    <Text style={styles.overallRatingLabel}>Overall Rating</Text>
                    <Text style={styles.ratingValueText}>4.0/5</Text>
                  </View>
                  <Text style={styles.feedbackBodyText}>
                    Good start on the methodology. Consider adding more details on your data collection process.
                  </Text>
                  <View style={styles.chapterTagBox}>
                    <Text style={styles.chapterTagTitle}>Chapter 3 - Methodology</Text>
                  </View>
                  <TouchableOpacity style={styles.replyBtn}>
                    <Text style={styles.replyBtnText}>Reply</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            ) : (
              <ScrollView
                contentContainerStyle={styles.workspaceScrollContent}
                showsVerticalScrollIndicator={false}
              >
                <Text style={styles.sectionHeaderTitle}>Recent Feedback</Text>
                <View style={styles.recentFeedbackCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.adviserAvatarCircle}>
                      <Ionicons name="person" size={scaleFont(18)} color="#2563EB" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.adviserNameText}>Dr. Elizzette Joy Mationg</Text>
                      <Text style={styles.adviserDateText}>May 18, 2026 10:30 AM</Text>
                    </View>
                  </View>
                  <View style={styles.feedbackCardFooterRow}>
                    <Text style={styles.chapterSubText}>Chapter 2 Literature Review</Text>
                    <Text style={styles.statusReviewedTag}>Reviewed</Text>
                  </View>
                </View>
                <View style={styles.recentFeedbackCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.adviserAvatarCircle}>
                      <Ionicons name="person" size={scaleFont(18)} color="#2563EB" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.adviserNameText}>Dr. Elizzette Joy Mationg</Text>
                      <Text style={styles.adviserDateText}>May 5, 2026 2:15 PM</Text>
                    </View>
                  </View>
                  <View style={styles.feedbackCardFooterRow}>
                    <Text style={styles.chapterSubText}>Chapter 1 Introduction</Text>
                    <Text style={styles.statusRevisionsTag}>Revisions Needed</Text>
                  </View>
                </View>
                <View style={styles.recentFeedbackCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.adviserAvatarCircle}>
                      <Ionicons name="person" size={scaleFont(18)} color="#2563EB" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.adviserNameText}>Dr. Elizzette Joy Mationg</Text>
                      <Text style={styles.adviserDateText}>Apr 22, 2026 9:00 AM</Text>
                    </View>
                  </View>
                  <View style={styles.feedbackCardFooterRow}>
                    <Text style={styles.chapterSubText}>Research Methodology</Text>
                    <Text style={styles.statusReviewedTag}>Reviewed</Text>
                  </View>
                </View>
                <TouchableOpacity style={{ alignSelf: 'flex-end', marginVertical: 6 }}>
                  <Text style={{ color: '#1D61E7', fontSize: scaleFont(11), fontWeight: '600' }}>
                    View all feedback
                  </Text>
                </TouchableOpacity>
                <Text style={[styles.sectionHeaderTitle, { marginTop: 12 }]}>Upcoming Meetings</Text>
                <View style={styles.meetingCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.adviserAvatarCircle}>
                      <Ionicons name="person" size={scaleFont(18)} color="#2563EB" />
                    </View>
                    <View style={{ flex: 1, marginLeft: 8 }}>
                      <Text style={styles.adviserNameText}>Dr. Elizzette Joy Mationg</Text>
                      <Text style={styles.adviserDateText}>May 21, 2026 2:00 PM</Text>
                    </View>
                  </View>
                  <View style={styles.meetingFooterRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <MaterialCommunityIcons name="google-meet" size={scaleFont(16)} color="#00832D" />
                      <Text style={styles.meetPlatformText}>Google Meet</Text>
                    </View>
                    <TouchableOpacity style={styles.viewDetailsBtn}>
                      <Text style={styles.viewDetailsText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </ScrollView>
            )}
          </View>
          <TouchableOpacity style={styles.fabButton} activeOpacity={0.8}>
            <MaterialCommunityIcons name="robot" size={scaleFont(22)} color="#FFF" />
          </TouchableOpacity>
        </View>
      ) : (
        /* DASHBOARD CONTENT */
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Fixed aligned greeting header for Student Dashboard */}
          <View style={styles.greetingContainer}>
            <View style={{ flex: 1, paddingRight: 8 }}>
              <Text style={styles.greetingTitle} numberOfLines={1}>
                Hello, {username || 'Cooper'}!
              </Text>
              <Text style={styles.greetingSub} numberOfLines={1}>
                Here's your thesis progress overview
              </Text>
            </View>
            <TouchableOpacity style={styles.gearButton}>
              <Ionicons name="settings-outline" size={scaleFont(18)} color="#64748B" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => setCurrentView('roadmap')}
          >
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardLabel}>Overall Progress</Text>
              <Text style={styles.statusBadge}>On Track</Text>
            </View>
            <Text style={styles.progressPercent}>68%</Text>
            <View style={styles.progressBarTrack}>
              <View style={[styles.progressBarFill, { width: '68%' }]} />
            </View>
            <Text style={styles.progressSubText}>68% completed</Text>
          </TouchableOpacity>
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel} numberOfLines={1}>
                Chapters
              </Text>
              <Text style={styles.statValue}>5/5</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel} numberOfLines={1}>
                Tasks
              </Text>
              <Text style={styles.statValue}>24</Text>
              <Text style={styles.statSub}>Total</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabelWarning} numberOfLines={1}>
                Due Soon
              </Text>
              <Text style={styles.statValueWarning}>3</Text>
              <Text style={styles.statSub}>Tasks</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabelDanger} numberOfLines={1}>
                Overdue
              </Text>
              <Text style={styles.statValueDanger}>2</Text>
              <Text style={styles.statSub}>Tasks</Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardSectionTitle}>Milestone Progress</Text>
              <TouchableOpacity onPress={() => setCurrentView('roadmap')}>
                <Text style={styles.linkText}>Roadmap Timeline</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.milestoneItem}>
              <View style={styles.milestoneRow}>
                <Text style={styles.milestoneName}>Chapter 1: Introduction</Text>
                <Text style={[styles.milestonePercent, { color: '#10B981' }]}>100%</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: '100%', backgroundColor: '#10B981' },
                  ]}
                />
              </View>
            </View>
            <View style={styles.milestoneItem}>
              <View style={styles.milestoneRow}>
                <Text style={styles.milestoneName}>Chapter 2: Literature Review</Text>
                <Text style={styles.milestonePercent}>75%</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: '75%', backgroundColor: '#0F172A' },
                  ]}
                />
              </View>
            </View>
            <View style={styles.milestoneItem}>
              <View style={styles.milestoneRow}>
                <Text style={styles.milestoneName}>Chapter 3: Methodology</Text>
                <Text style={styles.milestonePercent}>40%</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: '40%', backgroundColor: '#1E3A8A' },
                  ]}
                />
              </View>
            </View>
            <View style={styles.milestoneItem}>
              <View style={styles.milestoneRow}>
                <Text style={styles.milestoneName}>Chapter 4: Results</Text>
                <Text style={styles.milestonePercent}>20%</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: '20%', backgroundColor: '#2563EB' },
                  ]}
                />
              </View>
            </View>
            <View style={styles.milestoneItem}>
              <View style={styles.milestoneRow}>
                <Text style={styles.milestoneName}>Chapter 5: Conclusion</Text>
                <Text style={styles.milestonePercent}>0%</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: '0%', backgroundColor: '#2563EB' },
                  ]}
                />
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardSectionTitle}>Upcoming Deadlines</Text>
              <TouchableOpacity>
                <Text style={styles.linkText}>View all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.deadlineItem}>
              <View style={styles.deadlineRow}>
                <Text style={styles.deadlineTitle}>Chapter 3: Methodology</Text>
                <Text style={styles.badgeWarning}>3 days left</Text>
              </View>
              <Text style={styles.deadlineDate}>May 21, 2026</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.deadlineItem}>
              <View style={styles.deadlineRow}>
                <Text style={styles.deadlineTitle}>Adviser Consultation</Text>
                <Text style={styles.badgeSuccess}>Today</Text>
              </View>
              <Text style={styles.deadlineDate}>May 18, 2026</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.deadlineItem}>
              <View style={styles.deadlineRow}>
                <Text style={styles.deadlineTitle}>Pre-Final Defense</Text>
                <Text style={styles.badgePrimary}>14 days left</Text>
              </View>
              <Text style={styles.deadlineDate}>June 01, 2026</Text>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardSectionTitle}>Recent Activity</Text>
              <TouchableOpacity>
                <Text style={styles.linkText}>View all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.activityRow}>
              <View style={styles.avatarBlue}>
                <Text style={styles.avatarText}>DE</Text>
              </View>
              <Text style={styles.activityText}>
                <Text style={{ fontWeight: 'bold' }}>Dr. Elizzette</Text> commented on{' '}
                <Text style={{ fontWeight: 'bold' }}>Chapter 2: Literature Review</Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      )}

      {/* 3. BOTTOM TAB BAR */}
      <View style={styles.bottomTabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            setActiveTab('Dashboard');
            setCurrentView('main');
          }}
        >
          <Ionicons
            name={activeTab === 'Dashboard' && currentView === 'main' ? 'grid' : 'grid-outline'}
            size={scaleFont(18)}
            color={activeTab === 'Dashboard' && currentView === 'main' ? '#1D61E7' : '#64748B'}
          />
          <Text
            style={
              activeTab === 'Dashboard' && currentView === 'main'
                ? styles.tabTextActive
                : styles.tabText
            }
          >
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            setActiveTab('Workspace');
            setCurrentView('main');
          }}
        >
          <Ionicons
            name={
              activeTab === 'Workspace' ||
              currentView === 'references' ||
              currentView === 'defensePrep' ||
              currentView === 'googleScholar'
                ? 'folder'
                : 'folder-outline'
            }
            size={scaleFont(18)}
            color={
              activeTab === 'Workspace' ||
              currentView === 'references' ||
              currentView === 'defensePrep' ||
              currentView === 'googleScholar'
                ? '#1D61E7'
                : '#64748B'
            }
          />
          <Text
            style={
              activeTab === 'Workspace' ||
              currentView === 'references' ||
              currentView === 'defensePrep' ||
              currentView === 'googleScholar'
                ? styles.tabTextActive
                : styles.tabText
            }
          >
            Workspace
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            setActiveTab('Chat');
            setCurrentView('main');
          }}
        >
          <Ionicons
            name={activeTab === 'Chat' && currentView === 'main' ? 'chatbubbles' : 'chatbubbles-outline'}
            size={scaleFont(18)}
            color={activeTab === 'Chat' && currentView === 'main' ? '#1D61E7' : '#64748B'}
          />
          <Text
            style={
              activeTab === 'Chat' && currentView === 'main'
                ? styles.tabTextActive
                : styles.tabText
            }
          >
            Chat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            setActiveTab('Tasks');
            setCurrentView('main');
          }}
        >
          <Octicons
            name="tasklist"
            size={scaleFont(18)}
            color={activeTab === 'Tasks' && currentView === 'main' ? '#1D61E7' : '#64748B'}
          />
          <Text
            style={
              activeTab === 'Tasks' && currentView === 'main'
                ? styles.tabTextActive
                : styles.tabText
            }
          >
            Tasks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => {
            setActiveTab('Profile');
            setCurrentView('main');
          }}
        >
          <Ionicons
            name={activeTab === 'Profile' && currentView === 'main' ? 'person' : 'person-outline'}
            size={scaleFont(18)}
            color={activeTab === 'Profile' && currentView === 'main' ? '#1D61E7' : '#64748B'}
          />
          <Text
            style={
              activeTab === 'Profile' && currentView === 'main'
                ? styles.tabTextActive
                : styles.tabText
            }
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4. HAMBURGER SIDEBAR MODAL */}
      <HamburgerMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onLogout={handleLogout}
        onNavigate={(tab, view) => {
          if (view) {
            setCurrentView(view);
          } else {
            setActiveTab(tab);
            setCurrentView('main');
          }
          setIsMenuOpen(false);
        }}
      />
    </SafeAreaView>
  );
}

function HamburgerMenu({
  isOpen,
  onClose,
  onNavigate,
  onLogout,
}: {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: any, view?: any) => void;
  onLogout: () => void;
}) {
  if (!isOpen) return null;
  return (
    <Modal transparent={true} visible={isOpen} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.drawer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Ionicons name="arrow-back" size={scaleFont(22)} color="#000" />
            </TouchableOpacity>
            <View style={styles.logoContainer}>
              <Ionicons name="school" size={scaleFont(32)} color="#1D61E7" />
              <Text style={styles.logoText}>ThesisPilot</Text>
            </View>
            <View style={styles.menuList}>
              <TouchableOpacity
                style={[styles.menuItem, styles.activeMenuItem]}
                onPress={() => onNavigate('Dashboard')}
              >
                <Ionicons name="home-outline" size={scaleFont(18)} color="#1D61E7" />
                <Text style={[styles.menuText, styles.activeMenuText]}>Dashboard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('Workspace')}>
                <Ionicons name="grid-outline" size={scaleFont(18)} color="#000" />
                <Text style={styles.menuText}>Thesis Workspace</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('Tasks')}>
                <Octicons name="tasklist" size={scaleFont(18)} color="#000" />
                <Text style={styles.menuText}>Tasks</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('Feedback')}>
                <MaterialCommunityIcons
                  name="comment-text-multiple-outline"
                  size={scaleFont(18)}
                  color="#000"
                />
                <Text style={styles.menuText}>Adviser Feedback</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('Files')}>
                <Ionicons name="library-outline" size={scaleFont(18)} color="#000" />
                <Text style={styles.menuText}>File Repository</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Feather name="video" size={scaleFont(18)} color="#000" />
                <Text style={styles.menuText}>Meetings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('Chat')}>
                <Ionicons name="chatbubble-ellipses-outline" size={scaleFont(18)} color="#000" />
                <Text style={styles.menuText}>Chat</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <MaterialCommunityIcons name="robot-outline" size={scaleFont(18)} color="#000" />
                <Text style={styles.menuText}>AI Assistant</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="star-outline" size={scaleFont(18)} color="#000" />
                <Text style={styles.menuText}>Peer Assessment</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => onNavigate('Workspace', 'references')}
              >
                <Ionicons name="book-outline" size={scaleFont(18)} color="#000" />
                <Text style={styles.menuText}>References</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => onNavigate('Workspace', 'googleScholar')}
              >
                <Ionicons name="school-outline" size={scaleFont(18)} color="#000" />
                <Text style={styles.menuText}>Google Scholar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => onNavigate('Workspace', 'defensePrep')}
              >
                <Ionicons name="time-outline" size={scaleFont(18)} color="#000" />
                <Text style={styles.menuText}>Defense Preparation</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="settings-outline" size={scaleFont(18)} color="#000" />
                <Text style={styles.menuText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="help-circle-outline" size={scaleFont(18)} color="#000" />
                <Text style={styles.menuText}>Help & Support</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={onLogout}>
                <SimpleLineIcons name="logout" size={scaleFont(18)} color="#EF4444" />
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.versionText}>App Version 1.0.0</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // LOGIN STYLES
  loginContainer: {
    flex: 1,
    backgroundColor: '#1D61E7',
  },
  loginScrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  loginHeaderSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  loginIconBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  loginAppTitle: {
    fontSize: scaleFont(26),
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loginSubtitle: {
    fontSize: scaleFont(12),
    color: '#BFDBFE',
    marginTop: 4,
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  loginCardTitle: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: scaleFont(11),
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    backgroundColor: '#F8FAFC',
    gap: 8,
  },
  textInput: {
    flex: 1,
    fontSize: scaleFont(12),
    color: '#0F172A',
  },
  loginSubmitBtn: {
    backgroundColor: '#1D61E7',
    borderRadius: 10,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  loginSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: scaleFont(13),
    fontWeight: 'bold',
  },
  loginFooterRow: {
    marginTop: 16,
    alignItems: 'center',
  },
  loginFooterText: {
    fontSize: scaleFont(10),
    color: '#94A3B8',
  },

  // APP STYLES
  container: {
    flex: 1,
    backgroundColor: '#1D61E7',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1D61E7',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    alignItems: 'flex-start',
    width: 68,
  },
  dashboardTitle: {
    fontSize: scaleFont(18),
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerRightIcons: {
    flexDirection: 'row',
    gap: 8,
    width: 68,
    justifyContent: 'flex-end',
  },
  headerCircleBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#F1F5F9',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 12,
  },
  greetingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  greetingTitle: {
    fontSize: scaleFont(20),
    fontWeight: 'bold',
    color: '#0F172A',
  },
  greetingSub: {
    fontSize: scaleFont(12),
    color: '#64748B',
    marginTop: 2,
  },
  gearButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: scaleFont(12),
    fontWeight: '600',
    color: '#334155',
  },
  cardSectionTitle: {
    fontSize: scaleFont(14),
    fontWeight: 'bold',
    color: '#0F172A',
  },
  statusBadge: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: scaleFont(11),
  },
  progressPercent: {
    fontSize: scaleFont(26),
    fontWeight: '800',
    color: '#0F172A',
    marginVertical: 4,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginVertical: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1D61E7',
    borderRadius: 3,
  },
  progressSubText: {
    fontSize: scaleFont(10),
    color: '#94A3B8',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 2,
    marginHorizontal: 2,
    borderRadius: 12,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: scaleFont(9.5),
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },
  statLabelWarning: {
    fontSize: scaleFont(9.5),
    color: '#D97706',
    fontWeight: '600',
    textAlign: 'center',
  },
  statLabelDanger: {
    fontSize: scaleFont(9.5),
    color: '#DC2626',
    fontWeight: '600',
    textAlign: 'center',
  },
  statValue: {
    fontSize: scaleFont(15),
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 2,
  },
  statValueWarning: {
    fontSize: scaleFont(15),
    fontWeight: 'bold',
    color: '#D97706',
    marginTop: 2,
  },
  statValueDanger: {
    fontSize: scaleFont(15),
    fontWeight: 'bold',
    color: '#DC2626',
    marginTop: 2,
  },
  statSub: {
    fontSize: scaleFont(8.5),
    color: '#94A3B8',
  },
  linkText: {
    fontSize: scaleFont(11),
    color: '#1D61E7',
    fontWeight: '600',
  },
  milestoneItem: {
    marginTop: 10,
  },
  milestoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  milestoneName: {
    fontSize: scaleFont(11),
    color: '#334155',
    fontWeight: '500',
  },
  milestonePercent: {
    fontSize: scaleFont(11),
    fontWeight: 'bold',
    color: '#0F172A',
  },
  deadlineItem: {
    marginTop: 6,
  },
  deadlineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  deadlineTitle: {
    fontSize: scaleFont(12),
    fontWeight: 'bold',
    color: '#0F172A',
  },
  deadlineDate: {
    fontSize: scaleFont(10),
    color: '#94A3B8',
    marginTop: 1,
  },
  badgeWarning: {
    color: '#D97706',
    fontSize: scaleFont(10),
    fontWeight: 'bold',
  },
  badgeSuccess: {
    color: '#10B981',
    fontSize: scaleFont(10),
    fontWeight: 'bold',
  },
  badgePrimary: {
    color: '#1D61E7',
    fontSize: scaleFont(10),
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  avatarBlue: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#1D61E7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFF',
    fontSize: scaleFont(10),
    fontWeight: 'bold',
  },
  activityText: {
    flex: 1,
    fontSize: scaleFont(11),
    color: '#334155',
    lineHeight: 15,
  },

  // NOTIFICATION STYLES
  notifContentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  notifTabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginTop: 12,
    marginHorizontal: 12,
  },
  notifTabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifActiveTabBtn: {
    backgroundColor: '#BFDBFE',
    borderRadius: 4,
  },
  notifTabText: {
    fontSize: scaleFont(13),
    color: '#0F172A',
    fontWeight: '500',
  },
  notifActiveTabText: {
    color: '#1D61E7',
    fontWeight: 'bold',
  },
  notifScrollList: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 80,
  },
  notifSectionHeader: {
    fontSize: scaleFont(14),
    fontWeight: 'bold',
    color: '#0F172A',
    marginVertical: 10,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 16,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
  },
  notifIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  notifTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  notifCardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  notifItemTitle: {
    fontSize: scaleFont(13),
    fontWeight: 'bold',
    color: '#0F172A',
  },
  notifRightHeaderGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  notifTimeText: {
    fontSize: scaleFont(10),
    color: '#64748B',
  },
  notifRedDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
    marginLeft: 2,
  },
  notifItemDescription: {
    fontSize: scaleFont(11),
    color: '#475569',
    marginTop: 2,
    paddingRight: 8,
    lineHeight: 15,
  },

  // ROADMAP TIMELINE STYLES
  roadmapContentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  roadmapScrollList: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 80,
  },
  roadmapProgressHeader: {
    marginBottom: 12,
  },
  roadmapProgressTitle: {
    fontSize: scaleFont(14),
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  roadmapProgressPercent: {
    fontSize: scaleFont(14),
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  roadmapProgressBarTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 10,
  },
  roadmapProgressBarFill: {
    height: '100%',
    backgroundColor: '#1E3A8A',
    borderRadius: 4,
  },
  roadmapDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 16,
  },
  roadmapTimelineContainer: {
    paddingVertical: 8,
  },
  roadmapItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
    position: 'relative',
  },
  roadmapNodeColumn: {
    width: 32,
    alignItems: 'center',
    marginRight: 12,
    position: 'relative',
  },
  roadmapCirclePending: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#94A3B8',
    backgroundColor: '#FFFFFF',
    marginTop: 1,
  },
  roadmapConnectingLine: {
    width: 2,
    position: 'absolute',
    top: 22,
    bottom: -22,
    left: 15,
    zIndex: -1,
  },
  roadmapTextColumn: {
    flex: 1,
  },
  roadmapItemTitle: {
    fontSize: scaleFont(13),
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  roadmapItemDate: {
    fontSize: scaleFont(10),
    color: '#94A3B8',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  roadmapRightStatusColumn: {
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // FAB BUTTON
  fabButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#0EA5E9',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
  },

  // WORKSPACE STYLES
  workspaceContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
  },
  workspaceHeaderCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  workspaceHeaderLabel: {
    fontSize: scaleFont(10),
    color: '#64748B',
    marginBottom: 4,
  },
  workspaceTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workspaceThesisTitle: {
    fontSize: scaleFont(13),
    fontWeight: 'bold',
    color: '#0F172A',
    flex: 1,
    paddingRight: 8,
  },
  workspaceSubTabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginTop: 12,
    marginHorizontal: 16,
  },
  workspaceSubTabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  workspaceSubTabBtnActive: {
    backgroundColor: '#BFDBFE',
    borderRadius: 4,
  },
  workspaceSubTabText: {
    fontSize: scaleFont(12),
    color: '#0F172A',
    fontWeight: '500',
  },
  workspaceSubTabTextActive: {
    color: '#1D61E7',
    fontWeight: 'bold',
  },
  workspaceScrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  overviewBox: {
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  overviewBoxTitle: {
    fontSize: scaleFont(12),
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  overviewBoxDesc: {
    fontSize: scaleFont(11),
    color: '#475569',
    lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  adviserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 10,
  },
  adviserAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adviserName: {
    fontSize: scaleFont(12),
    fontWeight: 'bold',
    color: '#0F172A',
  },
  adviserEmail: {
    fontSize: scaleFont(10),
    color: '#64748B',
  },
  emailIconBtn: {
    padding: 4,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginVertical: 4,
  },
  statusLabel: {
    fontSize: scaleFont(12),
    fontWeight: 'bold',
    color: '#0F172A',
  },
  statusValue: {
    fontSize: scaleFont(11),
    color: '#16A34A',
    fontWeight: '600',
  },
  datesGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  dateCard: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    padding: 12,
    borderRadius: 12,
  },
  dateLabel: {
    fontSize: scaleFont(10),
    color: '#64748B',
    fontWeight: '600',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: scaleFont(12),
    fontWeight: 'bold',
    color: '#0F172A',
  },
  chaptersHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeaderTitle: {
    fontSize: scaleFont(15),
    fontWeight: 'bold',
    color: '#0F172A',
  },
  addChapterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  addChapterBtnText: {
    color: '#FFFFFF',
    fontSize: scaleFont(11),
    fontWeight: 'bold',
  },
  chapterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    gap: 10,
  },
  chapNumberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chapNumberText: {
    color: '#1D61E7',
    fontWeight: 'bold',
    fontSize: scaleFont(12),
  },
  chapBody: {
    flex: 1,
  },
  chapTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chapTitleText: {
    fontSize: scaleFont(12),
    fontWeight: 'bold',
    color: '#0F172A',
  },
  chapPercentText: {
    fontSize: scaleFont(11),
    fontWeight: 'bold',
  },
  notesSearchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  notesSearchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
    gap: 6,
  },
  notesInput: {
    flex: 1,
    fontSize: scaleFont(11),
    color: '#0F172A',
    padding: 0,
  },
  filterBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteItemCard: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 10,
    marginBottom: 10,
    gap: 10,
  },
  noteIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FEF08A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteContent: {
    flex: 1,
  },
  noteTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteTitle: {
    fontSize: scaleFont(12),
    fontWeight: 'bold',
    color: '#0F172A',
  },
  noteDate: {
    fontSize: scaleFont(9.5),
    color: '#94A3B8',
    marginVertical: 2,
  },
  noteSnippet: {
    fontSize: scaleFont(11),
    color: '#475569',
  },
  activityDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  activityDropdownText: {
    fontSize: scaleFont(11),
    color: '#0F172A',
  },
  timelineSectionTitle: {
    fontSize: scaleFont(12),
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 8,
  },
  timelineList: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timelineLeftColumn: {
    alignItems: 'center',
    width: 24,
    marginRight: 8,
  },
  timelineDotIconBlue: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotIconFile: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotIconGreen: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#16A34A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineDotIconNote: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FEF08A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#CBD5E1',
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
  },
  timelineText: {
    fontSize: scaleFont(11),
    color: '#334155',
    lineHeight: 15,
  },
  timelineTime: {
    fontSize: scaleFont(9.5),
    color: '#94A3B8',
    marginTop: 2,
  },

  // TASKS STYLES
  yearPickerContainer: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  yearPickerTitle: {
    fontSize: scaleFont(12),
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  yearScrollView: {
    flexDirection: 'row',
  },
  yearChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#E2E8F0',
    marginRight: 8,
  },
  yearChipActive: {
    backgroundColor: '#1D61E7',
  },
  yearChipText: {
    fontSize: scaleFont(11),
    color: '#475569',
    fontWeight: '600',
  },
  yearChipTextActive: {
    color: '#FFFFFF',
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calNavBtn: {
    padding: 6,
  },
  monthYearSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  calendarMonthTitle: {
    fontSize: scaleFont(14),
    fontWeight: 'bold',
    color: '#1D61E7',
  },
  calendarDaysHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
  },
  dayHeaderCell: {
    fontSize: scaleFont(10),
    fontWeight: 'bold',
    color: '#64748B',
    width: 36,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  dimmedDateCell: {
    width: 36,
    height: 36,
    textAlign: 'center',
    lineHeight: 36,
    fontSize: scaleFont(11),
    color: '#CBD5E1',
  },
  dateCell: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    marginBottom: 4,
  },
  selectedDateCell: {
    backgroundColor: '#1D61E7',
  },
  dateCellText: {
    fontSize: scaleFont(11),
    color: '#0F172A',
    fontWeight: '500',
  },
  selectedDateText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  appOpenedDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1D61E7',
    marginTop: 2,
  },
  appOpenedDotSelected: {
    backgroundColor: '#FFFFFF',
  },
  selectedDateEventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  selectedDateTitle: {
    fontSize: scaleFont(13),
    fontWeight: 'bold',
    color: '#0F172A',
  },
  todayBtnText: {
    fontSize: scaleFont(11),
    color: '#1D61E7',
    fontWeight: 'bold',
  },
  taskCardItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  taskCardTitle: {
    fontSize: scaleFont(12),
    fontWeight: 'bold',
    color: '#0F172A',
  },
  taskCardSub: {
    fontSize: scaleFont(10),
    color: '#64748B',
    marginTop: 2,
    marginLeft: 14,
  },
  taskCardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginLeft: 14,
  },
  taskCardTime: {
    fontSize: scaleFont(10),
    color: '#64748B',
  },
  taskStatusInProgress: {
    fontSize: scaleFont(10),
    color: '#2563EB',
    fontWeight: '600',
  },
  taskSectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  taskSectionHeader: {
    fontSize: scaleFont(13),
    fontWeight: 'bold',
    color: '#0F172A',
  },
  addTaskBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1D61E7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    gap: 4,
  },
  addTaskBtnText: {
    color: '#FFFFFF',
    fontSize: scaleFont(10),
    fontWeight: 'bold',
  },
  taskListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 8,
  },
  taskListTitle: {
    fontSize: scaleFont(12),
    fontWeight: '600',
    color: '#0F172A',
  },
  taskListSub: {
    fontSize: scaleFont(10),
    color: '#64748B',
  },
  taskDueDateOverdue: {
    fontSize: scaleFont(10),
    color: '#EF4444',
    fontWeight: 'bold',
  },
  taskDueDateNormal: {
    fontSize: scaleFont(10),
    color: '#64748B',
  },

  // FILES STYLES
  folderRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  folderTitle: {
    fontSize: scaleFont(12),
    fontWeight: 'bold',
    color: '#0F172A',
  },
  folderCount: {
    fontSize: scaleFont(10),
    color: '#64748B',
  },
  fileRowCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  fileTitle: {
    fontSize: scaleFont(12),
    fontWeight: 'bold',
    color: '#0F172A',
  },
  fileDate: {
    fontSize: scaleFont(10),
    color: '#64748B',
    marginTop: 2,
  },

  // FEEDBACK STYLES
  feedbackCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  adviserHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  adviserAvatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#BFDBFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  adviserNameText: {
    fontSize: scaleFont(12),
    fontWeight: 'bold',
    color: '#0F172A',
  },
  adviserDateText: {
    fontSize: scaleFont(9.5),
    color: '#64748B',
  },
  ratingBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  overallRatingLabel: {
    fontSize: scaleFont(10),
    color: '#1E40AF',
    fontWeight: '600',
  },
  ratingValueText: {
    fontSize: scaleFont(10),
    color: '#1E40AF',
    fontWeight: 'bold',
  },
  feedbackBodyText: {
    fontSize: scaleFont(11),
    color: '#334155',
    lineHeight: 16,
    marginBottom: 8,
  },
  chapterTagBox: {
    alignSelf: 'flex-start',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 8,
  },
  chapterTagTitle: {
    fontSize: scaleFont(9.5),
    color: '#475569',
    fontWeight: '600',
  },
  replyBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#1D61E7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 6,
  },
  replyBtnText: {
    color: '#FFFFFF',
    fontSize: scaleFont(10),
    fontWeight: 'bold',
  },
  recentFeedbackCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  feedbackCardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  chapterSubText: {
    fontSize: scaleFont(10),
    color: '#64748B',
    fontWeight: '500',
  },
  statusReviewedTag: {
    fontSize: scaleFont(9.5),
    color: '#16A34A',
    fontWeight: 'bold',
  },
  statusRevisionsTag: {
    fontSize: scaleFont(9.5),
    color: '#DC2626',
    fontWeight: 'bold',
  },
  meetingCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 8,
  },
  meetingFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  meetPlatformText: {
    fontSize: scaleFont(10),
    color: '#475569',
    fontWeight: '600',
  },
  viewDetailsBtn: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  viewDetailsText: {
    fontSize: scaleFont(10),
    color: '#0F172A',
    fontWeight: '600',
  },

  // REFERENCES STYLES
  refTabsRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  refTabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  refTabBtnActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#1D61E7',
  },
  refTabText: {
    fontSize: scaleFont(11),
    color: '#64748B',
    fontWeight: '500',
  },
  refTabTextActive: {
    color: '#1D61E7',
    fontWeight: 'bold',
  },
  refCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  refCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  refTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  refTypeBadgeText: {
    fontSize: scaleFont(9.5),
    fontWeight: 'bold',
  },
  apaBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  apaBadgeText: {
    fontSize: scaleFont(9),
    color: '#475569',
    fontWeight: '600',
  },
  refTitle: {
    fontSize: scaleFont(12),
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  refAuthor: {
    fontSize: scaleFont(10),
    color: '#475569',
    marginBottom: 2,
  },
  refDetails: {
    fontSize: scaleFont(9.5),
    color: '#64748B',
    fontStyle: 'italic',
  },
  mockupFabBot: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 10,
  },
  mockupBotCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockupBotBubble1: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  mockupBotBubble2: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#60A5FA',
  },

  // GOOGLE SCHOLAR STYLES
  scholarSearchHeader: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  scholarInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    gap: 8,
  },
  scholarInput: {
    flex: 1,
    fontSize: scaleFont(11),
    color: '#0F172A',
  },
  scholarFilterBar: {
    flexDirection: 'row',
    marginTop: 10,
  },
  scholarFilterChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  scholarFilterChipActive: {
    backgroundColor: '#1D61E7',
  },
  scholarFilterText: {
    fontSize: scaleFont(10),
    color: '#64748B',
    fontWeight: '500',
  },
  scholarFilterTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scholarCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  scholarCardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  scholarTitle: {
    fontSize: scaleFont(12),
    fontWeight: 'bold',
    color: '#1D61E7',
    flex: 1,
  },
  pdfBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pdfBadgeText: {
    fontSize: scaleFont(9),
    color: '#DC2626',
    fontWeight: 'bold',
  },
  scholarAuthors: {
    fontSize: scaleFont(10),
    color: '#16A34A',
    marginTop: 2,
  },
  scholarPublication: {
    fontSize: scaleFont(9.5),
    color: '#64748B',
    marginBottom: 6,
  },
  scholarSnippet: {
    fontSize: scaleFont(10.5),
    color: '#334155',
    lineHeight: 15,
    marginBottom: 8,
  },
  scholarFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  scholarCitations: {
    fontSize: scaleFont(10),
    color: '#1D61E7',
    fontWeight: '500',
  },
  scholarImportBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  scholarImportBtnText: {
    fontSize: scaleFont(9.5),
    color: '#1D61E7',
    fontWeight: '600',
  },

  // SCHOLAR MODAL STYLES
  scholarModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  scholarModalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  scholarModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  scholarModalHeaderTitle: {
    fontSize: scaleFont(14),
    fontWeight: 'bold',
    color: '#0F172A',
  },
  scholarModalArticleTitle: {
    fontSize: scaleFont(14),
    fontWeight: 'bold',
    color: '#1D61E7',
    marginBottom: 6,
  },
  scholarModalAuthors: {
    fontSize: scaleFont(11),
    color: '#16A34A',
    marginBottom: 2,
  },
  scholarModalPub: {
    fontSize: scaleFont(10),
    color: '#64748B',
  },
  scholarModalDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  scholarModalSectionLabel: {
    fontSize: scaleFont(11),
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  scholarModalSnippet: {
    fontSize: scaleFont(11),
    color: '#334155',
    lineHeight: 16,
    marginBottom: 16,
  },
  scholarModalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  scholarModalBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  scholarModalBtnPrimary: {
    backgroundColor: '#1D61E7',
  },
  scholarModalBtnTextPrimary: {
    color: '#FFFFFF',
    fontSize: scaleFont(11),
    fontWeight: 'bold',
  },

  // DEFENSE PREP STYLES
  defenseCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  defenseCardTitle: {
    fontSize: scaleFont(13),
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  defenseDateTimeRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  defenseDateText: {
    fontSize: scaleFont(11),
    color: '#1D61E7',
    fontWeight: '600',
  },
  defenseTimeText: {
    fontSize: scaleFont(11),
    color: '#64748B',
  },
  timerGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 6,
  },
  timerBox: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  timerVal: {
    fontSize: scaleFont(16),
    fontWeight: 'bold',
    color: '#1D61E7',
  },
  timerSub: {
    fontSize: scaleFont(8.5),
    color: '#64748B',
    marginTop: 2,
  },
  checklistCountText: {
    fontSize: scaleFont(11),
    color: '#1D61E7',
    fontWeight: 'bold',
  },
  checklistBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
  },
  checklistBarFill: {
    height: '100%',
    backgroundColor: '#1D61E7',
    borderRadius: 3,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  checkText: {
    fontSize: scaleFont(11),
    color: '#334155',
  },

  // BOTTOM TAB BAR STYLES
  bottomTabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingVertical: 6,
    height: 56,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: scaleFont(9.5),
    color: '#64748B',
    marginTop: 2,
  },
  tabTextActive: {
    fontSize: scaleFont(9.5),
    color: '#1D61E7',
    fontWeight: 'bold',
    marginTop: 2,
  },

  // HAMBURGER MENU MODAL STYLES
  overlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backdrop: {
    flex: 1,
  },
  drawer: {
    width: SCREEN_WIDTH * 0.75,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  backButton: {
    paddingVertical: 8,
    marginBottom: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  logoText: {
    fontSize: scaleFont(20),
    fontWeight: 'bold',
    color: '#1D61E7',
  },
  menuList: {
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 12,
  },
  activeMenuItem: {
    backgroundColor: '#EFF6FF',
  },
  menuText: {
    fontSize: scaleFont(12),
    color: '#334155',
    fontWeight: '500',
  },
  activeMenuText: {
    color: '#1D61E7',
    fontWeight: 'bold',
  },
  logoutText: {
    fontSize: scaleFont(12),
    color: '#EF4444',
    fontWeight: 'bold',
  },
  versionText: {
    fontSize: scaleFont(10),
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 24,
  },
});