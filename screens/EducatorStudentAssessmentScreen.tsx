import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export interface StudentPeerAssessment {
  id: string;
  name: string;
  avatar: string;
  contributionSubtext: string;
  ratingLabel: 'Bad' | 'Good' | 'Fair' | 'Excellent' | 'No Work';
  ratingColor: string;
  scores: {
    contribution: number;
    quality: number;
    communication: number;
    teamwork: number;
    initiative: number;
  };
  overallScore: string;
  overallStatus: string;
}

interface ThesisGroupAssessment {
  id: string;
  title: string;
  chapter: string;
  assessments: StudentPeerAssessment[];
}

interface EducatorStudentAssessmentScreenProps {
  onBack: () => void;
  setEducatorDashView?: (view: 'dashboard' | 'chat' | 'profile') => void;
}

const SAMPLE_GROUPS_ASSESSMENTS: ThesisGroupAssessment[] = [
  {
    id: '1',
    title: "Cooper's Thesis Group",
    chapter: 'Chapter 3: Methodology',
    assessments: [
      {
        id: '1',
        name: 'Wally Bayola',
        avatar: 'https://i.pravatar.cc/100?img=12',
        contributionSubtext: 'Rate the contribution of Wally',
        ratingLabel: 'Bad',
        ratingColor: '#EF4444',
        scores: { contribution: 1, quality: 1, communication: 1, teamwork: 1, initiative: 1 },
        overallScore: '1/5',
        overallStatus: 'Needs Work',
      },
      {
        id: '2',
        name: 'Apple David',
        avatar: 'https://i.pravatar.cc/100?img=5',
        contributionSubtext: 'Rate the contribution of Apple',
        ratingLabel: 'Good',
        ratingColor: '#22C55E',
        scores: { contribution: 4, quality: 4, communication: 4, teamwork: 4, initiative: 3 },
        overallScore: '4/5',
        overallStatus: 'Good',
      },
      {
        id: '3',
        name: 'Jesse Pinkman',
        avatar: 'https://i.pravatar.cc/100?img=11',
        contributionSubtext: 'Rate the contribution of Jesse',
        ratingLabel: 'Fair',
        ratingColor: '#EAB308',
        scores: { contribution: 3, quality: 3, communication: 3, teamwork: 2, initiative: 3 },
        overallScore: '3/5',
        overallStatus: 'Fair',
      },
      {
        id: '4',
        name: 'Sheldon Lee Cooper',
        avatar: 'https://i.pravatar.cc/100?img=60',
        contributionSubtext: 'Rate yourself',
        ratingLabel: 'Excellent',
        ratingColor: '#10B981',
        scores: { contribution: 5, quality: 5, communication: 5, teamwork: 5, initiative: 5 },
        overallScore: '5/5',
        overallStatus: 'Excellent',
      },
      {
        id: '5',
        name: 'Ronald Dela Rosa',
        avatar: 'https://i.pravatar.cc/100?img=9',
        contributionSubtext: 'Rate the contribution of Bato',
        ratingLabel: 'No Work',
        ratingColor: '#64748B',
        scores: { contribution: 0, quality: 0, communication: 0, teamwork: 0, initiative: 0 },
        overallScore: '0/5',
        overallStatus: 'No Work',
      },
    ],
  },
  {
    id: '2',
    title: 'Pied Piper AI Group',
    chapter: 'Chapter 2: Literature Review',
    assessments: [
      {
        id: '6',
        name: 'Richard Hendricks',
        avatar: 'https://i.pravatar.cc/100?img=13',
        contributionSubtext: 'Rate the contribution of Richard',
        ratingLabel: 'Excellent',
        ratingColor: '#10B981',
        scores: { contribution: 5, quality: 5, communication: 5, teamwork: 5, initiative: 5 },
        overallScore: '5/5',
        overallStatus: 'Excellent',
      },
    ],
  },
  {
    id: '3',
    title: 'BioTech Health Research',
    chapter: 'Chapter 4: Data Results',
    assessments: [],
  },
  {
    id: '4',
    title: 'EcoTech Innovations',
    chapter: 'Chapter 1: Proposal',
    assessments: [],
  },
];

