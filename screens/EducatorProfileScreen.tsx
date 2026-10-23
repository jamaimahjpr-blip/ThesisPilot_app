import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import React, { useEffect, useState } from 'react';
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

interface EducatorProfileScreenProps {
  onBack?: () => void;
  onSwitchRole?: () => void;
  onLogout?: () => void;
  setEducatorDashView?: (view: 'dashboard' | 'chat' | 'profile' | 'repository') => void;
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
  const extractUsername = (emailStr?: string) => {
    if (!emailStr) return 'johnternus';
    return emailStr.split('@')[0];
  };

  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'profile'>('profile');
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [showImagePickerModal, setShowImagePickerModal] = useState(false);

  const [educatorName, setEducatorName] = useState(userData?.fullName || 'Educator User');
  const [educatorTitle, setEducatorTitle] = useState('Educator / Thesis Adviser');
  const [educatorEmail, setEducatorEmail] = useState(userData?.email || 'educator@domain.com');
  const [educatorPhone, setEducatorPhone] = useState('+63 912 345 6789');
  const [educatorUsername, setEducatorUsername] = useState(extractUsername(userData?.email));
  const [educatorBio, setEducatorBio] = useState(
    'Faculty member specializing in AI, Machine Learning, and Academic Research Management.'
  );
  const [selectedThesisGroup, setSelectedThesisGroup] = useState("Cooper's Thesis Group");
  const [showThesisSelectModal, setShowThesisSelectModal] = useState(false);

  const thesisGroupsList = [
    { id: '1', title: "Cooper's Thesis Group", chapter: 'Chapter 3: Methodology' },
    { id: '2', title: 'Pied Piper AI Group', chapter: 'Chapter 2: Literature Review' },
    { id: '3', title: 'BioTech Health Research', chapter: 'Chapter 4: Data Results' },
    { id: '4', title: 'EcoTech Innovations', chapter: 'Chapter 1: Proposal' },
  ];

  const [masterNotificationsEnabled, setMasterNotificationsEnabled] = useState(true);
  const [notifTaskReminders, setNotifTaskReminders] = useState(true);
  const [notifStudentComments, setNotifStudentComments] = useState(true);
  const [notifConsultationUpdates, setNotifConsultationUpdates] = useState(true);
  const [notifChatMessages, setNotifChatMessages] = useState(true);
  const [notifSystemUpdates, setNotifSystemUpdates] = useState(false);
  const [notifEmailDigest, setNotifEmailDigest] = useState(true);

  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [activeSessionsStatus, setActiveSessionsStatus] = useState(true);
  const [whoCanSeeProfile, setWhoCanSeeProfile] = useState<'Students Only' | 'Everyone' | 'Only me'>('Students Only');
  const [blockedUsersList, setBlockedUsersList] = useState<string[]>(['John Doe', 'Jane Smith']);

  const [show2FAModal, setShow2FAModal] = useState(false);
  const [showActiveSessionsModal, setShowActiveSessionsModal] = useState(false);
  const [showWhoCanSeeModal, setShowWhoCanSeeModal] = useState(false);
  const [showBlockedUsersModal, setShowBlockedUsersModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showManageStorageModal, setShowManageStorageModal] = useState(false);
  const [cacheSize, setCacheSize] = useState('200 MB');

  const [showWhatsNewModal, setShowWhatsNewModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showOpenSourceModal, setShowOpenSourceModal] = useState(false);

  const [activeSubView, setActiveSubView] = useState<
    'main' | 'account' | 'notification' | 'privacy' | 'data' | 'activityHistory' | 'about'
  >('main');

  const [userActivityLogs] = useState([
    { id: '1', action: 'Reviewed Chapter 3 Draft', target: 'Sheldon Cooper', time: '36 mins ago' },
    { id: '2', action: 'Approved Literature Review', target: 'Penny Hofstadter', time: '12 hours ago' },
    { id: '3', action: 'Scheduled Pre-Final Defense', target: 'Pied Piper AI Group', time: 'Yesterday' },
  ]);

