import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

export interface ScholarResultItem {
  id: string;
  title: string;
  authors: string;
  year: string;
  source: string;
  type: 'Book' | 'Journal' | 'Website';
  isSaved: boolean;
  abstractText: string;
  apaCitation: string;
  url?: string;
  tags?: string[];
}

interface GoogleScholarScreenProps {
  setStudentDashView?: (view: any) => void;
  onBackPress?: () => void;
  initialTab?: 'Results' | 'Saved';
}

export default function GoogleScholarScreen({
  setStudentDashView,
  onBackPress,
  initialTab = 'Results',
}: GoogleScholarScreenProps) {
  const [scholarTab, setScholarTab] = useState<'Results' | 'Saved'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<ScholarResultItem | null>(null);
  const [isEditingSaved, setIsEditingSaved] = useState(false);

  // Trusted Google Scholar References List
  const [scholarResults, setScholarResults] = useState<ScholarResultItem[]>([
    {
      id: 'gs1',
      title: 'Mobile Learning System: A Systematic Literature Review',
      authors: 'John Doe',
      year: '2022',
      source: 'Journal of Education Technology',
      type: 'Journal',
      isSaved: true,
      abstractText:
        'This paper presents a systematic literature review on mobile learning systems from 2010 to 2022. The study identifies trends, challenges, and future direction for mobile learning education.',
      apaCitation:
        'Doe, J. (2022). Mobile Learning System: A Systematic Literature Review. Journal of Education Technology, 14(2), 45-58.',
      url: 'https://scholar.google.com',
      tags: ['Mobile Learning', 'Education Technology', 'Systematic Review', 'E-Learning'],
    },
    {
      id: 'gs2',
      title: 'The Impact of Mobile Application in Education',
      authors: 'Jane Smith',
      year: '2021',
      source: 'Computers & Education',
      type: 'Website',
      isSaved: true,
      abstractText:
        'An empirical investigation into mobile application integrations for modern classroom learning. Discusses usability and interactive pedagogical frameworks.',
      apaCitation:
        'Smith, J. (2021). The Impact of Mobile Application in Education. Computers & Education, 128, 80-95.',
      url: 'https://scholar.google.com',
      tags: ['Mobile Application', 'Pedagogy', 'Classroom Technology'],
    },
    {
      id: 'gs3',
      title: 'Design and Development of Mobile-Based Systems',
      authors: 'Mark Lee',
      year: '2020',
      source: 'International Journal Information',
      type: 'Book',
      isSaved: true,
      abstractText:
        'Comprehensive guide on architecture design patterns and usability evaluation methodologies for mobile educational software.',
      apaCitation:
        'Lee, M. (2020). Design and Development of Mobile-Based Systems. International Journal Information, 32(1), 112-130.',
      url: 'https://scholar.google.com',
      tags: ['Software Design', 'System Development', 'Educational Software'],
    },
    {
      id: 'gs4',
      title: 'Artificial Intelligence in Mobile Educational Tools',
      authors: 'Robert Chen & Maria Santos',
      year: '2023',
      source: 'Journal of Educational Computing',
      type: 'Journal',
      isSaved: false,
      abstractText:
        'Analyzes the integration of AI components into mobile education platforms, focusing on adaptive recommendation systems for thesis research.',
      apaCitation:
        'Chen, R., & Santos, M. (2023). Artificial Intelligence in Mobile Educational Tools. Journal of Educational Computing, 18(4), 210-225.',
      url: 'https://scholar.google.com',
      tags: ['Artificial Intelligence', 'Adaptive Learning', 'Research Tools'],
    },
  ]);

  // Toggle Bookmark state (Save / Unsave from Thesis References)
  const toggleBookmark = (id: string) => {
    setScholarResults((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextState = !item.isSaved;
          Alert.alert(
            nextState ? 'Saved to Thesis References' : 'Removed from Saved',
            nextState
              ? `"${item.title}" has been saved to your references.`
              : `"${item.title}" was removed from your saved list.`
          );
          return { ...item, isSaved: nextState };
        }
        return item;
      })
    );
  };

  // Open external Google Scholar link
  const handleVisitSource = (url?: string) => {
    const targetUrl = url || 'https://scholar.google.com';
    Linking.openURL(targetUrl).catch(() => {
      Alert.alert('Visit Source', `Opening source link: ${targetUrl}`);
    });
  };

  // Add reference to student thesis references
  const handleAddToReferences = (item: ScholarResultItem) => {
    if (!item.isSaved) {
      toggleBookmark(item.id);
    } else {
      Alert.alert(
        'Reference Added',
        `"${item.title}" is already in your saved thesis references list.`
      );
    }
  };

  // Generate and Copy APA Citation
  const handleGenerateCitation = (item: ScholarResultItem) => {
    Alert.alert(
      'Generated APA Citation',
      `${item.apaCitation}\n\nCitation copied to clipboard!`,
      [{ text: 'OK' }]
    );
  };

  // Filtered List based on search and sub-tab
  const filteredList = scholarResults.filter((item) => {
    const matchesTab =
      scholarTab === 'Results' || (scholarTab === 'Saved' && item.isSaved);
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.source.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <View style={styles.container}>
      {/* TOP HEADER BAR */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => {
            if (selectedItem) {
              setSelectedItem(null); // Back to Results/Saved list from Article Detail
            } else if (onBackPress) {
              onBackPress();
            } else if (setStudentDashView) {
              setStudentDashView('references');
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Google Scholar</Text>
        <TouchableOpacity style={styles.headerIconBtn}>
          <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* MAIN WHITE CARD CONTAINER */}
      <View style={styles.whiteCardContainer}>
        {selectedItem ? (
          /* ARTICLE DETAILED VIEW (GOOGLE SCHOLAR CLICKED SCREEN) */
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
          >
            {/* TITLE & METADATA */}
            <Text style={styles.detailTitleText}>{selectedItem.title}</Text>
            <Text style={styles.detailAuthorText}>
              {selectedItem.authors}, {selectedItem.year}
            </Text>
            <Text style={styles.detailSourceText}>{selectedItem.source}</Text>

            {/* ACTION BUTTONS */}
            <View style={styles.actionButtonContainer}>
              {/* VISIT SOURCE BUTTON */}
              <TouchableOpacity
                style={styles.actionOutlineBtn}
                activeOpacity={0.8}
                onPress={() => handleVisitSource(selectedItem.url)}
              >
                <Text style={styles.actionOutlineBtnText}>Visit Source</Text>
              </TouchableOpacity>

              {/* ADD TO REFERENCES BUTTON */}
              <TouchableOpacity
                style={styles.actionOutlineBtn}
                activeOpacity={0.8}
                onPress={() => handleAddToReferences(selectedItem)}
              >
                <MaterialCommunityIcons
                  name="file-document-outline"
                  size={20}
                  color="#1E58A8"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.actionOutlineBtnText}>Add to References</Text>
              </TouchableOpacity>

              {/* GENERATE CITATION BUTTON */}
              <TouchableOpacity
                style={styles.actionOutlineBtn}
                activeOpacity={0.8}
                onPress={() => handleGenerateCitation(selectedItem)}
              >
                <MaterialCommunityIcons
                  name="text-box-plus-outline"
                  size={20}
                  color="#1E58A8"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.actionOutlineBtnText}>Generate Citation</Text>
              </TouchableOpacity>
            </View>

            {/* ABSTRACT SECTION */}
            <Text style={styles.sectionHeaderLabel}>Abstract</Text>
            <Text style={styles.abstractContentBody}>{selectedItem.abstractText}</Text>

            {/* TAGS SECTION */}
            <Text style={[styles.sectionHeaderLabel, { marginTop: 20 }]}>Tags</Text>
            <View style={styles.tagsFlexWrapRow}>
              {(
                selectedItem.tags || [
                  'Mobile Learning',
                  'Education Technology',
                  'Systematic Review',
                  'E-Learning',
                ]
              ).map((tag, idx) => (
                <View key={idx} style={styles.tagChipBox}>
                  <Text style={styles.tagChipText}>{tag}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        ) : (
          /* LIST VIEW (RESULTS OR SAVED TABS) */
          <>
            {/* GOOGLE SCHOLAR SEARCH BAR */}
            <View style={styles.scholarSearchBar}>
              <Ionicons name="search" size={18} color="#64748B" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.scholarSearchInput}
                placeholder="Search in Google Scholar"
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <View style={styles.googleGLogoCircle}>
                <FontAwesome name="google" size={16} color="#4285F4" />
              </View>
            </View>

            {/* SUB-TABS: RESULTS vs SAVED */}
            <View style={styles.tabBarRow}>
              <TouchableOpacity
                style={[styles.tabButton, scholarTab === 'Results' && styles.tabButtonActive]}
                onPress={() => setScholarTab('Results')}
              >
                <Text
                  style={[styles.tabText, scholarTab === 'Results' && styles.tabTextActive]}
                >
                  Results
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabButton, scholarTab === 'Saved' && styles.tabButtonActive]}
                onPress={() => setScholarTab('Saved')}
              >
                <Text style={[styles.tabText, scholarTab === 'Saved' && styles.tabTextActive]}>
                  Saved
                </Text>
              </TouchableOpacity>
            </View>

            {/* MY SAVED ARTICLES HEADER (ONLY IN SAVED TAB) */}
            {scholarTab === 'Saved' && (
              <View style={styles.savedSubHeaderRow}>
                <Text style={styles.mySavedTitleText}>My Saved Articles</Text>
                <TouchableOpacity onPress={() => setIsEditingSaved(!isEditingSaved)}>
                  <Text style={styles.editTextBtn}>{isEditingSaved ? 'Done' : 'Edit'}</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* LIST OF SCHOLAR RESULTS */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 100, paddingTop: 6 }}
            >
              {filteredList.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Ionicons name="bookmark-outline" size={48} color="#CBD5E1" />
                  <Text style={styles.emptyBoxText}>
                    {scholarTab === 'Saved'
                      ? 'No saved Google Scholar references yet.'
                      : 'No Google Scholar results found.'}
                  </Text>
                </View>
              ) : (
                filteredList.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.resultCard}
                    activeOpacity={0.8}
                    onPress={() => setSelectedItem(item)}
                  >
                    <View style={styles.cardMainRow}>
                      <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={styles.cardTitleText}>{item.title}</Text>
                        <Text style={styles.cardAuthorText}>
                          {item.authors}, {item.year}
                        </Text>
                        <Text style={styles.cardSourceText}>{item.source}</Text>
                      </View>

                      {/* BOOKMARK ICON BUTTON */}
                      <TouchableOpacity
                        style={styles.bookmarkTouch}
                        onPress={() => toggleBookmark(item.id)}
                      >
                        <Ionicons
                          name={item.isSaved ? 'bookmark' : 'bookmark-outline'}
                          size={24}
                          color={item.isSaved ? '#1E58A8' : '#475569'}
                        />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E58A8',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 48,
    paddingBottom: 14,
  },
  headerIconBtn: {
    padding: 4,
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
    paddingHorizontal: 18,
    paddingTop: 16,
  },
  scholarSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 14,
  },
  scholarSearchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  googleGLogoCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  tabBarRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: '#BFDBFE',
    borderBottomColor: '#1E58A8',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tabTextActive: {
    color: '#1E58A8',
    fontWeight: 'bold',
  },
  savedSubHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
    paddingHorizontal: 2,
  },
  mySavedTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  editTextBtn: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1E58A8',
  },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  cardMainRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  cardTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  cardAuthorText: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  cardSourceText: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  bookmarkTouch: {
    padding: 4,
  },
  detailTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    lineHeight: 24,
    marginBottom: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  detailAuthorText: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  detailSourceText: {
    fontSize: 13,
    color: '#475569',
    marginBottom: 18,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  actionButtonContainer: {
    gap: 10,
    marginBottom: 20,
  },
  actionOutlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#1E58A8',
    borderRadius: 10,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  actionOutlineBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E58A8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  sectionHeaderLabel: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  abstractContentBody: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tagsFlexWrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChipBox: {
    borderWidth: 1,
    borderColor: '#94A3B8',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
  },
  tagChipText: {
    fontSize: 12,
    color: '#1E293B',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyBoxText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 8,
  },
});