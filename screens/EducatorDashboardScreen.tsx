import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChapterItem } from '../types';
import EducatorChatManagementScreen from './EducatorChatManagementScreen';
import EducatorFeedbackScreen from './EducatorFeedbackScreen';
import EducatorFileRepositoryScreen from './EducatorFileRepositoryScreen';
import EducatorGroupManagementScreen from './EducatorGroupManagementScreen';
import EducatorHelpSupportScreen from './EducatorHelpSupportScreen';
import EducatorMeetingsScreen from './EducatorMeetingsScreen';
import EducatorNotificationScreen from './EducatorNotificationScreen';
import EducatorProfileScreen from './EducatorProfileScreen';
import EducatorSettingsScreen from './EducatorSettingsScreen';
import EducatorStudentAssessmentScreen from './EducatorStudentAssessmentScreen';
import EducatorTaskManagementScreen from './EducatorTaskManagementScreen';

interface EducatorDashboardScreenProps {
  onSwitchRole?: () => void;
  setEducatorDashView?: (view: 'dashboard' | 'chat' | 'profile' | 'repository') => void;
  educatorName?: string;
  educatorEmail?: string;
  overallProgress?: number;
  chaptersList?: ChapterItem[];
  userData?: {
    fullName?: string;
    email?: string;
    role?: 'Student' | 'Educator';
  };
}

