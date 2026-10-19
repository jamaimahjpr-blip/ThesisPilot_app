import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EducatorSettingsScreenProps {
  onBack: () => void;
  onSwitchRole?: () => void;
  setEducatorDashView?: (view: 'dashboard' | 'chat' | 'profile') => void;
}

// Storage Key para sa Educator Settings Data
const SETTINGS_STORAGE_KEY = '@educator_settings_data_v1';

export default function EducatorSettingsScreen({
  onBack,
  onSwitchRole,
  setEducatorDashView,
}: EducatorSettingsScreenProps) {
  // Modal Control State
  const [activeModal, setActiveModal] = useState<
    | null
    | 'personal_info'
    | 'change_password'
    | 'notifications'
    | 'theme'
    | 'language'
    | 'data_storage'
    | 'privacy'
    | 'terms'
  >(null);

  // Form States (Personal Info)
  const [fullName, setFullName] = useState('Dr. Alex Mercer');
  const [email, setEmail] = useState('alex.mercer@university.edu');
  const [department, setDepartment] = useState('College of Computer Studies');

  // Password States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Notification States
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [meetingNotifs, setMeetingNotifs] = useState(true);

  // Theme State ("DEFAULT MODE" ONLY as specified)
  const [selectedTheme, setSelectedTheme] = useState<'Default' | 'Light' | 'Dark'>('Default');

  // PERSISTENCE: LOAD SAVED PERSONAL INFO & PREFERENCES ON MOUNT
  useEffect(() => {
    loadSavedSettingsData();
  }, []);

  const loadSavedSettingsData = async () => {
    try {
      const savedDataJSON = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedDataJSON !== null) {
        const data = JSON.parse(savedDataJSON);
        if (data.fullName) setFullName(data.fullName);
        if (data.email) setEmail(data.email);
        if (data.department) setDepartment(data.department);
        if (data.pushNotifs !== undefined) setPushNotifs(data.pushNotifs);
        if (data.emailNotifs !== undefined) setEmailNotifs(data.emailNotifs);
        if (data.meetingNotifs !== undefined) setMeetingNotifs(data.meetingNotifs);
        if (data.selectedTheme) setSelectedTheme(data.selectedTheme);
      }
    } catch (e) {
      console.log('Failed to load educator settings from storage:', e);
    }
  };

  const saveSettingsDataToStorage = async (overrideObj = {}) => {
    try {
      const currentSettingsData = {
        fullName,
        email,
        department,
        pushNotifs,
        emailNotifs,
        meetingNotifs,
        selectedTheme,
        ...overrideObj,
      };
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(currentSettingsData));
    } catch (e) {
      console.log('Failed to save educator settings to storage:', e);
    }
  };

  // HANDLER: SAVE PERSONAL INFORMATION WITH PERSISTENCE
  const handleSavePersonalInfo = async () => {
    await saveSettingsDataToStorage({ fullName, email, department });
    Alert.alert('Saved', 'Personal information updated.');
    setActiveModal(null);
  };

  // Logout Handler
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out of ThesisPilot?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          if (onSwitchRole) onSwitchRole();
        },
      },
    ]);
  };

  const handleSavePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match.');
      return;
    }
    Alert.alert('Success', 'Your password has been changed successfully!');
    setActiveModal(null);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <View style={styles.container}>
      {/* TOP HEADER BAR */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity style={styles.headerIconTouch} onPress={onBack}>
          <Ionicons name="menu-outline" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={styles.headerIconTouch}>
          <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* MAIN WHITE CARD CONTAINER */}
      <View style={styles.whiteCardContainerGroup}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
          {/* SECTION 1: ACCOUNT */}
          <Text style={styles.sectionHeaderTitle}>Account</Text>
          <View style={styles.sectionCardBox}>
            <TouchableOpacity style={styles.settingRowItem} onPress={() => setActiveModal('personal_info')}>
              <Ionicons name="person-outline" size={20} color="#0F172A" />
              <Text style={styles.settingRowLabel}>Personal Information</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingRowItem} onPress={() => setActiveModal('change_password')}>
              <Ionicons name="key-outline" size={20} color="#0F172A" />
              <Text style={styles.settingRowLabel}>Change Password</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingRowItem, { borderBottomWidth: 0 }]}
              onPress={() => setActiveModal('notifications')}
            >
              <Ionicons name="notifications-outline" size={20} color="#0F172A" />
              <Text style={styles.settingRowLabel}>Notification Settings</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* SECTION 2: APP PREFERENCES */}
          <Text style={styles.sectionHeaderTitle}>App Preferences</Text>
          <View style={styles.sectionCardBox}>
            <TouchableOpacity style={styles.settingRowItem} onPress={() => setActiveModal('theme')}>
              <Ionicons name="color-palette-outline" size={20} color="#0F172A" />
              <Text style={styles.settingRowLabel}>Theme</Text>
              <Text style={styles.settingValueText}>{selectedTheme}</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingRowItem} onPress={() => setActiveModal('language')}>
              <Ionicons name="language-outline" size={20} color="#0F172A" />
              <Text style={styles.settingRowLabel}>Language</Text>
              <Text style={styles.settingValueText}>English</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingRowItem, { borderBottomWidth: 0 }]}
              onPress={() => setActiveModal('data_storage')}
            >
              <Ionicons name="server-outline" size={20} color="#0F172A" />
              <Text style={styles.settingRowLabel}>Data & Storage</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* SECTION 3: PRIVACY & SECURITY */}
          <Text style={styles.sectionHeaderTitle}>Privacy & Security</Text>
          <View style={styles.sectionCardBox}>
            <TouchableOpacity style={styles.settingRowItem} onPress={() => setActiveModal('privacy')}>
              <Ionicons name="open-outline" size={20} color="#0F172A" />
              <Text style={styles.settingRowLabel}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingRowItem, { borderBottomWidth: 0 }]}
              onPress={() => setActiveModal('terms')}
            >
              <Ionicons name="open-outline" size={20} color="#0F172A" />
              <Text style={styles.settingRowLabel}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* LOGOUT BUTTON CARD */}
          <View style={[styles.sectionCardBox, { marginTop: 12 }]}>
            <TouchableOpacity style={[styles.settingRowItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
              <Ionicons name="exit-outline" size={20} color="#EF4444" />
              <Text style={[styles.settingRowLabel, { color: '#EF4444' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* LOWER NAVIGATOR */}
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
          <Ionicons name="person" size={24} color="#1E58A8" />
          <Text style={[styles.tabLabelText, styles.activeTabLabel]}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* MODAL 1: PERSONAL INFORMATION */}
      <Modal visible={activeModal === 'personal_info'} transparent animationType="slide">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Personal Information</Text>

            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput style={styles.textInputStyle} value={fullName} onChangeText={setFullName} />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Email Address</Text>
            <TextInput
              style={styles.textInputStyle}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Department / College</Text>
            <TextInput style={styles.textInputStyle} value={department} onChangeText={setDepartment} />

            <TouchableOpacity style={styles.primaryBlueBtn} onPress={handleSavePersonalInfo}>
              <Text style={styles.primaryBlueBtnText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setActiveModal(null)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: CHANGE PASSWORD */}
      <Modal visible={activeModal === 'change_password'} transparent animationType="slide">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Change Password</Text>
            <Text style={styles.inputLabel}>Current Password</Text>
            <TextInput
              style={styles.textInputStyle}
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>New Password</Text>
            <TextInput
              style={styles.textInputStyle}
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Confirm New Password</Text>
            <TextInput
              style={styles.textInputStyle}
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity style={styles.primaryBlueBtn} onPress={handleSavePassword}>
              <Text style={styles.primaryBlueBtnText}>Update Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setActiveModal(null)}>
              <Text style={styles.cancelOutlineBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: NOTIFICATION SETTINGS */}
      <Modal visible={activeModal === 'notifications'} transparent animationType="slide">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Notification Settings</Text>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Push Notifications</Text>
              <Switch
                value={pushNotifs}
                onValueChange={(val) => {
                  setPushNotifs(val);
                  saveSettingsDataToStorage({ pushNotifs: val });
                }}
                trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                thumbColor={pushNotifs ? '#1E58A8' : '#94A3B8'}
              />
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Email Alerts</Text>
              <Switch
                value={emailNotifs}
                onValueChange={(val) => {
                  setEmailNotifs(val);
                  saveSettingsDataToStorage({ emailNotifs: val });
                }}
                trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                thumbColor={emailNotifs ? '#1E58A8' : '#94A3B8'}
              />
            </View>

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Meeting Reminders</Text>
              <Switch
                value={meetingNotifs}
                onValueChange={(val) => {
                  setMeetingNotifs(val);
                  saveSettingsDataToStorage({ meetingNotifs: val });
                }}
                trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                thumbColor={meetingNotifs ? '#1E58A8' : '#94A3B8'}
              />
            </View>

            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setActiveModal(null)}>
              <Text style={styles.cancelOutlineBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 4: THEME */}
      <Modal visible={activeModal === 'theme'} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Select App Theme</Text>
            {(['Default', 'Light', 'Dark'] as const).map((themeOption) => (
              <TouchableOpacity
                key={themeOption}
                style={styles.radioOptionRow}
                onPress={() => {
                  setSelectedTheme(themeOption);
                  saveSettingsDataToStorage({ selectedTheme: themeOption });
                  setActiveModal(null);
                }}
              >
                <Text style={styles.radioOptionText}>{themeOption} Mode</Text>
                <Ionicons
                  name={selectedTheme === themeOption ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color="#1E58A8"
                />
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setActiveModal(null)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 5: LANGUAGE */}
      <Modal visible={activeModal === 'language'} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Language</Text>
            <Text style={{ fontSize: 13, color: '#475569', marginBottom: 12 }}>
              English is currently the supported default language.
            </Text>
            <TouchableOpacity style={styles.radioOptionRow}>
              <Text style={styles.radioOptionText}>English (United States)</Text>
              <Ionicons name="checkmark-circle" size={20} color="#1E58A8" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setActiveModal(null)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 6: DATA & STORAGE */}
      <Modal visible={activeModal === 'data_storage'} transparent animationType="slide">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Data & Storage</Text>
            <View style={styles.infoRowItem}>
              <Text style={styles.infoRowLabel}>Cache Size:</Text>
              <Text style={styles.infoRowVal}>42.5 MB</Text>
            </View>
            <View style={styles.infoRowItem}>
              <Text style={styles.infoRowLabel}>Offline Documents:</Text>
              <Text style={styles.infoRowVal}>12 Files</Text>
            </View>

            <TouchableOpacity
              style={styles.primaryBlueBtn}
              onPress={() => {
                Alert.alert('Cleared', 'App cache has been cleared successfully.');
                setActiveModal(null);
              }}
            >
              <Text style={styles.primaryBlueBtnText}>Clear Cache</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setActiveModal(null)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 7: PRIVACY POLICY */}
      <Modal visible={activeModal === 'privacy'} transparent animationType="slide">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Privacy Policy</Text>
            <ScrollView style={{ maxHeight: 250, marginVertical: 10 }}>
              <Text style={styles.policyBodyText}>
                ThesisPilot values your privacy. We store user credentials and thesis documents securely. All student
                evaluations, peer assessments, and uploaded files are encrypted and only accessible to authorized advisers,
                panelists, and group members.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setActiveModal(null)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 8: TERMS OF SERVICE */}
      <Modal visible={activeModal === 'terms'} transparent animationType="slide">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Terms of Service</Text>
            <ScrollView style={{ maxHeight: 250, marginVertical: 10 }}>
              <Text style={styles.policyBodyText}>
                By using ThesisPilot, you agree to follow institutional guidelines regarding thesis submissions, peer reviews,
                and academic honesty. Unauthorized sharing of research documents is strictly prohibited.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setActiveModal(null)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
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
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 52,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 12,
  },
  headerIconTouch: {
    padding: 4,
  },
  whiteCardContainerGroup: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  sectionHeaderTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 10,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  sectionCardBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  settingRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingRowLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
    marginLeft: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  settingValueText: {
    fontSize: 12,
    color: '#64748B',
    marginRight: 6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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
    borderRadius: 18,
    padding: 20,
    elevation: 8,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 6,
  },
  textInputStyle: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000000',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
  },
  radioOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  radioOptionText: {
    fontSize: 14,
    color: '#0F172A',
  },
  infoRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  infoRowLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  infoRowVal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  policyBodyText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 20,
  },
  primaryBlueBtn: {
    backgroundColor: '#1E58A8',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 18,
  },
  primaryBlueBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
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
});