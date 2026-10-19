import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Image,
  Platform,
  Alert,
  Modal,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export interface ChatMessage {
  id: string;
  senderName: string;
  avatarUrl?: string;
  text?: string;
  time: string;
  isMe: boolean;
  attachment?: {
    fileName: string;
    fileSize: string;
  };
}

interface ThesisGroupChatScreenProps {
  setStudentDashView?: (view: any) => void;
  setIsMenuOpen?: (open: boolean) => void;
  onBackPress?: () => void;
}

export default function ThesisGroupChatScreen({
  setStudentDashView,
  setIsMenuOpen,
  onBackPress,
}: ThesisGroupChatScreenProps) {
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState<{
    fileName: string;
    fileSize: string;
  } | null>(null);

  // States for Long-Press Actions Modal
  const [selectedMsg, setSelectedMsg] = useState<ChatMessage | null>(null);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editText, setEditText] = useState('');

  // Initial dummy messages matching the exact UI screenshot
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      senderName: 'You',
      text: "Hi guys! Don't forget to submit your parts for Chapter 3. Thank You!",
      time: 'Today, 11:30 AM',
      isMe: true,
    },
    {
      id: 'msg-2',
      senderName: 'Wally Bayola',
      avatarUrl: 'https://i.pravatar.cc/100?img=12',
      text: "Noted! I'll send mine later today.",
      time: 'Today, 13:43 PM',
      isMe: false,
    },
    {
      id: 'msg-3',
      senderName: 'Apple David',
      avatarUrl: 'https://i.pravatar.cc/100?img=47',
      text: "Here's my work. Please review.",
      time: 'Today, 14:21 PM',
      isMe: false,
      attachment: {
        fileName: 'Chapter 3 Methodology.docx',
        fileSize: '1.2 MB',
      },
    },
    {
      id: 'msg-4',
      senderName: 'Ronald "Bato" Dela Rosa',
      avatarUrl: 'https://i.pravatar.cc/100?img=33',
      text: 'quits mna ak guys keri nyu n yn',
      time: 'Today, 14:23 PM',
      isMe: false,
    },
  ]);

  // Long Press Event Handler
  const handleLongPressMsg = (msg: ChatMessage) => {
    setSelectedMsg(msg);
    setShowOptionsModal(true);
  };

  // Delete Handlers
  const handleDeleteForMe = () => {
    if (!selectedMsg) return;
    setMessages((prev) => prev.filter((m) => m.id !== selectedMsg.id));
    setShowOptionsModal(false);
    setSelectedMsg(null);
  };

  const handleDeleteForEveryone = () => {
    if (!selectedMsg) return;
    setMessages((prev) => prev.filter((m) => m.id !== selectedMsg.id));
    setShowOptionsModal(false);
    setSelectedMsg(null);
    Alert.alert('Message Deleted', 'This message was deleted for everyone.');
  };

  // Open Edit Modal
  const handleOpenEdit = () => {
    if (!selectedMsg) return;
    setEditText(selectedMsg.text || '');
    setShowOptionsModal(false);
    setShowEditModal(true);
  };

  // Save Edit Handler
  const handleSaveEditSubmit = () => {
    if (!selectedMsg || !editText.trim()) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === selectedMsg.id ? { ...m, text: editText.trim() } : m
      )
    );
    setShowEditModal(false);
    setSelectedMsg(null);
    setEditText('');
  };

  // Simulate File Attachment Selection
  const handleAttachFile = () => {
    Alert.alert(
      'Attach File',
      'Select a document to attach to your chat message:',
      [
        {
          text: 'Chapter 3 Methodology.docx',
          onPress: () =>
            setAttachedFile({
              fileName: 'Chapter 3 Methodology.docx',
              fileSize: '1.2 MB',
            }),
        },
        {
          text: 'Thesis Draft V2.pdf',
          onPress: () =>
            setAttachedFile({
              fileName: 'Thesis_Draft_V2.pdf',
              fileSize: '12.5 MB',
            }),
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Send Message Handler
  const handleSendMessage = () => {
    if (!inputText.trim() && !attachedFile) return;
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderName: 'You',
      text: inputText.trim(),
      time: 'Just now',
      isMe: true,
      attachment: attachedFile || undefined,
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputText('');
    setAttachedFile(null);
  };

  return (
    <View style={styles.container}>
      {/* TOP HEADER BAR */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => {
            if (onBackPress) onBackPress();
            else if (setIsMenuOpen) setIsMenuOpen(true);
            else if (setStudentDashView) setStudentDashView('main');
          }}
        >
          <Ionicons name="arrow-back-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Thesis Group Chat</Text>
          <Text style={styles.headerSubtitle}>5 members</Text>
        </View>
        <View style={styles.headerRightActions}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="search-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* MAIN WHITE CONTAINER FOR MESSAGES */}
      <View style={styles.whiteCardContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 16, paddingHorizontal: 12 }}
        >
          {messages.map((item) => {
            if (item.isMe) {
              // SENT MESSAGE (BLUE BUBBLE ON RIGHT)
              return (
                <View key={item.id} style={styles.sentMsgWrapper}>
                  <Text style={styles.sentSenderText}>{item.senderName}</Text>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onLongPress={() => handleLongPressMsg(item)}
                    style={styles.sentMsgBubble}
                  >
                    {item.attachment && (
                      <View style={styles.sentAttachmentRow}>
                        <View style={styles.docIconBox}>
                          <Ionicons name="document-text" size={22} color="#FFFFFF" />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.attachmentNameTextSent} numberOfLines={1}>
                            {item.attachment.fileName}
                          </Text>
                          <Text style={styles.attachmentSizeTextSent}>
                            {item.attachment.fileSize}
                          </Text>
                        </View>
                      </View>
                    )}
                    {item.text ? <Text style={styles.sentMsgText}>{item.text}</Text> : null}
                  </TouchableOpacity>
                  <Text style={styles.msgTimeTextRight}>{item.time}</Text>
                </View>
              );
            }

            // RECEIVED MESSAGE (DARK BUBBLE ON LEFT WITH AVATAR)
            return (
              <View key={item.id} style={styles.receivedMsgWrapper}>
                <Image
                  source={{
                    uri:
                      item.avatarUrl ||
                      'https://via.placeholder.com/100/1E58A8/FFFFFF?text=User',
                  }}
                  style={styles.avatarImage}
                />
                <View style={{ flex: 1, marginLeft: 8 }}>
                  <Text style={styles.receivedSenderText}>{item.senderName}</Text>
                  <TouchableOpacity
                    activeOpacity={0.85}
                    onLongPress={() => handleLongPressMsg(item)}
                    style={styles.receivedMsgBubble}
                  >
                    {item.attachment && (
                      <View style={styles.receivedAttachmentRow}>
                        <View style={styles.docIconBoxBlue}>
                          <Text style={styles.docxBadgeText}>DOCX</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.attachmentNameTextRec} numberOfLines={1}>
                            {item.attachment.fileName}
                          </Text>
                          <Text style={styles.attachmentSizeTextRec}>
                            {item.attachment.fileSize}
                          </Text>
                        </View>
                      </View>
                    )}
                    {item.text ? <Text style={styles.receivedMsgText}>{item.text}</Text> : null}
                  </TouchableOpacity>
                  <Text style={styles.msgTimeTextLeft}>{item.time}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        {/* FILE ATTACHMENT PREVIEW CHIP (IF SELECTED) */}
        {attachedFile && (
          <View style={styles.attachedPreviewChip}>
            <Ionicons name="document-attach" size={18} color="#1E58A8" />
            <Text style={styles.attachedPreviewText} numberOfLines={1}>
              {attachedFile.fileName} ({attachedFile.fileSize})
            </Text>
            <TouchableOpacity onPress={() => setAttachedFile(null)}>
              <Ionicons name="close-circle" size={18} color="#64748B" />
            </TouchableOpacity>
          </View>
        )}

        {/* INPUT TOOLBAR AT BOTTOM */}
        <View style={styles.inputBarRow}>
          <View style={styles.textInputPillContainer}>
            <TouchableOpacity onPress={handleAttachFile} style={styles.inputInnerBtn}>
              <Ionicons name="add-circle-outline" size={26} color="#94A3B8" />
            </TouchableOpacity>
            <TextInput
              style={styles.chatTextInput}
              placeholder="Type a message..."
              placeholderTextColor="#94A3B8"
              value={inputText}
              onChangeText={setInputText}
            />
            <TouchableOpacity style={styles.inputInnerBtn}>
              <Ionicons name="happy-outline" size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.sendButtonBlue}
            activeOpacity={0.8}
            onPress={handleSendMessage}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" style={{ marginLeft: 2 }} />
          </TouchableOpacity>
        </View>
      </View>

      {/* LONG PRESS MESSAGE OPTIONS MODAL */}
      <Modal visible={showOptionsModal} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlayDark}
          activeOpacity={1}
          onPress={() => setShowOptionsModal(false)}
        >
          <View style={styles.optionsModalWhiteCard}>
            <Text style={styles.optionsModalTitle}>Message Options</Text>
            {selectedMsg?.isMe ? (
              <>
                <TouchableOpacity style={styles.optionRowBtn} onPress={handleOpenEdit}>
                  <Ionicons name="create-outline" size={20} color="#1E58A8" />
                  <Text style={styles.optionRowText}>Edit Message</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionRowBtn} onPress={handleDeleteForEveryone}>
                  <Ionicons name="trash-outline" size={20} color="#DC2626" />
                  <Text style={[styles.optionRowText, { color: '#DC2626' }]}>
                    Delete for Everyone
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.optionRowBtn} onPress={handleDeleteForMe}>
                  <Ionicons name="trash-bin-outline" size={20} color="#475569" />
                  <Text style={styles.optionRowText}>Delete for You</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.optionRowBtn} onPress={handleDeleteForMe}>
                <Ionicons name="trash-bin-outline" size={20} color="#DC2626" />
                <Text style={[styles.optionRowText, { color: '#DC2626' }]}>Delete for You</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.cancelModalBtn}
              onPress={() => setShowOptionsModal(false)}
            >
              <Text style={styles.cancelModalBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* EDIT MESSAGE MODAL */}
      <Modal visible={showEditModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.optionsModalWhiteCard}>
            <Text style={styles.optionsModalTitle}>Edit Message</Text>
            <TextInput
              style={styles.editTextInput}
              value={editText}
              onChangeText={setEditText}
              multiline
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <TouchableOpacity
                style={[styles.cancelModalBtn, { flex: 1 }]}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelModalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveEditBtn} onPress={handleSaveEditSubmit}>
                <Text style={styles.saveEditBtnText}>Save</Text>
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
    backgroundColor: '#1E58A8',
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 48,
    paddingBottom: 14,
  },
  headerIconBtn: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#93C5FD',
    marginTop: 1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  whiteCardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    position: 'relative',
    justifyContent: 'space-between',
  },
  sentMsgWrapper: {
    alignItems: 'flex-end',
    marginBottom: 14,
  },
  sentSenderText: {
    fontSize: 10,
    color: '#64748B',
    marginBottom: 3,
    marginRight: 4,
  },
  sentMsgBubble: {
    backgroundColor: '#2563EB',
    borderRadius: 18,
    borderBottomRightRadius: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '82%',
  },
  sentMsgText: {
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  sentAttachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
  },
  docIconBox: {
    marginRight: 8,
  },
  attachmentNameTextSent: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  attachmentSizeTextSent: {
    fontSize: 10,
    color: '#BFDBFE',
    marginTop: 1,
  },
  msgTimeTextRight: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    marginRight: 4,
  },
  receivedMsgWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  avatarImage: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginTop: 16,
  },
  receivedSenderText: {
    fontSize: 10,
    color: '#475569',
    marginBottom: 3,
    marginLeft: 4,
  },
  receivedMsgBubble: {
    backgroundColor: '#272E3B',
    borderRadius: 18,
    borderTopLeftRadius: 2,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignSelf: 'flex-start',
    maxWidth: '92%',
  },
  receivedMsgText: {
    fontSize: 13,
    color: '#FFFFFF',
    lineHeight: 18,
  },
  receivedAttachmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
  },
  docIconBoxBlue: {
    width: 32,
    height: 32,
    backgroundColor: '#2563EB',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  docxBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  attachmentNameTextRec: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  attachmentSizeTextRec: {
    fontSize: 10,
    color: '#CBD5E1',
    marginTop: 1,
  },
  msgTimeTextLeft: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
    marginLeft: 4,
  },
  attachedPreviewChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginHorizontal: 16,
    marginBottom: 6,
    borderRadius: 20,
    gap: 6,
  },
  attachedPreviewText: {
    flex: 1,
    fontSize: 11,
    color: '#1E58A8',
    fontWeight: '600',
  },
  inputBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 8,
    paddingBottom: Platform.OS === 'ios' ? 24 : 10,
  },
  textInputPillContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    borderRadius: 12,
    paddingHorizontal: 8,
    height: 44,
  },
  inputInnerBtn: {
    padding: 4,
  },
  chatTextInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingHorizontal: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  sendButtonBlue: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlayDark: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  optionsModalWhiteCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 10,
  },
  optionsModalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 14,
  },
  optionRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 12,
  },
  optionRowText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  cancelModalBtn: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
  },
  cancelModalBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
  },
  editTextInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    color: '#0F172A',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  saveEditBtn: {
    flex: 1,
    backgroundColor: '#1E58A8',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  saveEditBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});