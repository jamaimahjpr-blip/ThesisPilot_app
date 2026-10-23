import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
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
  const [themeMode, setThemeMode] = useState<'system'>('system');
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);

  const extractUsername = (emailStr?: string) => {
    if (!emailStr) return 'user';
    return emailStr.split('@')[0];
  };

  const [studentName, setStudentName] = useState(userData?.fullName || 'Student User');
  const [studentEmail, setStudentEmail] = useState(userData?.email || 'student@tip.edu.ph');
  const [studentPhone, setStudentPhone] = useState('+63 912 345 6769');
  const [studentUsername, setStudentUsername] = useState(extractUsername(userData?.email));
  const [studentBio, setStudentBio] = useState('Computer Science passionate about programming, research, tech enthusiast, and travelling.');

  const [studentProgram, setStudentProgram] = useState('BS Computer Science');
  const [studentYear, setStudentYear] = useState('2nd Year');
  const [studentId, setStudentId] = useState('2516327');
  const [studentSection, setStudentSection] = useState('CS21S5');
  const [studentSchool, setStudentSchool] = useState('Technological Institute of the Philippines');
  const [studentGraduation, setStudentGraduation] = useState('June 2030');
  const [studentAdviser, setStudentAdviser] = useState('Dr. Elizzette Joy Mationg');

  useEffect(() => {
    if (userData?.fullName) {
      setStudentName(userData.fullName);
    }
    if (userData?.email) {
      setStudentEmail(userData.email);
      setStudentUsername(extractUsername(userData.email));
    }
  }, [userData]);

  const [masterNotificationsEnabled, setMasterNotificationsEnabled] = useState(true);
  const [notifTaskReminders, setNotifTaskReminders] = useState(true);
  const [notifAdviserFeedback, setNotifAdviserFeedback] = useState(true);
  const [notifConsultationUpdates, setNotifConsultationUpdates] = useState(true);
  const [notifChatMessages, setNotifChatMessages] = useState(true);
  const [notifSystemUpdates, setNotifSystemUpdates] = useState(false);
  const [notifEmailDigest, setNotifEmailDigest] = useState(true);

  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [activeSessionsStatus, setActiveSessionsStatus] = useState(true);
  const [whoCanSeeProfile, setWhoCanSeeProfile] = useState<'Everyone' | 'Only me'>('Only me');
  const [blockedUsersList, setBlockedUsersList] = useState<string[]>(['John Doe', 'Jane Smith']);

  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showActiveSessionsModal, setShowActiveSessionsModal] = useState(false);
  const [showWhoCanSeeModal, setShowWhoCanSeeModal] = useState(false);
  const [showBlockedUsersModal, setShowBlockedUsersModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showManageStorageModal, setShowManageStorageModal] = useState(false);
  const [otherDataSize, setOtherDataSize] = useState('200 MB');

  const [showWhatsNewModal, setShowWhatsNewModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showLicensesModal, setShowLicensesModal] = useState(false);

  const [activeSubView, setActiveSubView] = useState<
    | 'main'
    | 'account'
    | 'academic'
    | 'notification'
    | 'privacy'
    | 'data'
    | 'activityHistory'
    | 'help'
    | 'about'
    | 'theme'
  >('main');

  const [showThesisSelectModal, setShowThesisSelectModal] = useState(false);

  const [userActivityLogs, setUserActivityLogs] = useState([
    { id: '1', action: 'Uploaded file', target: 'Chapter1_Final_Draft.pdf', time: '10 mins ago' },
    { id: '2', action: 'Replaced file', target: 'Chapter2_Literature_Review.pdf', time: '12 hours ago' },
    { id: '3', action: 'Deleted draft', target: 'Chapter3_OldNotes.docx', time: 'Yesterday' },
    { id: '4', action: 'Created new thesis note', target: 'Research Problem Ideas', time: 'May 10, 2026' },
  ]);

  useEffect(() => {
    loadSavedProfileData();
  }, []);

  const loadSavedProfileData = async () => {
    try {
      const savedDataJSON = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedDataJSON !== null) {
        const data = JSON.parse(savedDataJSON);
        if (data.profileImageUri !== undefined) setProfileImageUri(data.profileImageUri);
        if (data.studentName && !userData?.fullName) setStudentName(data.studentName);
        if (data.studentEmail && !userData?.email) setStudentEmail(data.studentEmail);
        if (data.studentPhone) setStudentPhone(data.studentPhone);
        if (data.studentUsername && !userData?.email) setStudentUsername(data.studentUsername);
        if (data.studentBio) setStudentBio(data.studentBio);
        if (data.studentProgram) setStudentProgram(data.studentProgram);
        if (data.studentYear) setStudentYear(data.studentYear);
        if (data.studentId) setStudentId(data.studentId);
        if (data.studentSection) setStudentSection(data.studentSection);
        if (data.studentSchool) setStudentSchool(data.studentSchool);
        if (data.studentGraduation) setStudentGraduation(data.studentGraduation);
        if (data.studentAdviser) setStudentAdviser(data.studentAdviser);
        if (data.masterNotificationsEnabled !== undefined) setMasterNotificationsEnabled(data.masterNotificationsEnabled);
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

  const handleToggleMasterNotifications = (val: boolean) => {
    setMasterNotificationsEnabled(val);
    setNotifTaskReminders(val);
    setNotifAdviserFeedback(val);
    setNotifConsultationUpdates(val);
    setNotifChatMessages(val);
    setNotifSystemUpdates(val);
    setNotifEmailDigest(val);
  };

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

  const handleChooseFromGallery = async () => {
    setShowImagePickerModal(false);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'You need to grant access to your photo gallery to choose a profile picture.');
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

  const handleEnable2FA = () => {
    setShow2FAModal(false);
    Alert.alert(
      'Verify Login Email',
      `A security code will be sent to (${studentEmail}). Are you the owner of this email attempting to login/enable 2FA?`,
      [
        { text: 'No / Cancel', style: 'cancel' },
        {
          text: 'Yes, Send Code',
          onPress: () => {
            setTwoFactorAuth(true);
            saveProfileDataToStorage({ twoFactorAuth: true });
            Alert.alert(
              '2FA Enabled',
              `Two-Factor Authentication is now ON. Verification prompts will be routed to ${studentEmail}.`
            );
          },
        },
      ]
    );
  };

  const handleDisable2FA = () => {
    setShow2FAModal(false);
    setTwoFactorAuth(false);
    saveProfileDataToStorage({ twoFactorAuth: false });
    Alert.alert('2FA Disabled', 'Two-Factor Authentication is now OFF.');
  };

  const handleOptionPress = (viewTarget: string) => {
    if (viewTarget === 'account') setActiveSubView('account');
    else if (viewTarget === 'academic') setActiveSubView('academic');
    else if (viewTarget === 'notification') setActiveSubView('notification');
    else if (viewTarget === 'privacy') setActiveSubView('privacy');
    else if (viewTarget === 'data') setActiveSubView('data');
    else if (viewTarget === 'theme') setActiveSubView('theme');
    else if (viewTarget === 'help') {
      if (setStudentDashView) setStudentDashView('help');
      else setActiveSubView('help');
    } else if (viewTarget === 'about') setActiveSubView('about');
  };

  const handleOpenFileRepository = () => {
    setShowManageStorageModal(false);
    if (setStudentDashView) {
      setStudentDashView('files');
    } else {
      Alert.alert('File Repository', 'Opening File Repository workspace...');
    }
  };

  const handleClearCache = () => {
    setShowManageStorageModal(false);
    setOtherDataSize('0 MB');
    Alert.alert('Cache Cleared', 'Successfully cleared 200MB of temporary cache storage.');
  };

  const handleSaveAccountInfo = async () => {
    await saveProfileDataToStorage();
    Alert.alert('Success', 'Personal and Account information updated successfully.');
    setActiveSubView('main');
  };

  const handleSaveAcademicInfo = async () => {
    await saveProfileDataToStorage();
    Alert.alert('Success', 'Academic information updated successfully.');
    setActiveSubView('main');
  };

  const handleUnblockUser = (userName: string) => {
    setBlockedUsersList((prev) => prev.filter((u) => u !== userName));
    Alert.alert('Unblocked', `${userName} has been unblocked.`);
  };

  const handleConfirmDeleteAccount = async () => {
    setShowDeleteAccountModal(false);
    await AsyncStorage.removeItem(STORAGE_KEY);
    Alert.alert('Account Deleted', 'Your account has been deleted. Redirecting to registration...');
    if (setStudentDashView) setStudentDashView('register');
  };

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
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}>
              <View style={styles.avatarCenterWrapper}>
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
              <Text style={styles.formLabelText}>Full Name</Text>
              <TextInput style={styles.formTextInput} value={studentName} onChangeText={setStudentName} placeholder="Full Name" placeholderTextColor="#64748B" />
              <Text style={styles.formLabelText}>Email</Text>
              <TextInput
                style={styles.formTextInput}
                value={studentEmail}
                onChangeText={(text) => {
                  setStudentEmail(text);
                  setStudentUsername(extractUsername(text));
                }}
                keyboardType="email-address"
                placeholder="Email Address"
                placeholderTextColor="#64748B"
              />
              <Text style={styles.formLabelText}>Phone Number</Text>
              <TextInput style={styles.formTextInput} value={studentPhone} onChangeText={setStudentPhone} keyboardType="phone-pad" placeholder="Phone Number" placeholderTextColor="#64748B" />
              <Text style={styles.formLabelText}>Username</Text>
              <TextInput style={styles.formTextInput} value={studentUsername} onChangeText={setStudentUsername} placeholder="Username" placeholderTextColor="#64748B" />
              <Text style={styles.formLabelText}>Bio (Optional)</Text>
              <TextInput style={[styles.formTextInput, styles.formTextAreaInput]} value={studentBio} onChangeText={setStudentBio} multiline numberOfLines={3} placeholder="Bio" placeholderTextColor="#64748B" />
              <TouchableOpacity style={styles.saveChangesPrimaryBtn} activeOpacity={0.85} onPress={handleSaveAccountInfo}>
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
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}>
              <Text style={styles.formLabelText}>Program</Text>
              <TextInput style={styles.formTextInput} value={studentProgram} onChangeText={setStudentProgram} placeholder="e.g., BS Computer Science" placeholderTextColor="#64748B" />
              <Text style={styles.formLabelText}>Year Level</Text>
              <TextInput style={styles.formTextInput} value={studentYear} onChangeText={setStudentYear} placeholder="e.g., 2nd Year" placeholderTextColor="#64748B" />
              <Text style={styles.formLabelText}>Student ID</Text>
              <TextInput style={styles.formTextInput} value={studentId} onChangeText={setStudentId} placeholder="Student ID Number" placeholderTextColor="#64748B" />
              <Text style={styles.formLabelText}>Section</Text>
              <TextInput style={styles.formTextInput} value={studentSection} onChangeText={setStudentSection} placeholder="Section Code" placeholderTextColor="#64748B" />
              <Text style={styles.formLabelText}>School / University</Text>
              <TextInput style={styles.formTextInput} value={studentSchool} onChangeText={setStudentSchool} placeholder="Name of School / University" placeholderTextColor="#64748B" />
              <Text style={styles.formLabelText}>Expected Graduation</Text>
              <TextInput style={styles.formTextInput} value={studentGraduation} onChangeText={setStudentGraduation} placeholder="Month Year (e.g., June 2030)" placeholderTextColor="#64748B" />
              <Text style={styles.formLabelText}>Adviser</Text>
              <TextInput style={styles.formTextInput} value={studentAdviser} onChangeText={setStudentAdviser} placeholder="Adviser Name" placeholderTextColor="#64748B" />
              <TouchableOpacity style={styles.saveChangesPrimaryBtn} activeOpacity={0.85} onPress={handleSaveAcademicInfo}>
                <Text style={styles.saveChangesBtnText}>Save Changes</Text>
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
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}>
              <Text style={styles.notifSectionGroupHeading}>Choose Appearance</Text>
              <View style={styles.privacyCardGroup}>
                <TouchableOpacity style={[styles.privacyRowItem, styles.optionSelectBtnActive]} onPress={() => setThemeMode('system')}>
                  <Ionicons name="settings-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>System Default</Text>
                  <Ionicons name="checkmark-circle" size={20} color="#1E58A8" />
                </TouchableOpacity>
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
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}>
              <View style={styles.masterNotifCardGroup}>
                <Text style={styles.notifMainTitleText}>Enable Notifications</Text>
                <Switch value={masterNotificationsEnabled} onValueChange={handleToggleMasterNotifications} trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }} thumbColor={masterNotificationsEnabled ? '#1E58A8' : '#94A3B8'} />
              </View>
              <Text style={styles.notifSectionGroupHeading}>Notification Preferences</Text>
              <View style={styles.notifPreferencesGroupCard}>
                <View style={styles.notifToggleRowItem}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.notifRowTitleText}>Task Reminders</Text>
                    <Text style={styles.notifRowSubText}>Reminders for due dates</Text>
                  </View>
                  <Switch value={notifTaskReminders} onValueChange={setNotifTaskReminders} trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }} thumbColor={notifTaskReminders ? '#1E58A8' : '#94A3B8'} />
                </View>
                <View style={styles.notifToggleRowItem}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.notifRowTitleText}>Adviser Feedback</Text>
                    <Text style={styles.notifRowSubText}>New feedback & responses</Text>
                  </View>
                  <Switch value={notifAdviserFeedback} onValueChange={setNotifAdviserFeedback} trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }} thumbColor={notifAdviserFeedback ? '#1E58A8' : '#94A3B8'} />
                </View>
                <View style={styles.notifToggleRowItem}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.notifRowTitleText}>Consultation Updates</Text>
                    <Text style={styles.notifRowSubText}>Meeting confirmation</Text>
                  </View>
                  <Switch value={notifConsultationUpdates} onValueChange={setNotifConsultationUpdates} trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }} thumbColor={notifConsultationUpdates ? '#1E58A8' : '#94A3B8'} />
                </View>
                <View style={styles.notifToggleRowItem}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.notifRowTitleText}>Chat Messages</Text>
                    <Text style={styles.notifRowSubText}>New messages & mentions</Text>
                  </View>
                  <Switch value={notifChatMessages} onValueChange={setNotifChatMessages} trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }} thumbColor={notifChatMessages ? '#1E58A8' : '#94A3B8'} />
                </View>
                <View style={styles.notifToggleRowItem}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.notifRowTitleText}>System Updates</Text>
                    <Text style={styles.notifRowSubText}>App updates & announcements</Text>
                  </View>
                  <Switch value={notifSystemUpdates} onValueChange={setNotifSystemUpdates} trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }} thumbColor={notifSystemUpdates ? '#1E58A8' : '#94A3B8'} />
                </View>
                <View style={[styles.notifToggleRowItem, { borderBottomWidth: 0 }]}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={styles.notifRowTitleText}>Email Digest</Text>
                    <Text style={styles.notifRowSubText}>Daily summary via email</Text>
                  </View>
                  <Switch value={notifEmailDigest} onValueChange={setNotifEmailDigest} trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }} thumbColor={notifEmailDigest ? '#1E58A8' : '#94A3B8'} />
                </View>
              </View>
              <TouchableOpacity style={styles.saveChangesPrimaryBtn} activeOpacity={0.85} onPress={handleSaveAccountInfo}>
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
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}>
              <Text style={styles.notifSectionGroupHeading}>Account Security</Text>
              <View style={styles.privacyCardGroup}>
                <TouchableOpacity style={styles.privacyRowItem} onPress={() => setShow2FAModal(true)}>
                  <Ionicons name="key-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Two-Factor Authentication</Text>
                  <Text style={styles.valueBadgeText}>{twoFactorAuth ? 'ON' : 'OFF'}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.privacyRowItem, { borderBottomWidth: 0 }]} onPress={() => setShowActiveSessionsModal(true)}>
                  <Ionicons name="pulse-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Active Sessions</Text>
                  <Text style={styles.valueBadgeText}>{activeSessionsStatus ? 'ON (3 active)' : 'OFF'}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              <Text style={[styles.notifSectionGroupHeading, { marginTop: 16 }]}>Privacy</Text>
              <View style={styles.privacyCardGroup}>
                <TouchableOpacity style={styles.privacyRowItem} onPress={() => setShowWhoCanSeeModal(true)}>
                  <Ionicons name="eye-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Who can see my profile</Text>
                  <Text style={styles.valueBadgeText}>{whoCanSeeProfile}</Text>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.privacyRowItem} onPress={() => setActiveSubView('activityHistory')}>
                  <Ionicons name="analytics-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Data & Activity</Text>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.privacyRowItem, { borderBottomWidth: 0 }]} onPress={() => setShowBlockedUsersModal(true)}>
                  <Ionicons name="people-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Blocked Users</Text>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.deleteAccountCardBtn} onPress={() => setShowDeleteAccountModal(true)}>
                <Ionicons name="trash-outline" size={20} color="#EF4444" style={{ marginRight: 10 }} />
                <Text style={styles.deleteAccountBtnText}>Delete Account</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      ) : activeSubView === 'activityHistory' ? (
        /* DATA & ACTIVITY HISTORY SUB-SCREEN */
        <View style={styles.container}>
          <View style={styles.topHeaderBarSub}>
            <TouchableOpacity style={styles.headerIconTouch} onPress={() => setActiveSubView('privacy')}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitleSub}>Data & Activity</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.whiteCardContainerSub}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}>
              <Text style={styles.notifSectionGroupHeading}>Recent Activity Logs</Text>
              <View style={styles.privacyCardGroup}>
                {userActivityLogs.map((log) => (
                  <View key={log.id} style={styles.privacyRowItem}>
                    <Ionicons name="time-outline" size={20} color="#1E58A8" style={styles.optionIcon} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#0F172A' }}>{log.action}</Text>
                      <Text style={{ fontSize: 12, color: '#64748B' }}>{log.target}</Text>
                    </View>
                    <Text style={{ fontSize: 11, color: '#94A3B8' }}>{log.time}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      ) : activeSubView === 'data' ? (
        /* 6. SUB-SCREEN: DATA & STORAGE */
        <View style={styles.container}>
          <View style={styles.topHeaderBarSub}>
            <TouchableOpacity style={styles.headerIconTouch} onPress={() => setActiveSubView('main')}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitleSub}>Storage & Data</Text>
            <View style={{ width: 24 }} />
          </View>
          <View style={styles.whiteCardContainerSub}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}>
              <View style={styles.privacyCardGroup}>
                <TouchableOpacity style={[styles.privacyRowItem, { borderBottomWidth: 0 }]} onPress={handleOpenFileRepository}>
                  <Ionicons name="cloud-outline" size={24} color="#1E58A8" style={styles.optionIcon} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.privacyLabelText}>Cloud Storage</Text>
                    <Text style={{ fontSize: 11, color: '#64748B' }}>2.45 GB of 10 GB used (Tap to open files)</Text>
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: 'bold', color: '#64748B' }}>24%</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.notifSectionGroupHeading, { marginTop: 16 }]}>Storage Breakdown</Text>
              <View style={styles.privacyCardGroup}>
                <View style={styles.privacyRowItem}>
                  <Ionicons name="document-text-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Files</Text>
                  <Text style={{ fontSize: 12, color: '#64748B' }}>1.25 GB</Text>
                </View>
                <View style={styles.privacyRowItem}>
                  <Ionicons name="journal-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Notes</Text>
                  <Text style={{ fontSize: 12, color: '#64748B' }}>680 MB</Text>
                </View>
                <View style={styles.privacyRowItem}>
                  <Ionicons name="attach-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Chat Attachments</Text>
                  <Text style={{ fontSize: 12, color: '#64748B' }}>320 MB</Text>
                </View>
                <View style={[styles.privacyRowItem, { borderBottomWidth: 0 }]}>
                  <Ionicons name="folder-open-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Other Data</Text>
                  <Text style={{ fontSize: 12, color: '#64748B' }}>{otherDataSize}</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.outlineActionBtn} onPress={() => setShowManageStorageModal(true)}>
                <Text style={styles.outlineActionBtnText}>Manage Storage</Text>
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
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}>
              <View style={{ alignItems: 'center', marginVertical: 16 }}>
                <View style={styles.appBadgeBox}>
                  <Ionicons name="school" size={40} color="#1E58A8" />
                </View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginTop: 8 }}>ThesisPilot</Text>
                <Text style={{ fontSize: 12, color: '#64748B', marginTop: 2 }}>Version 1.0.0</Text>
                <Text style={{ fontSize: 12, color: '#64748B', textAlign: 'center', marginTop: 6, paddingHorizontal: 20 }}>
                  Your AI-powered partner in every step of your thesis journey.
                </Text>
              </View>
              <View style={styles.privacyCardGroup}>
                <TouchableOpacity style={styles.privacyRowItem} onPress={() => setShowWhatsNewModal(true)}>
                  <Ionicons name="open-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>What's New</Text>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.privacyRowItem} onPress={() => setShowTermsModal(true)}>
                  <Ionicons name="open-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Terms of Service</Text>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.privacyRowItem} onPress={() => setShowPrivacyModal(true)}>
                  <Ionicons name="open-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Privacy Policy</Text>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.privacyRowItem, { borderBottomWidth: 0 }]} onPress={() => setShowLicensesModal(true)}>
                  <Ionicons name="open-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Open Source Licenses</Text>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      ) : (
        /* 8. MAIN PROFILE DASHBOARD MENU */
        <View style={styles.container}>
          <View style={styles.topHeaderBarSub}>
            <Text style={styles.headerTitleSub}>Profile</Text>
            <TouchableOpacity style={styles.headerIconTouch} onPress={() => setIsMenuOpen && setIsMenuOpen(true)}>
              <Ionicons name="settings-outline" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.whiteCardContainerSub}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}>
              <View style={styles.avatarCenterWrapper}>
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
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#0F172A', marginTop: 8 }}>{studentName}</Text>
                <Text style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>
                  {studentProgram} <Text style={{ color: '#1E58A8', fontWeight: 'bold' }}>{studentYear}</Text>
                </Text>
              </View>

              {/* Current Thesis Card */}
              <TouchableOpacity style={styles.currentThesisCard} onPress={() => setShowThesisSelectModal(true)}>
                <Text style={{ fontSize: 11, color: '#64748B' }}>Current Thesis</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4 }}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: '#0F172A', flex: 1, marginRight: 8 }}>
                    {selectedThesis?.title || 'The Impact of AI on Student Learning Outcomes'}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color="#0F172A" />
                </View>
              </TouchableOpacity>

              <View style={styles.privacyCardGroup}>
                <TouchableOpacity style={styles.privacyRowItem} onPress={() => handleOptionPress('account')}>
                  <Ionicons name="person-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Account Information</Text>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.privacyRowItem} onPress={() => handleOptionPress('academic')}>
                  <Ionicons name="information-circle-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Academic Information</Text>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.privacyRowItem} onPress={() => handleOptionPress('notification')}>
                  <Ionicons name="notifications-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Notification</Text>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.privacyRowItem} onPress={() => handleOptionPress('privacy')}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Privacy & Security</Text>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.privacyRowItem} onPress={() => handleOptionPress('data')}>
                  <Ionicons name="server-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Data & Storage</Text>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.privacyRowItem} onPress={() => handleOptionPress('help')}>
                  <Ionicons name="help-circle-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>Help & Support</Text>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.privacyRowItem, { borderBottomWidth: 0 }]} onPress={() => handleOptionPress('about')}>
                  <Ionicons name="information-circle-outline" size={20} color="#0F172A" style={styles.optionIcon} />
                  <Text style={styles.privacyLabelText}>About ThesisPilot</Text>
                  <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      )}

      {/* MANAGE STORAGE BOTTOM SHEET MODAL */}
      <Modal visible={showManageStorageModal} transparent animationType="slide" statusBarTranslucent>
        <TouchableOpacity style={styles.modalOverlayDark} activeOpacity={1} onPress={() => setShowManageStorageModal(false)}>
          <View style={styles.actionSheetCard}>
            <View style={styles.actionSheetHandle} />
            <Text style={styles.actionSheetTitle}>Manage Storage</Text>
            <TouchableOpacity style={styles.actionSheetOption} onPress={handleOpenFileRepository}>
              <Ionicons name="folder-open-outline" size={22} color="#1E58A8" />
              <Text style={styles.actionSheetOptionText}>Open File Repository</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionSheetOption} onPress={handleClearCache}>
              <Ionicons name="trash-bin-outline" size={22} color="#DC2626" />
              <Text style={[styles.actionSheetOptionText, { color: '#DC2626' }]}>Clear Cache ({otherDataSize})</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelSheetBtn} onPress={() => setShowManageStorageModal(false)}>
              <Text style={styles.cancelSheetText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL: PROFILE PHOTO PICKER */}
      <Modal visible={showImagePickerModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.smallOptionsModalCard}>
            <Text style={styles.smallModalHeaderTitle}>Profile Photo</Text>
            <TouchableOpacity style={styles.modalOptionRowItem} onPress={handleTakePhoto}>
              <Ionicons name="camera-outline" size={20} color="#1E58A8" />
              <Text style={styles.modalOptionLabelText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOptionRowItem} onPress={handleChooseFromGallery}>
              <Ionicons name="images-outline" size={20} color="#1E58A8" />
              <Text style={styles.modalOptionLabelText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOptionRowItem} onPress={handleRemovePhoto}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text style={[styles.modalOptionLabelText, { color: '#EF4444' }]}>Remove Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOptionCloseBtn} onPress={() => setShowImagePickerModal(false)}>
              <Text style={styles.modalOptionCloseText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL: TWO-FACTOR AUTHENTICATION (2FA) */}
      <Modal visible={show2FAModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.smallOptionsModalCard}>
            <Text style={styles.smallModalHeaderTitle}>Two-Factor Authentication</Text>
            <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }}>
              Secure your account by requiring verification codes sent directly to your registered email ({studentEmail}).
            </Text>
            <TouchableOpacity style={styles.modalOptionRowItem} onPress={handleEnable2FA}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#16A34A" />
              <Text style={[styles.modalOptionLabelText, { color: '#16A34A' }]}>ON (Enable 2FA)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOptionRowItem} onPress={handleDisable2FA}>
              <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
              <Text style={[styles.modalOptionLabelText, { color: '#EF4444' }]}>OFF (Disable 2FA)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOptionCloseBtn} onPress={() => setShow2FAModal(false)}>
              <Text style={styles.modalOptionCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL: ACTIVE SESSIONS STATUS */}
      <Modal visible={showActiveSessionsModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.smallOptionsModalCard}>
            <Text style={styles.smallModalHeaderTitle}>Active Sessions Status</Text>
            <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }}>
              Set to ON if you want others to see when you are online. Set to OFF to hide your status.
            </Text>
            <TouchableOpacity
              style={styles.modalOptionRowItem}
              onPress={() => {
                setActiveSessionsStatus(true);
                setShowActiveSessionsModal(false);
                saveProfileDataToStorage({ activeSessionsStatus: true });
                Alert.alert('Active Status ON', 'Other users can now see your online status.');
              }}
            >
              <Ionicons name="checkmark-circle-outline" size={20} color="#16A34A" />
              <Text style={[styles.modalOptionLabelText, { color: '#16A34A' }]}>ON (3 Active Sessions)</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOptionRowItem}
              onPress={() => {
                setActiveSessionsStatus(false);
                setShowActiveSessionsModal(false);
                saveProfileDataToStorage({ activeSessionsStatus: false });
                Alert.alert('Active Status OFF', 'Your active status is now hidden.');
              }}
            >
              <Ionicons name="close-circle-outline" size={20} color="#EF4444" />
              <Text style={[styles.modalOptionLabelText, { color: '#EF4444' }]}>OFF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOptionCloseBtn} onPress={() => setShowActiveSessionsModal(false)}>
              <Text style={styles.modalOptionCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL: WHO CAN SEE MY PROFILE */}
      <Modal visible={showWhoCanSeeModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.smallOptionsModalCard}>
            <Text style={styles.smallModalHeaderTitle}>Who Can See My Profile</Text>
            <TouchableOpacity
              style={styles.modalOptionRowItem}
              onPress={() => {
                setWhoCanSeeProfile('Everyone');
                setShowWhoCanSeeModal(false);
                saveProfileDataToStorage({ whoCanSeeProfile: 'Everyone' });
              }}
            >
              <Ionicons name={whoCanSeeProfile === 'Everyone' ? 'checkmark-circle' : 'ellipse-outline'} size={20} color="#1E58A8" />
              <Text style={styles.modalOptionLabelText}>Everyone</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalOptionRowItem}
              onPress={() => {
                setWhoCanSeeProfile('Only me');
                setShowWhoCanSeeModal(false);
                saveProfileDataToStorage({ whoCanSeeProfile: 'Only me' });
              }}
            >
              <Ionicons name={whoCanSeeProfile === 'Only me' ? 'checkmark-circle' : 'ellipse-outline'} size={20} color="#1E58A8" />
              <Text style={styles.modalOptionLabelText}>Only me</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalOptionCloseBtn} onPress={() => setShowWhoCanSeeModal(false)}>
              <Text style={styles.modalOptionCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL: BLOCKED USERS (EXACT MATCH FOR SCREENSHOT) */}
      <Modal visible={showBlockedUsersModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.blockedUsersModalCard}>
            <Text style={styles.blockedUsersModalTitle}>Blocked Users</Text>
            {blockedUsersList.length === 0 ? (
              <Text style={{ fontSize: 13, color: '#64748B', marginVertical: 16 }}>No blocked users.</Text>
            ) : (
              blockedUsersList.map((user) => (
                <View key={user} style={styles.blockedUserRowItem}>
                  <Text style={styles.blockedUserNameText}>{user}</Text>
                  <TouchableOpacity style={styles.unblockOutlineBtn} onPress={() => handleUnblockUser(user)}>
                    <Text style={styles.unblockOutlineBtnText}>Unblock</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
            <TouchableOpacity style={styles.blockedCloseOutlineBtn} onPress={() => setShowBlockedUsersModal(false)}>
              <Text style={styles.blockedCloseOutlineText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL: WHAT'S NEW */}
      <Modal visible={showWhatsNewModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.smallOptionsModalCard}>
            <Text style={styles.smallModalHeaderTitle}>What's New in v1.0.0</Text>
            <ScrollView style={{ maxHeight: 250, marginBottom: 12 }}>
              <Text style={styles.aboutContentBullet}>• Added AI Assistant Integration for real-time thesis guidance and manuscript review.</Text>
              <Text style={styles.aboutContentBullet}>• Built-in consultation scheduler and educator group manager.</Text>
              <Text style={styles.aboutContentBullet}>• Enhanced File Repository with support for PDFs, DOCX, and XLSX data formats.</Text>
              <Text style={styles.aboutContentBullet}>• Dark Mode UI support and overall performance optimizations.</Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalOptionCloseBtn} onPress={() => setShowWhatsNewModal(false)}>
              <Text style={styles.modalOptionCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL: TERMS OF SERVICE */}
      <Modal visible={showTermsModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.smallOptionsModalCard}>
            <Text style={styles.smallModalHeaderTitle}>Terms of Service</Text>
            <ScrollView style={{ maxHeight: 250, marginBottom: 12 }}>
              <Text style={styles.aboutContentText}>
                ThesisPilot is designed to facilitate thesis management, defense scheduling, and advisor-student collaboration. By using this app, you agree to submit authentic work, respect intellectual property, and adhere to institutional academic integrity standards.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalOptionCloseBtn} onPress={() => setShowTermsModal(false)}>
              <Text style={styles.modalOptionCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL: PRIVACY POLICY */}
      <Modal visible={showPrivacyModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.smallOptionsModalCard}>
            <Text style={styles.smallModalHeaderTitle}>Privacy Policy</Text>
            <ScrollView style={{ maxHeight: 250, marginBottom: 12 }}>
              <Text style={styles.aboutContentText}>
                Your privacy is paramount. ThesisPilot protects your personal details, thesis drafts, and cloud storage files using industry-standard encryption. We do not sell or share your research data with third parties.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalOptionCloseBtn} onPress={() => setShowPrivacyModal(false)}>
              <Text style={styles.modalOptionCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL: OPEN SOURCE LICENSES */}
      <Modal visible={showLicensesModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.smallOptionsModalCard}>
            <Text style={styles.smallModalHeaderTitle}>Open Source Licenses</Text>
            <ScrollView style={{ maxHeight: 250, marginBottom: 12 }}>
              <Text style={styles.aboutContentBullet}>• React Native Framework (MIT License)</Text>
              <Text style={styles.aboutContentBullet}>• Expo SDK (MIT License)</Text>
              <Text style={styles.aboutContentBullet}>• Ionicons Vector Icons (MIT License)</Text>
              <Text style={styles.aboutContentBullet}>• React Native Async Storage (MIT License)</Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalOptionCloseBtn} onPress={() => setShowLicensesModal(false)}>
              <Text style={styles.modalOptionCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL: DELETE ACCOUNT CONFIRMATION */}
      <Modal visible={showDeleteAccountModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.deleteBlueCard}>
            <Ionicons name="alert-circle" size={40} color="#EF4444" style={{ alignSelf: 'center', marginBottom: 8 }} />
            <Text style={styles.deleteModalTitle}>Delete Account</Text>
            <Text style={styles.deleteModalSubText}>This will permanently delete your account and all associated data:</Text>
            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 8, padding: 10, marginVertical: 10 }}>
              <Text style={{ fontSize: 12, color: '#EF4444' }}>• Overall Progress</Text>
              <Text style={{ fontSize: 12, color: '#EF4444' }}>• File Repository</Text>
              <Text style={{ fontSize: 12, color: '#EF4444' }}>• Account Information</Text>
              <Text style={{ fontSize: 12, color: '#EF4444' }}>• Data & Storage</Text>
            </View>
            <Text style={{ fontSize: 11, color: '#FCA5A5', textAlign: 'center', marginBottom: 14 }}>This action cannot be undone.</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity onPress={() => setShowDeleteAccountModal(false)}>
                <Text style={{ color: '#FFFFFF', paddingVertical: 6, paddingHorizontal: 10 }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: '#EF4444', paddingVertical: 6, paddingHorizontal: 14, borderRadius: 6 }} onPress={handleConfirmDeleteAccount}>
                <Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Continue</Text>
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
    backgroundColor: '#1E58A8',
    flex: 1,
  },
  topHeaderBarSub: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 48,
    paddingBottom: 16,
  },
  headerIconTouch: {
    padding: 4,
  },
  headerTitleSub: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  whiteCardContainerSub: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  avatarCenterWrapper: {
    alignItems: 'center',
    marginVertical: 12,
  },
  avatarTouchBox: {
    position: 'relative',
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  placeholderAvatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    elevation: 2,
  },
  formLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
    marginTop: 10,
  },
  formTextInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  formTextAreaInput: {
    height: 70,
    textAlignVertical: 'top',
  },
  saveChangesPrimaryBtn: {
    backgroundColor: '#1E58A8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  saveChangesBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  notifSectionGroupHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 8,
    marginTop: 10,
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
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  optionIcon: {
    marginRight: 12,
  },
  privacyLabelText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  optionSelectBtnActive: {
    backgroundColor: '#EFF6FF',
  },
  masterNotifCardGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    marginBottom: 16,
  },
  notifMainTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  notifPreferencesGroupCard: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  notifToggleRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  notifRowTitleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  notifRowSubText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  valueBadgeText: {
    fontSize: 12,
    color: '#64748B',
    marginRight: 6,
  },
  deleteAccountCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 20,
  },
  deleteAccountBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  outlineActionBtn: {
    borderWidth: 1,
    borderColor: '#1E58A8',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  outlineActionBtnText: {
    color: '#1E58A8',
    fontSize: 13,
    fontWeight: 'bold',
  },
  appBadgeBox: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  currentThesisCard: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  modalOverlayDark: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  smallOptionsModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
  },
  smallModalHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 14,
  },
  modalOptionRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 10,
  },
  modalOptionLabelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E58A8',
  },
  modalOptionCloseBtn: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  modalOptionCloseText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#64748B',
  },
  /* EXACT MATCH STYLES FOR BLOCKED USERS MODAL */
  blockedUsersModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
  },
  blockedUsersModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 18,
  },
  blockedUserRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  blockedUserNameText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  unblockOutlineBtn: {
    borderWidth: 1,
    borderColor: '#BFDBFE',
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  unblockOutlineBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E58A8',
  },
  blockedCloseOutlineBtn: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blockedCloseOutlineText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E58A8',
  },
  deleteBlueCard: {
    width: '100%',
    backgroundColor: '#1E58A8',
    borderRadius: 16,
    padding: 20,
  },
  deleteModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  deleteModalSubText: {
    fontSize: 12,
    color: '#E0F2FE',
    textAlign: 'center',
    marginTop: 4,
  },
  aboutContentBullet: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 8,
    lineHeight: 18,
  },
  aboutContentText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },
  actionSheetCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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