export default function EducatorStudentAssessmentScreen({
  onBack,
  setEducatorDashView,
}: EducatorStudentAssessmentScreenProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'profile'>('dashboard');

  const [showGroupSelectModal, setShowGroupSelectModal] = useState<boolean>(true);
  const [selectedGroup, setSelectedGroup] = useState<ThesisGroupAssessment | null>(null);

  const [sortOption, setSortOption] = useState<string>('Lowest');
  const [showSortModal, setShowSortModal] = useState<boolean>(false);
  const [selectedStudentForDetail, setSelectedStudentForDetail] = useState<StudentPeerAssessment | null>(null);

  const handleSelectGroup = (group: ThesisGroupAssessment) => {
    setSelectedGroup(group);
    setShowGroupSelectModal(false);
  };

  const handleSelectSort = (option: 'LOWEST SCORE' | 'HIGHEST SCORE' | 'RELEVANCE') => {
    if (!selectedGroup) return;
    let sortedList = [...selectedGroup.assessments];
    if (option === 'LOWEST SCORE') {
      setSortOption('Lowest');
      sortedList.sort((a, b) => a.scores.contribution - b.scores.contribution);
    } else if (option === 'HIGHEST SCORE') {
      setSortOption('Highest');
      sortedList.sort((a, b) => b.scores.contribution - a.scores.contribution);
    } else {
      setSortOption('Relevance');
    }
    setSelectedGroup({ ...selectedGroup, assessments: sortedList });
    setShowSortModal(false);
  };

  const renderStarRating = (ratingCount: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= ratingCount ? 'star' : 'star-outline'}
          size={24}
          color="#2563EB"
          style={{ marginRight: 6 }}
        />
      );
    }
    return <View style={{ flexDirection: 'row', marginTop: 4 }}>{stars}</View>;
  };

  // 4th Photo View: DETAILED STUDENT ASSESSMENT VIEW
  if (selectedStudentForDetail) {
    return (
      <View style={styles.container}>
        <View style={styles.detailHeaderBar}>
          <TouchableOpacity onPress={() => setSelectedStudentForDetail(null)}>
            <Text style={styles.detailCancelBtnText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.detailHeaderTitle}>
            Assess: {selectedStudentForDetail.name}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.whiteCardContainer}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20 }}>
            <Text style={styles.detailSubtitleText}>
              Rate your groupmate based on the criteria below.
            </Text>

            <View style={styles.criteriaBlock}>
              <Text style={styles.criteriaTitle}>Contribution to Tasks</Text>
              <Text style={styles.criteriaSub}>How well they completed assigned tasks.</Text>
              {renderStarRating(selectedStudentForDetail.scores.contribution)}
            </View>

            <View style={styles.criteriaBlock}>
              <Text style={styles.criteriaTitle}>Quality of Work</Text>
              <Text style={styles.criteriaSub}>The quality and accuracy of their work.</Text>
              {renderStarRating(selectedStudentForDetail.scores.quality)}
            </View>

            <View style={styles.criteriaBlock}>
              <Text style={styles.criteriaTitle}>Communication</Text>
              <Text style={styles.criteriaSub}>How effectively they communicated.</Text>
              {renderStarRating(selectedStudentForDetail.scores.communication)}
            </View>

            <View style={styles.criteriaBlock}>
              <Text style={styles.criteriaTitle}>Teamwork</Text>
              <Text style={styles.criteriaSub}>How well they collaborated with the group.</Text>
              {renderStarRating(selectedStudentForDetail.scores.teamwork)}
            </View>

            <View style={styles.criteriaBlock}>
              <Text style={styles.criteriaTitle}>Initiative</Text>
              <Text style={styles.criteriaSub}>Their willingness to take initiative and help.</Text>
              {renderStarRating(selectedStudentForDetail.scores.initiative)}
            </View>

            <View style={styles.overallRatingContainer}>
              <Text style={styles.overallRatingLabel}>Overall Rating</Text>
              <View style={styles.overallScoreBox}>
                <Text style={styles.overallScoreVal}>{selectedStudentForDetail.overallScore}</Text>
                <Text style={styles.overallStatusVal}>{selectedStudentForDetail.overallStatus}</Text>
              </View>
            </View>
          </ScrollView>
        </View>

        <View style={styles.bottomTabContainer}>
          <TouchableOpacity
            style={styles.tabButton}
            activeOpacity={0.7}
            onPress={() => {
              setSelectedStudentForDetail(null);
              onBack();
            }}
          >
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
      </View>
    );
  }

  // 2nd Photo View: GRADED PEERS ASSESSMENT VIEW (NO SETTINGS ICON AT UPPER RIGHT)
  return (
    <View style={styles.container}>
      <View style={styles.topHeaderBar}>
        <TouchableOpacity style={styles.headerIconTouch} onPress={() => setShowGroupSelectModal(true)}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Peers Assessment</Text>
        {/* SETTINGS ICON REMOVED AS REQUESTED */}
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.whiteCardContainer}>
        <View style={styles.sortHeaderRow}>
          <Text style={styles.overallRatingsTitle}>Overall Ratings by Average</Text>
          <TouchableOpacity style={styles.sortDropdownBtn} onPress={() => setShowSortModal(true)}>
            <Text style={styles.sortDropdownText}>Sort: {sortOption}</Text>
            <Ionicons name="chevron-down" size={16} color="#0F172A" style={{ marginLeft: 4 }} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 90 }}>
          {selectedGroup && selectedGroup.assessments.length > 0 ? (
            selectedGroup.assessments.map((student) => (
              <TouchableOpacity
                key={student.id}
                style={styles.studentAssessmentRow}
                activeOpacity={0.8}
                onPress={() => setSelectedStudentForDetail(student)}
              >
                <View style={styles.studentAvatarBox}>
                  <Ionicons name="person-circle" size={48} color="#475569" />
                </View>

                <View style={styles.studentInfoCol}>
                  <Text style={styles.studentNameText}>{student.name}</Text>
                  <Text style={styles.studentSubtext}>{student.contributionSubtext}</Text>
                </View>

                <View style={[styles.ratingPillBadge, { borderColor: student.ratingColor }]}>
                  <Text style={[styles.ratingPillText, { color: student.ratingColor }]}>
                    {student.ratingLabel}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{ alignItems: 'center', marginTop: 40 }}>
              <Text style={{ color: '#64748B' }}>No peer assessments found for this group.</Text>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.bottomTabContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
          onPress={() => {
            setActiveTab('dashboard');
            onBack();
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
            if (setEducatorDashView) setEducatorDashView('chat');
          }}
        >
          <Ionicons
            name={activeTab === 'chat' ? 'chatbox-ellipses' : 'chatbox-ellipses-outline'}
            size={24}
            color={activeTab === 'chat' ? '#1E58A8' : '#64748B'}
          />
          <Text style={[styles.tabLabelText, activeTab === 'chat' && styles.activeTabLabel]}>
            Chat
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
          onPress={() => {
            setActiveTab('profile');
            if (setEducatorDashView) setEducatorDashView('profile');
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

      {/* 1st Photo View: GROUP SELECTION MODAL */}
      <Modal visible={showGroupSelectModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.sortModalTitle}>Select Thesis Group</Text>

            <ScrollView style={{ maxHeight: 280, marginVertical: 12 }}>
              {SAMPLE_GROUPS_ASSESSMENTS.map((group) => {
                const isSelected = selectedGroup?.id === group.id;
                return (
                  <TouchableOpacity
                    key={group.id}
                    style={[styles.groupSelectItem, isSelected && styles.groupSelectActive]}
                    onPress={() => handleSelectGroup(group)}
                  >
                    <Text style={styles.groupSelectTitle}>{group.title}</Text>
                    <Text style={styles.groupSelectSub}>{group.chapter}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              style={styles.cancelOutlineBtn}
              onPress={() => {
                setShowGroupSelectModal(false);
                onBack();
              }}
            >
              <Text style={styles.cancelOutlineBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 3rd Photo View: SORT OPTIONS MODAL */}
      <Modal visible={showSortModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlayDark}
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
        >
          <View style={styles.modalWhiteCard}>
            <Text style={styles.sortModalTitle}>Sort Options</Text>
            <Text style={styles.sortModalSub}>Select sorting criteria:</Text>

            <TouchableOpacity style={styles.sortOptionBtn} onPress={() => handleSelectSort('LOWEST SCORE')}>
              <Text style={styles.sortOptionText}>LOWEST SCORE</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sortOptionBtn} onPress={() => handleSelectSort('HIGHEST SCORE')}>
              <Text style={styles.sortOptionText}>HIGHEST SCORE</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.sortOptionBtn} onPress={() => handleSelectSort('RELEVANCE')}>
              <Text style={styles.sortOptionText}>RELEVANCE</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
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
  },
  headerIconTouch: {
    padding: 4,
  },
  whiteCardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  sortHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 14,
  },
  overallRatingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  sortDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
  },
  sortDropdownText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  studentAssessmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  studentAvatarBox: {
    marginRight: 10,
  },
  studentInfoCol: {
    flex: 1,
  },
  studentNameText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
  },
  studentSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  ratingPillBadge: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
    minWidth: 90,
    alignItems: 'center',
  },
  ratingPillText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  groupSelectItem: {
    padding: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  groupSelectActive: {
    borderColor: '#1E58A8',
    backgroundColor: '#EFF6FF',
  },
  groupSelectTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  groupSelectSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
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
    padding: 24,
    elevation: 8,
  },
  sortModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  sortModalSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
    marginBottom: 16,
  },
  sortOptionBtn: {
    alignItems: 'flex-end',
    paddingVertical: 12,
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E58A8',
    letterSpacing: 0.5,
  },
  cancelOutlineBtn: {
    marginTop: 14,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  cancelOutlineBtnText: {
    color: '#475569',
    fontWeight: 'bold',
    fontSize: 14,
  },
  detailHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 52,
    paddingBottom: 16,
  },
  detailCancelBtnText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  detailHeaderTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  detailSubtitleText: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 20,
  },
  criteriaBlock: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 14,
  },
  criteriaTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
  },
  criteriaSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 4,
  },
  overallRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
  },
  overallRatingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  overallScoreBox: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
    minWidth: 120,
  },
  overallScoreVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EAB308',
  },
  overallStatusVal: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#EAB308',
    marginTop: 2,
  },
});