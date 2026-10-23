import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import {
  Alert,
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
  const [activeModal, setActiveModal] = useState<
    | 'personal'
    | 'notifications'
    | 'theme'
    | 'language'
    | 'storage'
    | 'manage_storage_sheet'
    | 'privacy'
    | 'terms'
    | 'logout'
    | null
  >(null);

  const [userInfo, setUserInfo] = useState({
    name: 'Sheldon Lee Cooper',
    email: 'cooper.sheldon@university.edu.ph',
    studentId: '2023-10492',
    program: 'BS Computer Science',
  });

  const [notifConfig, setNotifConfig] = useState({
    push: true,
    email: true,
    taskReminders: true,
    consultationAlerts: true,
  });

  const [cacheSize, setCacheSize] = useState('200 MB');

  const handleSavePersonalInfo = () => {
    Alert.alert('Success', 'Personal information updated successfully.');
    setActiveModal(null);
  };

  const handleClearCache = () => {
    setCacheSize('0 MB');
    Alert.alert('Done', 'App cache has been cleared.');
    setActiveModal(null);
  };

  return (
    <View style={styles.container}>
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

      <View style={styles.whiteCardContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 18,
            paddingBottom: 40,
          }}
        >
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
              onPress={() => setActiveModal('notifications')}
            >
              <Ionicons name="notifications-outline" size={22} color="#0F172A" />
              <Text style={styles.settingItemLabel}>Notification Settings</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionHeaderTitle}>App Preferences</Text>
          <View style={styles.settingsGroupCard}>
            <TouchableOpacity
              style={styles.settingItemRow}
              activeOpacity={0.7}
              onPress={() => setActiveModal('theme')}
            >
              <Ionicons name="color-palette-outline" size={22} color="#0F172A" />
              <Text style={styles.settingItemLabel}>Theme</Text>
              <Text style={styles.settingValueText}>Default</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <View style={styles.itemDivider} />

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

      {/* PERSONAL INFO MODAL */}
      <Modal visible={activeModal === 'personal'} transparent animationType="fade">
        <View style={styles.modaloverlay}>
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
              <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setActiveModal(null)}>
                <Text style={styles.cancelOutlineBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryBlueBtn} onPress={handleSavePersonalInfo}>
                <Text style={styles.primaryBlueBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* NOTIFICATIONS MODAL */}
      <Modal visible={activeModal === 'notifications'} transparent animationType="fade">
        <View style={styles.modaloverlay}>
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
                onValueChange={(val) => setNotifConfig({ ...notifConfig, taskReminders: val })}
                trackColor={{ false: '#CBD5E1', true: '#BFDBFE' }}
                thumbColor={notifConfig.taskReminders ? '#1E58A8' : '#F1F5F9'}
              />
            </View>
            <View style={styles.modalActionRow}>
              <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setActiveModal(null)}>
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

      {/* THEME MODAL (DEFAULT MODE ONLY) */}
      <Modal visible={activeModal === 'theme'} transparent animationType="fade">
        <View style={styles.modaloverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeaderTitle}>Select App Theme</Text>
            <TouchableOpacity style={styles.switchRow} onPress={() => setActiveModal(null)}>
              <Text style={styles.switchLabel}>Default Mode</Text>
              <Ionicons name="radio-button-on" size={20} color="#1E58A8" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.closeFullWidthBtn} onPress={() => setActiveModal(null)}>
              <Text style={styles.closeFullWidthBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* LANGUAGE MODAL */}
      <Modal visible={activeModal === 'language'} transparent animationType="fade">
        <View style={styles.modaloverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeaderTitle}>Language</Text>
            <Text style={styles.modalBodyText}>
              Currently, English is the primary supported language for ThesisPilot.
            </Text>
            <TouchableOpacity style={styles.closeFullWidthBtn} onPress={() => setActiveModal(null)}>
              <Text style={styles.closeFullWidthBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* DATA & STORAGE MODAL (3rd PHOTO) */}
      <Modal visible={activeModal === 'storage'} transparent animationType="slide">
        <View style={styles.storageModalContainer}>
          <View style={styles.storageHeaderBar}>
            <TouchableOpacity onPress={() => setActiveModal(null)}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.storageHeaderTitle}>Storage & Data</Text>
            <View style={{ width: 24 }} />
          </View>

          <View style={styles.storageWhiteCardContainer}>
            <TouchableOpacity
              style={styles.cloudStorageCard}
              onPress={() => setActiveModal('manage_storage_sheet')}
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

            <Text style={styles.breakdownHeaderTitle}>Storage Breakdown</Text>
            <View style={styles.breakdownBox}>
              <View style={styles.breakdownRow}>
                <Ionicons name="document-outline" size={20} color="#0F172A" />
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
                <Ionicons name="folder-outline" size={20} color="#0F172A" />
                <Text style={styles.breakdownLabel}>Other Data</Text>
                <Text style={styles.breakdownValue}>200 MB</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.manageStorageBtn}
              onPress={() => setActiveModal('manage_storage_sheet')}
            >
              <Text style={styles.manageStorageBtnText}>Manage Storage</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MANAGE STORAGE BOTTOM SHEET MODAL (8th PHOTO) */}
      <Modal visible={activeModal === 'manage_storage_sheet'} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modaloverlay}
          activeOpacity={1}
          onPress={() => setActiveModal('storage')}
        >
          <View style={styles.bottomSheetCard}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Manage Storage</Text>

            <TouchableOpacity
              style={styles.sheetOptionRow}
              onPress={() => {
                setActiveModal(null);
                if (setStudentDashView) setStudentDashView('files');
              }}
            >
              <Ionicons name="folder-outline" size={22} color="#1E58A8" style={{ marginRight: 12 }} />
              <Text style={styles.sheetOptionText}>Open File Repository</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetOptionRow} onPress={handleClearCache}>
              <Ionicons name="trash-bin-outline" size={22} color="#EF4444" style={{ marginRight: 12 }} />
              <Text style={[styles.sheetOptionText, { color: '#EF4444' }]}>Clear Cache ({cacheSize})</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetCancelBtn}
              onPress={() => setActiveModal('storage')}
            >
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* PRIVACY & TERMS */}
      <Modal visible={activeModal === 'privacy'} transparent animationType="fade">
        <View style={styles.modaloverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeaderTitle}>Privacy Policy</Text>
            <ScrollView style={{ maxHeight: 250, marginBottom: 12 }}>
              <Text style={styles.legalBodyText}>
                ThesisPilot values your privacy. Your research notes, document drafts, and group assessments are stored securely.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeFullWidthBtn} onPress={() => setActiveModal(null)}>
              <Text style={styles.closeFullWidthBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={activeModal === 'terms'} transparent animationType="fade">
        <View style={styles.modaloverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalHeaderTitle}>Terms of Service</Text>
            <ScrollView style={{ maxHeight: 250, marginBottom: 12 }}>
              <Text style={styles.legalBodyText}>
                By using ThesisPilot, you agree to academic integrity standards.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeFullWidthBtn} onPress={() => setActiveModal(null)}>
              <Text style={styles.closeFullWidthBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* LOGOUT CONFIRMATION */}
      <Modal visible={activeModal === 'logout'} transparent animationType="fade">
        <View style={styles.modaloverlay}>
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
  modaloverlay: {
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
  storageModalContainer: {
    flex: 1,
    backgroundColor: '#1E58A8',
  },
  storageHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 52,
    paddingBottom: 16,
  },
  storageHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  storageWhiteCardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  cloudStorageCard: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
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
  manageStorageBtn: {
    borderWidth: 1,
    borderColor: '#1E58A8',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  manageStorageBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E58A8',
  },
  bottomSheetCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#CBD5E1',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 20,
  },
  sheetOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sheetOptionText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  sheetCancelBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  sheetCancelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
  },
});