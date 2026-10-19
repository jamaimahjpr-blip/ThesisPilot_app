import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

export interface FileFolderItem {
  id: string;
  name: string;
  fileCount?: number;
  type: 'folder';
}

export interface FileDocumentItem {
  id: string;
  name: string;
  date: string;
  size: string;
  extension: 'pdf' | 'xlsx' | 'docx';
  type: 'file';
}

type RepositoryItem = FileFolderItem | FileDocumentItem;

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

  // Initial Mock Repository Data matching the UI design exactly
  const initialFolders: FileFolderItem[] = [
    { id: 'fol-1', name: 'Chapter 1 Introduction', fileCount: 5, type: 'folder' },
    { id: 'fol-2', name: 'Chapter 2 Literature Review', fileCount: 8, type: 'folder' },
    { id: 'fol-3', name: 'Chapter 3 Methodology', fileCount: 6, type: 'folder' },
    { id: 'fol-4', name: 'Chapter 4 Results', fileCount: 4, type: 'folder' },
    { id: 'fol-5', name: 'Chapter 5 Conclusion', fileCount: 3, type: 'folder' },
  ];

  const initialFiles: FileDocumentItem[] = [
    {
      id: 'doc-1',
      name: 'Thesis_Proposal.pdf',
      date: 'May 05, 2026',
      size: '2.4 MB',
      extension: 'pdf',
      type: 'file',
    },
    {
      id: 'doc-2',
      name: 'Data Collection.xlsx',
      date: 'May 12, 2026',
      size: '1.1 MB',
      extension: 'xlsx',
      type: 'file',
    },
    {
      id: 'doc-3',
      name: 'Research Instrument.docx',
      date: 'Apr 26, 2026',
      size: '856 KB',
      extension: 'docx',
      type: 'file',
    },
  ];

  const [foldersList, setFoldersList] = useState<FileFolderItem[]>(initialFolders);
  const [filesList, setFilesList] = useState<FileDocumentItem[]>(initialFiles);

  // Filter List based on Search Bar Query
  const filteredFolders = foldersList.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredFiles = filesList.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      {/* Top Header Title Bar */}
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
          <TouchableOpacity style={{ padding: 6 }}>
            <Ionicons name="funnel-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ padding: 6 }}
            onPress={() => setShowUploadModal(true)}
          >
            <Ionicons name="cloud-upload-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main White Content Card */}
      <View style={styles.contentCard}>
        {/* Search Bar Input Container */}
        <View style={styles.searchBarBox}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#94A3B8"
            style={{ marginRight: 8 }}
          />
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
            <TouchableOpacity>
              <Ionicons name="funnel-outline" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Scrollable File & Folder List */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
        >
          {/* Folders List */}
          {filteredFolders.map((folder) => (
            <TouchableOpacity
              key={folder.id}
              style={styles.repositoryItemRow}
              activeOpacity={0.7}
              onPress={() => handleOptionsPress(folder)}
            >
              <FontAwesome5
                name="folder"
                size={32}
                color="#E59E0B"
                style={{ marginRight: 14 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitleText}>{folder.name}</Text>
                <Text style={styles.itemSubText}>{folder.fileCount} files</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleOptionsPress(folder)}
                style={{ padding: 6 }}
              >
                <Ionicons name="ellipsis-vertical" size={18} color="#000000" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          {/* Documents List */}
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
              <TouchableOpacity
                onPress={() => handleOptionsPress(file)}
                style={{ padding: 6 }}
              >
                <Ionicons name="ellipsis-vertical" size={18} color="#000000" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Floating AI Assistant Mascot Button */}
        <TouchableOpacity style={styles.floatingAiButton} activeOpacity={0.85}>
          <MaterialCommunityIcons name="robot" size={28} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

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
              <Text style={styles.uploadDashedText}>
                Tap to select PDF, XLSX or DOCX file
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setShowUploadModal(false)}
            >
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
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  itemSubText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
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
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  cancelBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  cancelBtnText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});