  const handleNavToDashboard = () => {
    setActiveTab('dashboard');
    if (setEducatorDashView) {
      setEducatorDashView('dashboard');
    } else if (onBack) {
      onBack();
    }
  };

  const handleNavToChat = () => {
    setActiveTab('chat');
    if (setEducatorDashView) {
      setEducatorDashView('chat');
    }
  };

  const handleNavToProfile = () => {
    setActiveTab('profile');
    if (activeSubView !== 'main') {
      setActiveSubView('main');
    }
  };

  useEffect(() => {
    if (userData?.fullName) {
      setEducatorName(userData.fullName);
    }
    if (userData?.email) {
      setEducatorEmail(userData.email);
      setEducatorUsername(extractUsername(userData.email));
    }
    loadSavedProfileData();
  }, [userData]);

  const loadSavedProfileData = async () => {
    try {
      const savedDataJSON = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedDataJSON !== null) {
        const data = JSON.parse(savedDataJSON);
        if (data.profileImageUri !== undefined) setProfileImageUri(data.profileImageUri);
        if (data.educatorPhone) setEducatorPhone(data.educatorPhone);
        if (data.educatorBio) setEducatorBio(data.educatorBio);
        if (data.selectedThesisGroup) setSelectedThesisGroup(data.selectedThesisGroup);
      }
    } catch (e) {
      console.log('Failed to load educator profile data:', e);
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
        selectedThesisGroup,
        masterNotificationsEnabled,
        ...overrideObj,
      };
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(currentProfileData));
    } catch (e) {
      console.log('Failed to save educator profile data:', e);
    }
  };

  const handleToggleMasterNotifications = (val: boolean) => {
    setMasterNotificationsEnabled(val);
    setNotifTaskReminders(val);
    setNotifStudentComments(val);
    setNotifConsultationUpdates(val);
    setNotifChatMessages(val);
    setNotifSystemUpdates(val);
    setNotifEmailDigest(val);
  };

  const handleTakePhoto = async () => {
    setShowImagePickerModal(false);
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'You need camera permissions to take a photo.');
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
    }
  };

  const handleChooseFromGallery = async () => {
    setShowImagePickerModal(false);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Required', 'You need access to your gallery.');
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
    }
  };

  const handleRemovePhoto = () => {
    setShowImagePickerModal(false);
    if (!profileImageUri) return;
    Alert.alert('Remove Photo', 'Are you sure you want to remove your profile photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          setProfileImageUri(null);
          await saveProfileDataToStorage({ profileImageUri: null });
        },
      },
    ]);
  };

  const handleUnblockUser = (userName: string) => {
    setBlockedUsersList((prev) => prev.filter((u) => u !== userName));
    Alert.alert('Unblocked', `${userName} has been unblocked.`);
  };

  const handleClearCache = () => {
    setShowManageStorageModal(false);
    setCacheSize('0 MB');
    Alert.alert('Cache Cleared', 'Successfully cleared cache and all temporary files.');
  };

  const handleOpenFileRepository = () => {
    setShowManageStorageModal(false);
    if (setEducatorDashView) {
      setEducatorDashView('repository');
    } else {
      Alert.alert('File Repository', 'Opening File Repository...');
    }
  };

  const handleSaveAccountInfo = async () => {
    await saveProfileDataToStorage();
    Alert.alert('Success', 'Account information updated successfully.');
    setActiveSubView('main');
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
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
                <TextInput
                  style={styles.formTextInput}
                  value={educatorName}
                  onChangeText={setEducatorName}
                  placeholder="Full Name"
                  placeholderTextColor="#64748B"
                />

                <Text style={styles.formLabelText}>Email</Text>
                <TextInput
                  style={styles.formTextInput}
                  value={educatorEmail}
                  onChangeText={(text) => {
                    setEducatorEmail(text);
                    setEducatorUsername(extractUsername(text));
                  }}
                  keyboardType="email-address"
                  placeholder="Email Address"
                  placeholderTextColor="#64748B"
                />

                <Text style={styles.formLabelText}>Phone Number</Text>
                <TextInput
                  style={styles.formTextInput}
                  value={educatorPhone}
                  onChangeText={setEducatorPhone}
                  keyboardType="phone-pad"
                  placeholder="Phone Number"
                  placeholderTextColor="#64748B"
                />

                <Text style={styles.formLabelText}>Username</Text>
                <TextInput
                  style={styles.formTextInput}
                  value={educatorUsername}
                  onChangeText={setEducatorUsername}
                  placeholder="Username"
                  placeholderTextColor="#64748B"
                />

                <Text style={styles.formLabelText}>Bio (Optional)</Text>
                <TextInput
                  style={[styles.formTextInput, styles.formTextAreaInput]}
                  value={educatorBio}
                  onChangeText={setEducatorBio}
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
        ) : activeSubView === 'notification' ? (
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
                  onPress={() => setActiveSubView('main')}
                >
                  <Text style={styles.saveChangesBtnText}>Save Preferences</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        ) : activeSubView === 'privacy' ? (
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
                  <TouchableOpacity style={styles.privacyRowItem} onPress={() => setShow2FAModal(true)}>
                    <Ionicons name="key-outline" size={20} color="#000000" style={styles.optionIcon} />
                    <Text style={styles.privacyLabelText}>Two-Factor Authentication</Text>
                    <Text style={styles.privacySubStatusText}>{twoFactorAuth ? 'ON' : 'OFF'}</Text>
                    <Ionicons name="chevron-forward" size={18} color="#000000" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.privacyRowItem, { borderBottomWidth: 0 }]}
                    onPress={() => setShowActiveSessionsModal(true)}
                  >
                    <Ionicons name="time-outline" size={20} color="#000000" style={styles.optionIcon} />
                    <Text style={styles.privacyLabelText}>Active Sessions</Text>
                    <Text style={styles.privacySubStatusText}>
                      {activeSessionsStatus ? 'ON (3 active)' : 'OFF'}
                    </Text>
                    <Ionicons name="chevron-forward" size={18} color="#000000" />
                  </TouchableOpacity>
                </View>

                <Text style={[styles.notifSectionGroupHeading, { marginTop: 20 }]}>Privacy</Text>
                <View style={styles.privacyCardGroup}>
                  <TouchableOpacity style={styles.privacyRowItem} onPress={() => setShowWhoCanSeeModal(true)}>
                    <Ionicons name="help-circle-outline" size={20} color="#000000" style={styles.optionIcon} />
                    <Text style={styles.privacyLabelText}>Who can see my profile</Text>
                    <Text style={styles.privacySubStatusText}>{whoCanSeeProfile}</Text>
                    <Ionicons name="chevron-forward" size={18} color="#000000" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.privacyRowItem} onPress={() => setActiveSubView('activityHistory')}>
                    <Ionicons name="stats-chart-outline" size={20} color="#000000" style={styles.optionIcon} />
                    <Text style={styles.privacyLabelText}>Data & Activity</Text>
                    <Ionicons name="chevron-forward" size={18} color="#000000" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.privacyRowItem, { borderBottomWidth: 0 }]}
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
        ) : activeSubView === 'activityHistory' ? (
          <View style={styles.container}>
            <View style={styles.topHeaderBarSub}>
              <TouchableOpacity style={styles.headerIconTouch} onPress={() => setActiveSubView('privacy')}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitleSub}>Data & Activity</Text>
              <View style={{ width: 24 }} />
            </View>
            <View style={styles.whiteCardContainerSub}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 40 }}
              >
                <Text style={styles.notifSectionGroupHeading}>Educator Activity Logs</Text>
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
          /* STORAGE & DATA SUB-VIEW MATCHING IMAGE DESIGN */
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
                {/* CLOUD STORAGE CARD */}
                <TouchableOpacity
                  style={styles.cloudStorageCard}
                  activeOpacity={0.85}
                  onPress={() => setShowManageStorageModal(true)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="cloud-outline" size={28} color="#1E58A8" style={{ marginRight: 12 }} />
                      <View>
                        <Text style={styles.cloudCardTitle}>Cloud Storage</Text>
                        <Text style={styles.cloudCardSub}>2.45 GB of 10 GB used (Tap to open files)</Text>
                      </View>
                    </View>
                    <Text style={styles.cloudCardPercent}>24%</Text>
                  </View>
                </TouchableOpacity>

                {/* STORAGE BREAKDOWN */}
                <Text style={styles.breakdownHeaderTitle}>Storage Breakdown</Text>
                <View style={styles.breakdownBox}>
                  <View style={styles.breakdownRow}>
                    <Ionicons name="document-text-outline" size={20} color="#0F172A" />
                    <Text style={styles.breakdownLabel}>Files</Text>
                    <Text style={styles.breakdownValue}>1.25 GB</Text>
                  </View>
                  <View style={styles.breakdownRow}>
                    <Ionicons name="book-outline" size={20} color="#0F172A" />
                    <Text style={styles.breakdownLabel}>Notes</Text>
                    <Text style={styles.breakdownValue}>680 MB</Text>
                  </View>
                  <View style={styles.breakdownRow}>
                    <Ionicons name="attach-outline" size={20} color="#0F172A" />
                    <Text style={styles.breakdownLabel}>Chat Attachments</Text>
                    <Text style={styles.breakdownValue}>320 MB</Text>
                  </View>
                  <View style={[styles.breakdownRow, { borderBottomWidth: 0 }]}>
                    <Ionicons name="pie-chart-outline" size={20} color="#0F172A" />
                    <Text style={styles.breakdownLabel}>Other Data</Text>
                    <Text style={styles.breakdownValue}>{cacheSize}</Text>
                  </View>
                </View>

                {/* MANAGE STORAGE BUTTON */}
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
                  <Text style={styles.aboutSloganText}>
                    Your AI-powered partner in every step of your thesis journey.
                  </Text>
                </View>

                <View style={styles.aboutOptionsCardGroup}>
                  <TouchableOpacity
                    style={styles.aboutOptionRowItem}
                    onPress={() => setShowWhatsNewModal(true)}
                  >
                    <Ionicons name="open-outline" size={20} color="#000000" style={styles.aboutOptionIcon} />
                    <Text style={styles.aboutOptionLabelText}>What's New</Text>
                    <Ionicons name="chevron-forward" size={18} color="#64748B" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.aboutOptionRowItem} onPress={() => setShowTermsModal(true)}>
                    <Ionicons name="open-outline" size={20} color="#000000" style={styles.aboutOptionIcon} />
                    <Text style={styles.aboutOptionLabelText}>Terms of Service</Text>
                    <Ionicons name="chevron-forward" size={18} color="#64748B" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.aboutOptionRowItem}
                    onPress={() => setShowPrivacyModal(true)}
                  >
                    <Ionicons name="open-outline" size={20} color="#000000" style={styles.aboutOptionIcon} />
                    <Text style={styles.aboutOptionLabelText}>Privacy Policy</Text>
                    <Ionicons name="chevron-forward" size={18} color="#64748B" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.aboutOptionRowItem, { borderBottomWidth: 0 }]}
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
        ) : (
          /* MAIN PROFILE SCREEN */
          <View style={styles.container}>
            <View style={styles.topHeaderBar}>
              <Text style={styles.headerTitle}>Profile</Text>
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
                contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 }}
              >
                <View style={styles.studentInfoCenter}>
                  <Text style={styles.studentNameText}>{educatorName}</Text>
                  <Text style={styles.degreeText}>{educatorTitle}</Text>
                </View>

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

                <View style={styles.optionsCardGroup}>
                  <TouchableOpacity style={styles.optionRowItem} onPress={() => setActiveSubView('account')}>
                    <Ionicons name="person-outline" size={22} color="#000000" style={styles.optionIcon} />
                    <Text style={styles.optionLabelText}>Account Information</Text>
                    <Ionicons name="chevron-forward" size={18} color="#000000" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.optionRowItem}
                    onPress={() => setActiveSubView('notification')}
                  >
                    <Ionicons name="notifications-outline" size={22} color="#000000" style={styles.optionIcon} />
                    <Text style={styles.optionLabelText}>Notification</Text>
                    <Ionicons name="chevron-forward" size={18} color="#000000" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.optionRowItem} onPress={() => setActiveSubView('privacy')}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={22}
                      color="#000000"
                      style={styles.optionIcon}
                    />
                    <Text style={styles.optionLabelText}>Privacy & Security</Text>
                    <Ionicons name="chevron-forward" size={18} color="#000000" />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.optionRowItem} onPress={() => setActiveSubView('data')}>
                    <Ionicons name="server-outline" size={22} color="#000000" style={styles.optionIcon} />
                    <Text style={styles.optionLabelText}>Data & Storage</Text>
                    <Ionicons name="chevron-forward" size={18} color="#000000" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.optionRowItem, { borderBottomWidth: 0 }]}
                    onPress={() => setActiveSubView('about')}
                  >
                    <Ionicons
                      name="information-circle-outline"
                      size={22}
                      color="#000000"
                      style={styles.optionIcon}
                    />
                    <Text style={styles.optionLabelText}>About ThesisPilot</Text>
                    <Ionicons name="chevron-forward" size={18} color="#000000" />
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </View>

      {/* LOWER NAVIGATION BAR FOR PROFILE SCREEN */}
      <View style={styles.bottomTabContainer}>
        <TouchableOpacity style={styles.tabButton} activeOpacity={0.7} onPress={handleNavToDashboard}>
          <Ionicons
            name={activeTab === 'dashboard' ? 'home' : 'home-outline'}
            size={24}
            color={activeTab === 'dashboard' ? '#1E58A8' : '#64748B'}
          />
          <Text style={[styles.tabLabelText, activeTab === 'dashboard' && styles.activeTabLabel]}>
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} activeOpacity={0.7} onPress={handleNavToChat}>
          <Ionicons
            name={activeTab === 'chat' ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'}
            size={24}
            color={activeTab === 'chat' ? '#1E58A8' : '#64748B'}
          />
          <Text style={[styles.tabLabelText, activeTab === 'chat' && styles.activeTabLabel]}>
            Chat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} activeOpacity={0.7} onPress={handleNavToProfile}>
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={24}
            color={activeTab === 'profile' ? '#1E58A8' : '#64748B'}
          />
          <Text style={[styles.tabLabelText, activeTab === 'profile' && styles.activeTabLabel]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>

      {/* MANAGE STORAGE SHEET MODAL */}
      <Modal visible={showManageStorageModal} transparent animationType="slide" statusBarTranslucent>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowManageStorageModal(false)}
        >
          <View style={styles.actionSheetCard}>
            <View style={styles.actionSheetHandle} />
            <Text style={styles.actionSheetTitle}>Manage Storage & Data</Text>

            <TouchableOpacity style={styles.actionSheetOption} onPress={handleOpenFileRepository}>
              <Ionicons name="folder-open-outline" size={22} color="#1E58A8" />
              <Text style={styles.actionSheetOptionText}>Open File Repository</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionSheetOption} onPress={handleClearCache}>
              <Ionicons name="trash-bin-outline" size={22} color="#DC2626" />
              <Text style={[styles.actionSheetOptionText, { color: '#DC2626' }]}>
                Clear Cache ({cacheSize})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelSheetBtn} onPress={() => setShowManageStorageModal(false)}>
              <Text style={styles.cancelSheetText}>CANCEL</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* MODAL 1: TWO-FACTOR AUTHENTICATION */}
      <Modal visible={show2FAModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Two-Factor Authentication</Text>
            <Text style={{ fontSize: 13, color: '#64748B', marginVertical: 10 }}>
              When ON, a One-Time PIN (OTP) will be sent to your email ({educatorEmail}) before logging in.
            </Text>

            <TouchableOpacity
              style={[styles.optionSelectBtn, twoFactorAuth && styles.optionSelectBtnActive]}
              onPress={() => setTwoFactorAuth(true)}
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
              onPress={() => setTwoFactorAuth(false)}
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
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Active Sessions Status</Text>

            <TouchableOpacity
              style={[styles.optionSelectBtn, activeSessionsStatus && styles.optionSelectBtnActive]}
              onPress={() => {
                setActiveSessionsStatus(true);
                setShowActiveSessionsModal(false);
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
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Who Can See My Profile</Text>

            <TouchableOpacity
              style={[styles.optionSelectBtn, whoCanSeeProfile === 'Everyone' && styles.optionSelectBtnActive]}
              onPress={() => {
                setWhoCanSeeProfile('Everyone');
                setShowWhoCanSeeModal(false);
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

      {/* ABOUT MODALS */}
      <Modal visible={showWhatsNewModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>What's New in v1.0.0</Text>
            <ScrollView style={{ maxHeight: 220, marginVertical: 10 }}>
              <Text style={{ fontSize: 13, color: '#334155', lineHeight: 20 }}>
                • Added AI Assistant Integration.{'\n\n'}• Built-in consultation scheduler.{'\n\n'}• Enhanced
                File Repository.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowWhatsNewModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showTermsModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Terms of Service</Text>
            <ScrollView style={{ maxHeight: 220, marginVertical: 10 }}>
              <Text style={{ fontSize: 13, color: '#334155', lineHeight: 20 }}>
                By using this app, you agree to submit authentic work and respect intellectual property.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowTermsModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showPrivacyModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Privacy Policy</Text>
            <ScrollView style={{ maxHeight: 220, marginVertical: 10 }}>
              <Text style={{ fontSize: 13, color: '#334155', lineHeight: 20 }}>
                Your privacy is paramount. ThesisPilot protects your personal details and cloud storage files.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowPrivacyModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showOpenSourceModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Open Source Licenses</Text>
            <ScrollView style={{ maxHeight: 220, marginVertical: 10 }}>
              <Text style={{ fontSize: 13, color: '#334155', lineHeight: 20 }}>
                • React Native Framework (MIT License) {'\n'}• Expo SDK (MIT License)
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowOpenSourceModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 4: BLOCKED USERS */}
      <Modal visible={showBlockedUsersModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
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
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowBlockedUsersModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 5: DELETE ACCOUNT */}
      <Modal visible={showDeleteAccountModal} transparent animationType="fade">
        <View style={styles.modalOverlayDarkBlur}>
          <View style={styles.deleteModalBlueCard}>
            <Text style={styles.deleteModalTitleText}>Delete Account</Text>
            <Text style={styles.deleteModalDescText}>
              This will permanently delete your account and data.
            </Text>
            <View style={styles.deleteModalActionsRow}>
              <TouchableOpacity style={styles.deleteCancelTouchBtn} onPress={() => setShowDeleteAccountModal(false)}>
                <Text style={styles.deleteCancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteContinueRedBtn} onPress={() => setShowDeleteAccountModal(false)}>
                <Text style={styles.deleteContinueBtnText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* THESIS SELECTOR MODAL */}
      <Modal visible={showThesisSelectModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Select Thesis Group</Text>
            <ScrollView style={{ maxHeight: 260, marginVertical: 10 }}>
              {thesisGroupsList.map((proj) => (
                <TouchableOpacity
                  key={proj.id}
                  style={[
                    styles.thesisSelectItem,
                    selectedThesisGroup === proj.title && styles.thesisSelectItemActive,
                  ]}
                  onPress={() => {
                    setSelectedThesisGroup(proj.title);
                    setShowThesisSelectModal(false);
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
    backgroundColor: '#1E58A8',
    flex: 1,
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
  cloudStorageCard: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  cloudCardTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  cloudCardSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  cloudCardPercent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  breakdownHeaderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 10,
  },
  breakdownBox: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  breakdownLabel: {
    fontSize: 14,
    color: '#0F172A',
    marginLeft: 12,
    flex: 1,
  },
  breakdownValue: {
    fontSize: 13,
    color: '#64748B',
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
  modalOverlayDarkBlur: {
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
  },
  actionSheetCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justify.content: 'center',
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
});