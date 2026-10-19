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

interface HelpSupportScreenProps {
  onBack: () => void;
  setEducatorDashView?: (view: 'dashboard' | 'chat' | 'profile' | 'help') => void;
}

export default function HelpSupportScreen({
  onBack,
  setEducatorDashView,
}: HelpSupportScreenProps) {
  // Modal States
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Form States
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState('');

  // Expandable FAQ State
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(null);

  const faqList = [
    {
      question: 'How do I review and grade student thesis chapters?',
      answer:
        'Navigate to the Thesis Group section on your Dashboard, select the student or group, and tap on the uploaded manuscript file to open the review panel.',
    },
    {
      question: 'How do I schedule a consultation session?',
      answer:
        'Go to the Consultation Scheduler tab from your Dashboard, pick an open date slot on the calendar, set your available time, and send the invite.',
    },
    {
      question: 'Can I upload files larger than 50MB?',
      answer:
        'Yes, ThesisPilot supports cloud uploads up to 200MB per file. Make sure you have a stable internet connection during large transfers.',
    },
    {
      question: 'How do I reset or change my password?',
      answer:
        'Go to Settings > Personal Information & Security > Change Password, or reset it directly from the Profile screen sub-view.',
    },
  ];

  const handleSendContactMessage = () => {
    if (!contactSubject.trim() || !contactMessage.trim()) {
      Alert.alert('Incomplete Form', 'Please enter both a subject and your message before sending.');
      return;
    }
    Alert.alert(
      'Message Sent',
      'Thank you for contacting support! Our team will respond to your email within 24-48 hours.'
    );
    setContactSubject('');
    setContactMessage('');
    setShowContactModal(false);
  };

  const handleSubmitFeedback = () => {
    if (!feedbackText.trim()) {
      Alert.alert('Feedback Required', 'Please write a brief comment before submitting.');
      return;
    }
    Alert.alert('Feedback Received', 'Thank you for helping us improve ThesisPilot!');
    setFeedbackText('');
    setFeedbackRating(5);
    setShowFeedbackModal(false);
  };

  const handleDirectEmailSupport = () => {
    Linking.openURL('mailto:support@thesispilot.app').catch(() => {
      Alert.alert('Email Support', 'Contact us directly at support@thesispilot.app.');
    });
  };

  return (
    <View style={styles.container}>
      {/* TOP HEADER BAR */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity style={styles.headerIconTouch} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* MAIN WHITE CARD CONTAINER */}
      <View style={styles.whiteCardContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 }}
        >
          {/* SECTION 1: QUICK HELP OPTIONS */}
          <Text style={styles.sectionHeaderTitle}>QUICK ACTIONS</Text>
          <View style={styles.optionsCardGroup}>
            <TouchableOpacity
              style={styles.optionRowItem}
              activeOpacity={0.7}
              onPress={() => setShowFaqModal(true)}
            >
              <Ionicons name="help-circle-outline" size={22} color="#0F172A" style={styles.optionIcon} />
              <Text style={styles.optionLabelText}>Frequently Asked Questions</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionRowItem}
              activeOpacity={0.7}
              onPress={() => setShowGuideModal(true)}
            >
              <Ionicons name="book-outline" size={22} color="#0F172A" style={styles.optionIcon} />
              <Text style={styles.optionLabelText}>User Guide & Documentation</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionRowItem}
              activeOpacity={0.7}
              onPress={() => setShowContactModal(true)}
            >
              <Ionicons name="mail-outline" size={22} color="#0F172A" style={styles.optionIcon} />
              <Text style={styles.optionLabelText}>Contact Technical Support</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionRowItem, { borderBottomWidth: 0 }]}
              activeOpacity={0.7}
              onPress={() => setShowFeedbackModal(true)}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={22} color="#0F172A" style={styles.optionIcon} />
              <Text style={styles.optionLabelText}>Send App Feedback</Text>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* SECTION 2: DIRECT CONTACT CARDS */}
          <Text style={[styles.sectionHeaderTitle, { marginTop: 24 }]}>DIRECT CONTACT</Text>

          <TouchableOpacity
            style={styles.contactMethodCard}
            activeOpacity={0.8}
            onPress={handleDirectEmailSupport}
          >
            <View style={[styles.contactIconCircle, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="mail-unread-outline" size={24} color="#1E58A8" />
            </View>
            <View style={styles.contactCardInfo}>
              <Text style={styles.contactCardTitle}>Email Support</Text>
              <Text style={styles.contactCardSub}>support@thesispilot.app</Text>
            </View>
            <Ionicons name="open-outline" size={18} color="#64748B" />
          </TouchableOpacity>

          <View style={styles.contactMethodCard}>
            <View style={[styles.contactIconCircle, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="time-outline" size={24} color="#16A34A" />
            </View>
            <View style={styles.contactCardInfo}>
              <Text style={styles.contactCardTitle}>Support Hours</Text>
              <Text style={styles.contactCardSub}>Mon - Fri, 8:00 AM - 6:00 PM PST</Text>
            </View>
          </View>
        </ScrollView>
      </View>

      {/* MODAL 1: FREQUENTLY ASKED QUESTIONS */}
      <Modal visible={showFaqModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={[styles.modalWhiteCard, { maxHeight: '80%' }]}>
            <Text style={styles.modalHeaderTitle}>Frequently Asked Questions</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginVertical: 10 }}>
              {faqList.map((item, index) => {
                const isExpanded = expandedFaqIndex === index;
                return (
                  <View key={index} style={styles.faqAccordionBox}>
                    <TouchableOpacity
                      style={styles.faqHeaderTouch}
                      activeOpacity={0.7}
                      onPress={() => setExpandedFaqIndex(isExpanded ? null : index)}
                    >
                      <Text style={styles.faqQuestionText}>{item.question}</Text>
                      <Ionicons
                        name={isExpanded ? 'chevron-up' : 'chevron-down'}
                        size={18}
                        color="#64748B"
                      />
                    </TouchableOpacity>
                    {isExpanded && (
                      <View style={styles.faqBodyBox}>
                        <Text style={styles.faqAnswerText}>{item.answer}</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowFaqModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: USER GUIDE & DOCUMENTATION */}
      <Modal visible={showGuideModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={[styles.modalWhiteCard, { maxHeight: '80%' }]}>
            <Text style={styles.modalHeaderTitle}>User Guide & Overview</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginVertical: 10 }}>
              <Text style={styles.guideStepHeader}>1. Thesis Group Management</Text>
              <Text style={styles.guideStepBody}>
                Educators can create, assign, and track multiple student research groups from the Educator Dashboard. Select a thesis group to view manuscript submissions.
              </Text>

              <Text style={styles.guideStepHeader}>2. Consultation Scheduler</Text>
              <Text style={styles.guideStepBody}>
                Set your office availability in the Consultation tab. Students can request slots which you can confirm or reschedule with one tap.
              </Text>

              <Text style={styles.guideStepHeader}>3. File Repository & Backups</Text>
              <Text style={styles.guideStepBody}>
                Access all submitted drafts, instruments, and spreadsheets under Profile &gt; Storage & Data &gt; File Repository. All files are encrypted end-to-end.
              </Text>
            </ScrollView>
            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowGuideModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: CONTACT TECHNICAL SUPPORT FORM */}
      <Modal visible={showContactModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Contact Support</Text>

            <Text style={styles.inputLabel}>Subject</Text>
            <TextInput
              style={styles.textInputStyle}
              value={contactSubject}
              onChangeText={setContactSubject}
              placeholder="e.g., File upload error, Account issue"
              placeholderTextColor="#94A3B8"
            />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Message</Text>
            <TextInput
              style={[styles.textInputStyle, { height: 90, textAlignVertical: 'top' }]}
              value={contactMessage}
              onChangeText={setContactMessage}
              multiline
              numberOfLines={4}
              placeholder="Describe the issue you are experiencing..."
              placeholderTextColor="#94A3B8"
            />

            <TouchableOpacity style={styles.primaryBlueBtn} activeOpacity={0.85} onPress={handleSendContactMessage}>
              <Text style={styles.primaryBlueBtnText}>Submit Support Request</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowContactModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 4: SEND FEEDBACK */}
      <Modal visible={showFeedbackModal} transparent animationType="fade">
        <View style={styles.modaloverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Send Feedback</Text>
            <Text style={{ fontSize: 13, color: '#64748B', marginBottom: 12 }}>
              How is your experience with ThesisPilot?
            </Text>

            {/* STAR RATING BAR */}
            <View style={styles.starRatingRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setFeedbackRating(star)}>
                  <Ionicons
                    name={star <= feedbackRating ? 'star' : 'star-outline'}
                    size={28}
                    color="#FACC15"
                  />
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Your Comments</Text>
            <TextInput
              style={[styles.textInputStyle, { height: 80, textAlignVertical: 'top' }]}
              value={feedbackText}
              onChangeText={setFeedbackText}
              multiline
              numberOfLines={3}
              placeholder="Tell us what you like or what we can improve..."
              placeholderTextColor="#94A3B8"
            />

            <TouchableOpacity style={styles.primaryBlueBtn} activeOpacity={0.85} onPress={handleSubmitFeedback}>
              <Text style={styles.primaryBlueBtnText}>Submit Feedback</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelOutlineBtn} onPress={() => setShowFeedbackModal(false)}>
              <Text style={styles.cancelOutlineBtnText}>Cancel</Text>
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
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
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
  },
  sectionHeaderTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#64748B',
    marginBottom: 10,
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
    paddingVertical: 14,
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
  contactMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  contactIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactCardInfo: {
    flex: 1,
  },
  contactCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  contactCardSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
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
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 6,
    marginTop: 10,
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
  primaryBlueBtn: {
    backgroundColor: '#1E58A8',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
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
  faqAccordionBox: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
  },
  faqHeaderTouch: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    backgroundColor: '#F8FAFC',
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginRight: 8,
  },
  faqBodyBox: {
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  faqAnswerText: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
  },
  guideStepHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E58A8',
    marginTop: 12,
    marginBottom: 4,
  },
  guideStepBody: {
    fontSize: 13,
    color: '#334155',
    lineHeight: 18,
    marginBottom: 8,
  },
  starRatingRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginVertical: 12,
  },
});