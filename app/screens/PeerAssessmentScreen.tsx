import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface PeerAssessmentScreenProps {
  setStudentDashView?: (view: any) => void;
  setIsMenuOpen?: (open: boolean) => void;
  onBackPress?: () => void;
}

interface AssessmentCriteria {
  tasks: number;
  quality: number;
  communication: number;
  teamwork: number;
  initiative: number;
}

interface Groupmate {
  id: string;
  name: string;
  subtext: string;
  isAssessed: boolean;
  avatarUrl: string;
  score?: number;
  statusTag?: 'Bad' | 'Good' | 'Fair' | 'Excellent' | 'No Work';
  ratings?: AssessmentCriteria;
}

export default function PeerAssessmentScreen({
  setStudentDashView,
  setIsMenuOpen,
  onBackPress,
}: PeerAssessmentScreenProps) {
  // Navigation Tabs: 'to_assess' or 'completed'
  const [activeTab, setActiveTab] = useState<'to_assess' | 'completed'>('to_assess');

  // Sorting Option State for Completed Tab
  const [sortBy, setSortBy] = useState<string>('Relevance');

  // Groupmates List
  const [groupmates, setGroupmates] = useState<Groupmate[]>([
    {
      id: 'g1',
      name: 'Wally Bayola',
      subtext: 'Rate the contribution of Wally',
      isAssessed: true,
      score: 1,
      statusTag: 'Bad',
      avatarUrl: 'https://i.pravatar.cc/150?img=11',
      ratings: { tasks: 1, quality: 1, communication: 1, teamwork: 1, initiative: 1 },
    },
    {
      id: 'g2',
      name: 'Apple David',
      subtext: 'Rate the contribution of Apple',
      isAssessed: true,
      score: 4,
      statusTag: 'Good',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      ratings: { tasks: 4, quality: 4, communication: 4, teamwork: 4, initiative: 4 },
    },
    {
      id: 'g3',
      name: 'Jesse Pinkman',
      subtext: 'Rate the contribution of Jesse',
      isAssessed: true,
      score: 3,
      statusTag: 'Fair',
      avatarUrl: 'https://i.pravatar.cc/150?img=33',
      ratings: { tasks: 3, quality: 3, communication: 3, teamwork: 3, initiative: 3 },
    },
    {
      id: 'g4',
      name: 'Sheldon Lee Cooper',
      subtext: 'Rate yourself',
      isAssessed: true,
      score: 5,
      statusTag: 'Excellent',
      avatarUrl: 'https://i.pravatar.cc/150?img=12',
      ratings: { tasks: 5, quality: 5, communication: 5, teamwork: 5, initiative: 5 },
    },
    {
      id: 'g5',
      name: 'Ronald Dela Rosa',
      subtext: 'Rate the contribution of Bato',
      isAssessed: true,
      score: 0,
      statusTag: 'No Work',
      avatarUrl: 'https://i.pravatar.cc/150?img=60',
      ratings: { tasks: 0, quality: 0, communication: 0, teamwork: 0, initiative: 0 },
    },
  ]);

  // Assessment Detailed View Modal State
  const [selectedPeer, setSelectedPeer] = useState<Groupmate | null>(null);
  const [currentCriteria, setCurrentCriteria] = useState<AssessmentCriteria>({
    tasks: 3,
    quality: 3,
    communication: 3,
    teamwork: 3,
    initiative: 3,
  });

  const handleOpenRatingModal = (peer: Groupmate) => {
    setSelectedPeer(peer);
    if (peer.ratings) {
      setCurrentCriteria(peer.ratings);
    } else {
      setCurrentCriteria({
        tasks: 3,
        quality: 3,
        communication: 3,
        teamwork: 3,
        initiative: 3,
      });
    }
  };

  const calculateOverallRating = (): {
    scoreText: string;
    labelText: string;
    statusTag: 'Bad' | 'Good' | 'Fair' | 'Excellent' | 'No Work';
  } => {
    const sum =
      currentCriteria.tasks +
      currentCriteria.quality +
      currentCriteria.communication +
      currentCriteria.teamwork +
      currentCriteria.initiative;
    const avg = Math.round(sum / 5);
    let label = 'Fair';
    let tag: 'Bad' | 'Good' | 'Fair' | 'Excellent' | 'No Work' = 'Fair';

    if (avg === 5) {
      label = 'Excellent';
      tag = 'Excellent';
    } else if (avg === 4) {
      label = 'Good';
      tag = 'Good';
    } else if (avg === 3) {
      label = 'Fair';
      tag = 'Fair';
    } else if (avg === 2 || avg === 1) {
      label = 'Needs Work';
      tag = 'Bad';
    } else {
      label = 'No Work';
      tag = 'No Work';
    }

    return { scoreText: `${avg}/5`, labelText: label, statusTag: tag };
  };

  const handleSaveAssessment = () => {
    if (!selectedPeer) return;
    const { scoreText, statusTag } = calculateOverallRating();
    const finalScoreNum = parseInt(scoreText.split('/')[0], 10);

    setGroupmates((prev) =>
      prev.map((item) =>
        item.id === selectedPeer.id
          ? {
              ...item,
              isAssessed: true,
              score: finalScoreNum,
              statusTag: statusTag,
              ratings: currentCriteria,
            }
          : item
      )
    );

    Alert.alert(
      'Assessment Submitted',
      `You have assessed ${selectedPeer.name} with an overall rating of ${scoreText}.`
    );
    setSelectedPeer(null);
  };

  // Helper for Status Badge Color rendering
  const renderStatusBadge = (tag?: 'Bad' | 'Good' | 'Fair' | 'Excellent' | 'No Work') => {
    let borderColor = '#334155';
    let textColor = '#334155';

    if (tag === 'Bad') {
      borderColor = '#EF4444';
      textColor = '#EF4444';
    } else if (tag === 'Good') {
      borderColor = '#16A34A';
      textColor = '#16A34A';
    } else if (tag === 'Fair') {
      borderColor = '#EAB308';
      textColor = '#EAB308';
    } else if (tag === 'Excellent') {
      borderColor = '#22C55E';
      textColor = '#22C55E';
    } else if (tag === 'No Work') {
      borderColor = '#475569';
      textColor = '#475569';
    }

    return (
      <View style={[styles.statusTagPill, { borderColor }]}>
        <Text style={[styles.statusTagPillText, { color: textColor }]}>
          {tag || 'Fair'}
        </Text>
      </View>
    );
  };

  const filteredGroupmates = groupmates.filter((item) =>
    activeTab === 'to_assess' ? true : item.isAssessed
  );

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
          <Text style={styles.headerTitle}>Peers Assessment</Text>
        </View>
        <View style={{ width: 28 }} />
      </View>

      {/* MAIN WHITE CARD CONTAINER */}
      <View style={styles.whiteCardContainer}>
        {/* TABS SELECTOR */}
        <View style={styles.tabsRowContainer}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'to_assess' && styles.tabBtnActive]}
            onPress={() => setActiveTab('to_assess')}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'to_assess' && styles.tabBtnTextActive,
              ]}
            >
              To Assess
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === 'completed' && styles.tabBtnActive]}
            onPress={() => setActiveTab('completed')}
          >
            <Text
              style={[
                styles.tabBtnText,
                activeTab === 'completed' && styles.tabBtnTextActive,
              ]}
            >
              Completed
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 30 }}
        >
          {activeTab === 'completed' ? (
            <View style={styles.completedHeaderRow}>
              <Text style={styles.sectionTitleHeaderNoMargin}>
                Overall Ratings by Average
              </Text>
              <TouchableOpacity
                style={styles.sortDropdownBtn}
                onPress={() =>
                  Alert.alert('Sort Options', 'Select sorting criteria:', [
                    { text: 'Relevance', onPress: () => setSortBy('Relevance') },
                    { text: 'Highest Score', onPress: () => setSortBy('Highest') },
                    { text: 'Lowest Score', onPress: () => setSortBy('Lowest') },
                    { text: 'Cancel', style: 'cancel' },
                  ])
                }
              >
                <Text style={styles.sortDropdownText}>Sort: {sortBy}</Text>
                <Ionicons name="chevron-down" size={14} color="#000000" />
              </TouchableOpacity>
            </View>
          ) : (
            <Text style={styles.sectionTitleHeader}>Evaluate your groupmates</Text>
          )}

          {/* GROUPMATES LIST */}
          <View style={styles.groupmatesListContainer}>
            {filteredGroupmates.map((peer) => (
              <TouchableOpacity
                key={peer.id}
                style={styles.peerItemRow}
                activeOpacity={0.75}
                onPress={() => handleOpenRatingModal(peer)}
              >
                <Image source={{ uri: peer.avatarUrl }} style={styles.avatarImage} />
                <View style={styles.peerInfoContainer}>
                  <Text style={styles.peerNameText}>{peer.name}</Text>
                  <Text style={styles.peerSubtext}>{peer.subtext}</Text>
                </View>

                {activeTab === 'completed' ? (
                  renderStatusBadge(peer.statusTag)
                ) : peer.isAssessed ? (
                  <Ionicons name="checkmark-circle" size={24} color="#2563EB" />
                ) : (
                  <Ionicons name="ellipse-outline" size={24} color="#CBD5E1" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          {/* ADVISER INFO BANNER */}
          {activeTab === 'to_assess' && (
            <View style={styles.infoBannerCard}>
              <View style={styles.infoIconBox}>
                <Ionicons name="information-circle" size={32} color="#2563EB" />
              </View>
              <Text style={styles.infoBannerText}>
                Advisers can use these assessments as additional basis for grades.
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      {/* DETAILED CRITERIA RATING ASSESSMENT MODAL */}
      <Modal visible={!!selectedPeer} transparent animationType="slide">
        <View style={styles.assessModalContainer}>
          <View style={styles.assessTopHeader}>
            <TouchableOpacity onPress={() => setSelectedPeer(null)}>
              <Text style={styles.cancelHeaderText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.assessHeaderTitle}>Assess: {selectedPeer?.name}</Text>
            <TouchableOpacity onPress={handleSaveAssessment}>
              <Text style={styles.submitHeaderText}>Submit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.assessWhiteCard}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            >
              <Text style={styles.assessInstructionSub}>
                Rate your groupmate based on the criteria below.
              </Text>

              {/* CRITERIA 1: CONTRIBUTION TO TASKS */}
              <View style={styles.criteriaBlock}>
                <View style={styles.criteriaTextHeaderRow}>
                  <Text style={styles.criteriaTitle}>Contribution to Tasks</Text>
                  <View style={styles.starRowInline}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() =>
                          setCurrentCriteria((prev) => ({ ...prev, tasks: star }))
                        }
                      >
                        <Ionicons
                          name={star <= currentCriteria.tasks ? 'star' : 'star-outline'}
                          size={22}
                          color="#2563EB"
                          style={{ marginLeft: 3 }}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <Text style={styles.criteriaSubtext}>
                  How well they completed assigned tasks.
                </Text>
              </View>
              <View style={styles.criteriaDivider} />

              {/* CRITERIA 2: QUALITY OF WORK */}
              <View style={styles.criteriaBlock}>
                <View style={styles.criteriaTextHeaderRow}>
                  <Text style={styles.criteriaTitle}>Quality of Work</Text>
                  <View style={styles.starRowInline}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() =>
                          setCurrentCriteria((prev) => ({ ...prev, quality: star }))
                        }
                      >
                        <Ionicons
                          name={star <= currentCriteria.quality ? 'star' : 'star-outline'}
                          size={22}
                          color="#2563EB"
                          style={{ marginLeft: 3 }}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <Text style={styles.criteriaSubtext}>
                  The quality and accuracy of their work.
                </Text>
              </View>
              <View style={styles.criteriaDivider} />

              {/* CRITERIA 3: COMMUNICATION */}
              <View style={styles.criteriaBlock}>
                <View style={styles.criteriaTextHeaderRow}>
                  <Text style={styles.criteriaTitle}>Communication</Text>
                  <View style={styles.starRowInline}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() =>
                          setCurrentCriteria((prev) => ({ ...prev, communication: star }))
                        }
                      >
                        <Ionicons
                          name={star <= currentCriteria.communication ? 'star' : 'star-outline'}
                          size={22}
                          color="#2563EB"
                          style={{ marginLeft: 3 }}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <Text style={styles.criteriaSubtext}>
                  How effectively they communicated.
                </Text>
              </View>
              <View style={styles.criteriaDivider} />

              {/* CRITERIA 4: TEAMWORK */}
              <View style={styles.criteriaBlock}>
                <View style={styles.criteriaTextHeaderRow}>
                  <Text style={styles.criteriaTitle}>Teamwork</Text>
                  <View style={styles.starRowInline}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() =>
                          setCurrentCriteria((prev) => ({ ...prev, teamwork: star }))
                        }
                      >
                        <Ionicons
                          name={star <= currentCriteria.teamwork ? 'star' : 'star-outline'}
                          size={22}
                          color="#2563EB"
                          style={{ marginLeft: 3 }}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <Text style={styles.criteriaSubtext}>
                  How well they collaborated with the group.
                </Text>
              </View>
              <View style={styles.criteriaDivider} />

              {/* CRITERIA 5: INITIATIVE */}
              <View style={styles.criteriaBlock}>
                <View style={styles.criteriaTextHeaderRow}>
                  <Text style={styles.criteriaTitle}>Initiative</Text>
                  <View style={styles.starRowInline}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <TouchableOpacity
                        key={star}
                        onPress={() =>
                          setCurrentCriteria((prev) => ({ ...prev, initiative: star }))
                        }
                      >
                        <Ionicons
                          name={star <= currentCriteria.initiative ? 'star' : 'star-outline'}
                          size={22}
                          color="#2563EB"
                          style={{ marginLeft: 3 }}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <Text style={styles.criteriaSubtext}>
                  Their willingness to take initiative and help.
                </Text>
              </View>
              <View style={styles.criteriaDivider} />

              {/* OVERALL RATING DISPLAY BOX */}
              <View style={styles.overallRatingContainer}>
                <Text style={styles.overallRatingTitle}>Overall Rating</Text>
                <View style={styles.scoreBadgeBox}>
                  <Text style={styles.scoreNumberText}>
                    {calculateOverallRating().scoreText}
                  </Text>
                  <View style={styles.badgeLineDivider} />
                  <Text style={styles.scoreLabelText}>
                    {calculateOverallRating().labelText}
                  </Text>
                </View>
              </View>
            </ScrollView>
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
  tabsRowContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  tabBtnActive: {
    backgroundColor: '#BFDBFE',
  },
  tabBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tabBtnTextActive: {
    color: '#1E58A8',
  },
  completedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitleHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginTop: 8,
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  sectionTitleHeaderNoMargin: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  sortDropdownBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#94A3B8',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    gap: 4,
  },
  sortDropdownText: {
    fontSize: 11,
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  groupmatesListContainer: {
    gap: 16,
    marginBottom: 24,
  },
  peerItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#E2E8F0',
  },
  peerInfoContainer: {
    flex: 1,
    marginLeft: 14,
  },
  peerNameText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  peerSubtext: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusTagPill: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 70,
  },
  statusTagPillText: {
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  infoBannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#BFDBFE',
    borderRadius: 12,
    padding: 16,
    marginTop: 10,
  },
  infoIconBox: {
    marginRight: 12,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  assessModalContainer: {
    flex: 1,
    backgroundColor: '#1E58A8',
  },
  assessTopHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 36 : 48,
    paddingBottom: 16,
  },
  cancelHeaderText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  assessHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  submitHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  assessWhiteCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  assessInstructionSub: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  criteriaBlock: {
    marginBottom: 12,
  },
  criteriaTextHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  criteriaTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  starRowInline: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  criteriaSubtext: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  criteriaDivider: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginVertical: 12,
  },
  overallRatingContainer: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overallRatingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  scoreBadgeBox: {
    borderWidth: 1,
    borderColor: '#94A3B8',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    width: 90,
  },
  scoreNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EAB308',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  badgeLineDivider: {
    height: 1,
    width: '100%',
    backgroundColor: '#CBD5E1',
    marginVertical: 4,
  },
  scoreLabelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#EAB308',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});