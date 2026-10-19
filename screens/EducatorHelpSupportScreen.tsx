import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface EducatorHelpSupportScreenProps {
  onBack?: () => void;
  onOpenDrawer?: () => void;
  onNavigateTab?: (tab: 'dashboard' | 'chat' | 'profile') => void;
}

export default function EducatorHelpSupportScreen({
  onBack,
  onOpenDrawer,
  onNavigateTab,
}: EducatorHelpSupportScreenProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'profile'>('dashboard');

  // Modal Control States for Sub-sections
  const [activeModal, setActiveModal] = useState<
    'faqs' | 'guide' | 'contact' | 'bug' | 'feedback' | null
  >(null);

  // Form Input States
  const [inputText, setInputText] = useState('');
  const [emailSubject, setEmailSubject] = useState('');

  // Handle Opening Mail Client
  const handleEmailPress = () => {
    const email = 'support@thesispilot.app';
    const url = `mailto:${email}`;
    Linking.openURL(url).catch(() => {
      Alert.alert(
        'Email Support',
        `Contact developer at: ${email}\n(Response time: 24-48 hours)`
      );
    });
  };

  // Submit Feedback / Bug / Contact Handler
  const handleSubmitAction = (typeTitle: string) => {
    if (!inputText.trim()) {
      Alert.alert('Required', 'Please enter details before sending.');
      return;
    }
    Alert.alert('Success', `Your ${typeTitle} has been submitted to the developer team!`);
    setInputText('');
    setEmailSubject('');
    setActiveModal(null);
  };

  return (
    <View style={styles.container}>
      {/* TOP HEADER BAR */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity
          style={styles.headerIconTouch}
          onPress={onOpenDrawer || onBack}
        >
          <Ionicons name="menu-outline" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <TouchableOpacity style={styles.headerIconTouch}>
          <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* MAIN WHITE CARD CONTAINER */}
      <View style={styles.whiteCardContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 20, paddingBottom: 90 }}
        >
          <Text style={styles.greetingTitleText}>We're here to help you!</Text>

          {/* MAIN HELP OPTIONS LIST */}
          <View style={styles.helpCardGroup}>
            {/* 1. FAQs */}
            <TouchableOpacity
              style={styles.helpOptionRow}
              activeOpacity={0.7}
              onPress={() => setActiveModal('faqs')}
            >
              <View style={styles.helpIconBox}>
                <Ionicons name="help-circle-outline" size={24} color="#000000" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.optionTitleText}>FAQs</Text>
                <Text style={styles.optionSubText}>Find answers to common questions</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
            <View style={styles.dividerLine} />

            {/* 2. USER GUIDE */}
            <TouchableOpacity
              style={styles.helpOptionRow}
              activeOpacity={0.7}
              onPress={() => setActiveModal('guide')}
            >
              <View style={styles.helpIconBox}>
                <Ionicons name="journal-outline" size={22} color="#000000" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.optionTitleText}>User Guide</Text>
                <Text style={styles.optionSubText}>Learn how to use ThesisPilot</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
            <View style={styles.dividerLine} />

            {/* 3. CONTACT SUPPORT */}
            <TouchableOpacity
              style={styles.helpOptionRow}
              activeOpacity={0.7}
              onPress={() => setActiveModal('contact')}
            >
              <View style={styles.helpIconBox}>
                <Ionicons name="person-outline" size={22} color="#000000" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.optionTitleText}>Contact Support</Text>
                <Text style={styles.optionSubText}>Get help from our support team</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
            <View style={styles.dividerLine} />

            {/* 4. REPORT A BUG */}
            <TouchableOpacity
              style={styles.helpOptionRow}
              activeOpacity={0.7}
              onPress={() => setActiveModal('bug')}
            >
              <View style={styles.helpIconBox}>
                <Ionicons name="notifications-outline" size={22} color="#000000" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.optionTitleText}>Report a Bug</Text>
                <Text style={styles.optionSubText}>Help us improve by reporting issues</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
            <View style={styles.dividerLine} />

            {/* 5. SEND FEEDBACK */}
            <TouchableOpacity
              style={styles.helpOptionRow}
              activeOpacity={0.7}
              onPress={() => setActiveModal('feedback')}
            >
              <View style={styles.helpIconBox}>
                <Ionicons name="chatbox-ellipses-outline" size={22} color="#000000" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.optionTitleText}>Send Feedback</Text>
                <Text style={styles.optionSubText}>Share your suggestions</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* EMAIL SUPPORT CARD */}
          <TouchableOpacity style={styles.emailCardGroup} activeOpacity={0.8} onPress={handleEmailPress}>
            <Ionicons name="mail-outline" size={28} color="#000000" style={{ marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={styles.emailCardTitle}>Email Support</Text>
              <Text style={styles.emailAddressText}>support@thesispilot.app</Text>
              <Text style={styles.emailResponseTimeText}>Response within 24-48 hours</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.versionTextCenter}>Version 1.0.0</Text>
        </ScrollView>
      </View>

      {/* EDUCATOR LOWER NAVIGATOR BAR */}
      <View style={styles.bottomTabContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
          onPress={() => {
            setActiveTab('dashboard');
            if (onNavigateTab) onNavigateTab('dashboard');
            else if (onBack) onBack();
          }}
        >
          <Ionicons
            name={activeTab === 'dashboard' ? 'home' : 'home-outline'}
            size={24}
            color={activeTab === 'dashboard' ? '#1E58A8' : '#64748B'}
          />
          <Text style={[styles.tabLabelText, activeTab === 'dashboard' && styles.activeTabLabel]}>
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
          onPress={() => {
            setActiveTab('chat');
            if (onNavigateTab) onNavigateTab('chat');
          }}
        >
          <Ionicons
            name={activeTab === 'chat' ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'}
            size={24}
            color={activeTab === 'chat' ? '#1E58A8' : '#64748B'}
          />
          <Text style={[styles.tabLabelText, activeTab === 'chat' && styles.activeTabLabel]}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
          onPress={() => {
            setActiveTab('profile');
            if (onNavigateTab) onNavigateTab('profile');
          }}
        >
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

      {/* FAQS MODAL */}
      <Modal visible={activeModal === 'faqs'} transparent animationType="slide">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Frequently Asked Questions</Text>
            <ScrollView style={{ maxHeight: 320, marginVertical: 10 }}>
              <Text style={styles.faqQuestion}>Q: What is ThesisPilot?</Text>
              <Text style={styles.faqAnswer}>
                ThesisPilot is an all-in-one thesis management and tracking system designed for students and advisers.
              </Text>
              <Text style={styles.faqQuestion}>Q: How do I submit my chapter revisions?</Text>
              <Text style={styles.faqAnswer}>
                Navigate to your active Thesis Group Workspace, open the specific chapter step, and tap "Submit File".
              </Text>
              <Text style={styles.faqQuestion}>Q: Who can view my Peer Assessments?</Text>
              <Text style={styles.faqAnswer}>
                Peer assessments are visible to your Adviser/Educator and group leader to ensure fair contribution evaluation.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeBtnOutline} onPress={() => setActiveModal(null)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* USER GUIDE MODAL */}
      <Modal visible={activeModal === 'guide'} transparent animationType="slide">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>ThesisPilot User Guide</Text>
            <ScrollView style={{ maxHeight: 320, marginVertical: 10 }}>
              <Text style={styles.guideStepTitle}>1. Dashboard</Text>
              <Text style={styles.guideStepText}>
                Check your overall thesis percentage, upcoming deadlines, and recent activity logs.
              </Text>
              <Text style={styles.guideStepTitle}>2. Consultations & Meetings</Text>
              <Text style={styles.guideStepText}>
                View scheduled adviser meetings and tap the Google Meet link directly to join.
              </Text>
              <Text style={styles.guideStepTitle}>3. Direct Chat</Text>
              <Text style={styles.guideStepText}>
                Communicate directly with your thesis group members and assigned adviser in real-time.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.closeBtnOutline} onPress={() => setActiveModal(null)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CONTACT SUPPORT MODAL */}
      <Modal visible={activeModal === 'contact'} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Contact Support</Text>
            <Text style={styles.modalSubText}>Send a direct message to our technical support team.</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="Describe your inquiry or issue..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity style={styles.primaryActionBtn} onPress={() => handleSubmitAction('Inquiry')}>
              <Text style={styles.primaryActionBtnText}>Send Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeBtnOutline} onPress={() => setActiveModal(null)}>
              <Text style={styles.closeBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* REPORT A BUG MODAL */}
      <Modal visible={activeModal === 'bug'} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Report a Bug</Text>
            <Text style={styles.modalSubText}>Did something break? Let us know so we can fix it.</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="Explain what happened and steps to reproduce..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity style={styles.primaryActionBtn} onPress={() => handleSubmitAction('Bug Report')}>
              <Text style={styles.primaryActionBtnText}>Submit Bug Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeBtnOutline} onPress={() => setActiveModal(null)}>
              <Text style={styles.closeBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* SEND FEEDBACK MODAL */}
      <Modal visible={activeModal === 'feedback'} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Send Feedback</Text>
            <Text style={styles.modalSubText}>Tell us what you love or how we can make ThesisPilot better.</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="Write your feedback or suggestions here..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={4}
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity style={styles.primaryActionBtn} onPress={() => handleSubmitAction('Feedback')}>
              <Text style={styles.primaryActionBtnText}>Send Feedback</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeBtnOutline} onPress={() => setActiveModal(null)}>
              <Text style={styles.closeBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  headerIconTouch: {
    padding: 4,
  },
  whiteCardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  greetingTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#000000',
    marginBottom: 16,
  },
  helpCardGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  helpOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  helpIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#000000',
  },
  optionSubText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#64748B',
    marginTop: 2,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  emailCardGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 16,
    marginBottom: 20,
  },
  emailCardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#000000',
  },
  emailAddressText: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#1E58A8',
    marginVertical: 2,
  },
  emailResponseTimeText: {
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#64748B',
  },
  versionTextCenter: {
    textAlign: 'center',
    fontSize: 11,
    color: '#94A3B8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 10,
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
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  activeTabLabel: {
    fontWeight: 'bold',
    color: '#1E58A8',
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
    borderRadius: 18,
    padding: 20,
    elevation: 8,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 6,
  },
  modalSubText: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  faqAnswer: {
    fontSize: 12,
    color: '#475569',
    marginTop: 3,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  guideStepTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E58A8',
    marginTop: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  guideStepText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#000000',
    textAlignVertical: 'top',
    height: 100,
    marginBottom: 14,
  },
  primaryActionBtn: {
    backgroundColor: '#1E58A8',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  primaryActionBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 14,
  },
  closeBtnOutline: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  closeBtnText: {
    color: '#475569',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 13,
  },
});