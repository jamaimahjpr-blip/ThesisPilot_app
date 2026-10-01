// src/pages/student/StudentDashboard.js
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
  Octicons,
  Feather,
  SimpleLineIcons
} from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext'; // Access Google OAuth tokens
import { getCalendarTasks } from '../../services/calendarService'; // Google Calendar Integration
import { getClassroomAssignments } from '../../services/classroomService'; // Google Classroom Integration

export default function StudentDashboard({ navigation }) {
  // State para sa pagbukas at pag-sara ng Hamburger Menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // States for live Google sync metrics
  const { googleTokens } = useContext(AuthContext);
  const [taskCount, setTaskCount] = useState(3); // Default initial value from original code
  const [loadingMetrics, setLoadingMetrics] = useState(false);

  useEffect(() => {
    if (googleTokens) {
      fetchGoogleDashboardMetrics();
    }
  }, [googleTokens]);

  const fetchGoogleDashboardMetrics = async () => {
    setLoadingMetrics(true);
    try {
      const [calendarEvents, classroomTasks] = await Promise.all([
        getCalendarTasks(googleTokens),
        getClassroomAssignments(googleTokens),
      ]);
      
      const totalGoogleTasks = (calendarEvents?.length || 0) + (classroomTasks?.length || 0);
      if (totalGoogleTasks > 0) {
        setTaskCount(totalGoogleTasks);
      }
    } catch (error) {
      console.error("Dashboard Google Sync Error:", error);
    } finally {
      setLoadingMetrics(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. Header Section ng Student Dashboard */}
      <View style={styles.dashboardHeader}>
        <TouchableOpacity
          onPress={() => setIsMenuOpen(true)}
          style={styles.hamburgerButton}
        >
          <Text style={styles.hamburgerIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.dashboardTitle}>Dashboard</Text>
        <View style={styles.headerRightIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="notifications-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="person-circle-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* 2. Main Body Content ng Dashboard */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Thesis Progress Status</Text>
          <Text style={styles.cardText}>On Track</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upcoming Deadlines</Text>
          {loadingMetrics ? (
            <ActivityIndicator size="small" color="#2563EB" />
          ) : (
            <Text style={styles.cardText}>{taskCount} Tasks Remaining</Text>
          )}
        </View>
      </ScrollView>

      {/* 3. Hamburger Menu Modal Component */}
      <HamburgerMenu
        isopen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navigation={navigation}
      />
    </SafeAreaView>
  );
}

// Hamburger Menu Sub-Component (Naka-upgrade na sa Vector Icons)
function HamburgerMenu({ isopen, onClose, navigation }) {
  if (!isopen) return null;

  const handleNavigate = (screenName) => {
    onClose();
    if (navigation && screenName) {
      navigation.navigate(screenName);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={isopen}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Backdrop overlay para ma-tap sa labas kapag gustong isara */}
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        {/* Hamburger Drawer Container */}
        <View style={styles.drawer}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Back Button */}
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>

            {/* Logo & Name */}
            <View style={styles.logoContainer}>
              <Ionicons name="school" size={40} color="#2563EB" />
              <Text style={styles.logoText}>ThesisPilot</Text>
            </View>

            {/* Menu Links */}
            <View style={styles.menuList}>
              {/* Active Dashboard Link */}
              <TouchableOpacity
                style={[styles.menuItem, styles.activeMenuItem]}
                onPress={() => handleNavigate('Dashboard')}
              >
                <Ionicons name="home-outline" size={20} color="#2563EB" />
                <Text style={[styles.menuText, styles.activeMenuText]}>Dashboard</Text>
              </TouchableOpacity>

              {/* Thesis Workspace */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigate('ThesisWorkspace')}
              >
                <Ionicons name="grid-outline" size={20} color="#000" />
                <Text style={styles.menuText}>Thesis Workspace</Text>
              </TouchableOpacity>

              {/* Tasks */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigate('Tasks')}
              >
                <Octicons name="tasklist" size={20} color="#000" />
                <Text style={styles.menuText}>Tasks</Text>
              </TouchableOpacity>

              {/* Adviser Feedback */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigate('AdviserFeedback')}
              >
                <MaterialCommunityIcons
                  name="comment-text-multiple-outline"
                  size={20}
                  color="#000"
                />
                <Text style={styles.menuText}>Adviser Feedback</Text>
              </TouchableOpacity>

              {/* References */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigate('References')}
              >
                <Ionicons name="library-outline" size={20} color="#000" />
                <Text style={styles.menuText}>References</Text>
              </TouchableOpacity>

              {/* Meetings */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigate('Meetings')}
              >
                <Feather name="video" size={20} color="#000" />
                <Text style={styles.menuText}>Meetings</Text>
              </TouchableOpacity>

              {/* Chat */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigate('Chat')}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={20} color="#000" />
                <Text style={styles.menuText}>Chat</Text>
              </TouchableOpacity>

              {/* AI Assistant */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigate('AIAssistant')}
              >
                <MaterialCommunityIcons name="robot-outline" size={20} color="#000" />
                <Text style={styles.menuText}>AI Assistant</Text>
              </TouchableOpacity>

              {/* Peer Assessment */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigate('PeerAssessment')}
              >
                <Ionicons name="star-outline" size={20} color="#000" />
                <Text style={styles.menuText}>Peer Assessment</Text>
              </TouchableOpacity>

              {/* Defense Preparation */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigate('DefensePreparation')}
              >
                <Ionicons name="time-outline" size={20} color="#000" />
                <Text style={styles.menuText}>Defense Preparation</Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Settings */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigate('Settings')}
              >
                <Ionicons name="settings-outline" size={20} color="#000" />
                <Text style={styles.menuText}>Settings</Text>
              </TouchableOpacity>

              {/* Help & Support */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigate('HelpSupport')}
              >
                <Ionicons name="help-circle-outline" size={20} color="#000" />
                <Text style={styles.menuText}>Help & Support</Text>
              </TouchableOpacity>

              {/* Logout */}
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => handleNavigate('Login')}
              >
                <SimpleLineIcons name="logout" size={20} color="#EF4444" />
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

// Complete StyleSheet
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    flex: 1,
  },
  dashboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  hamburgerButton: {
    padding: 4,
  },
  hamburgerIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dashboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRightIcons: {
    flexDirection: 'row',
    gap: 10,
  },
  iconBtn: {
    padding: 4,
  },
  content: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  /* Hamburger Menu Styles */
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  drawer: {
    width: '78%',
    backgroundColor: '#FFFFFF',
    height: '100%',
    borderTopRightRadius: 32,
    paddingTop: 40,
    paddingHorizontal: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  backButton: {
    paddingVertical: 6,
    marginBottom: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    paddingLeft: 4,
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#2563EB',
  },
  menuList: {
    gap: 3,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 14,
  },
  activeMenuItem: {
    backgroundColor: '#BFDBFE',
  },
  menuText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: 'monospace',
  },
  activeMenuText: {
    color: '#2563EB',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#EF4444',
    fontFamily: 'monospace',
  },
  versionText: {
    marginTop: 20,
    marginBottom: 30,
    fontSize: 10,
    color: '#94A3B8',
    fontFamily: 'monospace',
    paddingLeft: 12,
  },
});