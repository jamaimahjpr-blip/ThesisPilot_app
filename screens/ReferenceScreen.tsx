import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface ReferenceItem {
  id: string;
  type: 'Journal' | 'Book' | 'Website';
  title: string;
  authors: string;
  publication: string;
  format: string; // APA
  source: string; // Google Scholar
}

interface ReferenceScreenProps {
  setStudentDashView?: (view: any) => void;
  initialTab?: 'All' | 'Book' | 'Journal' | 'Website';
  showSearchExternal?: boolean;
  setShowSearchExternal?: (val: boolean) => void;
  showAddExternal?: boolean;
  setShowAddExternal?: (val: boolean) => void;
}

export default function ReferenceScreen({
  setStudentDashView,
  initialTab = 'Website',
  showSearchExternal,
  setShowSearchExternal,
  showAddExternal,
  setShowAddExternal,
}: ReferenceScreenProps) {
  // Sub-Tab Filter State
  const [activeTab, setActiveTab] = useState<'All' | 'Book' | 'Journal' | 'Website'>(initialTab);

  // Search Toggle State & Query
  const [internalSearchBar, setInternalSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add Reference Modal State
  const [internalAddModal, setInternalAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAuthors, setNewAuthors] = useState('');
  const [newPublication, setNewPublication] = useState('');
  const [newType, setNewType] = useState<'Journal' | 'Book' | 'Website'>('Website');

  // Sync external header trigger props with internal modal states
  const isSearchActive = showSearchExternal !== undefined ? showSearchExternal : internalSearchBar;
  const isAddModalActive = showAddExternal !== undefined ? showAddExternal : internalAddModal;

  const closeSearch = () => {
    if (setShowSearchExternal) setShowSearchExternal(false);
    else setInternalSearchBar(false);
  };

  const closeAddModal = () => {
    if (setShowAddExternal) setShowAddExternal(false);
    else setInternalAddModal(false);
  };

  // Google Scholar Academic & Trusted References List
  const [referencesList, setReferencesList] = useState<ReferenceItem[]>([
    {
      id: 'ref1',
      type: 'Journal',
      title: 'The Impact of Artificial Intelligence on Education',
      authors: 'Johnson, R., & Smith, T.',
      publication: 'Journal of Educational Technology, 45(2), 123-145.',
      format: 'APA',
      source: 'Google Scholar',
    },
    {
      id: 'ref2',
      type: 'Book',
      title: 'AI in Higher Education: A Systematic Review',
      authors: 'Brown, A.',
      publication: 'International Journal of Learning Technology, 15(3), 200-215.',
      format: 'APA',
      source: 'Google Scholar',
    },
    {
      id: 'ref3',
      type: 'Website',
      title: 'Mobile Learning and Student Performance',
      authors: 'Williams, K., et al.',
      publication: 'Computers & Education, 128, 80-95.',
      format: 'APA',
      source: 'Google Scholar',
    },
    {
      id: 'ref4',
      type: 'Journal',
      title: 'Adaptive Learning Technologies in Modern Classrooms',
      authors: 'Davis, M., & Garcia, I.',
      publication: 'Educational Psychology Review, 32(1), 45-67.',
      format: 'APA',
      source: 'Google Scholar',
    },
    {
      id: 'ref5',
      type: 'Book',
      title: 'Foundations of Educational Research & Statistics',
      authors: 'Miller, P.',
      publication: 'Academic Press, 4th Edition, 112-190.',
      format: 'APA',
      source: 'Google Scholar',
    },
    {
      id: 'ref6',
      type: 'Website',
      title: 'Digital Literacies in Higher Education Frameworks',
      authors: 'Taylor, E., & Anderson, C.',
      publication: 'Higher Education Research & Development, 39(4), 310-328.',
      format: 'APA',
      source: 'Google Scholar',
    },
  ]);

  // Tab Counts
  const totalCount = referencesList.length;
  const bookCount = referencesList.filter((r) => r.type === 'Book').length;
  const journalCount = referencesList.filter((r) => r.type === 'Journal').length;
  const websiteCount = referencesList.filter((r) => r.type === 'Website').length;

  // Filter Items
  const filteredReferences = referencesList.filter((ref) => {
    const matchesTab = activeTab === 'All' || ref.type === activeTab;
    const matchesSearch =
      ref.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.authors.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ref.publication.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Handle Adding Google Scholar Reference
  const handleAddReference = () => {
    if (!newTitle.trim() || !newAuthors.trim()) {
      Alert.alert('Required Fields', 'Please enter title and author(s).');
      return;
    }

    const newRefObj: ReferenceItem = {
      id: `ref-${Date.now()}`,
      type: newType,
      title: newTitle.trim(),
      authors: newAuthors.trim(),
      publication: newPublication.trim() || 'Google Scholar Indexed Website Source',
      format: 'APA',
      source: 'Google Scholar',
    };

    setReferencesList([newRefObj, ...referencesList]);
    setNewTitle('');
    setNewAuthors('');
    setNewPublication('');
    closeAddModal();
    Alert.alert('Reference Added', 'New Google Scholar APA citation added to references.');
  };

  return (
    <View style={styles.container}>
      {/* SEARCH BAR (Toggled by Magnifying Glass in Header) */}
      {isSearchActive && (
        <View style={styles.searchBarContainer}>
          <Ionicons name="search" size={18} color="#64748B" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search Google Scholar website references..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#64748B" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={closeSearch}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* SUB-TABS HEADER */}
      <View style={styles.tabHeaderRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'All' && styles.tabBtnActive]}
          onPress={() => setActiveTab('All')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'All' && styles.tabBtnTextActive]}>
            All ({totalCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'Book' && styles.tabBtnActive]}
          onPress={() => setActiveTab('Book')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'Book' && styles.tabBtnTextActive]}>
            Book ({bookCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'Journal' && styles.tabBtnActive]}
          onPress={() => setActiveTab('Journal')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'Journal' && styles.tabBtnTextActive]}>
            Journal ({journalCount})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'Website' && styles.tabBtnActive]}
          onPress={() => setActiveTab('Website')}
        >
          <Text style={[styles.tabBtnText, activeTab === 'Website' && styles.tabBtnTextActive]}>
            Website ({websiteCount})
          </Text>
        </TouchableOpacity>
      </View>

      {/* REFERENCES LIST VIEW */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
      >
        {filteredReferences.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>No Google Scholar website references found.</Text>
          </View>
        ) : (
          filteredReferences.map((item) => (
            <View key={item.id} style={styles.refCardWrapper}>
              <View style={styles.cardHeaderRow}>
                <View style={styles.typeBadge}>
                  <Text style={styles.typeBadgeText}>{item.type}</Text>
                </View>
                <View style={styles.rightBadgeRow}>
                  <View style={styles.apaBadge}>
                    <Text style={styles.apaBadgeText}>{item.format}</Text>
                  </View>
                  <TouchableOpacity
                    style={{ paddingLeft: 6 }}
                    onPress={() =>
                      Alert.alert(
                        item.title,
                        `APA Citation:\n${item.authors} (${item.publication}).\n\nSource: ${item.source}`,
                        [{ text: 'Close' }]
                      )
                    }
                  >
                    <Ionicons name="ellipsis-vertical" size={18} color="#000000" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.refTitleText}>{item.title}</Text>
              <Text style={styles.refAuthorsText}>{item.authors}</Text>
              <Text style={styles.refPublicationText}>{item.publication}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* ADD REFERENCE MODAL (+ Button in Top Right Header) */}
      <Modal visible={isAddModalActive} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Add Google Scholar Reference</Text>
            <Text style={styles.inputLabelText}>Reference Type</Text>
            <View style={styles.typeSelectorRow}>
              {(['Journal', 'Book', 'Website'] as const).map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.typeSelectBtn, newType === t && styles.typeSelectBtnActive]}
                  onPress={() => setNewType(t)}
                >
                  <Text
                    style={[
                      styles.typeSelectBtnText,
                      newType === t && styles.typeSelectBtnTextActive,
                    ]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabelText}>Title / Article Heading</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="e.g., Mobile Learning and Student Performance"
              placeholderTextColor="#94A3B8"
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <Text style={styles.inputLabelText}>Author(s) (APA Style)</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="e.g., Williams, K., et al."
              placeholderTextColor="#94A3B8"
              value={newAuthors}
              onChangeText={setNewAuthors}
            />

            <Text style={styles.inputLabelText}>Publisher / Web Source Details</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="e.g., Computers & Education, 128, 80-95."
              placeholderTextColor="#94A3B8"
              value={newPublication}
              onChangeText={setNewPublication}
            />

            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.cancelOutlineBtn}
                onPress={() => {
                  closeAddModal();
                  setNewTitle('');
                  setNewAuthors('');
                  setNewPublication('');
                }}
              >
                <Text style={styles.cancelOutlineBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryBlueBtn} onPress={handleAddReference}>
                <Text style={styles.primaryBlueBtnText}>Add APA Ref</Text>
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
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    marginBottom: 10,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tabHeaderRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CBD5E1',
    marginBottom: 10,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabBtnActive: {
    backgroundColor: '#BFDBFE',
    borderBottomColor: '#1E58A8',
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tabBtnTextActive: {
    color: '#1E58A8',
    fontWeight: 'bold',
  },
  refCardWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  typeBadge: {
    backgroundColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E58A8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  rightBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  apaBadge: {
    backgroundColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  apaBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1E58A8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  refTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  refAuthorsText: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  refPublicationText: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 8,
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
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 14,
  },
  inputLabelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  typeSelectorRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  typeSelectBtn: {
    flex: 1,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    alignItems: 'center',
  },
  typeSelectBtnActive: {
    backgroundColor: '#1E58A8',
    borderColor: '#1E58A8',
  },
  typeSelectBtnText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: 'bold',
  },
  typeSelectBtnTextActive: {
    color: '#FFFFFF',
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 12,
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  primaryBlueBtn: {
    flex: 1,
    backgroundColor: '#1E58A8',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  primaryBlueBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  cancelOutlineBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelOutlineBtnText: {
    color: '#475569',
    fontWeight: 'bold',
    fontSize: 14,
  },
});