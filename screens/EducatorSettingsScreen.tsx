import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
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

interface EducatorSettingsScreenProps {
  onBack: () => void;
  onSwitchRole?: () => void;
  setEducatorDashView?: (view: 'dashboard' | 'chat' | 'profile' | 'repository') => void;
}

const SETTINGS_STORAGE_KEY = '@educator_settings_data_v1';

export default function EducatorSettingsScreen({
  onBack,
  onSwitchRole,
  setEducatorDashView,
}: EducatorSettingsScreenProps) {
  const [activeModal, setActiveModal] = useState<
    | null
    | 'personal_info'
    | 'notifications'
    | 'theme'
    | 'language'
    | 'data_storage'
    | 'manage_storage_sheet'
    | 'privacy'
    | 'terms'
  >(null);

  const [fullName, setFullName] = useState('Dr. Alex Mercer');
  const [email, setEmail] = useState('alex.mercer@university.edu');
  const [department, setDepartment] = useState('College of Computer Studies');
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [meetingNotifs, setMeetingNotifs] = useState(true);
  const [cacheSize, setCacheSize] = useState('200 MB');

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
        ...overrideObj,
      };
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(currentSettingsData));
    } catch (e) {
      console.log('Failed to save educator settings to storage:', e);
    }
  };

  const handleSavePersonalInfo = async () => {
    await saveSettingsDataToStorage({ fullName, email, department });
    Alert.alert('Saved', 'Personal information updated.');
    setActiveModal(null);
  };

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

  const handleClearCache = () => {
    setCacheSize('0 MB');
    Alert.alert('Cleared', 'App cache has been cleared successfully.');
    setActiveModal(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topHeaderBar}>
        <TouchableOpacity style={styles.headerIconTouch} onPress={onBack}>
          <Ionicons name="menu-outline" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={styles.headerIconTouch}>
          <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.whiteCardContainerGroup}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
          <Text style={styles.sectionHeaderTitle}>Account</Text>
          <View style={styles.sectionCardBox}>
            <TouchableOpacity style={styles.settingRowItem} onPress={() => setActiveModal('personal_info')}>
              <Ionicons name="person-outline" size={20} color="#0F172A" />
              <Text style={styles.settingRowLabel}>Personal Information</Text>
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

          <Text style={styles.sectionHeaderTitle}>App Preferences</Text>
          <View style={styles.sectionCardBox}>
            <TouchableOpacity style={styles.settingRowItem} onPress={() => setActiveModal('theme')}>
              <Ionicons name="color-palette-outline" size={20} color="#0F172A" />
              <Text style={styles.settingRowLabel}>Theme</Text>
              <Text style={styles.settingValueText}>Default</Text>
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

          <View style={[styles.sectionCardBox, { marginTop: 12 }]}>
            <TouchableOpacity
              style={[styles.settingRowItem, { borderBottomWidth: 0 }]}
              onPress={handleLogout}
            >
              <Ionicons name="exit-outline" size={20} color="#EF4444" />
              <Text style={[styles.settingRowLabel, { color: '#EF4444' }]}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* BOTTOM TAB BAR */}
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

      {/* MODAL 1: PERSONAL INFO */}
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

      {/* MODAL 2: NOTIFICATIONS */}
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

      {/* MODAL 3: THEME */}
      <Modal visible={activeModal === 'theme'} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Select App Theme</Text>
            <TouchableOpacity style={styles.radioOptionRow} onPress={() => setActiveModal(null)}>
              <Text style={styles.radioOptionText}>Default Mode</Text>
              <Ionicons name="radio-button-on" size={20} color="#1E58A8" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setActiveModal(null)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 4: LANGUAGE */}
      <Modal visible={activeModal === 'language'} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Language</Text>
            <Text style={{ fontSize: 13, color: '#475569', marginBottom: 12 }}>
              Currently, English is the primary supported language for ThesisPilot.
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

      {/* MODAL 5: STORAGE & DATA (MATCHING IMAGE DESIGN) */}
      <Modal visible={activeModal === 'data_storage'} transparent animationType="slide">
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
              activeOpacity={0.85}
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

            <TouchableOpacity
              style={styles.manageStorageBtn}
              activeOpacity={0.8}
              onPress={() => setActiveModal('manage_storage_sheet')}
            >
              <Text style={styles.manageStorageBtnText}>Manage Storage</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 6: MANAGE STORAGE SHEET */}
      <Modal visible={activeModal === 'manage_storage_sheet'} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modaloverlayDark}
          activeOpacity={1}
          onPress={() => setActiveModal('data_storage')}
        >
          <View style={styles.bottomSheetCard}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Manage Storage</Text>

            <TouchableOpacity
              style={styles.sheetOptionRow}
              onPress={() => {
                setActiveModal(null);
                if (setEducatorDashView) setEducatorDashView('repository');
              }}
            >
              <Ionicons name="folder-outline" size={22} color="#1E58A8" style={{ marginRight: 12 }} />
              <Text style={styles.sheetOptionText}>Open File Repository</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sheetOptionRow} onPress={handleClearCache}>
              <Ionicons name="trash-bin-outline" size={22} color="#EF4444" style={{ marginRight: 12 }} />
              <Text style={[styles.sheetOptionText, { color: '#EF4444' }]}>
                Clear Cache ({cacheSize})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.sheetCancelBtn}
              onPress={() => setActiveModal('data_storage')}
            >
              <Text style={styles.sheetCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* PRIVACY & TERMS MODALS */}
      <Modal visible={activeModal === 'privacy'} transparent animationType="slide">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Privacy Policy</Text>
            <ScrollView style={{ maxHeight: 250, marginVertical: 10 }}>
              <Text style={styles.policyBodyText}>
                ThesisPilot values your privacy. We store user credentials and thesis documents securely.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setActiveModal(null)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={activeModal === 'terms'} transparent animationType="slide">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Terms of Service</Text>
            <ScrollView style={{ maxHeight: 250, marginVertical: 10 }}>
              <Text style={styles.policyBodyText}>
                By using ThesisPilot, you agree to follow institutional guidelines regarding thesis submissions.
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
  },
  settingValueText: {
    fontSize: 12,
    color: '#64748B',
    marginRight: 6,
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
  manageStorageBtn: {
    borderWidth: 1.5,
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