import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Modal,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface SettingsScreenProps {
  setStudentDashView?: (view: any) => void;
  setIsMenuOpen?: (open: boolean) => void;
  onBackPress?: () => void;
  onLogout?: () => void;
}

export default function SettingsScreen({
  setStudentDashView,
  setIsMenuOpen,
  onBackPress,
  onLogout,
}: SettingsScreenProps) {
  // Modal States
  const [activeModal, setActiveModal] = useState<
    | 'personal'
    | 'password'
    | 'notifications'
    | 'language'
    | 'storage'
    | 'privacy'
    | 'terms'
    | 'logout'
    | null
  >(null);

  // User Profile State
  const [userInfo, setUserInfo] = useState({
    name: 'Sheldon Lee Cooper',
    email: 'cooper.sheldon@university.edu.ph',
    studentId: '2023-10492',
    program: 'BS Computer Science',
  });

  // Password State
  const [passwords, setPasswords] = useState({
    current: '',
    newPass: '',
    confirmPass: '',
  });

  // Notification Toggles State
  const [notifConfig, setNotifConfig] = useState({
    push: true,
    email: true,
    taskReminders: true,
    consultationAlerts: true,
  });

  // Cache Storage State
  const [cacheSize, setCacheSize] = useState('24.8 MB');

  // Handlers
  const handleSavePersonalInfo = () => {
    Alert.alert('Success', 'Personal information updated successfully.');
    setActiveModal(null);
  };

  const handleChangePasswordSubmit = () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirmPass) {
      Alert.alert('Error', 'Please fill in all password fields.');
      return;
    }
    if (passwords.newPass !== passwords.confirmPass) {
      Alert.alert('Error', 'New password and confirm password do not match.');
      return;
    }
    Alert.alert('Success', 'Your password has been changed successfully.');
    setPasswords({ current: '', newPass: '', confirmPass: '' });
    setActiveModal(null);
  };

  const handleClearCache = () => {
    Alert.alert('Clear Cache', 'Are you sure you want to clear cached data?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          setCacheSize('0.0 MB');
          Alert.alert('Done', 'App cache has been cleared.');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* TOP HEADER BAR */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => {
            if (setIsMenuOpen) {
              setIsMenuOpen(true);
            } else if (onBackPress) {
              onBackPress();
            }
          }}
        >
          <Ionicons name="menu-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      {/* MAIN WHITE CARD CONTAINER */}
      <View style={styles.whiteCardContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 18,
            paddingBottom: 40,
          }}
        >
          {/* SECTION 1: ACCOUNT */}
          <Text style={styles.sectionHeaderTitle}>Account</Text>
          <View style={styles.settingsGroupCard}>
            <TouchableOpacity
              style={styles.settingItemRow}
              activeOpacity={0.7}
              onPress={() => setActiveModal('personal')}
            >
              <Ionicons name="person-outline" size={22} color="#0F172A" />
              <Text style={styles.settingItemLabel}>Personal Information</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
            <View style={styles.itemDivider} />
            <TouchableOpacity
              style={styles.settingItemRow}
              activeOpacity={0.7}
              onPress={() => setActiveModal('password')}
            >
              <Ionicons name="key-outline" size={22} color="#0F172A" />
              <Text style={styles.settingItemLabel}>Change Password</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
            <View style={styles.itemDivider} />
            <TouchableOpacity
              style={styles.settingItemRow}
              activeOpacity={0.7}
              onPress={() => setActiveModal('notifications')}
            >
              <Ionicons name="notifications-outline" size={22} color="#0F172A" />
              <Text style={styles.settingItemLabel}>Notification Settings</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* SECTION 2: APP PREFERENCES */}
          <Text style={styles.sectionHeaderTitle}>App Preferences</Text>
          <View style={styles.settingsGroupCard}>
            <TouchableOpacity
              style={styles.settingItemRow}
              activeOpacity={0.7}
              onPress={() => setActiveModal('language')}
            >
              <Ionicons name="language-outline" size={22} color="#0F172A" />
              <Text style={styles.settingItemLabel}>Language</Text>
              <Text style={styles.settingValueText}>English</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
            <View style={styles.itemDivider} />
            <TouchableOpacity
              style={styles.settingItemRow}
              activeOpacity={0.7}
              onPress={() => setActiveModal('storage')}
            >
              <Ionicons name="server-outline" size={22} color="#0F172A" />
              <Text style={styles.settingItemLabel}>Data & Storage</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* SECTION 3: PRIVACY & SECURITY */}
          <Text style={styles.sectionHeaderTitle}>Privacy & Security</Text>
          <View style={styles.settingsGroupCard}>
            <TouchableOpacity
              style={styles.settingItemRow}
              activeOpacity={0.7}
              onPress={() => setActiveModal('privacy')}
            >
              <Ionicons name="open-outline" size={22} color="#0F172A" />
              <Text style={styles.settingItemLabel}>Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
            <View style={styles.itemDivider} />
            <TouchableOpacity
              style={styles.settingItemRow}
              activeOpacity={0.7}
              onPress={() => setActiveModal('terms')}
            >
              <Ionicons name="open-outline" size={22} color="#0F172A" />
              <Text style={styles.settingItemLabel}>Terms of Service</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* LOGOUT BUTTON CARD */}
          <TouchableOpacity
            style={styles.logoutCardBtn}
            activeOpacity={0.8}
            onPress={() => setActiveModal('logout')}
          >
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            <Text style={styles.logoutBtnText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* MODAL 1: PERSONAL INFORMATION */}
      <Modal visible={activeModal === 'personal'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeaderTitle}>Personal Information</Text>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.textInput}
              value={userInfo.name}
              onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
            />
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.textInput}
              value={userInfo.email}
              keyboardType="email-address"
              onChangeText={(text) => setUserInfo({ ...userInfo, email: text })}
            />
            <Text style={styles.inputLabel}>Student ID Number</Text>
            <TextInput
              style={styles.textInput}
              value={userInfo.studentId}
              onChangeText={(text) => setUserInfo({ ...userInfo, studentId: text })}
            />
            <Text style={styles.inputLabel}>Program / Course</Text>
            <TextInput
              style={styles.textInput}
              value={userInfo.program}
              onChangeText={(text) => setUserInfo({ ...userInfo, program: text })}
            />
            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.cancelOutlineBtn}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.cancelOutlineBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryBlueBtn}
                onPress={handleSavePersonalInfo}
              >
                <Text style={styles.primaryBlueBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: CHANGE PASSWORD */}
      <Modal visible={activeModal === 'password'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeaderTitle}>Change Password</Text>
            <Text style={styles.inputLabel}>Current Password</Text>
            <TextInput
              style={styles.textInput}
              secureTextEntry
              placeholder="Enter current password"
              value={passwords.current}
              onChangeText={(text) => setPasswords({ ...passwords, current: text })}
            />
            <Text style={styles.inputLabel}>New Password</Text>
            <TextInput
              style={styles.textInput}
              secureTextEntry
              placeholder="Enter new password"
              value={passwords.newPass}
              onChangeText={(text) => setPasswords({ ...passwords, newPass: text })}
            />
            <Text style={styles.inputLabel}>Confirm New Password</Text>
            <TextInput
              style={styles.textInput}
              secureTextEntry
              placeholder="Confirm new password"
              value={passwords.confirmPass}
              onChangeText={(text) => setPasswords({ ...passwords, confirmPass: text })}
            />
            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.cancelOutlineBtn}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.cancelOutlineBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryBlueBtn}
                onPress={handleChangePasswordSubmit}
              >
                <Text style={styles.primaryBlueBtnText}>Update Password</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: NOTIFICATION SETTINGS */}
      <Modal visible={activeModal === 'notifications'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeaderTitle}>Notification Settings</Text>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Push Notifications</Text>
              <Switch
                value={notifConfig.push}
                onValueChange={(val) => setNotifConfig({ ...notifConfig, push: val })}
                trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                thumbColor={notifConfig.push ? '#1E58A8' : '#F1F5F9'}
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Email Alerts</Text>
              <Switch
                value={notifConfig.email}
                onValueChange={(val) => setNotifConfig({ ...notifConfig, email: val })}
                trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                thumbColor={notifConfig.email ? '#1E58A8' : '#F1F5F9'}
              />
            </View>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Task Reminders</Text>
              <Switch
                value={notifConfig.taskReminders}
                onValueChange={(val) =>
                  setNotifConfig({ ...notifConfig, taskReminders: val })
                }
                trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                thumbColor={notifConfig.taskReminders ? '#1E58A8' : '#F1F5F9'}
              />
            </View>
            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.cancelOutlineBtn}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.cancelOutlineBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.primaryBlueBtn}
                onPress={() => {
                  Alert.alert('Saved', 'Notification preferences updated.');
                  setActiveModal(null);
                }}
              >
                <Text style={styles.primaryBlueBtnText}>Save Preferences</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* MODAL 4: LANGUAGE */}
      <Modal visible={activeModal === 'language'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeaderTitle}>Language</Text>
            <Text style={styles.modalBodyText}>
              Currently, English is the primary supported language for ThesisPilot.
            </Text>
            <TouchableOpacity
              style={styles.closeFullWidthBtn}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.closeFullWidthBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 5: DATA & STORAGE */}
      <Modal visible={activeModal === 'storage'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeaderTitle}>Data & Storage</Text>
            <View style={styles.storageInfoRow}>
              <Text style={styles.storageInfoLabel}>Temporary Cache Size:</Text>
              <Text style={styles.storageInfoVal}>{cacheSize}</Text>
            </View>
            <TouchableOpacity style={styles.clearCacheBtn} onPress={handleClearCache}>
              <Ionicons name="trash-outline" size={18} color="#EF4444" style={{ marginRight: 6 }} />
              <Text style={styles.clearCacheBtnText}>Clear Cache</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeFullWidthBtn}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.closeFullWidthBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 6: PRIVACY POLICY */}
      <Modal visible={activeModal === 'privacy'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeaderTitle}>Privacy Policy</Text>
            <ScrollView style={{ maxHeight: 250, marginBottom: 12 }}>
              <Text style={styles.legalBodyText}>
                ThesisPilot values your privacy. Your research notes, document drafts, and group assessments are stored securely. We do not share your personal academic data with unauthorized third parties.
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeFullWidthBtn}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.closeFullWidthBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 7: TERMS OF SERVICE */}
      <Modal visible={activeModal === 'terms'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeaderTitle}>Terms of Service</Text>
            <ScrollView style={{ maxHeight: 250, marginBottom: 12 }}>
              <Text style={styles.legalBodyText}>
                By using ThesisPilot, you agree to academic integrity standards. All group assessments and submission progress logged in this platform must accurately reflect authentic student contributions.
              </Text>
            </ScrollView>
            <TouchableOpacity
              style={styles.closeFullWidthBtn}
              onPress={() => setActiveModal(null)}
            >
              <Text style={styles.closeFullWidthBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 8: LOGOUT CONFIRMATION */}
      <Modal visible={activeModal === 'logout'} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.logoutBlueCard}>
            <Text style={styles.logoutModalTitle}>Log Out</Text>
            <Text style={styles.logoutModalSubText}>Are you sure you want to logout?</Text>
            <View style={styles.logoutModalActionRow}>
              <TouchableOpacity
                style={styles.logoutCancelTextBtn}
                onPress={() => setActiveModal(null)}
              >
                <Text style={styles.logoutCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutConfirmRedBtn}
                onPress={() => {
                  setActiveModal(null);
                  if (onLogout) onLogout();
                }}
              >
                <Text style={styles.logoutConfirmText}>Log Out</Text>
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 48,
    paddingBottom: 16,
  },
  headerIconBtn: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  whiteCardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  sectionHeaderTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 14,
    marginBottom: 8,
  },
  settingsGroupCard: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    marginBottom: 10,
  },
  settingItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  settingItemLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginLeft: 12,
  },
  settingValueText: {
    fontSize: 12,
    color: '#64748B',
    marginRight: 6,
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#CBD5E1',
  },
  logoutCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 10,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#EF4444',
    marginLeft: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
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
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 12,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  primaryBlueBtn: {
    flex: 1,
    backgroundColor: '#1E58A8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryBlueBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  cancelOutlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#1E58A8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelOutlineBtnText: {
    color: '#475569',
    fontWeight: 'bold',
    fontSize: 13,
  },
  closeFullWidthBtn: {
    width: '100%',
    backgroundColor: '#1E58A8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 14,
  },
  closeFullWidthBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 13,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  switchLabel: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  modalBodyText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  storageInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  storageInfoLabel: {
    fontSize: 13,
    color: '#475569',
  },
  storageInfoVal: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  clearCacheBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    paddingVertical: 10,
    borderRadius: 8,
  },
  clearCacheBtnText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 13,
  },
  legalBodyText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
  logoutBlueCard: {
    width: '85%',
    backgroundColor: '#1E58A8',
    borderRadius: 12,
    padding: 20,
    elevation: 8,
  },
  logoutModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  logoutModalSubText: {
    fontSize: 13,
    color: '#E0F2FE',
    marginBottom: 20,
  },
  logoutModalActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16,
  },
  logoutCancelTextBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  logoutCancelText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  logoutConfirmRedBtn: {
    backgroundColor: '#EF4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutConfirmText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});