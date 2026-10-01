import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet,
  SafeAreaView 
} from 'react-native';
import { 
  Ionicons, 
  MaterialCommunityIcons, 
  Octicons, 
  Feather, 
  SimpleLineIcons 
} from '@expo/vector-icons';

export default function HamburgerMenu(props) {
  // Pangsara kung nakakabit sa navigation drawer
  const handleClose = () => {
    if (props.navigation && props.navigation.closeDrawer) {
      props.navigation.closeDrawer();
    } else if (props.onClose) {
      props.onClose();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.drawer}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Back Button */}
          <TouchableOpacity onPress={handleClose} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          {/* Logo & Name */}
          <View style={styles.logoRow}>
            <Ionicons name="school" size={40} color="#2563EB" />
            <Text style={styles.logoText}>ThesisPilot</Text>
          </View>

          {/* Navigation Items */}
          <View style={styles.menuContainer}>
            
            {/* Active Link: Dashboard */}
            <TouchableOpacity style={[styles.menuItem, styles.activeMenuItem]}>
              <Ionicons name="home-outline" size={20} color="#2563EB" />
              <Text style={[styles.menuText, styles.activeMenuText]}>Dashboard</Text>
            </TouchableOpacity>

            {/* Thesis Workspace */}
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="grid-outline" size={20} color="#000" />
              <Text style={styles.menuText}>Thesis Workspace</Text>
            </TouchableOpacity>

            {/* Tasks */}
            <TouchableOpacity style={styles.menuItem}>
              <Octicons name="tasklist" size={20} color="#000" />
              <Text style={styles.menuText}>Tasks</Text>
            </TouchableOpacity>

            {/* Adviser Feedback */}
            <TouchableOpacity style={styles.menuItem}>
              <MaterialCommunityIcons name="comment-text-multiple-outline" size={20} color="#000" />
              <Text style={styles.menuText}>Adviser Feedback</Text>
            </TouchableOpacity>

            {/* References */}
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="library-outline" size={20} color="#000" />
              <Text style={styles.menuText}>References</Text>
            </TouchableOpacity>

            {/* Meetings */}
            <TouchableOpacity style={styles.menuItem}>
              <Feather name="video" size={20} color="#000" />
              <Text style={styles.menuText}>Meetings</Text>
            </TouchableOpacity>

            {/* Chat */}
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="chatbubble-ellipses-outline" size={20} color="#000" />
              <Text style={styles.menuText}>Chat</Text>
            </TouchableOpacity>

            {/* AI Assistant */}
            <TouchableOpacity style={styles.menuItem}>
              <MaterialCommunityIcons name="robot-outline" size={20} color="#000" />
              <Text style={styles.menuText}>AI Assistant</Text>
            </TouchableOpacity>

            {/* Peer Assessment */}
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="star-outline" size={20} color="#000" />
              <Text style={styles.menuText}>Peer Assessment</Text>
            </TouchableOpacity>

            {/* Defense Preparation */}
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="time-outline" size={20} color="#000" />
              <Text style={styles.menuText}>Defense Preperation</Text>
            </TouchableOpacity>

            {/* Line Separator */}
            <View style={styles.divider} />

            {/* Settings */}
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="settings-outline" size={20} color="#000" />
              <Text style={styles.menuText}>Settings</Text>
            </TouchableOpacity>

            {/* Help & Support */}
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons name="help-circle-outline" size={20} color="#000" />
              <Text style={styles.menuText}>Help & Support</Text>
            </TouchableOpacity>

            {/* Logout */}
            <TouchableOpacity style={styles.menuItem}>
              <SimpleLineIcons name="logout" size={20} color="#FF4D4D" />
              <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
            </TouchableOpacity>

          </View>

          {/* Version */}
          <Text style={styles.versionText}>App Version 1.0.0</Text>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  drawer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopRightRadius: 32,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingTop: 10,
    paddingBottom: 30,
  },
  backButton: {
    paddingVertical: 10,
    marginBottom: 5,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    paddingLeft: 4,
  },
  logoText: {
    fontSize: 24,
    fontWeight: '800',
    fontStyle: 'italic',
    color: '#2563EB',
    letterSpacing: -0.5,
  },
  menuContainer: {
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
    color: '#000000',
    fontFamily: 'monospace',
  },
  activeMenuText: {
    color: '#2563EB',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  logoutText: {
    color: '#FF4D4D',
  },
  versionText: {
    marginTop: 25,
    fontSize: 10,
    color: '#9CA3AF',
    fontFamily: 'monospace',
    paddingLeft: 12,
  },
});