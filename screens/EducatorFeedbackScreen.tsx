import React, { useState } from 'react';
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
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export interface FeedbackSubmission {
  id: string;
  studentName: string;
  date: string;
  avatar: string;
  rating: string;
  chapter: string;
  comment?: string;
  status?: 'graded' | 'pending';
}

interface EducatorFeedbackScreenProps {
  onBack: () => void;
  setEducatorDashView?: (view: 'dashboard' | 'chat' | 'profile') => void;
}

export default function EducatorFeedbackScreen({
  onBack,
  setEducatorDashView,
}: EducatorFeedbackScreenProps) {
  const [feedbackList, setFeedbackList] = useState<FeedbackSubmission[]>([
    // NEW UNGRADED / PENDING SUBMISSIONS FROM STUDENTS
    {
      id: '101',
      studentName: 'Wally Bayola',
      date: 'May 18, 2026',
      avatar: 'https://i.pravatar.cc/100?img=12',
      rating: 'Pending Review',
      chapter: 'Chapter 4 - Data Analysis & Results',
      comment: '',
      status: 'pending',
    },
    {
      id: '102',
      studentName: 'Ronald Dela Rosa',
      date: 'May 17, 2026',
      avatar: 'https://i.pravatar.cc/100?img=9',
      rating: 'Pending Review',
      chapter: 'Chapter 5 - Conclusion & Recommendations',
      comment: '',
      status: 'pending',
    },
    // PREVIOUS GRADED SUBMISSIONS
    {
      id: '1',
      studentName: 'Sheldon Lee Cooper',
      date: 'May 15, 2026',
      avatar: 'https://i.pravatar.cc/100?img=60',
      rating: '4.5/5',
      chapter: 'Chapter 2 Literature Review',
      comment: 'Comprehensive review. Keep up the good work!',
      status: 'graded',
    },
    {
      id: '2',
      studentName: 'Apple David',
      date: 'Apr 20, 2026',
      avatar: 'https://i.pravatar.cc/100?img=5',
      rating: '4.0/5',
      chapter: 'Chapter 3 - Methodology',
      comment: 'Good methodology framework.',
      status: 'graded',
    },
    {
      id: '3',
      studentName: 'Jesse Pinkman',
      date: 'May 08, 2026',
      avatar: 'https://i.pravatar.cc/100?img=11',
      rating: '2.0/5',
      chapter: 'Chapter 1 Introduction',
      comment: 'Needs significant revision on the research problem.',
      status: 'graded',
    },
  ]);

  // Edit Feedback Modal State
  const [editingFeedback, setEditingFeedback] = useState<FeedbackSubmission | null>(null);
  const [editRating, setEditRating] = useState('');
  const [editComment, setEditComment] = useState('');

  const handleOpenEdit = (item: FeedbackSubmission) => {
    setEditingFeedback(item);
    setEditRating(
      item.rating === 'Pending Review' ? '' : item.rating.replace('/5', '')
    );
    setEditComment(item.comment || '');
  };

  const handleSaveFeedback = () => {
    if (!editingFeedback) return;
    const formattedRating = editRating.trim()
      ? `${editRating.trim()}/5`
      : 'Pending Review';

    setFeedbackList(
      feedbackList.map((f) =>
        f.id === editingFeedback.id
          ? {
              ...f,
              rating: formattedRating,
              comment: editComment.trim(),
              status: editRating.trim() ? 'graded' : 'pending',
            }
          : f
      )
    );

    setEditingFeedback(null);
    Alert.alert(
      'Saved',
      'Feedback updated successfully. You can edit it again anytime.'
    );
  };

  const getRatingBgColor = (ratingStr: string) => {
    if (ratingStr === 'Pending Review') return '#FEF08A'; // Soft Yellow
    const num = parseFloat(ratingStr);
    if (isNaN(num)) return '#BBF7D0';
    if (num >= 4.0) return '#BBF7D0';
    if (num >= 3.0) return '#FEF08A';
    return '#FCA5A5'; // Soft Red
  };

  const getRatingTextColor = (ratingStr: string) => {
    if (ratingStr === 'Pending Review') return '#854D0E';
    return '#15803D';
  };

  return (
    <View style={styles.container}>
      {/* TOP BAR / HEADER */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity style={styles.headerIconTouch} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Feedback</Text>
        <TouchableOpacity style={styles.headerIconTouch}>
          <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* MAIN WHITE CARD CONTAINER */}
      <View style={styles.whiteCardContainerGroup}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 90 }}
        >
          {feedbackList.map((item) => (
            <View key={item.id} style={styles.feedbackCardItem}>
              {/* Header Info */}
              <View style={styles.feedbackCardHeader}>
                <Image source={{ uri: item.avatar }} style={styles.avatarCircleImage} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.studentNameText}>{item.studentName}</Text>
                  <Text style={styles.feedbackDateText}>{item.date}</Text>
                </View>
              </View>

              {/* Rating / Status Pill */}
              <View
                style={[
                  styles.ratingBarContainer,
                  { backgroundColor: getRatingBgColor(item.rating) },
                ]}
              >
                <Text
                  style={[
                    styles.ratingBarLabel,
                    { color: getRatingTextColor(item.rating) },
                  ]}
                >
                  {item.rating === 'Pending Review' ? 'Status' : 'Your Rating'}
                </Text>
                <Text
                  style={[
                    styles.ratingBarValue,
                    { color: getRatingTextColor(item.rating) },
                  ]}
                >
                  {item.rating}
                </Text>
              </View>

              {/* Chapter Tag */}
              <View style={styles.chapterTagContainer}>
                <Text style={styles.chapterTagText}>{item.chapter}</Text>
              </View>

              {/* Edit Button */}
              <TouchableOpacity
                style={styles.editBlueBtn}
                activeOpacity={0.7}
                onPress={() => handleOpenEdit(item)}
              >
                <Text style={styles.editBlueBtnText}>
                  {item.rating === 'Pending Review' ? 'Give Feedback' : 'Edit'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* LOWER NAVIGATOR */}
      <View style={styles.bottomTabContainer}>
        <TouchableOpacity style={styles.tabButton} activeOpacity={0.7} onPress={onBack}>
          <Ionicons name="home" size={24} color="#1E58A8" />
          <Text style={[styles.tabLabelText, styles.activeTabLabel]}>Dashboard</Text>
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
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
          onPress={() => {
            if (setEducatorDashView) setEducatorDashView('profile');
          }}
        >
          <Ionicons name="person-outline" size={24} color="#64748B" />
          <Text style={styles.tabLabelText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* EDIT / GIVE FEEDBACK MODAL */}
      <Modal visible={!!editingFeedback} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>
              {editingFeedback?.rating === 'Pending Review'
                ? 'Give Feedback'
                : 'Edit Feedback'}
            </Text>
            {editingFeedback && (
              <Text style={{ fontSize: 13, color: '#475569', marginBottom: 12 }}>
                Student:{' '}
                <Text style={{ fontWeight: 'bold' }}>{editingFeedback.studentName}</Text>{' '}
                ({editingFeedback.chapter})
              </Text>
            )}
            <Text style={styles.inputLabel}>Rating Score (e.g. 4.5 or 5.0)</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder="e.g. 4.5"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={editRating}
              onChangeText={setEditRating}
            />
            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Feedback Comment</Text>
            <TextInput
              style={[styles.textInputStyle, { height: 80, textAlignVertical: 'top' }]}
              placeholder="Write feedback comments here..."
              placeholderTextColor="#94A3B8"
              multiline
              value={editComment}
              onChangeText={setEditComment}
            />
            <TouchableOpacity style={styles.primaryBlueBtn} onPress={handleSaveFeedback}>
              <Text style={styles.primaryBlueBtnText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelOutlineBtn}
              onPress={() => setEditingFeedback(null)}
            >
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
    paddingHorizontal: 20,
  },
  feedbackCardItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    padding: 14,
    marginBottom: 16,
  },
  feedbackCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarCircleImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  studentNameText: {
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#000000',
  },
  feedbackDateText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#94A3B8',
    marginTop: 2,
  },
  ratingBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  ratingBarLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  ratingBarValue: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  chapterTagContainer: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  chapterTagText: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#000000',
  },
  editBlueBtn: {
    backgroundColor: '#BFDBFE',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  editBlueBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#1E58A8',
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