import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export interface FileFolderItem {
  id: string;
  name: string;
  fileCount?: number;
  type: 'folder';
  uploadTime?: number;
}

export interface FileDocumentItem {
  id: string;
  name: string;
  date: string;
  size: string;
  extension: 'pdf' | 'xlsx' | 'docx';
  type: 'file';
  uploadTime?: number;
}

export type RepositoryItem = FileFolderItem | FileDocumentItem;

interface FileRepositoryScreenProps {
  setStudentDashView?: (view: any) => void;
  setIsMenuOpen?: (open: boolean) => void;
}

export default function FileRepositoryScreen({
  setStudentDashView,
  setIsMenuOpen,
}: FileRepositoryScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const initialFolders: FileFolderItem[] = [
    { id: 'fol-1', name: 'Chapter 1 Introduction', fileCount: 5, type: 'folder', uploadTime: 1 },
    { id: 'fol-2', name: 'Chapter 2 Literature Review', fileCount: 8, type: 'folder', uploadTime: 2 },
    { id: 'fol-3', name: 'Chapter 3 Methodology', fileCount: 6, type: 'folder', uploadTime: 3 },
    { id: 'fol-4', name: 'Chapter 4 Results', fileCount: 4, type: 'folder', uploadTime: 4 },
    { id: 'fol-5', name: 'Chapter 5 Conclusion', fileCount: 3, type: 'folder', uploadTime: 5 },
  ];

  const initialFiles: FileDocumentItem[] = [
    {
      id: 'doc-1',
      name: 'Thesis_Proposal.pdf',
      date: 'May 05, 2026',
      size: '2.4 MB',
      extension: 'pdf',
      type: 'file',
      uploadTime: 10,
    },
    {
      id: 'doc-2',
      name: 'Data Collection.xlsx',
      date: 'May 12, 2026',
      size: '1.1 MB',
      extension: 'xlsx',
      type: 'file',
      uploadTime: 12,
    },
    {
      id: 'doc-3',
      name: 'Research Instrument.docx',
      date: 'Apr 26, 2026',
      size: '856 KB',
      extension: 'docx',
      type: 'file',
      uploadTime: 8,
    },
  ];

  const [foldersList] = useState<FileFolderItem[]>(initialFolders);
  const [filesList] = useState<FileDocumentItem[]>(initialFiles);

  const filteredFolders = foldersList.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredFiles = filesList.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (sortOrder === 'newest') {
    filteredFolders.sort((a, b) => (b.uploadTime || 0) - (a.uploadTime || 0));
    filteredFiles.sort((a, b) => (b.uploadTime || 0) - (a.uploadTime || 0));
  } else {
    filteredFolders.sort((a, b) => (a.uploadTime || 0) - (b.uploadTime || 0));
    filteredFiles.sort((a, b) => (a.uploadTime || 0) - (b.uploadTime || 0));
  }

  const handleOptionsPress = (item: RepositoryItem) => {
    Alert.alert('File Actions', `Selected: ${item.name}`, [
      { text: 'Open / Review', onPress: () => {} },
      { text: 'Re-submit / Update', onPress: () => {} },
      { text: 'Delete', style: 'destructive', onPress: () => {} },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const renderFileIcon = (ext: FileDocumentItem['extension']) => {
    if (ext === 'pdf') {
      return (
        <View style={[styles.fileIconBadge, { backgroundColor: '#EF4444' }]}>
          <FontAwesome5 name="file-pdf" size={16} color="#FFFFFF" />
          <Text style={styles.fileIconBadgeText}>PDF</Text>
        </View>
      );
    } else if (ext === 'xlsx') {
      return (
        <View style={[styles.fileIconBadge, { backgroundColor: '#10B981' }]}>
          <FontAwesome5 name="file-excel" size={16} color="#FFFFFF" />
          <Text style={styles.fileIconBadgeText}>XLSX</Text>
        </View>
      );
    } else {
      return (
        <View style={[styles.fileIconBadge, { backgroundColor: '#0284C7' }]}>
          <FontAwesome5 name="file-word" size={16} color="#FFFFFF" />
          <Text style={styles.fileIconBadgeText}>DOCX</Text>
        </View>
      );
    }
  };

  return (
    <View style={styles.screenContainer}>
      <View style={styles.topHeaderBar}>
        <View style={styles.headerLeftRow}>
          <TouchableOpacity
            style={{ padding: 4 }}
            onPress={() => {
              if (setIsMenuOpen) {
                setIsMenuOpen(true);
              } else if (setStudentDashView) {
                setStudentDashView('workspace');
              }
            }}
          >
            <Ionicons name="menu-outline" size={26} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitleText}>Files</Text>
        </View>
        <View style={styles.headerRightRow}>
          <TouchableOpacity style={{ padding: 6 }} onPress={() => setShowFilterModal(true)}>
            <Ionicons name="funnel-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.contentCard}>
        <View style={styles.searchBarBox}>
          <Ionicons name="search-outline" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInputText}
            placeholder="Search files..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#64748B" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => setShowFilterModal(true)}>
              <Ionicons name="funnel-outline" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
        >
          {filteredFolders.map((folder) => (
            <TouchableOpacity
              key={folder.id}
              style={styles.repositoryItemRow}
              activeOpacity={0.7}
              onPress={() => handleOptionsPress(folder)}
            >
              <FontAwesome5 name="folder" size={32} color="#E59E0B" style={{ marginRight: 14 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitleText}>{folder.name}</Text>
                <Text style={styles.itemSubText}>{folder.fileCount} files</Text>
              </View>
              <TouchableOpacity onPress={() => handleOptionsPress(folder)} style={{ padding: 6 }}>
                <Ionicons name="ellipsis-vertical" size={18} color="#000000" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          {filteredFiles.map((file) => (
            <TouchableOpacity
              key={file.id}
              style={styles.repositoryItemRow}
              activeOpacity={0.7}
              onPress={() => handleOptionsPress(file)}
            >
              <View style={{ marginRight: 14 }}>{renderFileIcon(file.extension)}</View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitleText}>{file.name}</Text>
                <Text style={styles.itemSubText}>
                  {file.date} • {file.size}
                </Text>
              </View>
              <TouchableOpacity onPress={() => handleOptionsPress(file)} style={{ padding: 6 }}>
                <Ionicons name="ellipsis-vertical" size={18} color="#000000" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.floatingAiButton} activeOpacity={0.85}>
          <MaterialCommunityIcons name="robot" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* FILTER MODAL */}
      <Modal visible={showFilterModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlayDark}
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Sort Files By</Text>

            <TouchableOpacity
              style={styles.filterOptionRow}
              onPress={() => {
                setSortOrder('newest');
                setShowFilterModal(false);
              }}
            >
              <Text style={styles.filterOptionText}>Newest</Text>
              {sortOrder === 'newest' && <Ionicons name="checkmark" size={18} color="#1E58A8" />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.filterOptionRow}
              onPress={() => {
                setSortOrder('oldest');
                setShowFilterModal(false);
              }}
            >
              <Text style={styles.filterOptionText}>Oldest</Text>
              {sortOrder === 'oldest' && <Ionicons name="checkmark" size={18} color="#1E58A8" />}
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowFilterModal(false)}>
              <Text style={styles.cancelBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* UPLOAD FILE MODAL */}
      <Modal visible={showUploadModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Upload New Document</Text>
            <TouchableOpacity
              style={styles.dashedUploadBox}
              onPress={() => {
                setShowUploadModal(false);
                Alert.alert('Success', 'File uploaded to repository successfully.');
              }}
            >
              <Ionicons name="cloud-upload-outline" size={36} color="#1E58A8" />
              <Text style={styles.uploadDashedText}>Tap to select PDF, XLSX or DOCX file</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowUploadModal(false)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#1E58A8',
  },
  topHeaderBar: {
    backgroundColor: '#1E58A8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 48,
    paddingBottom: 12,
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contentCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 16,
    position: 'relative',
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 12,
  },
  searchInputText: {
    flex: 1,
    fontSize: 12,
    color: '#000000',
  },
  repositoryItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  itemTitleText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
  },
  itemSubText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
  },
  fileIconBadge: {
    width: 36,
    height: 40,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 2,
  },
  fileIconBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  floatingAiButton: {
    position: 'absolute',
    bottom: 85,
    left: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#0EA5E9',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
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
    borderRadius: 16,
    padding: 20,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 14,
  },
  filterOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  dashedUploadBox: {
    borderWidth: 1.5,
    borderColor: '#1E58A8',
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0F9FF',
    marginBottom: 14,
  },
  uploadDashedText: {
    fontSize: 12,
    color: '#1E58A8',
    fontWeight: 'bold',
    marginTop: 8,
  },
  cancelBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginTop: 10,
  },
  cancelBtnText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: 'bold',
  },
});