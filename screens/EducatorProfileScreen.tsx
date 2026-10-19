import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  Alert,
  Platform,
  TextInput,
  Switch,
  Linking,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EducatorProfileScreenProps {
  onBack: () => void;
  onSwitchRole?: () => void;
  onLogout?: () => void;
  setEducatorDashView?: (view: 'dashboard' | 'chat' | 'profile') => void;
  userData?: {
    fullName?: string;
    email?: string;
    role?: 'Student' | 'Educator';
  };
}

const STORAGE_KEY = '@educator_profile_data_v1';

export default function EducatorProfileScreen({
  onBack,
  onSwitchRole,
  onLogout,
  setEducatorDashView,
  userData,
}: EducatorProfileScreenProps) {
  // Theme Mode State (Light Mode default)
  const [themeMode, setThemeMode] = useState<'system' | 'light' | 'dark'>('light');

  // Profile Image States
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);

  // Educator Account Info Editable States
  const [educatorName, setEducatorName] = useState(userData?.fullName || 'John Ternus');
  const [educatorTitle, setEducatorTitle] = useState('Educator');
  const [educatorEmail, setEducatorEmail] = useState(userData?.email || 'johnternus@tip.edu.ph');
  const [educatorPhone, setEducatorPhone] = useState('+63 912 345 6789');
  const [educatorUsername, setEducatorUsername] = useState('john_appleseed');
  const [educatorBio, setEducatorBio] = useState('CEO of Apple Computer inc.');
  const [educatorDepartment, setEducatorDepartment] = useState('College of Computer Studies');

  // Currently Selected Thesis Group Handled
  const [selectedThesisGroup, setSelectedThesisGroup] = useState("Cooper's Thesis Group");
  const [showThesisSelectModal, setShowThesisSelectModal] = useState(false);
  const thesisGroupsList = [
    { id: '1', title: "Cooper's Thesis Group", chapter: 'Chapter 3: Methodology' },
    { id: '2', title: 'Pied Piper AI Group', chapter: 'Chapter 2: Literature Review' },
    { id: '3', title: 'BioTech Health Research', chapter: 'Chapter 4: Data Results' },
    { id: '4', title: 'EcoTech Innovations', chapter: 'Chapter 1: Proposal' },
  ];

  // Notification Preferences States
  const [masterNotificationsEnabled, setMasterNotificationsEnabled] = useState(true);
  const [notifTaskReminders, setNotifTaskReminders] = useState(true);
  const [notifStudentComments, setNotifStudentComments] = useState(true);
  const [notifConsultationUpdates, setNotifConsultationUpdates] = useState(true);
  const [notifChatMessages, setNotifChatMessages] = useState(true);
  const [notifSystemUpdates, setNotifSystemUpdates] = useState(false);
  const [notifEmailDigest, setNotifEmailDigest] = useState(true);

  // Privacy & Security States
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [activeSessionsStatus, setActiveSessionsStatus] = useState(true);
  const [whoCanSeeProfile, setWhoCanSeeProfile] = useState<'Students Only' | 'Everyone' | 'Only me'>('Students Only');
  const [blockedUsersList, setBlockedUsersList] = useState<string[]>(['John Doe', 'Jane Smith']);

  // Modals for Privacy & Security Sub-features
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showActiveSessionsModal, setShowActiveSessionsModal] = useState(false);
  const [showWhoCanSeeModal, setShowWhoCanSeeModal] = useState(false);
  const [showBlockedUsersModal, setShowBlockedUsersModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Manage Storage & Repository States
  const [showManageStorageModal, setShowManageStorageModal] = useState(false);
  const [cacheSize, setCacheSize] = useState('200MB');
  const [repositorySearchQuery, setRepositorySearchQuery] = useState('');

  // File Repository Items Mock Data
  const initialRepoFolders = [
    { id: 'f1', name: 'Chapter 1 - Introduction', count: '5 files' },
    { id: 'f2', name: 'Chapter 2 - Literature Review', count: '8 files' },
    { id: 'f3', name: 'Chapter 3 - Methodology', count: '16 files' },
    { id: 'f4', name: 'Chapter 4 - Results', count: '14 files' },
    { id: 'f5', name: 'Chapter 5 - Conclusion', count: '3 files' },
  ];

  const initialRepoFiles = [
    { id: 'file1', name: 'Thesis Proposal.pdf', date: 'May 05, 2026', size: '12.4 MB', type: 'pdf' },
    { id: 'file2', name: 'Data Collection.xlsx', date: 'May 12, 2026', size: '11.1 MB', type: 'xlsx' },
    { id: 'file3', name: 'Research Instrument.docx', date: 'Apr 26, 2026', size: '1856 KB', type: 'docx' },
  ];

  // About ThesisPilot Modals State
  const [showWhatsNewModal, setShowWhatsNewModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showOpenSourceModal, setShowOpenSourceModal] = useState(false);

  // Password Fields State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sub-Screen View Controls
  const [activeSubView, setActiveSubView] = useState<
    'main' | 'account' | 'notification' | 'privacy' | 'changePassword' | 'data' | 'repository' | 'help' | 'about' | 'theme'
  >('main');

  // PERSISTENCE: LOAD PROFILE DATA ON MOUNT
  useEffect(() => {
    loadSavedProfileData();
  }, []);

  const loadSavedProfileData = async () => {
    try {
      const savedDataJSON = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedDataJSON !== null) {
        const data = JSON.parse(savedDataJSON);
        if (data.profileImageUri !== undefined) setProfileImageUri(data.profileImageUri);
        if (data.educatorName) setEducatorName(data.educatorName);
        if (data.educatorTitle) setEducatorTitle(data.educatorTitle);
        if (data.educatorEmail) setEducatorEmail(data.educatorEmail);
        if (data.educatorPhone) setEducatorPhone(data.educatorPhone);
        if (data.educatorUsername) setEducatorUsername(data.educatorUsername);
        if (data.educatorBio) setEducatorBio(data.educatorBio);
        if (data.educatorDepartment) setEducatorDepartment(data.educatorDepartment);
        if (data.selectedThesisGroup) setSelectedThesisGroup(data.selectedThesisGroup);
        if (data.masterNotificationsEnabled !== undefined) setMasterNotificationsEnabled(data.masterNotificationsEnabled);
        if (data.notifTaskReminders !== undefined) setNotifTaskReminders(data.notifTaskReminders);
        if (data.notifStudentComments !== undefined) setNotifStudentComments(data.notifStudentComments);
        if (data.notifConsultationUpdates !== undefined) setNotifConsultationUpdates(data.notifConsultationUpdates);
        if (data.notifChatMessages !== undefined) setNotifChatMessages(data.notifChatMessages);
        if (data.notifSystemUpdates !== undefined) setNotifSystemUpdates(data.notifSystemUpdates);
        if (data.notifEmailDigest !== undefined) setNotifEmailDigest(data.notifEmailDigest);
        if (data.twoFactorAuth !== undefined) setTwoFactorAuth(data.twoFactorAuth);
        if (data.activeSessionsStatus !== undefined) setActiveSessionsStatus(data.activeSessionsStatus);
        if (data.whoCanSeeProfile) setWhoCanSeeProfile(data.whoCanSeeProfile);
      }
    } catch (e) {
      console.log('Failed to load educator profile data from storage:', e);
    }
  };

  const saveProfileDataToStorage = async (overrideObj = {}) => {
    try {
      const currentProfileData = {
        profileImageUri,
        educatorName,
        educatorTitle,
        educatorEmail,
        educatorPhone,
        educatorUsername,
        educatorBio,
        educatorDepartment,
        selectedThesisGroup,
        masterNotificationsEnabled,
        notifTaskReminders,
        notifStudentComments,
        notifConsultationUpdates,
        notifChatMessages,
        notifSystemUpdates,
        notifEmailDigest,
        twoFactorAuth,
        activeSessionsStatus,
        whoCanSeeProfile,
        ...overrideObj,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currentProfileData));
    } catch (e) {
      console.log('Failed to save educator profile data to storage:', e);
    }
  };

  // Master Toggle handler for "Enable Notifications"
  const handleToggleMasterNotifications = (val: boolean) => {
    setMasterNotificationsEnabled(val);
    setNotifTaskReminders(val);
    setNotifStudentComments(val);
    setNotifConsultationUpdates(val);
    setNotifChatMessages(val);
    setNotifSystemUpdates(val);
    setNotifEmailDigest(val);
  };

  // CAMERA ACTION
  const handleTakePhoto = async () => {
    setShowImagePickerModal(false);
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'You need to grant camera permissions to take a profile photo.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newUri = result.assets[0].uri;
      setProfileImageUri(newUri);
      await saveProfileDataToStorage({ profileImageUri: newUri });
      Alert.alert('Success', 'Profile photo updated successfully.');
    }
  };

  // GALLERY ACTION
  const handleChooseFromGallery = async () => {
    setShowImagePickerModal(false);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'You need to grant access to your photo gallery.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const newUri = result.assets[0].uri;
      setProfileImageUri(newUri);
      await saveProfileDataToStorage({ profileImageUri: newUri });
      Alert.alert('Success', 'Profile photo updated successfully.');
    }
  };

  // REMOVE PHOTO ACTION
  const handleRemovePhoto = () => {
    setShowImagePickerModal(false);
    if (!profileImageUri) {
      Alert.alert('Info', 'No profile photo to remove.');
      return;
    }
    Alert.alert('Remove Photo', 'Are you sure you want to remove your profile photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          setProfileImageUri(null);
          await saveProfileDataToStorage({ profileImageUri: null });
          Alert.alert('Removed', 'Profile photo has been removed.');
        },
      },
    ]);
  };

  // Unblock User Handler
  const handleUnblockUser = (userName: string) => {
    setBlockedUsersList((prev) => prev.filter((u) => u !== userName));
    Alert.alert('Unblocked', `${userName} has been unblocked.`);
  };

  // Confirm Logout Handler
  const handleConfirmLogout = () => {
    setShowLogoutModal(false);
    if (onLogout) {
      onLogout();
    } else {
      Alert.alert('Logged Out', 'You have been successfully logged out.');
    }
  };

  // Delete Account Confirmation Action
  const handleConfirmDeleteAccount = async () => {
    setShowDeleteAccountModal(false);
    await AsyncStorage.removeItem(STORAGE_KEY);
    Alert.alert('Account Deleted', 'Your account has been deleted. Redirecting to registration...');
  };

  // Clear Cache Action
  const handleClearCache = () => {
    setShowManageStorageModal(false);
    setCacheSize('0MB');
    Alert.alert('Cache Cleared', 'Successfully cleared 200MB of temporary cache storage.');
  };

  // Email Support Action
  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@thesispilot.app').catch(() => {
      Alert.alert('Email Support', 'Opening email client to support@thesispilot.app. Response within 24-48 hours.');
    });
  };

  // Save Handlers
  const handleSaveAccountInfo = async () => {
    await saveProfileDataToStorage();
    Alert.alert('Success', 'Account information updated successfully.');
    setActiveSubView('main');
  };

  const handleSaveNotificationPreferences = async () => {
    await saveProfileDataToStorage();
    Alert.alert('Preferences Saved', 'Notification preferences updated successfully.');
    setActiveSubView('main');
  };

  const handleChangePasswordSubmit = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirmation do not match.');
      return;
    }
    Alert.alert('Success', 'Your password has been changed successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setActiveSubView('privacy');
  };

  // Filtered Repository Items
  const filteredFolders = initialRepoFolders.filter((f) =>
    f.name.toLowerCase().includes(repositorySearchQuery.toLowerCase())
  );
  const filteredFiles = initialRepoFiles.filter((f) =>
    f.name.toLowerCase().includes(repositorySearchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* 1. SUB-SCREEN: ACCOUNT INFORMATION */}
      {activeSubView === 'account' ? (
        <View style={styles.container}>
          <View style={styles.topHeaderBarSub}>
            <TouchableOpacity style={styles.headerIconTouch} onPress={() => setActiveSubView('main')}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitleSub}>Account Information</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.whiteCardContainerSub}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
            >
              <View style={styles.avatarCenterWrapper}>
                <TouchableOpacity
                  style={styles.avatarTouchBox}
                  activeOpacity={0.85}
                  onPress={() => setShowImagePickerModal(true)}
                >
                  {profileImageUri ? (
                    <Image source={{ uri: profileImageUri }} style={styles.avatarImage} />
                  ) : (
                    <View style={styles.placeholderAvatar}>
                      <Ionicons name="person" size={60} color="#1E58A8" />
                    </View>
                  )}
                  <View style={styles.cameraBadge}>
                    <Ionicons name="camera-outline" size={16} color="#1E58A8" />
                  </View>
                </TouchableOpacity>
              </View>

              <Text style={styles.formLabelText}>Full Name</Text>
              <TextInput style={styles.formTextInput} value={educatorName} onChangeText={setEducatorName} placeholder="Full Name" />

              <Text style={styles.formLabelText}>Email</Text>
              <TextInput
                style={styles.formTextInput}
                value={educatorEmail}
                onChangeText={setEducatorEmail}
                keyboardType="email-address"
                placeholder="Email Address"
              />

              <Text style={styles.formLabelText}>Phone Number</Text>
              <TextInput
                style={styles.formTextInput}
                value={educatorPhone}
                onChangeText={setEducatorPhone}
                keyboardType="phone-pad"
                placeholder="Phone Number"
              />

              <Text style={styles.formLabelText}>Username</Text>
              <TextInput
                style={styles.formTextInput}
                value={educatorUsername}
                onChangeText={setEducatorUsername}
                placeholder="Username"
              />

              <Text style={styles.formLabelText}>Bio (Optional)</Text>
              <TextInput
                style={[styles.formTextInput, styles.formTextAreaInput]}
                value={educatorBio}
                onChangeText={setEducatorBio}
                multiline
                numberOfLines={3}
                placeholder="CEO of Apple Computer inc."
              />

              <TouchableOpacity style={styles.saveChangesPrimaryBtn} activeOpacity={0.85} onPress={handleSaveAccountInfo}>
                <Text style={styles.saveChangesBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      ) : activeSubView === 'notification' ? (
        /* 2. SUB-SCREEN: NOTIFICATION PREFERENCES */
        <View style={styles.container}>
          <View style={styles.topHeaderBarSub}>
            <TouchableOpacity style={styles.headerIconTouch} onPress={() => setActiveSubView('main')}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitleSub}>Notification</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.whiteCardContainerSub}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
            >
              <View style={styles.masterNotifCardGroup}>
                <Text style={styles.notifMainTitleText}>Enable Notifications</Text>
                <Switch
                  value={masterNotificationsEnabled}
                  onValueChange={handleToggleMasterNotifications}
                  trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                  thumbColor={masterNotificationsEnabled ? '#1E58A8' : '#94A3B8'}
                />
              </View>

              <Text style={styles.notifSectionGroupHeading}>Notification Preferences</Text>
              <View style={styles.notifPreferencesGroupCard}>
                <View style={styles.notifToggleRowItem}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.notifRowTitleText}>Task Reminders</Text>
                    <Text style={styles.notifRowSubText}>Reminders for due dates</Text>
                  </View>
                  <Switch
                    value={notifTaskReminders}
                    onValueChange={setNotifTaskReminders}
                    trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                    thumbColor={notifTaskReminders ? '#1E58A8' : '#94A3B8'}
                  />
                </View>

                <View style={styles.notifToggleRowItem}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.notifRowTitleText}>Student Comments</Text>
                    <Text style={styles.notifRowSubText}>Comments & responses from students</Text>
                  </View>
                  <Switch
                    value={notifStudentComments}
                    onValueChange={setNotifStudentComments}
                    trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                    thumbColor={notifStudentComments ? '#1E58A8' : '#94A3B8'}
                  />
                </View>

                <View style={styles.notifToggleRowItem}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.notifRowTitleText}>Consultation Updates</Text>
                    <Text style={styles.notifRowSubText}>Meeting confirmation</Text>
                  </View>
                  <Switch
                    value={notifConsultationUpdates}
                    onValueChange={setNotifConsultationUpdates}
                    trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                    thumbColor={notifConsultationUpdates ? '#1E58A8' : '#94A3B8'}
                  />
                </View>

                <View style={styles.notifToggleRowItem}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.notifRowTitleText}>Chat Messages</Text>
                    <Text style={styles.notifRowSubText}>New messages & mentions</Text>
                  </View>
                  <Switch
                    value={notifChatMessages}
                    onValueChange={setNotifChatMessages}
                    trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                    thumbColor={notifChatMessages ? '#1E58A8' : '#94A3B8'}
                  />
                </View>

                <View style={styles.notifToggleRowItem}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.notifRowTitleText}>System Updates</Text>
                    <Text style={styles.notifRowSubText}>App updates & announcements</Text>
                  </View>
                  <Switch
                    value={notifSystemUpdates}
                    onValueChange={setNotifSystemUpdates}
                    trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                    thumbColor={notifSystemUpdates ? '#1E58A8' : '#94A3B8'}
                  />
                </View>

                <View style={[styles.notifToggleRowItem, { borderBottomWidth: 0 }]}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.notifRowTitleText}>Email Digest</Text>
                    <Text style={styles.notifRowSubText}>Daily summary via email</Text>
                  </View>
                  <Switch
                    value={notifEmailDigest}
                    onValueChange={setNotifEmailDigest}
                    trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                    thumbColor={notifEmailDigest ? '#1E58A8' : '#94A3B8'}
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.saveChangesPrimaryBtn}
                activeOpacity={0.85}
                onPress={handleSaveNotificationPreferences}
              >
                <Text style={styles.saveChangesBtnText}>Save Preferences</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      ) : activeSubView === 'privacy' ? (
        /* 3. SUB-SCREEN: PRIVACY & SECURITY */
        <View style={styles.container}>
          <View style={styles.topHeaderBarSub}>
            <TouchableOpacity style={styles.headerIconTouch} onPress={() => setActiveSubView('main')}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitleSub}>Privacy & Security</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.whiteCardContainerSub}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
            >
              <Text style={styles.notifSectionGroupHeading}>Account Security</Text>
              <View style={styles.privacyCardGroup}>
                <TouchableOpacity
                  style={styles.privacyRowItem}
                  activeOpacity={0.7}
                  onPress={() => setActiveSubView('changePassword')}
                >
                  <Ionicons name="key-outline" size={20} color="#000000" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Change Password</Text>
                  <Ionicons name="chevron-forward" size={18} color="#000000" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.privacyRowItem} activeOpacity={0.7} onPress={() => setShow2FAModal(true)}>
                  <Ionicons name="lock-closed-outline" size={20} color="#000000" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Two-Factor Authentication</Text>
                  <Text style={styles.privacySubStatusText}>{twoFactorAuth ? 'On' : 'Off'}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#000000" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.privacyRowItem, { borderBottomWidth: 0 }]}
                  activeOpacity={0.7}
                  onPress={() => setShowActiveSessionsModal(true)}
                >
                  <Ionicons name="time-outline" size={20} color="#000000" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Active Sessions</Text>
                  <Text style={styles.privacySubStatusText}>{activeSessionsStatus ? '3 active' : 'Off'}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#000000" />
                </TouchableOpacity>
              </View>

              <Text style={[styles.notifSectionGroupHeading, { marginTop: 20 }]}>Privacy</Text>
              <View style={styles.privacyCardGroup}>
                <TouchableOpacity style={styles.privacyRowItem} activeOpacity={0.7} onPress={() => setShowWhoCanSeeModal(true)}>
                  <Ionicons name="help-circle-outline" size={20} color="#000000" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Who can see my profile</Text>
                  <Text style={styles.privacySubStatusText}>{whoCanSeeProfile}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#000000" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.privacyRowItem} activeOpacity={0.7} onPress={() => setActiveSubView('data')}>
                  <Ionicons name="stats-chart-outline" size={20} color="#000000" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Data & Activity</Text>
                  <Ionicons name="chevron-forward" size={18} color="#000000" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.privacyRowItem, { borderBottomWidth: 0 }]}
                  activeOpacity={0.7}
                  onPress={() => setShowBlockedUsersModal(true)}
                >
                  <Ionicons name="person-remove-outline" size={20} color="#000000" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Blocked Users</Text>
                  <Ionicons name="chevron-forward" size={18} color="#000000" />
                </TouchableOpacity>
              </View>

              <View style={[styles.privacyCardGroup, { marginTop: 24 }]}>
                <TouchableOpacity
                  style={[styles.privacyRowItem, { borderBottomWidth: 0 }]}
                  activeOpacity={0.7}
                  onPress={() => setShowDeleteAccountModal(true)}
                >
                  <Ionicons name="trash-outline" size={20} color="#DC2626" style={styles.optionIcon} />
                  <Text style={[styles.privacyLabelText, { color: '#DC2626' }]}>Delete Account</Text>
                  <Ionicons name="chevron-forward" size={18} color="#DC2626" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      ) : activeSubView === 'data' ? (
        /* 4. SUB-SCREEN: STORAGE & DATA */
        <View style={styles.container}>
          <View style={styles.topHeaderBarSub}>
            <TouchableOpacity style={styles.headerIconTouch} onPress={() => setActiveSubView('main')}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitleSub}>Storage & Data</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.whiteCardContainerSub}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
            >
              <View style={styles.cloudStorageCard}>
                <View style={styles.cloudStorageIconBox}>
                  <Ionicons name="cloud-outline" size={28} color="#1E58A8" />
                </View>
                <View style={styles.cloudStorageInfoBox}>
                  <Text style={styles.cloudStorageTitleText}>Cloud Storage</Text>
                  <View style={styles.cloudStorageRowText}>
                    <Text style={styles.cloudStorageUsedText}>1.62 GB of 10 GB used</Text>
                    <Text style={styles.cloudStoragePercentText}>24%</Text>
                  </View>
                  <View style={styles.cloudProgressBarTrack}>
                    <View style={[styles.cloudProgressBarFill, { width: '24%' }]} />
                  </View>
                </View>
              </View>

              <Text style={styles.notifSectionGroupHeading}>Storage Breakdown</Text>
              <View style={styles.privacyCardGroup}>
                <View style={styles.privacyRowItem}>
                  <Ionicons name="document-text-outline" size={22} color="#000000" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Notes</Text>
                  <Text style={styles.storageSizeText}>146 MB</Text>
                </View>
                <View style={styles.privacyRowItem}>
                  <Ionicons name="attach-outline" size={22} color="#000000" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Chat Attachments</Text>
                  <Text style={styles.storageSizeText}>420 MB</Text>
                </View>
                <View style={[styles.privacyRowItem, { borderBottomWidth: 0 }]}>
                  <Ionicons name="pie-chart-outline" size={22} color="#000000" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Other Data</Text>
                  <Text style={styles.storageSizeText}>69.7 MB</Text>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.manageStorageOutlineBtn, { marginTop: 28 }]}
                activeOpacity={0.8}
                onPress={() => setShowManageStorageModal(true)}
              >
                <Text style={styles.manageStorageBtnText}>Manage Storage</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      ) : activeSubView === 'repository' ? (
        /* 4.1 SUB-SCREEN: FILE REPOSITORY */
        <View style={styles.container}>
          <View style={styles.repoTopHeaderBar}>
            <TouchableOpacity style={styles.headerIconTouch} onPress={() => setActiveSubView('data')}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.repoHeaderTitleText}>Files</Text>
            <View style={styles.repoHeaderIconsRight}>
              <TouchableOpacity style={{ marginRight: 12 }}>
                <Ionicons name="funnel-outline" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="cloud-download-outline" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.whiteCardContainerSub}>
            <View style={styles.repoSearchRowWrapper}>
              <View style={styles.repoSearchBoxInput}>
                <Ionicons name="search-outline" size={18} color="#64748B" style={{ marginRight: 8 }} />
                <TextInput
                  style={styles.repoSearchTextInput}
                  placeholder="Search files..."
                  placeholderTextColor="#94A3B8"
                  value={repositorySearchQuery}
                  onChangeText={setRepositorySearchQuery}
                />
              </View>
              <TouchableOpacity style={styles.repoFilterFunnelBtn}>
                <Ionicons name="funnel-outline" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
              {filteredFolders.map((folder) => (
                <View key={folder.id} style={styles.repoFolderRowItem}>
                  <View style={styles.repoFolderIconBox}>
                    <Ionicons name="folder" size={32} color="#FACC15" />
                  </View>
                  <View style={styles.repoFolderInfoCol}>
                    <Text style={styles.repoFolderNameText}>{folder.name}</Text>
                    <Text style={styles.repoFolderSubCount}>{folder.count}</Text>
                  </View>
                  <TouchableOpacity style={styles.repoMoreMenuBtn}>
                    <Ionicons name="ellipsis-vertical" size={18} color="#000000" />
                  </TouchableOpacity>
                </View>
              ))}

              {filteredFiles.map((file) => (
                <View key={file.id} style={styles.repoFileRowItem}>
                  {file.type === 'pdf' ? (
                    <View style={styles.pdfIconWrapper}>
                      <Ionicons name="document-text-outline" size={24} color="#EF4444" />
                      <Text style={styles.pdfBadgeText}>PDF</Text>
                    </View>
                  ) : file.type === 'xlsx' ? (
                    <View style={styles.xlsxIconWrapper}>
                      <Text style={styles.xlsxBadgeText}>XLSX</Text>
                    </View>
                  ) : (
                    <View style={styles.docxIconWrapper}>
                      <Text style={styles.docxBadgeText}>DOCX</Text>
                    </View>
                  )}
                  <View style={styles.repoFileInfoCol}>
                    <Text style={styles.repoFileNameText}>{file.name}</Text>
                    <Text style={styles.repoFileSubMeta}>
                      {file.date} • {file.size}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.repoMoreMenuBtn}>
                    <Ionicons name="ellipsis-vertical" size={18} color="#000000" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      ) : activeSubView === 'about' ? (
        /* 6. SUB-SCREEN: ABOUT THESISPILOT */
        <View style={styles.container}>
          <View style={styles.topHeaderBarSub}>
            <TouchableOpacity style={styles.headerIconTouch} onPress={() => setActiveSubView('main')}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitleSub}>About ThesisPilot</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.whiteCardContainerSub}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 28, paddingBottom: 40 }}
            >
              <View style={styles.aboutBrandingWrapper}>
                <View style={styles.aboutLogoIconBox}>
                  <Ionicons name="school" size={56} color="#1E58A8" />
                </View>
                <Text style={styles.aboutAppNameText}>ThesisPilot</Text>
                <Text style={styles.aboutVersionText}>Version 1.0.0</Text>
                <Text style={styles.aboutSloganText}>Your AI-powered partner in every step of your thesis journey.</Text>
              </View>

              <View style={styles.aboutOptionsCardGroup}>
                <TouchableOpacity style={styles.aboutOptionRowItem} activeOpacity={0.7} onPress={() => setShowWhatsNewModal(true)}>
                  <Ionicons name="open-outline" size={20} color="#000000" style={styles.aboutOptionIcon} />
                  <Text style={styles.aboutOptionLabelText}>What's New</Text>
                  <Ionicons name="chevron-forward" size={18} color="#64748B" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.aboutOptionRowItem} activeOpacity={0.7} onPress={() => setShowTermsModal(true)}>
                  <Ionicons name="open-outline" size={20} color="#000000" style={styles.aboutOptionIcon} />
                  <Text style={styles.aboutOptionLabelText}>Terms of Service</Text>
                  <Ionicons name="chevron-forward" size={18} color="#64748B" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.aboutOptionRowItem} activeOpacity={0.7} onPress={() => setShowPrivacyModal(true)}>
                  <Ionicons name="open-outline" size={20} color="#000000" style={styles.aboutOptionIcon} />
                  <Text style={styles.aboutOptionLabelText}>Privacy Policy</Text>
                  <Ionicons name="chevron-forward" size={18} color="#64748B" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.aboutOptionRowItem, { borderBottomWidth: 0 }]}
                  activeOpacity={0.7}
                  onPress={() => setShowOpenSourceModal(true)}
                >
                  <Ionicons name="open-outline" size={20} color="#000000" style={styles.aboutOptionIcon} />
                  <Text style={styles.aboutOptionLabelText}>Open Source Licenses</Text>
                  <Ionicons name="chevron-forward" size={18} color="#64748B" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      ) : activeSubView === 'changePassword' ? (
        /* 7. SUB-SCREEN: CHANGE PASSWORD */
        <View style={styles.container}>
          <View style={styles.topHeaderBarSub}>
            <TouchableOpacity style={styles.headerIconTouch} onPress={() => setActiveSubView('privacy')}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitleSub}>Change Password</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.whiteCardContainerSub}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
            >
              <Text style={styles.formLabelText}>Current Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordTextInput}
                  secureTextEntry={!showCurrentPassword}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="Enter current password"
                  placeholderTextColor="#94A3B8"
                />
                <TouchableOpacity style={styles.eyeIconTouch} onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                  <Ionicons
                    name={showCurrentPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#475569"
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.formLabelText}>New Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordTextInput}
                  secureTextEntry={!showNewPassword}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Enter new password"
                  placeholderTextColor="#94A3B8"
                />
                <TouchableOpacity style={styles.eyeIconTouch} onPress={() => setShowNewPassword(!showNewPassword)}>
                  <Ionicons name={showNewPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#475569" />
                </TouchableOpacity>
              </View>

              <Text style={styles.formLabelText}>Confirm New Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordTextInput}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor="#94A3B8"
                />
                <TouchableOpacity style={styles.eyeIconTouch} onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Ionicons
                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#475569"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.saveChangesPrimaryBtn} activeOpacity={0.85} onPress={handleChangePasswordSubmit}>
                <Text style={styles.saveChangesBtnText}>Update Password</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      ) : activeSubView === 'theme' ? (
        /* APP THEME SUB-SCREEN */
        <View style={styles.container}>
          <View style={styles.topHeaderBarSub}>
            <TouchableOpacity style={styles.headerIconTouch} onPress={() => setActiveSubView('main')}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitleSub}>App Theme</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.whiteCardContainerSub}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
            >
              <Text style={styles.notifSectionGroupHeading}>Choose Appearance</Text>
              <View style={styles.privacyCardGroup}>
                {(['system', 'light', 'dark'] as const).map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    style={[styles.privacyRowItem, themeMode === mode && styles.optionSelectBtnActive]}
                    onPress={() => setThemeMode(mode)}
                  >
                    <Ionicons
                      name={mode === 'system' ? 'settings-outline' : mode === 'light' ? 'sunny-outline' : 'moon-outline'}
                      size={20}
                      color="#0F172A"
                      style={styles.optionIcon}
                    />
                    <Text style={styles.privacyLabelText}>
                      {mode === 'system' ? 'System Default' : mode === 'light' ? 'Light Mode' : 'Dark Mode'}
                    </Text>
                    {themeMode === mode && <Ionicons name="checkmark-circle" size={20} color="#1E58A8" />}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      ) : (
        /* 8. MAIN PROFILE SCREEN */
        <View style={styles.container}>
          {/* TOP HEADER BAR */}
          <View style={styles.topHeaderBar}>
            <Text style={styles.headerTitle}>Profile</Text>
          </View>

          {/* MAIN WHITE CONTAINER */}
          <View style={styles.whiteCardContainer}>
            {/* AVATAR OVERLAY AREA */}
            <View style={styles.avatarWrapper}>
              <TouchableOpacity style={styles.avatarTouchBox} activeOpacity={0.85} onPress={() => setShowImagePickerModal(true)}>
                {profileImageUri ? (
                  <Image source={{ uri: profileImageUri }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.placeholderAvatar}>
                    <Ionicons name="person" size={60} color="#1E58A8" />
                  </View>
                )}
                <View style={styles.cameraBadge}>
                  <Ionicons name="camera-outline" size={16} color="#1E58A8" />
                </View>
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 }}
            >
              {/* EDUCATOR NAME & LABEL */}
              <View style={styles.studentInfoCenter}>
                <Text style={styles.studentNameText}>{educatorName}</Text>
                <Text style={styles.degreeText}>{educatorTitle}</Text>
              </View>

              {/* CURRENT THESIS HANDLED CARD */}
              <TouchableOpacity
                style={styles.currentThesisCard}
                activeOpacity={0.8}
                onPress={() => setShowThesisSelectModal(true)}
              >
                <Text style={styles.currentThesisLabel}>CURRENT THESIS HANDLED</Text>
                <View style={styles.thesisRow}>
                  <Text style={styles.thesisTitleText}>{selectedThesisGroup}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#000000" />
                </View>
              </TouchableOpacity>

              {/* OPTIONS LIST CARD GROUP */}
              <View style={styles.optionsCardGroup}>
                <TouchableOpacity style={styles.optionRowItem} activeOpacity={0.7} onPress={() => setActiveSubView('account')}>
                  <Ionicons name="person-outline" size={22} color="#000000" style={styles.optionIcon} />
                  <Text style={styles.optionLabelText}>Account Information</Text>
                  <Ionicons name="chevron-forward" size={18} color="#000000" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionRowItem} activeOpacity={0.7} onPress={() => setActiveSubView('notification')}>
                  <Ionicons name="notifications-outline" size={22} color="#000000" style={styles.optionIcon} />
                  <Text style={styles.optionLabelText}>Notification</Text>
                  <Ionicons name="chevron-forward" size={18} color="#000000" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionRowItem} activeOpacity={0.7} onPress={() => setActiveSubView('privacy')}>
                  <Ionicons name="shield-checkmark-outline" size={22} color="#000000" style={styles.optionIcon} />
                  <Text style={styles.optionLabelText}>Privacy & Security</Text>
                  <Ionicons name="chevron-forward" size={18} color="#000000" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionRowItem} activeOpacity={0.7} onPress={() => setActiveSubView('data')}>
                  <Ionicons name="server-outline" size={22} color="#000000" style={styles.optionIcon} />
                  <Text style={styles.optionLabelText}>Data & Storage</Text>
                  <Ionicons name="chevron-forward" size={18} color="#000000" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.optionRowItem} activeOpacity={0.7} onPress={() => setActiveSubView('about')}>
                  <Ionicons name="information-circle-outline" size={22} color="#000000" style={styles.optionIcon} />
                  <Text style={styles.optionLabelText}>About ThesisPilot</Text>
                  <Ionicons name="chevron-forward" size={18} color="#000000" />
                </TouchableOpacity>

                {/* LOGOUT BUTTON ITEM */}
                <TouchableOpacity
                  style={[styles.optionRowItem, { borderBottomWidth: 0 }]}
                  activeOpacity={0.7}
                  onPress={() => setShowLogoutModal(true)}
                >
                  <Ionicons name="log-out-outline" size={22} color="#DC2626" style={styles.optionIcon} />
                  <Text style={[styles.optionLabelText, { color: '#DC2626' }]}>Log Out</Text>
                  <Ionicons name="chevron-forward" size={18} color="#DC2626" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      {/* LOWER TAB NAVIGATOR */}
      <View style={styles.bottomTabContainer}>
        <TouchableOpacity style={styles.tabButton} activeOpacity={0.7} onPress={onBack}>
          <Ionicons name="home-outline" size={24} color="#64748B" />
          <Text style={styles.tabLabelText}>Dashboard</Text>
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
        <TouchableOpacity style={styles.tabButton} activeOpacity={0.7}>
          <View style={styles.activeTabPillBadge}>
            <Ionicons name="person" size={22} color="#1E58A8" />
            <Text style={styles.activeTabPillLabel}>Profile</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* LOGOUT CONFIRMATION MODAL */}
      <Modal visible={showLogoutModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.logoutModalBlueCard}>
            <Text style={styles.logoutModalTitleText}>Log Out</Text>
            <Text style={styles.logoutModalSubText}>Are you sure you want to logout?</Text>
            <View style={styles.logoutModalActionsRow}>
              <TouchableOpacity style={styles.logoutCancelTouchBtn} activeOpacity={0.7} onPress={() => setShowLogoutModal(false)}>
                <Text style={styles.logoutCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutRedBoxBtn} activeOpacity={0.85} onPress={handleConfirmLogout}>
                <Text style={styles.logoutRedBtnText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ABOUT THESISPILOT MODALS */}
      <Modal visible={showWhatsNewModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>What's New in v1.0.0</Text>
            <ScrollView style={{ maxHeight: 220, marginVertical: 10 }}>
              <Text style={{ fontSize: 13, color: '#334155', lineHeight: 20 }}>
                • Added AI Assistant Integration for real-time thesis guidance and manuscript review.{'\n\n'}
                • Built-in consultation scheduler and educator group manager.{'\n\n'}
                • Enhanced File Repository with support for PDFs, DOCX, and XLSX data formats.{'\n\n'}
                • Dark Mode UI support and overall performance optimizations.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowWhatsNewModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showTermsModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Terms of Service</Text>
            <ScrollView style={{ maxHeight: 220, marginVertical: 10 }}>
              <Text style={{ fontSize: 13, color: '#334155', lineHeight: 20 }}>
                ThesisPilot is designed to facilitate thesis management, defense scheduling, and advisor-student collaboration.{'\n\n'}
                By using this app, you agree to submit authentic work, respect intellectual property, and adhere to institutional academic integrity standards.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowTermsModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showPrivacyModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Privacy Policy</Text>
            <ScrollView style={{ maxHeight: 220, marginVertical: 10 }}>
              <Text style={{ fontSize: 13, color: '#334155', lineHeight: 20 }}>
                Your privacy is paramount. ThesisPilot protects your personal details, thesis drafts, and cloud storage files using industry-standard encryption.{'\n\n'}
                We do not sell or share your research data with third parties.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowPrivacyModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showOpenSourceModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Open Source Licenses</Text>
            <ScrollView style={{ maxHeight: 220, marginVertical: 10 }}>
              <Text style={{ fontSize: 13, color: '#334155', lineHeight: 20 }}>
                ThesisPilot is built with reliable open-source frameworks:{'\n\n'}
                • React Native (MIT License){'\n'}
                • Expo SDK (MIT License){'\n'}
                • Ionicons Vector Icons (MIT License){'\n\n'}
                This application is fully licensed and verified.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowOpenSourceModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MANAGE STORAGE SHEET MODAL */}
      <Modal visible={showManageStorageModal} transparent animationType="slide" statusBarTranslucent>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowManageStorageModal(false)}>
          <View style={styles.actionSheetCard}>
            <View style={styles.actionSheetHandle} />
            <Text style={styles.actionSheetTitle}>Manage Storage</Text>
            <TouchableOpacity
              style={styles.actionSheetOption}
              onPress={() => {
                setShowManageStorageModal(false);
                setActiveSubView('repository');
              }}
            >
              <Ionicons name="folder-open-outline" size={22} color="#1E58A8" />
              <Text style={styles.actionSheetOptionText}>Open File Repository</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionSheetOption} onPress={handleClearCache}>
              <Ionicons name="trash-bin-outline" size={22} color="#DC2626" />
              <Text style={[styles.actionSheetOptionText, { color: '#DC2626' }]}>Clear Cache ({cacheSize})</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelSheetBtn} onPress={() => setShowManageStorageModal(false)}>
              <Text style={styles.cancelSheetText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL 1: TWO-FACTOR AUTHENTICATION */}
      <Modal visible={show2FAModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Two-Factor Authentication</Text>
            <Text style={{ fontSize: 13, color: '#64748B', marginVertical: 10 }}>
              When ON, a One-Time PIN (OTP) will be sent to your school email ({educatorEmail}) before logging in.
            </Text>
            <TouchableOpacity
              style={[styles.optionSelectBtn, twoFactorAuth && styles.optionSelectBtnActive]}
              onPress={() => {
                setTwoFactorAuth(true);
                setShow2FAModal(false);
                saveProfileDataToStorage({ twoFactorAuth: true });
                Alert.alert('2FA Enabled', 'A One Time PIN will now be sent to your school email upon Login.');
              }}
            >
              <Ionicons
                name={twoFactorAuth ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={twoFactorAuth ? '#1E58A8' : '#64748B'}
              />
              <Text style={styles.optionSelectText}>ON</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionSelectBtn, !twoFactorAuth && styles.optionSelectBtnActive]}
              onPress={() => {
                setTwoFactorAuth(false);
                setShow2FAModal(false);
                saveProfileDataToStorage({ twoFactorAuth: false });
                Alert.alert('2FA Disabled', 'Two-Factor Authentication has been turned off.');
              }}
            >
              <Ionicons
                name={!twoFactorAuth ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={!twoFactorAuth ? '#1E58A8' : '#64748B'}
              />
              <Text style={styles.optionSelectText}>OFF</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShow2FAModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: ACTIVE SESSIONS STATUS */}
      <Modal visible={showActiveSessionsModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Active Sessions Status</Text>
            <Text style={{ fontSize: 13, color: '#64748B', marginVertical: 10 }}>
              Set to ON if you want students and educators to see when you are online or last active. Set to OFF to hide your active status.
            </Text>
            <TouchableOpacity
              style={[styles.optionSelectBtn, activeSessionsStatus && styles.optionSelectBtnActive]}
              onPress={() => {
                setActiveSessionsStatus(true);
                setShowActiveSessionsModal(false);
                saveProfileDataToStorage({ activeSessionsStatus: true });
                Alert.alert('Active Status ON', 'Other students and educators can now see your active status.');
              }}
            >
              <Ionicons
                name={activeSessionsStatus ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={activeSessionsStatus ? '#1E58A8' : '#64748B'}
              />
              <Text style={styles.optionSelectText}>ON (3 Active Sessions)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionSelectBtn, !activeSessionsStatus && styles.optionSelectBtnActive]}
              onPress={() => {
                setActiveSessionsStatus(false);
                setShowActiveSessionsModal(false);
                saveProfileDataToStorage({ activeSessionsStatus: false });
                Alert.alert('Active Status OFF', 'Your active status is now hidden from everyone.');
              }}
            >
              <Ionicons
                name={!activeSessionsStatus ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={!activeSessionsStatus ? '#1E58A8' : '#64748B'}
              />
              <Text style={styles.optionSelectText}>OFF</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowActiveSessionsModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: WHO CAN SEE MY PROFILE */}
      <Modal visible={showWhoCanSeeModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Who Can See My Profile</Text>
            <TouchableOpacity
              style={[styles.optionSelectBtn, whoCanSeeProfile === 'Students Only' && styles.optionSelectBtnActive]}
              onPress={() => {
                setWhoCanSeeProfile('Students Only');
                setShowWhoCanSeeModal(false);
                saveProfileDataToStorage({ whoCanSeeProfile: 'Students Only' });
              }}
            >
              <Ionicons
                name={whoCanSeeProfile === 'Students Only' ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={whoCanSeeProfile === 'Students Only' ? '#1E58A8' : '#64748B'}
              />
              <Text style={styles.optionSelectText}>Students Only</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionSelectBtn, whoCanSeeProfile === 'Everyone' && styles.optionSelectBtnActive]}
              onPress={() => {
                setWhoCanSeeProfile('Everyone');
                setShowWhoCanSeeModal(false);
                saveProfileDataToStorage({ whoCanSeeProfile: 'Everyone' });
              }}
            >
              <Ionicons
                name={whoCanSeeProfile === 'Everyone' ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={whoCanSeeProfile === 'Everyone' ? '#1E58A8' : '#64748B'}
              />
              <Text style={styles.optionSelectText}>Everyone</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionSelectBtn, whoCanSeeProfile === 'Only me' && styles.optionSelectBtnActive]}
              onPress={() => {
                setWhoCanSeeProfile('Only me');
                setShowWhoCanSeeModal(false);
                saveProfileDataToStorage({ whoCanSeeProfile: 'Only me' });
              }}
            >
              <Ionicons
                name={whoCanSeeProfile === 'Only me' ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={whoCanSeeProfile === 'Only me' ? '#1E58A8' : '#64748B'}
              />
              <Text style={styles.optionSelectText}>Only me</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowWhoCanSeeModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 4: BLOCKED USERS */}
      <Modal visible={showBlockedUsersModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Blocked Users</Text>
            {blockedUsersList.length === 0 ? (
              <Text style={{ fontSize: 13, color: '#64748B', marginVertical: 14 }}>You have not blocked any users.</Text>
            ) : (
              blockedUsersList.map((user) => (
                <View key={user} style={styles.blockedUserRow}>
                  <Text style={styles.blockedUserName}>{user}</Text>
                  <TouchableOpacity style={styles.unblockBtn} onPress={() => handleUnblockUser(user)}>
                    <Text style={styles.unblockBtnText}>Unblock</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowBlockedUsersModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 5: DELETE ACCOUNT CONFIRMATION */}
      <Modal visible={showDeleteAccountModal} transparent animationType="fade">
        <View style={styles.modaloverlayDarkBlur}>
          <View style={styles.deleteModalBlueCard}>
            <View style={styles.deleteWarningIconCircle}>
              <Ionicons name="warning-sharp" size={30} color="#EF4444" />
            </View>
            <Text style={styles.deleteModalTitleText}>Delete Account</Text>
            <Text style={styles.deleteModalDescText}>This will permanently delete your account and all associated data:</Text>
            <View style={styles.deleteWarningBoxContainer}>
              <Text style={styles.deleteWarningBulletText}>• Class Progress</Text>
              <Text style={styles.deleteWarningBulletText}>• File Repository</Text>
              <Text style={styles.deleteWarningBulletText}>• Account Information</Text>
              <Text style={styles.deleteWarningBulletText}>• Data & Storage</Text>
            </View>
            <Text style={styles.deleteActionWarningText}>This action cannot be undone.</Text>
            <View style={styles.deleteModalActionsRow}>
              <TouchableOpacity style={styles.deleteCancelTouchBtn} onPress={() => setShowDeleteAccountModal(false)}>
                <Text style={styles.deleteCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteContinueRedBtn} activeOpacity={0.85} onPress={handleConfirmDeleteAccount}>
                <Text style={styles.deleteContinueBtnText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* THESIS SELECTOR MODAL */}
      <Modal visible={showThesisSelectModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Select Thesis Group</Text>
            <ScrollView style={{ maxHeight: 260, marginVertical: 10 }}>
              {thesisGroupsList.map((proj) => (
                <TouchableOpacity
                  key={proj.id}
                  style={[styles.thesisSelectItem, selectedThesisGroup === proj.title && styles.thesisSelectItemActive]}
                  onPress={() => {
                    setSelectedThesisGroup(proj.title);
                    setShowThesisSelectModal(false);
                    saveProfileDataToStorage({ selectedThesisGroup: proj.title });
                    Alert.alert('Group Switched', `Selected: "${proj.title}"`);
                  }}
                >
                  <Text style={styles.thesisSelectTitle}>{proj.title}</Text>
                  <Text style={styles.thesisSelectSub}>{proj.chapter}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowThesisSelectModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* IMAGE PICKER ACTION SHEET */}
      <Modal visible={showImagePickerModal} transparent animationType="slide" statusBarTranslucent>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setShowImagePickerModal(false)}>
          <View style={styles.actionSheetCard}>
            <View style={styles.actionSheetHandle} />
            <Text style={styles.actionSheetTitle}>Change Profile Picture</Text>
            <TouchableOpacity style={styles.actionSheetOption} onPress={handleTakePhoto}>
              <Ionicons name="camera-outline" size={22} color="#1E58A8" />
              <Text style={styles.actionSheetOptionText}>Take a Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionSheetOption} onPress={handleChooseFromGallery}>
              <Ionicons name="images-outline" size={22} color="#1E58A8" />
              <Text style={styles.actionSheetOptionText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionSheetOption} onPress={handleRemovePhoto}>
              <Ionicons name="trash-outline" size={22} color="#DC2626" />
              <Text style={[styles.actionSheetOptionText, { color: '#DC2626' }]}>Remove Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelSheetBtn} onPress={() => setShowImagePickerModal(false)}>
              <Text style={styles.cancelSheetText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
    paddingBottom: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  topHeaderBarSub: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 52,
    paddingBottom: 16,
  },
  headerTitleSub: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerIconTouch: {
    padding: 4,
  },
  whiteCardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: 10,
  },
  whiteCardContainerSub: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: 8,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginTop: -55,
    marginBottom: 10,
  },
  avatarCenterWrapper: {
    alignItems: 'center',
    marginVertical: 12,
  },
  avatarTouchBox: {
    position: 'relative',
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFFFFF',
    padding: 4,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  placeholderAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#1E58A8',
    elevation: 3,
  },
  studentInfoCenter: {
    alignItems: 'center',
    marginBottom: 20,
  },
  studentNameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  degreeText: {
    fontSize: 13,
    color: '#64748B',
  },
  currentThesisCard: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    backgroundColor: '#EFF6FF',
  },
  currentThesisLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#1E58A8',
    marginBottom: 4,
  },
  thesisRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  thesisTitleText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#000000',
    marginRight: 10,
  },
  optionsCardGroup: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  optionRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  optionIcon: {
    marginRight: 12,
  },
  optionLabelText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#000000',
  },
  formLabelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 6,
    marginTop: 12,
  },
  formTextInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },
  formTextAreaInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    paddingRight: 12,
  },
  passwordTextInput: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 14,
    color: '#0F172A',
  },
  eyeIconTouch: {
    padding: 4,
  },
  saveChangesPrimaryBtn: {
    backgroundColor: '#1E58A8',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  saveChangesBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  aboutBrandingWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  aboutLogoIconBox: {
    width: 104,
    height: 104,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  aboutAppNameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
  },
  aboutVersionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 12,
  },
  aboutSloganText: {
    fontSize: 14,
    color: '#1E293B',
    textAlign: 'center',
    paddingHorizontal: 24,
    lineHeight: 20,
    fontWeight: '500',
  },
  aboutOptionsCardGroup: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  aboutOptionRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  aboutOptionIcon: {
    marginRight: 14,
  },
  aboutOptionLabelText: {
    flex: 1,
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
  },
  logoutModalBlueCard: {
    width: '85%',
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingVertical: 22,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  logoutModalTitleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  logoutModalSubText: {
    fontSize: 14,
    color: '#E0F2FE',
    marginBottom: 24,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  logoutModalActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16,
  },
  logoutCancelTouchBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  logoutCancelBtnText: {
    color: '#E0F2FE',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  logoutRedBoxBtn: {
    backgroundColor: '#FF4D4D',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 18,
    elevation: 3,
  },
  logoutRedBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  cloudStorageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  cloudStorageIconBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cloudStorageInfoBox: {
    flex: 1,
  },
  cloudStorageTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 2,
  },
  cloudStorageRowText: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  cloudStorageUsedText: {
    fontSize: 12,
    color: '#64748B',
  },
  cloudStoragePercentText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
  },
  cloudProgressBarTrack: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  cloudProgressBarFill: {
    height: '100%',
    backgroundColor: '#22C55E',
    borderRadius: 3,
  },
  manageStorageOutlineBtn: {
    borderWidth: 1.5,
    borderColor: '#1E58A8',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  manageStorageBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#1E58A8',
  },
  storageSizeText: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
  },
  repoTopHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 52,
    paddingBottom: 16,
  },
  repoHeaderTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 12,
  },
  repoHeaderIconsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  repoSearchRowWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 10,
  },
  repoSearchBoxInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 42,
  },
  repoSearchTextInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  repoFilterFunnelBtn: {
    padding: 6,
  },
  repoFolderRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  repoFolderIconBox: {
    marginRight: 14,
  },
  repoFolderInfoCol: {
    flex: 1,
  },
  repoFolderNameText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#000000',
    marginBottom: 2,
  },
  repoFolderSubCount: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#94A3B8',
  },
  repoMoreMenuBtn: {
    padding: 6,
  },
  repoFileRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  pdfIconWrapper: {
    width: 40,
    height: 44,
    backgroundColor: '#FEF2F2',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  pdfBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#EF4444',
    marginTop: -2,
  },
  xlsxIconWrapper: {
    width: 40,
    height: 44,
    backgroundColor: '#22C55E',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  xlsxBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  docxIconWrapper: {
    width: 40,
    height: 44,
    backgroundColor: '#3B82F6',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  docxBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  repoFileInfoCol: {
    flex: 1,
  },
  repoFileNameText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#000000',
    marginBottom: 2,
  },
  repoFileSubMeta: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#94A3B8',
  },
  masterNotifCardGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  notifMainTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  notifSectionGroupHeading: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 10,
  },
  notifPreferencesGroupCard: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  notifToggleRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  notifRowTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  notifRowSubText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  privacyCardGroup: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  privacyRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  privacyLabelText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  privacySubStatusText: {
    fontSize: 12,
    color: '#64748B',
    marginRight: 6,
  },
  optionSelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  optionSelectBtnActive: {
    borderColor: '#1E58A8',
    backgroundColor: '#EFF6FF',
  },
  optionSelectText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginLeft: 10,
  },
  blockedUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  blockedUserName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  unblockBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  unblockBtnText: {
    fontSize: 12,
    color: '#1E58A8',
    fontWeight: 'bold',
  },
  modaloverlayDarkBlur: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  deleteModalBlueCard: {
    width: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  deleteWarningIconCircle: {
    marginBottom: 12,
  },
  deleteModalTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  deleteModalDescText: {
    fontSize: 13,
    color: '#E0F2FE',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  deleteWarningBoxContainer: {
    width: '100%',
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  deleteWarningBulletText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 8,
  },
  deleteActionWarningText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 20,
    textAlign: 'center',
  },
  deleteModalActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    gap: 16,
  },
  deleteCancelTouchBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  deleteCancelBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  deleteContinueRedBtn: {
    backgroundColor: '#FF3B30',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  deleteContinueBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomTabContainer: {
    flexDirection: 'row',
    height: 64,
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
  activeTabPillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeTabPillLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E58A8',
  },
  modaloverlayDark: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalWhiteCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 8,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 10,
  },
  thesisSelectItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  thesisSelectItemActive: {
    borderColor: '#1E58A8',
    backgroundColor: '#EFF6FF',
  },
  thesisSelectTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
  },
  thesisSelectSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  actionSheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
  },
  actionSheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  actionSheetTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
    textAlign: 'center',
  },
  actionSheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  actionSheetOptionText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    marginLeft: 14,
  },
  cancelSheetBtn: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
  },
  cancelSheetText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
  },
});