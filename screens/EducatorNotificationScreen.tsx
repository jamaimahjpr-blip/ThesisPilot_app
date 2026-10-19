import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export interface NotificationItem {
  id: string;
  type: 'adviser' | 'task' | 'consultation' | 'ai';
  title: string;
  description: string;
  fullContent: string;
  timeAgo: string;
  isUnread: boolean;
  avatarUrl?: string;
}

interface EducatorNotificationScreenProps {
  onBack?: () => void;
  onNavigateTab?: (tab: 'dashboard' | 'chat' | 'profile') => void;
}

export default function EducatorNotificationScreen({
  onBack,
  onNavigateTab,
}: EducatorNotificationScreenProps) {
  // Active Filter State: 'all' or 'unread'
  const [filterTab, setFilterTab] = useState<'all' | 'unread'>('all');
  const [activeBottomTab, setActiveBottomTab] = useState<'dashboard' | 'chat' | 'profile'>('dashboard');

  // Selected Notification Modal State
  const [selectedNotif, setSelectedNotif] = useState<NotificationItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Sample Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'adviser',
      title: 'Adviser Feedback',
      description: 'Dr. Mationg reviewed your Chapter 2. Check the feedback in your workspace.',
      fullContent:
        'Dr. Mationg has provided detailed inline notes and structural suggestions on Chapter 2 (Literature Review). Please check the comments regarding theoretical framework and methodology consistency.',
      timeAgo: '47m ago',
      isUnread: true,
      avatarUrl: 'https://i.pravatar.cc/100?img=12',
    },
    {
      id: '2',
      type: 'task',
      title: 'Task Reminder',
      description: '"Finalize Chapter 2" is due tomorrow.',
      fullContent:
        'Reminder: Your scheduled task "Finalize Chapter 2" is set for submission deadline tomorrow at 11:59 PM. Make sure all revisions requested by your adviser are incorporated.',
      timeAgo: '2h ago',
      isUnread: true,
    },
    {
      id: '3',
      type: 'consultation',
      title: 'Consultation',
      description: 'Your consultation is tomorrow at 2:00 PM.',
      fullContent:
        'Your online group consultation with Adviser Dr. Mationg is scheduled for tomorrow at 2:00 PM via Google Meet. Please prepare your presentation slides.',
      timeAgo: '3h ago',
      isUnread: true,
    },
    {
      id: '4',
      type: 'ai',
      title: 'AI Tool',
      description: 'Your grammar check for Chapter 1 is complete.',
      fullContent:
        'The ThesisPilot AI Proofreader has finished scanning Chapter 1. 14 minor style and punctuation recommendations are available for review.',
      timeAgo: '5h ago',
      isUnread: true,
    },
  ]);

  // Filter list based on selected tab ('all' or 'unread')
  const displayedNotifications = notifications.filter((item) =>
    filterTab === 'unread' ? item.isUnread : true
  );

  // Handle Notification Item Tap
  const handleOpenNotification = (item: NotificationItem) => {
    setSelectedNotif(item);
    setShowDetailModal(true);
  };

  // Close Notification Detail & Mark as Read
  const handleCloseDetailModal = () => {
    if (selectedNotif && selectedNotif.isUnread) {
      setNotifications((prevList) =>
        prevList.map((n) => (n.id === selectedNotif.id ? { ...n, isUnread: false } : n))
      );
    }
    setShowDetailModal(false);
    setSelectedNotif(null);
  };

  return (
    <View style={styles.container}>
      {/* BLUE TOP HEADER BAR */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity style={styles.headerIconTouch} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity style={styles.headerIconTouch}>
          <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* WHITE CARD CONTENT CONTAINER */}
      <View style={styles.whiteCardContainer}>
        {/* TAB SWITCHER (ALL / UNREAD) */}
        <View style={styles.tabSwitcherRow}>
          <TouchableOpacity
            style={[styles.tabSwitcherBtn, filterTab === 'all' && styles.activeTabSwitcherBtn]}
            activeOpacity={0.8}
            onPress={() => setFilterTab('all')}
          >
            <Text style={[styles.tabSwitcherText, filterTab === 'all' && styles.activeTabSwitcherText]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabSwitcherBtn, filterTab === 'unread' && styles.activeTabSwitcherBtn]}
            activeOpacity={0.8}
            onPress={() => setFilterTab('unread')}
          >
            <Text style={[styles.tabSwitcherText, filterTab === 'unread' && styles.activeTabSwitcherText]}>
              Unread
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionHeaderTitle}>Today</Text>
          {displayedNotifications.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.notificationCard}
              activeOpacity={0.85}
              onPress={() => handleOpenNotification(item)}
            >
              {/* LEFT ICON / AVATAR */}
              {item.type === 'adviser' ? (
                <View style={[styles.iconCircleWrapper, { backgroundColor: '#A5B4FC' }]}>
                  <Ionicons name="person" size={22} color="#FFFFFF" />
                </View>
              ) : item.type === 'task' ? (
                <View style={[styles.iconCircleWrapper, { backgroundColor: '#BAE6FD' }]}>
                  <Ionicons name="clipboard-outline" size={22} color="#0284C7" />
                </View>
              ) : item.type === 'consultation' ? (
                <View style={[styles.iconCircleWrapper, { backgroundColor: '#BAE6FD' }]}>
                  <Ionicons name="calendar-outline" size={22} color="#0284C7" />
                </View>
              ) : (
                <View style={[styles.iconCircleWrapper, { backgroundColor: '#BAE6FD' }]}>
                  <Ionicons name="hardware-chip-outline" size={22} color="#0284C7" />
                </View>
              )}

              {/* MIDDLE TEXT CONTENT */}
              <View style={styles.notificationTextWrapper}>
                <Text style={styles.itemTitleText}>{item.title}</Text>
                <Text style={styles.itemDescText} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>

              {/* RIGHT TIME & UNREAD RED DOT & CHEVRON */}
              <View style={styles.rightInfoWrapper}>
                <View style={styles.timeRow}>
                  <Text style={styles.timeAgoText}>{item.timeAgo}</Text>
                  {item.isUnread && <View style={styles.redDotIndicator} />}
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" style={{ marginTop: 6 }} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* EDUCATOR LOWER NAVIGATOR */}
      <View style={styles.bottomTabContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
          onPress={() => {
            setActiveBottomTab('dashboard');
            if (onNavigateTab) onNavigateTab('dashboard');
            if (onBack) onBack();
          }}
        >
          <Ionicons
            name={activeBottomTab === 'dashboard' ? 'home' : 'home-outline'}
            size={22}
            color={activeBottomTab === 'dashboard' ? '#1E58A8' : '#64748B'}
          />
          <Text style={[styles.tabLabelText, activeBottomTab === 'dashboard' && styles.activeTabLabel]}>
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
          onPress={() => {
            setActiveBottomTab('chat');
            if (onNavigateTab) onNavigateTab('chat');
          }}
        >
          <Ionicons
            name={activeBottomTab === 'chat' ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'}
            size={22}
            color={activeBottomTab === 'chat' ? '#1E58A8' : '#64748B'}
          />
          <Text style={[styles.tabLabelText, activeBottomTab === 'chat' && styles.activeTabLabel]}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
          onPress={() => {
            setActiveBottomTab('profile');
            if (onNavigateTab) onNavigateTab('profile');
          }}
        >
          <Ionicons
            name={activeBottomTab === 'profile' ? 'person' : 'person-outline'}
            size={22}
            color={activeBottomTab === 'profile' ? '#1E58A8' : '#64748B'}
          />
          <Text style={[styles.tabLabelText, activeBottomTab === 'profile' && styles.activeTabLabel]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* READ NOTIFICATION CONTENT MODAL */}
      <Modal visible={showDetailModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            {selectedNotif && (
              <>
                <Text style={styles.notifModalTitle}>{selectedNotif.title}</Text>
                <Text style={styles.notifModalTime}>{selectedNotif.timeAgo}</Text>
                <View style={styles.modalDivider} />
                <Text style={styles.notifModalBody}>{selectedNotif.fullContent}</Text>
              </>
            )}
            <TouchableOpacity style={styles.closePrimaryBtn} onPress={handleCloseDetailModal}>
              <Text style={styles.closeBtnText}>Close</Text>
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
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'android' ? 40 : 52,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  headerIconTouch: {
    padding: 4,
  },
  whiteCardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  tabSwitcherRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  tabSwitcherBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 12,
  },
  activeTabSwitcherBtn: {
    backgroundColor: '#BFDBFE',
  },
  tabSwitcherText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#000000',
  },
  activeTabSwitcherText: {
    color: '#1E58A8',
    fontWeight: 'bold',
  },
  scrollContent: {
    paddingBottom: 90,
  },
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#000000',
    marginBottom: 12,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 10,
  },
  iconCircleWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notificationTextWrapper: {
    flex: 1,
    paddingRight: 6,
  },
  itemTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#000000',
    marginBottom: 2,
  },
  itemDescText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#64748B',
    lineHeight: 16,
  },
  rightInfoWrapper: {
    alignItems: 'flex-end',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeAgoText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#94A3B8',
  },
  redDotIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
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
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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
    paddingHorizontal: 24,
  },
  modalWhiteCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    elevation: 8,
  },
  notifModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#0F172A',
  },
  notifModalTime: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 2,
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  notifModalBody: {
    fontSize: 13,
    color: '#334155',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    lineHeight: 18,
    marginBottom: 20,
  },
  closePrimaryBtn: {
    backgroundColor: '#1E58A8',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
  },
});