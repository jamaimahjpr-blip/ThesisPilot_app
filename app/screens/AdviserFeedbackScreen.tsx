import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AdviserFeedbackScreenProps {
  setStudentDashView: (view: any) => void;
}

export default function AdviserFeedbackScreen({
  setStudentDashView,
}: AdviserFeedbackScreenProps) {
  // Adviser Feedback States
  const [feedbackSubTab, setFeedbackSubTab] = useState<'Feedback' | 'Calendar'>('Feedback');
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyingFeedback, setReplyingFeedback] = useState<any>(null);
  const [replyTextInput, setReplyTextInput] = useState('');

  // Viewing Feedback Modal State (For Calendar View Read-Only Inspection)
  const [showViewOnlyModal, setShowViewOnlyModal] = useState(false);
  const [viewingFeedback, setViewingFeedback] = useState<any>(null);

  // Adviser Feedbacks List State
  const [adviserFeedbacks, setAdviserFeedbacks] = useState([
    {
      id: 'fb1',
      adviserName: 'Dr. Elizzette Joy Mationg',
      date: 'May 15, 2026',
      time: '10:30 AM',
      rating: '4.5/5',
      status: 'Reviewed',
      comment:
        'Great progress! The literature review is comprehensive. Please improve the synthesis of related studies.',
      chapterTag: 'Chapter 2 Literature Review',
      replies: [] as string[],
    },
    {
      id: 'fb2',
      adviserName: 'Dr. Elizzette Joy Mationg',
      date: 'May 8, 2026',
      time: '12:15 PM',
      rating: '4.0/5',
      status: 'Revisions Needed',
      comment:
        'Good start on the methodology. Consider adding more details on your data collection process.',
      chapterTag: 'Chapter 1 Introduction',
      replies: [] as string[],
    },
    {
      id: 'fb3',
      adviserName: 'Dr. Elizzette Joy Mationg',
      date: 'Apr 28, 2026',
      time: '9:00 AM',
      rating: '4.2/5',
      status: 'Reviewed',
      comment: 'Research methodology frameworks align well with the overall objective.',
      chapterTag: 'Research Methodology',
      replies: [] as string[],
    },
  ]);

  // Mock Upcoming Meetings
  const upcomingMeetings = [
    {
      id: 'm1',
      adviserName: 'Dr. Elizzette Joy Mationg',
      date: 'May 25, 2026',
      time: '12:00 PM',
      platform: 'Google Meet',
    },
  ];

  // Submit Student Reply Handler to Adviser Feedback
  const handleSendReply = () => {
    if (!replyTextInput.trim()) {
      Alert.alert('Required', 'Please enter a response.');
      return;
    }
    if (replyingFeedback) {
      setAdviserFeedbacks((prev) =>
        prev.map((fb) =>
          fb.id === replyingFeedback.id
            ? { ...fb, replies: [...fb.replies, replyTextInput.trim()] }
            : fb
        )
      );
      Alert.alert('Reply Sent', 'Your response has been sent to your adviser.');
    }
    setShowReplyModal(false);
    setReplyingFeedback(null);
    setReplyTextInput('');
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Top Sub-Tabs: Feedback vs Calendar */}
      <View style={styles.feedbackTabHeaderRow}>
        <TouchableOpacity
          style={[
            styles.feedbackTabBtn,
            feedbackSubTab === 'Feedback' && styles.feedbackTabBtnActive,
          ]}
          onPress={() => setFeedbackSubTab('Feedback')}
        >
          <Text
            style={[
              styles.feedbackTabBtnText,
              feedbackSubTab === 'Feedback' && styles.feedbackTabBtnTextActive,
            ]}
          >
            Feedback
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.feedbackTabBtn,
            feedbackSubTab === 'Calendar' && styles.feedbackTabBtnActive,
          ]}
          onPress={() => setFeedbackSubTab('Calendar')}
        >
          <Text
            style={[
              styles.feedbackTabBtnText,
              feedbackSubTab === 'Calendar' && styles.feedbackTabBtnTextActive,
            ]}
          >
            Calendar
          </Text>
        </TouchableOpacity>
      </View>

      {/* SUB-TAB 1: MAIN FEEDBACK VIEW */}
      {feedbackSubTab === 'Feedback' ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          {adviserFeedbacks.map((fb) => (
            <View key={fb.id} style={styles.feedbackCardWrapper}>
              {/* Adviser Header Info */}
              <View style={styles.fbHeaderRow}>
                <View style={styles.fbAvatarCircle}>
                  <Ionicons name="person" size={28} color="#FFFFFF" />
                </View>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.fbAdviserName}>{fb.adviserName}</Text>
                  <Text style={styles.fbDateText}>{fb.date}</Text>
                </View>
              </View>

              {/* Overall Rating Green Badge */}
              <View style={styles.fbRatingBadgeBox}>
                <Text style={styles.fbRatingLabel}>Overall Rating</Text>
                <Text style={styles.fbRatingValue}>{fb.rating}</Text>
              </View>

              {/* Adviser Comment Message */}
              <Text style={styles.fbCommentText}>{fb.comment}</Text>

              {/* Chapter Tag Box */}
              <View style={styles.fbChapterTagBox}>
                <Text style={styles.fbChapterTagText}>{fb.chapterTag}</Text>
              </View>

              {/* Student Replies Thread list */}
              {fb.replies.length > 0 && (
                <View style={styles.replyThreadBox}>
                  {fb.replies.map((rep, idx) => (
                    <View key={idx} style={styles.singleReplyItem}>
                      <Text style={styles.replyActorText}>You replied:</Text>
                      <Text style={styles.replyContentText}>{rep}</Text>
                    </View>
                  ))}
                </View>
              )}

              {/* Reply Action Button */}
              <TouchableOpacity
                style={styles.fbReplyBtn}
                activeOpacity={0.8}
                onPress={() => {
                  setReplyingFeedback(fb);
                  setShowReplyModal(true);
                }}
              >
                <Text style={styles.fbReplyBtnText}>Reply</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      ) : (
        /* SUB-TAB 2: CALENDAR VIEW (READ ONLY) */
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
        >
          {/* Recent Feedback Section */}
          <Text style={styles.sectionHeaderTitleText}>Recent Feedback</Text>
          {adviserFeedbacks.map((fb) => (
            <TouchableOpacity
              key={fb.id}
              style={styles.calFeedbackCard}
              activeOpacity={0.85}
              onPress={() => {
                setViewingFeedback(fb);
                setShowViewOnlyModal(true);
              }}
            >
              <View style={styles.fbHeaderRow}>
                <View style={styles.fbAvatarCircle}>
                  <Ionicons name="person" size={24} color="#FFFFFF" />
                </View>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.fbAdviserName}>{fb.adviserName}</Text>
                  <Text style={styles.fbDateText}>
                    {fb.date} ({fb.time})
                  </Text>
                  <Text style={styles.calChapterText}>{fb.chapterTag}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadgeBox,
                    fb.status === 'Reviewed'
                      ? styles.statusReviewedBg
                      : styles.statusRevisionBg,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusBadgeText,
                      fb.status === 'Reviewed'
                        ? styles.statusReviewedText
                        : styles.statusRevisionText,
                    ]}
                  >
                    {fb.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={{ alignSelf: 'flex-end', marginVertical: 8 }}
            onPress={() => setFeedbackSubTab('Feedback')}
          >
            <Text style={styles.viewAllFeedbackLink}>View all feedback</Text>
          </TouchableOpacity>

          {/* Upcoming Meetings Section */}
          <Text style={[styles.sectionHeaderTitleText, { marginTop: 12 }]}>
            Upcoming Meetings
          </Text>
          {upcomingMeetings.map((meet) => (
            <View key={meet.id} style={styles.calMeetingCard}>
              <View style={styles.fbHeaderRow}>
                <View style={styles.fbAvatarCircle}>
                  <Ionicons name="person" size={24} color="#FFFFFF" />
                </View>
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.fbAdviserName}>{meet.adviserName}</Text>
                  <Text style={styles.fbDateText}>
                    {meet.date} ({meet.time})
                  </Text>
                  <Text style={styles.meetingPlatformText}>{meet.platform}</Text>
                </View>
                <TouchableOpacity
                  style={styles.viewDetailsOutlineBtn}
                  onPress={() =>
                    Alert.alert(
                      'Meeting Details',
                      `Consultation with ${meet.adviserName}\nDate: ${meet.date} at ${meet.time}\nPlatform: ${meet.platform}`
                    )
                  }
                >
                  <Text style={styles.viewDetailsOutlineText}>View Details</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {/* REPLY TO ADVISER FEEDBACK MODAL (Main Feedback View) */}
      <Modal visible={showReplyModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>
              Reply to {replyingFeedback?.adviserName || 'Adviser'}
            </Text>
            <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 10 }}>
              Re: {replyingFeedback?.chapterTag}
            </Text>
            <TextInput
              style={[
                styles.modalTextInput,
                { height: 100, textAlignVertical: 'top' },
              ]}
              placeholder="Type your reply or questions regarding this feedback..."
              multiline
              value={replyTextInput}
              onChangeText={setReplyTextInput}
            />
            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={[styles.cancelOutlineBtn, { flex: 1 }]}
                onPress={() => {
                  setShowReplyModal(false);
                  setReplyingFeedback(null);
                  setReplyTextInput('');
                }}
              >
                <Text style={styles.cancelOutlineBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryBlueBtn, { flex: 1 }]}
                onPress={handleSendReply}
              >
                <Text style={styles.primaryBlueBtnText}>Send Reply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* READ-ONLY VIEW MODAL (FOR CALENDAR FEEDBACK TAPS) */}
      <Modal visible={showViewOnlyModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Feedback Details</Text>
            <Text style={{ fontSize: 14, fontWeight: 'bold', color: '#000' }}>
              {viewingFeedback?.adviserName}
            </Text>
            <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 8 }}>
              {viewingFeedback?.date} ({viewingFeedback?.chapterTag})
            </Text>
            <View
              style={{
                backgroundColor: '#F1F5F9',
                padding: 12,
                borderRadius: 8,
                marginBottom: 16,
              }}
            >
              <Text style={{ fontSize: 13, color: '#334155', lineHeight: 18 }}>
                {viewingFeedback?.comment}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.primaryBlueBtn}
              onPress={() => setShowViewOnlyModal(false)}
            >
              <Text style={styles.primaryBlueBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  feedbackTabHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    marginBottom: 14,
  },
  feedbackTabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  feedbackTabBtnActive: {
    backgroundColor: '#BFDBFE',
    borderBottomColor: '#1E58A8',
  },
  feedbackTabBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  feedbackTabBtnTextActive: {
    color: '#1E58A8',
    fontWeight: 'bold',
  },
  feedbackCardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  fbHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  fbAvatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#324338',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fbAdviserName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  fbDateText: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  fbRatingBadgeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#BBF7D0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 10,
  },
  fbRatingLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#16A34A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  fbRatingValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#16A34A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  fbCommentText: {
    fontSize: 12,
    color: '#000000',
    lineHeight: 18,
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  fbChapterTagBox: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  fbChapterTagText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  fbReplyBtn: {
    backgroundColor: '#BFDBFE',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  fbReplyBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E58A8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  replyThreadBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#1E58A8',
  },
  singleReplyItem: {
    marginBottom: 6,
  },
  replyActorText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1E58A8',
  },
  replyContentText: {
    fontSize: 12,
    color: '#334155',
    marginTop: 2,
  },
  sectionHeaderTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  calFeedbackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  calChapterText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusBadgeBox: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusReviewedBg: {
    backgroundColor: '#DCFCE7',
  },
  statusRevisionBg: {
    backgroundColor: '#FEF3C7',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusReviewedText: {
    color: '#16A34A',
  },
  statusRevisionText: {
    color: '#D97706',
  },
  viewAllFeedbackLink: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E58A8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  calMeetingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  meetingPlatformText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  viewDetailsOutlineBtn: {
    borderWidth: 1,
    borderColor: '#1E58A8',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  viewDetailsOutlineText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E58A8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  modalOverlayDark: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalWhiteCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 14,
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    marginBottom: 14,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  primaryBlueBtn: {
    flexDirection: 'row',
    backgroundColor: '#1E58A8',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBlueBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  cancelOutlineBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelOutlineBtnText: {
    color: '#475569',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
});