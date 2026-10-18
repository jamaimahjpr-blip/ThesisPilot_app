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
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThesisProject } from '../types';

interface ProfileScreenProps {
  setStudentDashView?: (view: any) => void;
  setIsMenuOpen?: (open: boolean) => void;
  onBackPress?: () => void;
  selectedThesis?: ThesisProject;
  setSelectedThesis?: (thesis: ThesisProject) => void;
  thesisProjectsList?: ThesisProject[];
  onLogout?: () => void;
  userData?: {
    fullName: string;
    email: string;
    role?: 'Student' | 'Educator';
  };
}

const STORAGE_KEY = '@student_profile_data_v1';

export default function ProfileScreen({
  setStudentDashView,
  setIsMenuOpen,
  selectedThesis,
  setSelectedThesis,
  thesisProjectsList = [
    {
      id: 'tp1',
      title: 'The Impact of AI on Student Learning Outcomes',
      description: '',
      adviser: 'Dr. Elizzette Joy Mationg',
      status: 'In Progress',
      startDate: '',
      targetDefense: '',
    },
    {
      id: 'tp2',
      title: 'Automated Campus Attendance Tracking System',
      description: '',
      adviser: 'Prof. Mark Vance',
      status: 'In Progress',
      startDate: '',
      targetDefense: '',
    },
  ],
  onBackPress,
  onLogout,
  userData,
}: ProfileScreenProps) {
  // Theme Mode State fixed for DEFAULT MODE
  const [themeMode, setThemeMode] = useState<'system' | 'light' | 'dark'>('light');

  // Student Profile Info States
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);

  // Student Account Info Editable States
  const [studentName, setStudentName] = useState(userData?.fullName || '');
  const [studentEmail, setStudentEmail] = useState(userData?.email || '');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentUsername, setStudentUsername] = useState('');
  const [studentBio, setStudentBio] = useState('');

  // Student Academic Info Editable States
  const [studentProgram, setStudentProgram] = useState('');
  const [studentYear, setStudentYear] = useState('');
  const [studentId, setStudentId] = useState('');
  const [studentSection, setStudentSection] = useState('');
  const [studentSchool, setStudentSchool] = useState('');
  const [studentGraduation, setStudentGraduation] = useState('');
  const [studentAdviser, setStudentAdviser] = useState('');

  // Notification Preferences States
  const [masterNotificationsEnabled, setMasterNotificationsEnabled] = useState(true);
  const [notifTaskReminders, setNotifTaskReminders] = useState(true);
  const [notifAdviserFeedback, setNotifAdviserFeedback] = useState(true);
  const [notifConsultationUpdates, setNotifConsultationUpdates] = useState(true);
  const [notifChatMessages, setNotifChatMessages] = useState(true);
  const [notifSystemUpdates, setNotifSystemUpdates] = useState(false);
  const [notifEmailDigest, setNotifEmailDigest] = useState(true);

  // Privacy & Security States
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [activeSessionsStatus, setActiveSessionsStatus] = useState(true);
  const [whoCanSeeProfile, setWhoCanSeeProfile] = useState<'Everyone' | 'Only me'>('Only me');
  const [blockedUsersList, setBlockedUsersList] = useState<string[]>(['John Doe', 'Jane Smith']);

  // Modals States
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showActiveSessionsModal, setShowActiveSessionsModal] = useState(false);
  const [showWhoCanSeeModal, setShowWhoCanSeeModal] = useState(false);
  const [showBlockedUsersModal, setShowBlockedUsersModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showManageStorageModal, setShowManageStorageModal] = useState(false);
  const [otherDataSize, setOtherDataSize] = useState('200 MB');

  // About ThesisPilot Modals State
  const [showWhatsNewModal, setShowWhatsNewModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showLicensesModal, setShowLicensesModal] = useState(false);

  // Password fields state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password Visibility Toggles
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sub-Screen View Controls
  const [activeSubView, setActiveSubView] = useState<
    | 'main'
    | 'account'
    | 'academic'
    | 'notification'
    | 'privacy'
    | 'changePassword'
    | 'data'
    | 'help'
    | 'about'
    | 'theme'
  >('main');

  // Thesis Picker Modal State
  const [showThesisSelectModal, setShowThesisSelectModal] = useState(false);

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
        if (data.studentName) setStudentName(data.studentName);
        if (data.studentEmail) setStudentEmail(data.studentEmail);
        if (data.studentPhone) setStudentPhone(data.studentPhone);
        if (data.studentUsername) setStudentUsername(data.studentUsername);
        if (data.studentBio) setStudentBio(data.studentBio);
        if (data.studentProgram) setStudentProgram(data.studentProgram);
        if (data.studentYear) setStudentYear(data.studentYear);
        if (data.studentId) setStudentId(data.studentId);
        if (data.studentSection) setStudentSection(data.studentSection);
        if (data.studentSchool) setStudentSchool(data.studentSchool);
        if (data.studentGraduation) setStudentGraduation(data.studentGraduation);
        if (data.studentAdviser) setStudentAdviser(data.studentAdviser);
        if (data.masterNotificationsEnabled !== undefined)
          setMasterNotificationsEnabled(data.masterNotificationsEnabled);
        if (data.notifTaskReminders !== undefined) setNotifTaskReminders(data.notifTaskReminders);
        if (data.notifAdviserFeedback !== undefined) setNotifAdviserFeedback(data.notifAdviserFeedback);
        if (data.notifConsultationUpdates !== undefined) setNotifConsultationUpdates(data.notifConsultationUpdates);
        if (data.notifChatMessages !== undefined) setNotifChatMessages(data.notifChatMessages);
        if (data.notifSystemUpdates !== undefined) setNotifSystemUpdates(data.notifSystemUpdates);
        if (data.notifEmailDigest !== undefined) setNotifEmailDigest(data.notifEmailDigest);
        if (data.twoFactorAuth !== undefined) setTwoFactorAuth(data.twoFactorAuth);
        if (data.activeSessionsStatus !== undefined) setActiveSessionsStatus(data.activeSessionsStatus);
        if (data.whoCanSeeProfile) setWhoCanSeeProfile(data.whoCanSeeProfile);
      }
    } catch (e) {
      console.log('Failed to load profile data from storage:', e);
    }
  };

  const saveProfileDataToStorage = async (overrideObj = {}) => {
    try {
      const currentProfileData = {
        profileImageUri,
        studentName,
        studentEmail,
        studentPhone,
        studentUsername,
        studentBio,
        studentProgram,
        studentYear,
        studentId,
        studentSection,
        studentSchool,
        studentGraduation,
        studentAdviser,
        masterNotificationsEnabled,
        notifTaskReminders,
        notifAdviserFeedback,
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
      console.log('Failed to save profile data to storage:', e);
    }
  };

  // Master Toggle handler for "Enable Notifications"
  const handleToggleMasterNotifications = (val: boolean) => {
    setMasterNotificationsEnabled(val);
    if (!val) {
      setNotifTaskReminders(false);
      setNotifAdviserFeedback(false);
      setNotifConsultationUpdates(false);
      setNotifChatMessages(false);
      setNotifSystemUpdates(false);
      setNotifEmailDigest(false);
    } else {
      setNotifTaskReminders(true);
      setNotifAdviserFeedback(true);
      setNotifConsultationUpdates(true);
      setNotifChatMessages(true);
      setNotifSystemUpdates(true);
      setNotifEmailDigest(true);
    }
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
      Alert.alert(
        'Permission Required',
        'You need to grant access to your photo gallery to choose a profile picture.'
      );
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

  // Menu navigation helper
  const handleOptionPress = (viewTarget: string) => {
    if (viewTarget === 'account') {
      setActiveSubView('account');
    } else if (viewTarget === 'academic') {
      setActiveSubView('academic');
    } else if (viewTarget === 'notification') {
      setActiveSubView('notification');
    } else if (viewTarget === 'privacy') {
      setActiveSubView('privacy');
    } else if (viewTarget === 'changePassword') {
      setActiveSubView('changePassword');
    } else if (viewTarget === 'data') {
      setActiveSubView('data');
    } else if (viewTarget === 'theme') {
      setActiveSubView('theme');
    } else if (viewTarget === 'help') {
      if (setStudentDashView) {
        setStudentDashView('help');
      } else {
        setActiveSubView('help');
      }
    } else if (viewTarget === 'about') {
      setActiveSubView('about');
    }
  };

  // Save Account & Personal Info
  const handleSaveAccountInfo = async () => {
    await saveProfileDataToStorage();
    Alert.alert('Success', 'Personal and Account information updated successfully.');
    setActiveSubView('main');
  };

  // Save Academic Info
  const handleSaveAcademicInfo = async () => {
    await saveProfileDataToStorage();
    Alert.alert('Success', 'Academic information updated successfully.');
    setActiveSubView('main');
  };

  // Save Notification Preferences
  const handleSaveNotificationPreferences = async () => {
    await saveProfileDataToStorage();
    Alert.alert('Preferences Saved', 'Notification preferences updated successfully.');
    setActiveSubView('main');
  };

  // Change Password Submission
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

  // Unblock User Handler
  const handleUnblockUser = (userName: string) => {
    setBlockedUsersList((prev) => prev.filter((u) => u !== userName));
    Alert.alert('Unblocked', `${userName} has been unblocked.`);
  };

  // Delete Account Confirmation Action
  const handleConfirmDeleteAccount = async () => {
    setShowDeleteAccountModal(false);
    await AsyncStorage.removeItem(STORAGE_KEY);
    Alert.alert('Account Deleted', 'Your account has been deleted. Redirecting to registration...');
    if (setStudentDashView) {
      setStudentDashView('register');
    }
  };

  // Storage Management Actions
  const handleClearCache = () => {
    setShowManageStorageModal(false);
    setOtherDataSize('10 MB');
    Alert.alert('Cache Cleared', '200 MB of temporary cache files have been cleared successfully.');
  };

  const handleOpenFileRepository = () => {
    setShowManageStorageModal(false);
    if (setStudentDashView) {
      setStudentDashView('files');
    } else {
      Alert.alert('File Repository', 'Opening File Repository workspace...');
    }
  };

  return (
    <View style={styles.container}>
      {/* 1. SUB-SCREEN: ACCOUNT & PERSONAL INFORMATION */}
      {activeSubView === 'account' ? (
        <View style={styles.container}>
          <View style={styles.topHeaderBarSub}>
            <TouchableOpacity style={styles.headerIconTouch} onPress={() => setActiveSubView('main')}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitleSub}>Personal & Account Info</Text>
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
              <TextInput
                style={styles.formTextInput}
                value={studentName}
                onChangeText={setStudentName}
                placeholder="Full Name"
                placeholderTextColor="#64748B"
              />

              <Text style={styles.formLabelText}>Email</Text>
              <TextInput
                style={styles.formTextInput}
                value={studentEmail}
                onChangeText={setStudentEmail}
                keyboardType="email-address"
                placeholder="Email Address"
                placeholderTextColor="#64748B"
              />

              <Text style={styles.formLabelText}>Phone Number</Text>
              <TextInput
                style={styles.formTextInput}
                value={studentPhone}
                onChangeText={setStudentPhone}
                keyboardType="phone-pad"
                placeholder="Phone Number"
                placeholderTextColor="#64748B"
              />

              <Text style={styles.formLabelText}>Username</Text>
              <TextInput
                style={styles.formTextInput}
                value={studentUsername}
                onChangeText={setStudentUsername}
                placeholder="Username"
                placeholderTextColor="#64748B"
              />

              <Text style={styles.formLabelText}>Bio (Optional)</Text>
              <TextInput
                style={[styles.formTextInput, styles.formTextAreaInput]}
                value={studentBio}
                onChangeText={setStudentBio}
                multiline
                numberOfLines={3}
                placeholder="Bio"
                placeholderTextColor="#64748B"
              />

              <TouchableOpacity
                style={styles.saveChangesPrimaryBtn}
                activeOpacity={0.85}
                onPress={handleSaveAccountInfo}
              >
                <Text style={styles.saveChangesBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      ) : activeSubView === 'academic' ? (
        /* 2. SUB-SCREEN: ACADEMIC INFORMATION */
        <View style={styles.container}>
          <View style={styles.topHeaderBarSub}>
            <TouchableOpacity style={styles.headerIconTouch} onPress={() => setActiveSubView('main')}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitleSub}>Academic Information</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.whiteCardContainerSub}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
            >
              <Text style={styles.formLabelText}>Program</Text>
              <TextInput
                style={styles.formTextInput}
                value={studentProgram}
                onChangeText={setStudentProgram}
                placeholder="e.g., BS Computer Science"
                placeholderTextColor="#64748B"
              />

              <Text style={styles.formLabelText}>Year Level</Text>
              <TextInput
                style={styles.formTextInput}
                value={studentYear}
                onChangeText={setStudentYear}
                placeholder="e.g., 2nd Year"
                placeholderTextColor="#64748B"
              />

              <Text style={styles.formLabelText}>Student ID</Text>
              <TextInput
                style={styles.formTextInput}
                value={studentId}
                onChangeText={setStudentId}
                placeholder="Student ID Number"
                placeholderTextColor="#64748B"
              />

              <Text style={styles.formLabelText}>Section</Text>
              <TextInput
                style={styles.formTextInput}
                value={studentSection}
                onChangeText={setStudentSection}
                placeholder="Section Code"
                placeholderTextColor="#64748B"
              />

              <Text style={styles.formLabelText}>School / University</Text>
              <TextInput
                style={styles.formTextInput}
                value={studentSchool}
                onChangeText={setStudentSchool}
                placeholder="Name of School / University"
                placeholderTextColor="#64748B"
              />

              <Text style={styles.formLabelText}>Expected Graduation</Text>
              <TextInput
                style={styles.formTextInput}
                value={studentGraduation}
                onChangeText={setStudentGraduation}
                placeholder="Month Year (e.g., June 2030)"
                placeholderTextColor="#64748B"
              />

              <Text style={styles.formLabelText}>Adviser</Text>
              <TextInput
                style={styles.formTextInput}
                value={studentAdviser}
                onChangeText={setStudentAdviser}
                placeholder="Adviser Name"
                placeholderTextColor="#64748B"
              />

              <TouchableOpacity
                style={styles.saveChangesPrimaryBtn}
                activeOpacity={0.85}
                onPress={handleSaveAcademicInfo}
              >
                <Text style={styles.saveChangesBtnText}>Save Information</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      ) : activeSubView === 'theme' ? (
        /* 3. SUB-SCREEN: APP THEME SETTINGS */
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
                    style={[
                      styles.privacyRowItem,
                      themeMode === mode && styles.optionSelectBtnActive,
                    ]}
                    onPress={() => setThemeMode(mode)}
                  >
                    <Ionicons
                      name={
                        mode === 'system'
                          ? 'settings-outline'
                          : mode === 'light'
                          ? 'sunny-outline'
                          : 'moon-outline'
                      }
                      size={20}
                      color="#0F172A"
                      style={styles.optionIcon}
                    />
                    <Text style={styles.privacyLabelText}>
                      {mode === 'system'
                        ? 'System Default'
                        : mode === 'light'
                        ? 'Light Mode'
                        : 'Dark Mode'}
                    </Text>
                    {themeMode === mode && (
                      <Ionicons name="checkmark-circle" size={20} color="#1E58A8" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      ) : activeSubView === 'notification' ? (
        /* 4. SUB-SCREEN: NOTIFICATION PREFERENCES */
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
                    <Text style={styles.notifRowTitleText}>Adviser Feedback</Text>
                    <Text style={styles.notifRowSubText}>New feedback & responses</Text>
                  </View>
                  <Switch
                    value={notifAdviserFeedback}
                    onValueChange={setNotifAdviserFeedback}
                    trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                    thumbColor={notifAdviserFeedback ? '#1E58A8' : '#94A3B8'}
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
        /* 5. SUB-SCREEN: PRIVACY & SECURITY */
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
                  <Ionicons name="key-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Change Password</Text>
                  <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.privacyRowItem}
                  activeOpacity={0.7}
                  onPress={() => setShow2FAModal(true)}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#0F172A"
                    style={styles.optionIcon}
                  />
                  <Text style={styles.privacyLabelText}>Two-Factor Authentication</Text>
                  <Text style={styles.privacySubStatusText}>
                    {twoFactorAuth ? 'On' : 'Off'}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.privacyRowItem, { borderBottomWidth: 0 }]}
                  activeOpacity={0.7}
                  onPress={() => setShowActiveSessionsModal(true)}
                >
                  <Ionicons name="time-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Active Sessions</Text>
                  <Text style={styles.privacySubStatusText}>
                    {activeSessionsStatus ? '3 active' : 'Off'}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                </TouchableOpacity>
              </View>

              <Text style={[styles.notifSectionGroupHeading, { marginTop: 20 }]}>Privacy</Text>
              <View style={styles.privacyCardGroup}>
                <TouchableOpacity
                  style={styles.privacyRowItem}
                  activeOpacity={0.7}
                  onPress={() => setShowWhoCanSeeModal(true)}
                >
                  <Ionicons
                    name="help-circle-outline"
                    size={20}
                    color="#0F172A"
                    style={styles.optionIcon}
                  />
                  <Text style={styles.privacyLabelText}>Who can see my profile</Text>
                  <Text style={styles.privacySubStatusText}>{whoCanSeeProfile}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.privacyRowItem}
                  activeOpacity={0.7}
                  onPress={() => handleOptionPress('data')}
                >
                  <Ionicons
                    name="stats-chart-outline"
                    size={20}
                    color="#0F172A"
                    style={styles.optionIcon}
                  />
                  <Text style={styles.privacyLabelText}>Data & Activity</Text>
                  <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.privacyRowItem, { borderBottomWidth: 0 }]}
                  activeOpacity={0.7}
                  onPress={() => setShowBlockedUsersModal(true)}
                >
                  <Ionicons
                    name="person-remove-outline"
                    size={20}
                    color="#0F172A"
                    style={styles.optionIcon}
                  />
                  <Text style={styles.privacyLabelText}>Blocked Users</Text>
                  <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                </TouchableOpacity>
              </View>

              <View style={[styles.privacyCardGroup, { marginTop: 24 }]}>
                <TouchableOpacity
                  style={[styles.privacyRowItem, { borderBottomWidth: 0 }]}
                  activeOpacity={0.7}
                  onPress={() => setShowDeleteAccountModal(true)}
                >
                  <Ionicons name="trash-outline" size={20} color="#DC2626" style={styles.optionIcon} />
                  <Text style={[styles.privacyLabelText, { color: '#DC2626' }]}>
                    Delete Account
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color="#DC2626" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      ) : activeSubView === 'data' ? (
        /* 6. SUB-SCREEN: STORAGE & DATA */
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
                    <Text style={styles.cloudStorageUsedText}>2.45 GB of 10 GB used</Text>
                    <Text style={styles.cloudStoragePercentText}>24%</Text>
                  </View>
                  <View style={styles.cloudProgressBarTrack}>
                    <View style={[styles.cloudProgressBarFill, { width: '24%' }]} />
                  </View>
                </View>
              </View>

              <Text style={styles.notifSectionGroupHeading}>Storage Breakdown</Text>
              <View style={styles.storageBreakdownCardGroup}>
                <View style={styles.storageBreakdownRowItem}>
                  <Ionicons
                    name="document-text-outline"
                    size={22}
                    color="#0F172A"
                    style={styles.storageItemIcon}
                  />
                  <Text style={styles.storageItemLabelText}>Files</Text>
                  <Text style={styles.storageItemSizeText}>1.25 GB</Text>
                </View>
                <View style={styles.storageBreakdownRowItem}>
                  <Ionicons
                    name="newspaper-outline"
                    size={22}
                    color="#0F172A"
                    style={styles.storageItemIcon}
                  />
                  <Text style={styles.storageItemLabelText}>Notes</Text>
                  <Text style={styles.storageItemSizeText}>680 MB</Text>
                </View>
                <View style={styles.storageBreakdownRowItem}>
                  <Ionicons
                    name="attach-outline"
                    size={22}
                    color="#0F172A"
                    style={styles.storageItemIcon}
                  />
                  <Text style={styles.storageItemLabelText}>Chat Attachments</Text>
                  <Text style={styles.storageItemSizeText}>320 MB</Text>
                </View>
                <View style={[styles.storageBreakdownRowItem, { borderBottomWidth: 0 }]}>
                  <Ionicons
                    name="pie-chart-outline"
                    size={22}
                    color="#0F172A"
                    style={styles.storageItemIcon}
                  />
                  <Text style={styles.storageItemLabelText}>Other Data</Text>
                  <Text style={styles.storageItemSizeText}>{otherDataSize}</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.manageStorageOutlineBtn}
                activeOpacity={0.8}
                onPress={() => setShowManageStorageModal(true)}
              >
                <Text style={styles.manageStorageBtnText}>Manage Storage</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      ) : activeSubView === 'about' ? (
        /* 7. SUB-SCREEN: ABOUT THESISPILOT */
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
              contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 }}
            >
              <View style={styles.aboutBrandingWrapper}>
                <View style={styles.aboutLogoIconBox}>
                  <Ionicons name="school-outline" size={54} color="#1E58A8" />
                </View>
                <Text style={styles.aboutAppNameText}>Thesis Pilot</Text>
                <Text style={styles.aboutVersionText}>Version 1.0.0</Text>
                <Text style={styles.aboutSloganText}>
                  Your AI-powered partner in every step of your thesis journey.
                </Text>
              </View>

              <View style={styles.aboutOptionsCardGroup}>
                <TouchableOpacity
                  style={styles.aboutOptionRowItem}
                  activeOpacity={0.7}
                  onPress={() => setShowWhatsNewModal(true)}
                >
                  <Ionicons
                    name="open-outline"
                    size={20}
                    color="#0F172A"
                    style={styles.aboutOptionIcon}
                  />
                  <Text style={styles.aboutOptionLabelText}>What's New</Text>
                  <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.aboutOptionRowItem}
                  activeOpacity={0.7}
                  onPress={() => setShowTermsModal(true)}
                >
                  <Ionicons
                    name="open-outline"
                    size={20}
                    color="#0F172A"
                    style={styles.aboutOptionIcon}
                  />
                  <Text style={styles.aboutOptionLabelText}>Terms of Service</Text>
                  <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.aboutOptionRowItem}
                  activeOpacity={0.7}
                  onPress={() => setShowPrivacyModal(true)}
                >
                  <Ionicons
                    name="open-outline"
                    size={20}
                    color="#0F172A"
                    style={styles.aboutOptionIcon}
                  />
                  <Text style={styles.aboutOptionLabelText}>Privacy Policy</Text>
                  <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.aboutOptionRowItem, { borderBottomWidth: 0 }]}
                  activeOpacity={0.7}
                  onPress={() => setShowLicensesModal(true)}
                >
                  <Ionicons
                    name="open-outline"
                    size={20}
                    color="#0F172A"
                    style={styles.aboutOptionIcon}
                  />
                  <Text style={styles.aboutOptionLabelText}>Open Source Licenses</Text>
                  <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      ) : activeSubView === 'changePassword' ? (
        /* 8. SUB-SCREEN: CHANGE PASSWORD */
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
                  placeholderTextColor="#64748B"
                />
                <TouchableOpacity
                  style={styles.eyeIconTouch}
                  onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                >
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
                  placeholderTextColor="#64748B"
                />
                <TouchableOpacity
                  style={styles.eyeIconTouch}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  <Ionicons
                    name={showNewPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#475569"
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.passwordHintsContainer}>
                <Text style={styles.passwordHintText}>• At least 8 characters</Text>
                <Text style={styles.passwordHintText}>• Include number and symbol</Text>
              </View>

              <Text style={styles.formLabelText}>Confirm New Password</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={styles.passwordTextInput}
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm new password"
                  placeholderTextColor="#64748B"
                />
                <TouchableOpacity
                  style={styles.eyeIconTouch}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#475569"
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.saveChangesPrimaryBtn}
                activeOpacity={0.85}
                onPress={handleChangePasswordSubmit}
              >
                <Text style={styles.saveChangesBtnText}>Update Password</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      ) : (
        /* 9. MAIN PROFILE SCREEN */
        <View style={styles.container}>
          <View style={styles.topHeaderBar}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity
              style={styles.headerIconTouch}
              onPress={() => setStudentDashView && setStudentDashView('settings')}
            >
              <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.whiteCardContainer}>
            <View style={styles.avatarWrapper}>
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

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 40 }}
            >
              <View style={styles.studentInfoCenter}>
                <Text style={styles.studentNameText}>{studentName || 'User Name'}</Text>
                <View style={styles.degreeRow}>
                  <Text style={styles.degreeText}>{studentProgram || 'Academic Program'}</Text>
                  <View style={styles.yearTagBadge}>
                    <Text style={styles.yearTagText}>{studentYear || 'N/A'}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.currentThesisCard}
                activeOpacity={0.8}
                onPress={() => setShowThesisSelectModal(true)}
              >
                <Text style={styles.currentThesisLabel}>Current Thesis</Text>
                <View style={styles.thesisRow}>
                  <Text style={styles.thesisTitleText}>
                    {selectedThesis?.title || 'The Impact of AI on Student Learning Outcomes'}
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#0F172A" />
                </View>
              </TouchableOpacity>

              <View style={styles.optionsCardGroup}>
                <TouchableOpacity
                  style={styles.optionRowItem}
                  activeOpacity={0.7}
                  onPress={() => handleOptionPress('account')}
                >
                  <Ionicons name="person-outline" size={22} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.optionLabelText}>Personal & Account Info</Text>
                  <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionRowItem}
                  activeOpacity={0.7}
                  onPress={() => handleOptionPress('academic')}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={22}
                    color="#0F172A"
                    style={styles.optionIcon}
                  />
                  <Text style={styles.optionLabelText}>Academic Information</Text>
                  <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionRowItem}
                  activeOpacity={0.7}
                  onPress={() => handleOptionPress('theme')}
                >
                  <Ionicons
                    name="color-palette-outline"
                    size={22}
                    color="#0F172A"
                    style={styles.optionIcon}
                  />
                  <Text style={styles.optionLabelText}>App Theme</Text>
                  <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionRowItem}
                  activeOpacity={0.7}
                  onPress={() => handleOptionPress('notification')}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={22}
                    color="#0F172A"
                    style={styles.optionIcon}
                  />
                  <Text style={styles.optionLabelText}>Notification</Text>
                  <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionRowItem}
                  activeOpacity={0.7}
                  onPress={() => handleOptionPress('privacy')}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={22}
                    color="#0F172A"
                    style={styles.optionIcon}
                  />
                  <Text style={styles.optionLabelText}>Privacy & Security</Text>
                  <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionRowItem}
                  activeOpacity={0.7}
                  onPress={() => handleOptionPress('data')}
                >
                  <Ionicons name="server-outline" size={22} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.optionLabelText}>Data & Storage</Text>
                  <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.optionRowItem}
                  activeOpacity={0.7}
                  onPress={() => handleOptionPress('help')}
                >
                  <Ionicons
                    name="help-circle-outline"
                    size={22}
                    color="#0F172A"
                    style={styles.optionIcon}
                  />
                  <Text style={styles.optionLabelText}>Help & Support</Text>
                  <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.optionRowItem, { borderBottomWidth: 0 }]}
                  activeOpacity={0.7}
                  onPress={() => handleOptionPress('about')}
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={22}
                    color="#0F172A"
                    style={styles.optionIcon}
                  />
                  <Text style={styles.optionLabelText}>About Thesis Pilot</Text>
                  <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      {/* WHAT'S NEW MODAL */}
      <Modal visible={showWhatsNewModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>What's New in v1.0.0</Text>
            <ScrollView style={{ maxHeight: 250, marginVertical: 10 }}>
              <Text style={styles.modalBodyContentText}>
                • AI Thesis Companion & Draft Analysis Integration.{'\n'}
                • Enhanced Real-time Consultation Scheduler.{'\n'}
                • Interactive Task Progress & Chapter Tracker.{'\n'}
                • Improved File Storage Management & Cloud Sync.{'\n'}
                • UI/UX Optimization and System Stability Fixes.
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelOutlineBtn}
              onPress={() => setShowWhatsNewModal(false)}
            >
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* TERMS OF SERVICE MODAL */}
      <Modal visible={showTermsModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Terms of Service</Text>
            <ScrollView style={{ maxHeight: 250, marginVertical: 10 }}>
              <Text style={styles.modalBodyContentText}>
                ThesisPilot is designed to assist students and academic advisers in managing, tracking, and collaborating on thesis projects.{'\n\n'}
                By accessing or using ThesisPilot, you agree to adhere to school regulations, respect intellectual property rights, and avoid submitting plagiarized material through the system.
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelOutlineBtn}
              onPress={() => setShowTermsModal(false)}
            >
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* PRIVACY POLICY MODAL */}
      <Modal visible={showPrivacyModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Privacy Policy</Text>
            <ScrollView style={{ maxHeight: 250, marginVertical: 10 }}>
              <Text style={styles.modalBodyContentText}>
                Your privacy and data security are our top priorities.{'\n\n'}
                We collect user information solely for academic collaboration.{'\n'}
                • File attachments and research drafts are encrypted and stored securely.{'\n'}
                • Your academic details will never be shared with unapproved third parties.
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelOutlineBtn}
              onPress={() => setShowPrivacyModal(false)}
            >
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* OPEN SOURCE LICENSES MODAL */}
      <Modal visible={showLicensesModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Open Source Licenses</Text>
            <ScrollView style={{ maxHeight: 250, marginVertical: 10 }}>
              <Text style={styles.modalBodyContentText}>
                ThesisPilot is licensed and verified. Built with open-source software libraries:{'\n\n'}
                • React Native - MIT License{'\n'}
                • Expo & Expo SDK - MIT License{'\n'}
                • Ionicons Vector Icons - MIT License{'\n'}
                • TypeScript - Apache 2.0 License
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.cancelOutlineBtn}
              onPress={() => setShowLicensesModal(false)}
            >
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MANAGE STORAGE ACTION SHEET MODAL */}
      <Modal visible={showManageStorageModal} transparent animationType="slide" statusBarTranslucent>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowManageStorageModal(false)}
        >
          <View style={styles.actionSheetCard}>
            <View style={styles.actionSheetHandle} />
            <Text style={styles.actionSheetTitle}>Manage Storage Options</Text>
            <TouchableOpacity style={styles.actionSheetOption} onPress={handleClearCache}>
              <Ionicons name="trash-bin-outline" size={22} color="#DC2626" />
              <Text style={[styles.actionSheetOptionText, { color: '#DC2626' }]}>
                Clear Cache (200MB)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionSheetOption} onPress={handleOpenFileRepository}>
              <Ionicons name="folder-open-outline" size={22} color="#1E58A8" />
              <Text style={styles.actionSheetOptionText}>Open File Repository</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelSheetBtn}
              onPress={() => setShowManageStorageModal(false)}
            >
              <Text style={styles.cancelSheetText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      <Modal visible={showDeleteAccountModal} transparent animationType="fade">
        <View style={styles.modaloverlayDarkBlur}>
          <View style={styles.deleteModalBlueCard}>
            <View style={styles.deleteWarningIconCircle}>
              <Ionicons name="warning-sharp" size={30} color="#EF4444" />
            </View>
            <Text style={styles.deleteModalTitleText}>Delete Account</Text>
            <Text style={styles.deleteModalDescText}>
              This will permanently delete your account and all associated data:
            </Text>
            <View style={styles.deleteWarningBoxContainer}>
              <Text style={styles.deleteWarningBulletText}>• Overall Progress</Text>
              <Text style={styles.deleteWarningBulletText}>• File Repository</Text>
              <Text style={styles.deleteWarningBulletText}>• Account Information</Text>
              <Text style={styles.deleteWarningBulletText}>• Data & Storage</Text>
            </View>
            <Text style={styles.deleteActionWarningText}>This action cannot be undone.</Text>
            <View style={styles.deleteModalActionsRow}>
              <TouchableOpacity
                style={styles.deleteCancelTouchBtn}
                onPress={() => setShowDeleteAccountModal(false)}
              >
                <Text style={styles.deleteCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteContinueRedBtn}
                activeOpacity={0.85}
                onPress={handleConfirmDeleteAccount}
              >
                <Text style={styles.deleteContinueBtnText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* TWO-FACTOR AUTHENTICATION MODAL */}
      <Modal visible={show2FAModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Two-Factor Authentication</Text>
            <Text style={{ fontSize: 13, color: '#64748B', marginVertical: 10 }}>
              When ON, a One-Time PIN (OTP) will be sent to your school email ({studentEmail || 'user@gmail.com'}) before logging in.
            </Text>
            <TouchableOpacity
              style={[styles.optionSelectBtn, twoFactorAuth && styles.optionSelectBtnActive]}
              onPress={async () => {
                setTwoFactorAuth(true);
                setShow2FAModal(false);
                await saveProfileDataToStorage({ twoFactorAuth: true });
                Alert.alert('2FA Enabled', 'A One-Time PIN will now be sent to your school email upon Login.');
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
              onPress={async () => {
                setTwoFactorAuth(false);
                setShow2FAModal(false);
                await saveProfileDataToStorage({ twoFactorAuth: false });
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

      {/* ACTIVE SESSIONS MODAL */}
      <Modal visible={showActiveSessionsModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Active Sessions Status</Text>
            <Text style={{ fontSize: 13, color: '#64748B', marginVertical: 10 }}>
              Set to ON if you want groupmates and educators to see when you are online or last active. Set to OFF to hide your active status.
            </Text>
            <TouchableOpacity
              style={[styles.optionSelectBtn, activeSessionsStatus && styles.optionSelectBtnActive]}
              onPress={async () => {
                setActiveSessionsStatus(true);
                setShowActiveSessionsModal(false);
                await saveProfileDataToStorage({ activeSessionsStatus: true });
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
              onPress={async () => {
                setActiveSessionsStatus(false);
                setShowActiveSessionsModal(false);
                await saveProfileDataToStorage({ activeSessionsStatus: false });
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

            <TouchableOpacity
              style={styles.cancelOutlineBtn}
              onPress={() => setShowActiveSessionsModal(false)}
            >
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* WHO CAN SEE MY PROFILE MODAL */}
      <Modal visible={showWhoCanSeeModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Who Can See My Profile</Text>
            <TouchableOpacity
              style={[
                styles.optionSelectBtn,
                whoCanSeeProfile === 'Everyone' && styles.optionSelectBtnActive,
              ]}
              onPress={async () => {
                setWhoCanSeeProfile('Everyone');
                setShowWhoCanSeeModal(false);
                await saveProfileDataToStorage({ whoCanSeeProfile: 'Everyone' });
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
              style={[
                styles.optionSelectBtn,
                whoCanSeeProfile === 'Only me' && styles.optionSelectBtnActive,
              ]}
              onPress={async () => {
                setWhoCanSeeProfile('Only me');
                setShowWhoCanSeeModal(false);
                await saveProfileDataToStorage({ whoCanSeeProfile: 'Only me' });
              }}
            >
              <Ionicons
                name={whoCanSeeProfile === 'Only me' ? 'checkmark-circle' : 'ellipse-outline'}
                size={20}
                color={whoCanSeeProfile === 'Only me' ? '#1E58A8' : '#64748B'}
              />
              <Text style={styles.optionSelectText}>Only me</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelOutlineBtn}
              onPress={() => setShowWhoCanSeeModal(false)}
            >
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* BLOCKED USERS MODAL */}
      <Modal visible={showBlockedUsersModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Blocked Users</Text>
            {blockedUsersList.length === 0 ? (
              <Text style={{ fontSize: 13, color: '#64748B', marginVertical: 14 }}>
                You have not blocked any users.
              </Text>
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
            <TouchableOpacity
              style={styles.cancelOutlineBtn}
              onPress={() => setShowBlockedUsersModal(false)}
            >
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* THESIS SELECTION MODAL */}
      <Modal visible={showThesisSelectModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Select Thesis Project</Text>
            <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 14 }}>
              Choose which thesis project you want to check or work on next:
            </Text>
            {thesisProjectsList.map((proj) => (
              <TouchableOpacity
                key={proj.id}
                style={[
                  styles.thesisSelectItem,
                  selectedThesis?.id === proj.id && styles.thesisSelectItemActive,
                ]}
                onPress={() => {
                  if (setSelectedThesis) {
                    setSelectedThesis(proj);
                    setShowThesisSelectModal(false);
                    Alert.alert('Project Switched', `Selected "${proj.title}"`);
                  }
                }}
              >
                <Text style={styles.thesisSelectTitle}>{proj.title}</Text>
                <Text style={styles.thesisSelectSub}>Adviser: {proj.adviser}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelOutlineBtn}
              onPress={() => setShowThesisSelectModal(false)}
            >
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CHANGE PROFILE PICTURE ACTION SHEET MODAL */}
      <Modal visible={showImagePickerModal} transparent animationType="slide" statusBarTranslucent>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowImagePickerModal(false)}
        >
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
            <TouchableOpacity
              style={styles.cancelSheetBtn}
              onPress={() => setShowImagePickerModal(false)}
            >
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
    shadowColor: '#000000',
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
  degreeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  degreeText: {
    fontSize: 13,
    color: '#64748B',
  },
  yearTagBadge: {
    backgroundColor: '#BFDBFE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  yearTagText: {
    fontSize: 11,
    color: '#1E58A8',
    fontWeight: 'bold',
  },
  currentThesisCard: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    padding: 14,
    marginBottom: 18,
    backgroundColor: '#FFFFFF',
  },
  currentThesisLabel: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#334155',
    marginBottom: 6,
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
    lineHeight: 18,
  },
  optionsCardGroup: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
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
  passwordHintsContainer: {
    marginTop: 6,
    marginBottom: 4,
    paddingLeft: 4,
  },
  passwordHintText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
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
    marginBottom: 28,
  },
  aboutLogoIconBox: {
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#BFDBFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  aboutAppNameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  aboutVersionText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 12,
  },
  aboutSloganText: {
    fontSize: 13,
    color: '#334155',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  aboutOptionsCardGroup: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  aboutOptionRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  aboutOptionIcon: {
    marginRight: 12,
  },
  aboutOptionLabelText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  modalBodyContentText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
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
  storageBreakdownCardGroup: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    marginBottom: 24,
  },
  storageBreakdownRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  storageItemIcon: {
    marginRight: 12,
  },
  storageItemLabelText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  storageItemSizeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
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
  modaloverlayDark: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
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
    shadowColor: '#000000',
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
    borderTopLeftRadius: 24,
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