export default function EducatorDashboardScreen({
  onSwitchRole,
  setEducatorDashView,
  educatorName = 'Educator User',
  educatorEmail = 'educator@domain.com',
  overallProgress = 48,
  chaptersList = [],
  userData,
}: EducatorDashboardScreenProps) {
  const [activeSubView, setActiveSubView] = useState<
    | 'main'
    | 'groups'
    | 'feedback'
    | 'calendar'
    | 'meetings'
    | 'chat'
    | 'assessment'
    | 'roadmap'
    | 'settings'
    | 'profile'
    | 'notifications'
    | 'help'
    | 'repository'
  >('main');

  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'profile' | 'repository'>('dashboard');
  const [showDrawer, setShowDrawer] = useState(false);
  const [showDeadlinesModal, setShowDeadlinesModal] = useState(false);
  const [showRecentActivityModal, setShowRecentActivityModal] = useState(false);
  const [showUpcomingEventsModal, setShowUpcomingEventsModal] = useState(false);
  const [showReviewFileModal, setShowReviewFileModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<{
    student: string;
    chapter: string;
    time: string;
    status: string;
  } | null>(null);

  const completedChaptersCount = chaptersList.filter((c) => c.progress === 100).length;
  const totalChaptersCount = chaptersList.length || 5;

  const peerRatings = [
    { name: 'Rajesh K.', rating: 'Bad', color: '#EF4444', avatar: 'https://i.pravatar.cc/100?img=12' },
    { name: 'Penny H.', rating: 'Good', color: '#22C55E', avatar: 'https://i.pravatar.cc/100?img=5' },
    { name: 'Howard W.', rating: 'Fair', color: '#EAB308', avatar: 'https://i.pravatar.cc/100?img=11' },
    { name: 'Sheldon C.', rating: 'Excellent', color: '#10B981', avatar: 'https://i.pravatar.cc/100?img=60' },
    { name: 'Bernadette R.', rating: 'No Work', color: '#64748B', avatar: 'https://i.pravatar.cc/100?img=9' },
  ];

  const deadlinesList = [
    { title: 'Chapter 3: Methodology', date: 'May 25, 2026', tag: '3 days left', color: '#EAB308' },
    { title: 'Adviser Consultation', date: 'May 18, 2026', tag: 'Today', color: '#22C55E' },
    { title: 'Pre-Final Defense', date: 'June 01, 2026', tag: '14 days left', color: '#1E58A8' },
  ];

  const upcomingEvents = [
    {
      title: 'Adviser Consultation',
      time: '10:00 AM - 11:00 AM',
      date: 'Today',
      meetLink: 'https://meet.google.com/abc-defg-hij',
    },
    {
      title: 'Title Defense Review',
      time: '02:00 PM - 03:30 PM',
      date: 'May 22, 2026',
      meetLink: 'https://meet.google.com/xyz-uvwx-rst',
    },
  ];

  const roadmapMilestones = [
    { id: 'm1', title: 'Proposal', date: 'Jan 16, 2026', isDone: true },
    { id: 'm2', title: 'Chapter 1: Introduction', date: 'Feb 10, 2026', isDone: true },
    { id: 'm3', title: 'Chapter 2: Literature Review', date: 'Mar 05, 2026', isDone: true },
    { id: 'm4', title: 'Chapter 3: Methodology', date: 'Apr 20, 2026', isDone: false, isInProgress: true },
    { id: 'm5', title: 'Chapter 4: Results & Discussion', date: 'Jun 10, 2026', isDone: false },
    { id: 'm6', title: 'Chapter 5: Conclusion', date: 'Aug 05, 2026', isDone: false },
    { id: 'm7', title: 'Final Defense', date: 'Nov 20, 2026', isDone: false },
  ];

  const handleNavigateTab = (tab: 'dashboard' | 'chat' | 'profile' | 'repository') => {
    setActiveTab(tab);
    if (tab === 'dashboard') {
      setActiveSubView('main');
    } else if (tab === 'chat') {
      setActiveSubView('chat');
    } else if (tab === 'profile') {
      setActiveSubView('profile');
    } else if (tab === 'repository') {
      setActiveSubView('repository');
    }
    if (setEducatorDashView && tab !== 'repository') {
      setEducatorDashView(tab);
    }
  };

  const handleOpenGoogleMeet = (link: string) => {
    Linking.openURL(link).catch(() => {
      Alert.alert('Error', 'Could not open Google Meet link.');
    });
  };

  const handleReviewSubmission = (sub: { student: string; chapter: string; time: string; status: string }) => {
    setSelectedSubmission(sub);
    setShowReviewFileModal(true);
  };

  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    if (onSwitchRole) {
      onSwitchRole();
    } else {
      Alert.alert('Logged Out', 'You have been successfully logged out.');
    }
  };

  const handleDrawerItemPress = (screenName: string) => {
    setShowDrawer(false);
    setTimeout(() => {
      if (screenName === 'Groups') setActiveSubView('groups');
      else if (screenName === 'Feedback') setActiveSubView('feedback');
      else if (screenName === 'Event Calendar') setActiveSubView('calendar');
      else if (screenName === 'Meetings' || screenName === 'Paneling & Defense') setActiveSubView('meetings');
      else if (screenName === 'Chat') handleNavigateTab('chat');
      else if (screenName === 'Student Assessment') setActiveSubView('assessment');
      else if (screenName === 'Settings') setActiveSubView('settings');
      else if (screenName === 'Help & Support') setActiveSubView('help');
      else if (screenName === 'Logout') setShowLogoutModal(true);
    }, 100);
  };

  // FULL-SCREEN SUB-VIEWS
  if (activeSubView === 'groups') {
    return (
      <EducatorGroupManagementScreen
        onBack={() => setActiveSubView('main')}
        setEducatorDashView={(view) => handleNavigateTab(view as any)}
      />
    );
  }

  if (activeSubView === 'feedback') {
    return (
      <EducatorFeedbackScreen
        onBack={() => setActiveSubView('main')}
        setEducatorDashView={handleNavigateTab}
      />
    );
  }

  if (activeSubView === 'calendar') {
    return (
      <EducatorTaskManagementScreen
        onBack={() => setActiveSubView('main')}
        setEducatorDashView={handleNavigateTab}
      />
    );
  }

  if (activeSubView === 'meetings') {
    return (
      <EducatorMeetingsScreen
        onBack={() => setActiveSubView('main')}
        setEducatorDashView={handleNavigateTab}
      />
    );
  }

  if (activeSubView === 'chat') {
    return (
      <EducatorChatManagementScreen
        onBack={() => setActiveSubView('main')}
        setEducatorDashView={handleNavigateTab}
      />
    );
  }

  if (activeSubView === 'assessment') {
    return (
      <EducatorStudentAssessmentScreen
        onBack={() => setActiveSubView('main')}
        setEducatorDashView={handleNavigateTab}
      />
    );
  }

  if (activeSubView === 'settings') {
    return (
      <EducatorSettingsScreen
        onBack={() => setActiveSubView('main')}
        onSwitchRole={onSwitchRole}
        setEducatorDashView={(view) => handleNavigateTab(view as any)}
      />
    );
  }

  if (activeSubView === 'profile') {
    return (
      <EducatorProfileScreen
        onBack={() => handleNavigateTab('dashboard')}
        onSwitchRole={onSwitchRole}
        onLogout={onSwitchRole}
        setEducatorDashView={handleNavigateTab}
        userData={userData || { fullName: educatorName, email: educatorEmail, role: 'Educator' }}
      />
    );
  }

  if (activeSubView === 'notifications') {
    return (
      <EducatorNotificationScreen
        onBack={() => handleNavigateTab('dashboard')}
        onNavigateTab={(tab) => handleNavigateTab(tab as any)}
      />
    );
  }

  if (activeSubView === 'help') {
    return (
      <EducatorHelpSupportScreen
        onBack={() => setActiveSubView('main')}
        onOpenDrawer={() => setShowDrawer(true)}
        onNavigateTab={(tab) => handleNavigateTab(tab as any)}
      />
    );
  }

  // MAIN LAYOUT WRAPPER WITH PERSISTENT BOTTOM NAVIGATION BAR
  return (
    <View style={styles.container}>
      {activeSubView === 'repository' ? (
        <EducatorFileRepositoryScreen
          onOpenDrawer={() => setShowDrawer(true)}
          onNavigateTab={(tab) => handleNavigateTab(tab)}
        />
      ) : activeSubView === 'roadmap' ? (
        /* ROADMAP TIMELINE VIEW */
        <View style={{ flex: 1 }}>
          <View style={styles.topHeaderBar}>
            <TouchableOpacity style={styles.headerIconTouch} onPress={() => setActiveSubView('main')}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Roadmap Timeline</Text>
            <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
          </View>

          <View style={styles.whiteCardContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
              <View style={styles.roadmapProgressBox}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000000' }}>Overall Progress</Text>
                  <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#000000' }}>{overallProgress}%</Text>
                </View>
                <View style={styles.roadmapTrackBar}>
                  <View style={[styles.roadmapFillBar, { width: `${overallProgress}%` }]} />
                </View>
              </View>

              <View style={styles.timelineListContainer}>
                {roadmapMilestones.map((item, index) => {
                  const isLast = index === roadmapMilestones.length - 1;
                  return (
                    <View key={item.id} style={styles.timelineRowNode}>
                      <View style={styles.nodeLeftColumn}>
                        {!isLast && (
                          <View style={[styles.nodeConnectingLine, item.isDone && styles.lineCompleted]} />
                        )}
                        {item.isDone ? (
                          <Ionicons name="checkmark-circle" size={24} color="#16A34A" />
                        ) : item.isInProgress ? (
                          <Ionicons name="checkmark-circle" size={24} color="#1E58A8" />
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
        </View>
      ) : (
        /* MAIN DASHBOARD CONTENT */
        <View style={{ flex: 1 }}>
          <View style={styles.topHeaderBar}>
            <TouchableOpacity style={styles.headerIconTouch} onPress={() => setShowDrawer(true)}>
              <Ionicons name="menu-outline" size={26} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Dashboard</Text>
            <View style={styles.headerRightRow}>
              <TouchableOpacity style={styles.headerIconTouch} onPress={() => setActiveSubView('notifications')}>
                <Ionicons name="notifications" size={24} color="#FACC15" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.whiteCardContainer}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 20, paddingBottom: 90 }}
            >
              <View style={styles.greetingHeaderRow}>
                <Text style={styles.greetingTitleText}>Hello, {educatorName}!</Text>
                <Text style={styles.greetingSubText}>
                  Here's the group's thesis progress overview (Cooper's group)
                </Text>
              </View>

              {/* OVERALL PROGRESS CARD */}
              <TouchableOpacity
                style={styles.overallProgressCard}
                activeOpacity={0.85}
                onPress={() => setActiveSubView('roadmap')}
              >
                <View style={styles.progressCardHeader}>
                  <Text style={styles.progressCardTitle}>Overall Estimated Progress</Text>
                  <Text style={styles.onTrackStatusText}>On Track</Text>
                </View>
                <Text style={styles.percentageText}>{overallProgress}%</Text>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: `${overallProgress}%` }]} />
                </View>
                <Text style={styles.progressSubText}>{overallProgress}% completed (Tap to view roadmap)</Text>
              </TouchableOpacity>

              <View style={styles.metricsGridRow}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricLabelText}>Chapters</Text>
                  <Text style={styles.metricValText}>
                    {completedChaptersCount}/{totalChaptersCount}
                  </Text>
                  <Text style={styles.metricSubText}>Complete</Text>
                </View>

                <TouchableOpacity
                  style={styles.metricCard}
                  activeOpacity={0.7}
                  onPress={() => setActiveSubView('groups')}
                >
                  <Text style={styles.metricLabelText}>Manage</Text>
                  <Text style={styles.metricValText}>Groups</Text>
                  <Text style={styles.metricSubText}>Thesis</Text>
                </TouchableOpacity>

                <View style={styles.metricCard}>
                  <Text style={styles.metricLabelText}>To review</Text>
                  <Text style={styles.metricValText}>2</Text>
                  <Text style={styles.metricSubText}>Works</Text>
                </View>

                <View style={styles.metricCard}>
                  <Text style={[styles.metricLabelText, { color: '#EF4444' }]}>Overdue</Text>
                  <Text style={[styles.metricValText, { color: '#EF4444' }]}>2</Text>
                  <Text style={styles.metricSubText}>Tasks</Text>
                </View>
              </View>

              {/* DEADLINES */}
              <View style={styles.sectionCardGroup}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitleText}>Upcoming Deadlines</Text>
                  <TouchableOpacity onPress={() => setShowDeadlinesModal(true)}>
                    <Text style={styles.viewLinkBlueText}>Edit / View all</Text>
                  </TouchableOpacity>
                </View>
                {deadlinesList.map((d, index) => (
                  <View key={index} style={styles.deadlineItemRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.itemTitleText}>{d.title}</Text>
                      <Text style={styles.itemDateText}>{d.date}</Text>
                    </View>
                    <Text style={[styles.tagBadgeText, { color: d.color }]}>{d.tag}</Text>
                  </View>
                ))}
              </View>

              {/* RECENT ACTIVITY */}
              <View style={styles.sectionCardGroup}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitleText}>Recent Activity</Text>
                  <TouchableOpacity onPress={() => setShowRecentActivityModal(true)}>
                    <Text style={styles.viewLinkBlueText}>View all</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.recentActivityRow}>
                  <Image source={{ uri: 'https://i.pravatar.cc/100?img=60' }} style={styles.avatarCircleImage} />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.activitySubText}>S. Cooper Submitted</Text>
                    <Text style={styles.activityTitleText}>Chapter 3: Methodology Partial</Text>
                    <Text style={styles.timeAgoText}>36 minutes ago</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() =>
                      handleReviewSubmission({
                        student: 'Sheldon Cooper',
                        chapter: 'Chapter 3: Methodology Partial',
                        time: '36 minutes ago',
                        status: 'Pending Review',
                      })
                    }
                  >
                    <Ionicons name="ellipsis-vertical" size={20} color="#000000" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* PEER ASSESSMENT */}
              <View style={styles.sectionCardGroup}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitleText}>Peer Assessment Average</Text>
                  <TouchableOpacity onPress={() => setActiveSubView('assessment')}>
                    <Text style={styles.viewLinkBlueText}>View More</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.peerAvatarsRowContainer}>
                  {peerRatings.map((item, index) => (
                    <View key={index} style={styles.peerAvatarItemWrapper}>
                      <View style={[styles.ratingPillBadge, { borderColor: item.color }]}>
                        <Text style={[styles.ratingPillText, { color: item.color }]}>{item.rating}</Text>
                      </View>
                      <Image source={{ uri: item.avatar }} style={styles.peerAvatarCircle} />
                    </View>
                  ))}
                </View>
              </View>

              {/* UPCOMING EVENTS */}
              <View style={styles.sectionCardGroup}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitleText}>Upcoming Events</Text>
                  <TouchableOpacity onPress={() => setShowUpcomingEventsModal(true)}>
                    <Text style={styles.viewLinkBlueText}>View all</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={styles.eventRowItem}
                  activeOpacity={0.8}
                  onPress={() => handleOpenGoogleMeet(upcomingEvents[0].meetLink)}
                >
                  <Ionicons name="videocam" size={24} color="#22C55E" style={{ marginRight: 12 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.eventTitleText}>Adviser Consultation</Text>
                    <Text style={styles.eventTimeText}>10:00 AM - 11:00 AM</Text>
                  </View>
                  <Ionicons name="open-outline" size={18} color="#1E58A8" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      {/* BOTTOM TAB BAR */}
      <View style={styles.bottomTabContainer}>
        <TouchableOpacity style={styles.tabButton} activeOpacity={0.7} onPress={() => handleNavigateTab('dashboard')}>
          <Ionicons
            name={activeTab === 'dashboard' ? 'home' : 'home-outline'}
            size={24}
            color={activeTab === 'dashboard' ? '#1E58A8' : '#64748B'}
          />
          <Text style={[styles.tabLabelText, activeTab === 'dashboard' && styles.activeTabLabel]}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} activeOpacity={0.7} onPress={() => handleNavigateTab('chat')}>
          <Ionicons
            name={activeTab === 'chat' ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'}
            size={24}
            color={activeTab === 'chat' ? '#1E58A8' : '#64748B'}
          />
          <Text style={[styles.tabLabelText, activeTab === 'chat' && styles.activeTabLabel]}>Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} activeOpacity={0.7} onPress={() => handleNavigateTab('profile')}>
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={24}
            color={activeTab === 'profile' ? '#1E58A8' : '#64748B'}
          />
          <Text style={[styles.tabLabelText, activeTab === 'profile' && styles.activeTabLabel]}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* DRAWER MENU MODAL */}
      <Modal visible={showDrawer} transparent animationType="fade" statusBarTranslucent>
        <View style={styles.drawerOverlay}>
          <TouchableOpacity style={styles.drawerBackdropTouch} activeOpacity={1} onPress={() => setShowDrawer(false)} />
          <View style={styles.drawerContentCard}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
              <TouchableOpacity style={styles.drawerCloseBtn} onPress={() => setShowDrawer(false)}>
                <Ionicons name="arrow-back" size={22} color="#000000" />
              </TouchableOpacity>
              <View style={styles.drawerBrandHeader}>
                <Ionicons name="school" size={42} color="#1E58A8" />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.drawerBrandTitle}>ThesisPilot</Text>
                  <Text style={styles.drawerBrandSub}>Educator</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.drawerMenuItem, activeSubView === 'main' && styles.drawerActiveMenuItem]}
                onPress={() => {
                  setShowDrawer(false);
                  handleNavigateTab('dashboard');
                }}
              >
                <Ionicons name="home-outline" size={20} color="#1E58A8" />
                <Text style={[styles.drawerMenuText, styles.drawerActiveMenuText]}>Dashboard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.drawerMenuItem, activeSubView === 'groups' && styles.drawerActiveMenuItem]}
                onPress={() => handleDrawerItemPress('Groups')}
              >
                <Ionicons name="people-outline" size={20} color="#000000" />
                <Text style={styles.drawerMenuText}>Groups</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.drawerMenuItem, activeSubView === 'feedback' && styles.drawerActiveMenuItem]}
                onPress={() => handleDrawerItemPress('Feedback')}
              >
                <Ionicons name="chatbubbles-outline" size={20} color="#000000" />
                <Text style={styles.drawerMenuText}>Feedback</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.drawerMenuItem, activeSubView === 'calendar' && styles.drawerActiveMenuItem]}
                onPress={() => handleDrawerItemPress('Event Calendar')}
              >
                <Ionicons name="calendar-outline" size={20} color="#000000" />
                <Text style={styles.drawerMenuText}>Event Calendar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.drawerMenuItem, activeSubView === 'meetings' && styles.drawerActiveMenuItem]}
                onPress={() => handleDrawerItemPress('Meetings')}
              >
                <Ionicons name="videocam-outline" size={20} color="#000000" />
                <Text style={styles.drawerMenuText}>Meetings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.drawerMenuItem, activeSubView === 'chat' && styles.drawerActiveMenuItem]}
                onPress={() => handleDrawerItemPress('Chat')}
              >
                <Ionicons name="chatbox-ellipses-outline" size={20} color="#000000" />
                <Text style={styles.drawerMenuText}>Chat</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.drawerMenuItem, activeSubView === 'assessment' && styles.drawerActiveMenuItem]}
                onPress={() => handleDrawerItemPress('Student Assessment')}
              >
                <Ionicons name="checkbox-outline" size={20} color="#000000" />
                <Text style={styles.drawerMenuText}>Student Assessment</Text>
              </TouchableOpacity>

              <View style={styles.drawerDivider} />

              <TouchableOpacity style={styles.drawerMenuItem} onPress={() => handleDrawerItemPress('Settings')}>
                <Ionicons name="settings-outline" size={20} color="#000000" />
                <Text style={styles.drawerMenuText}>Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerMenuItem} onPress={() => handleDrawerItemPress('Help & Support')}>
                <Ionicons name="help-circle-outline" size={20} color="#000000" />
                <Text style={styles.drawerMenuText}>Help & Support</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.drawerMenuItem} onPress={() => handleDrawerItemPress('Logout')}>
                <Ionicons name="exit-outline" size={20} color="#EF4444" />
                <Text style={[styles.drawerMenuText, { color: '#EF4444' }]}>Logout</Text>
              </TouchableOpacity>
              <Text style={styles.drawerVersionText}>App Version 1.0.0</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* LOGOUT CONFIRMATION MODAL */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View style={styles.logoutModalOverlayBlur}>
          <View style={styles.logoutBlueCard}>
            <Text style={styles.logoutCardTitle}>Log Out</Text>
            <Text style={styles.logoutCardSubtitle}>Are you sure you want to logout?</Text>
            <View style={styles.logoutActionsRow}>
              <TouchableOpacity
                style={styles.logoutCancelBtn}
                activeOpacity={0.7}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.logoutCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutConfirmRedBtn}
                activeOpacity={0.85}
                onPress={handleConfirmLogout}
              >
                <Text style={styles.logoutConfirmBtnText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* DEADLINES MODAL */}
      <Modal visible={showDeadlinesModal} transparent animationType="slide">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>All Deadlines & Schedules</Text>
            <ScrollView style={{ maxHeight: 300, marginVertical: 10 }}>
              {deadlinesList.map((d, index) => (
                <View key={index} style={styles.modalListItemRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitleText}>{d.title}</Text>
                    <Text style={styles.itemDateText}>{d.date}</Text>
                  </View>
                  <Text style={[styles.tagBadgeText, { color: d.color }]}>{d.tag}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowDeadlinesModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* RECENT ACTIVITY MODAL */}
      <Modal visible={showRecentActivityModal} transparent animationType="slide">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Submissions to Review</Text>
            <ScrollView style={{ maxHeight: 300, marginVertical: 10 }}>
              <TouchableOpacity
                style={styles.modalListItemRow}
                onPress={() => {
                  setShowRecentActivityModal(false);
                  handleReviewSubmission({
                    student: 'Sheldon Cooper',
                    chapter: 'Chapter 3: Methodology Partial',
                    time: '36 mins ago',
                    status: 'Pending',
                  });
                }}
              >
                <Image source={{ uri: 'https://i.pravatar.cc/100?img=60' }} style={styles.avatarCircleSmall} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.itemTitleText}>Chapter 3: Methodology Partial</Text>
                  <Text style={styles.itemDateText}>Sheldon Cooper • 36 mins ago</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#1E58A8" />
              </TouchableOpacity>
            </ScrollView>
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowRecentActivityModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* UPCOMING EVENTS MODAL */}
      <Modal visible={showUpcomingEventsModal} transparent animationType="slide">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Consultations & Defense Meetings</Text>
            <ScrollView style={{ maxHeight: 280, marginVertical: 10 }}>
              {upcomingEvents.map((evt, idx) => (
                <View key={idx} style={styles.modalListItemRow}>
                  <Ionicons name="logo-google" size={20} color="#4285F4" style={{ marginRight: 10 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemTitleText}>{evt.title}</Text>
                    <Text style={styles.itemDateText}>
                      {evt.date} • {evt.time}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.meetBtnLink}
                    onPress={() => handleOpenGoogleMeet(evt.meetLink)}
                  >
                    <Text style={styles.meetBtnLinkText}>Join Meet</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowUpcomingEventsModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* REVIEW FILE MODAL */}
      <Modal visible={showReviewFileModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Review Submission</Text>
            {selectedSubmission && (
              <View style={{ marginVertical: 10 }}>
                <Text style={styles.reviewModalLabel}>Student:</Text>
                <Text style={styles.reviewModalVal}>{selectedSubmission.student}</Text>
                <Text style={[styles.reviewModalLabel, { marginTop: 8 }]}>Submitted Item:</Text>
                <Text style={styles.reviewModalVal}>{selectedSubmission.chapter}</Text>
              </View>
            )}
            <TouchableOpacity
              style={styles.actionPrimaryBtn}
              onPress={() => {
                setShowReviewFileModal(false);
                Alert.alert('Approved', 'Thesis draft marked as Approved/Graded.');
              }}
            >
              <Text style={styles.actionPrimaryBtnText}>Approve & Mark Checked</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowReviewFileModal(false)}>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 52,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconTouch: {
    padding: 4,
  },
  whiteCardContainer: {
    flex: 1,
    backgroundColor: '#E2E8F0',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  greetingHeaderRow: {
    marginBottom: 16,
  },
  greetingTitleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
  greetingSubText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 4,
  },
  overallProgressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 16,
    marginBottom: 14,
  },
  progressCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  onTrackStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#22C55E',
  },
  percentageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginVertical: 4,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#BFDBFE',
    borderRadius: 4,
    overflow: 'hidden',
    marginVertical: 6,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1E58A8',
    borderRadius: 4,
  },
  progressSubText: {
    fontSize: 11,
    color: '#64748B',
  },
  metricsGridRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  metricCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 10,
    alignItems: 'center',
  },
  metricLabelText: {
    fontSize: 10,
    color: '#000000',
  },
  metricValText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginVertical: 2,
  },
  metricSubText: {
    fontSize: 9,
    color: '#64748B',
  },
  sectionCardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 14,
    marginBottom: 14,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  viewLinkBlueText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E58A8',
  },
  deadlineItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  itemTitleText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
  },
  itemDateText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  tagBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  recentActivityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircleImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  activitySubText: {
    fontSize: 11,
    color: '#475569',
  },
  activityTitleText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 2,
  },
  timeAgoText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  peerAvatarsRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  peerAvatarItemWrapper: {
    alignItems: 'center',
  },
  ratingPillBadge: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginBottom: 6,
    backgroundColor: '#FFFFFF',
  },
  ratingPillText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  peerAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  eventRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  eventTitleText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
  },
  eventTimeText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
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
  roadmapProgressBox: {
    paddingVertical: 8,
    marginBottom: 16,
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
  drawerOverlay: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 99999,
  },
  drawerBackdropTouch: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  drawerContentCard: {
    width: '72%',
    backgroundColor: '#FFFFFF',
    height: '100%',
    paddingTop: Platform.OS === 'android' ? 40 : 50,
    paddingHorizontal: 16,
    elevation: 10,
    zIndex: 100000,
  },
  drawerCloseBtn: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  drawerBrandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  drawerBrandTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E58A8',
  },
  drawerBrandSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
  },
  drawerMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 2,
  },
  drawerActiveMenuItem: {
    backgroundColor: '#BFDBFE',
  },
  drawerMenuText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 14,
  },
  drawerActiveMenuText: {
    color: '#1E58A8',
  },
  drawerDivider: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginVertical: 12,
    marginHorizontal: 4,
  },
  drawerVersionText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 24,
    paddingHorizontal: 12,
  },
  logoutModalOverlayBlur: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
  },
  logoutBlueCard: {
    width: '100%',
    backgroundColor: '#1E58A8',
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    elevation: 10,
  },
  logoutCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  logoutCardSubtitle: {
    fontSize: 13,
    color: '#FFFFFF',
    marginBottom: 28,
  },
  logoutActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16,
  },
  logoutCancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  logoutCancelBtnText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  logoutConfirmRedBtn: {
    backgroundColor: '#FF4D4D',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  logoutConfirmBtnText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: 'bold',
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
    marginBottom: 10,
  },
  modalListItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  avatarCircleSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  meetBtnLink: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  meetBtnLinkText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E58A8',
  },
  reviewModalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
  },
  reviewModalVal: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
    marginTop: 2,
  },
  actionPrimaryBtn: {
    backgroundColor: '#1E58A8',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  actionPrimaryBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cancelOutlineBtn: {
    marginTop: 12,
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