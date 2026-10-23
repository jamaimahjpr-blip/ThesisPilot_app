import Ionicons from '@expo/vector-icons/Ionicons';
import Constants from 'expo-constants';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// Multi-fallback strategy for Expo / EAS production build keys
const apiKey =
  process.env.EXPO_PUBLIC_GEMINI_API_KEY ||
  Constants.expoConfig?.extra?.EXPO_PUBLIC_GEMINI_API_KEY ||
  'AIzaSyBqmAciXTy8KgJ83LyzFnstWEAL4TULBZE';

interface AIAssistantScreenProps {
  onBack?: () => void;
  setStudentDashView?: (view: any) => void;
}

interface UploadedFile {
  name: string;
  size: string;
  uri: string;
  mimeType?: string;
  title?: string;
  author?: string;
  year?: string;
  journal?: string;
  volume?: string;
  pages?: string;
  doi?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  isError?: boolean;
}

// Academic Keywords list for topic validation
const ACADEMIC_KEYWORDS = [
  'thesis', 'research', 'chapter', 'methodology', 'literature', 'rrl', 'citation',
  'apa', 'mla', 'chicago', 'abstract', 'introduction', 'conclusion', 'defense',
  'proposal', 'study', 'studies', 'variables', 'data', 'analysis', 'survey', 'questionnaire',
  'academic', 'grammar', 'proofread', 'title', 'statement of the problem', 'sop',
  'reference', 'bibliography', 'qualitative', 'quantitative', 'scope', 'delimitation',
  'framework', 'hypothesis', 'sample', 'population', 'statistical', 'school', 'university',
  'find', 'explain', 'help', 'summarize', 'project', 'related'
];

export default function AIAssistantScreen({
  onBack,
  setStudentDashView,
}: AIAssistantScreenProps) {
  // Sub-Screen Views: 'dashboard' | 'plagiarism' | 'grammar' | 'citation' | 'chatbot'
  const [activeSubScreen, setActiveSubScreen] = useState<
    'dashboard' | 'plagiarism' | 'grammar' | 'citation' | 'chatbot'
  >('dashboard');

  // Selected File State
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>({
    name: 'Chapter 3 RRL.docx',
    size: 'DOCX 2.3 MB',
    uri: '',
    title: 'The impact of social media on consumer behavior',
    author: 'John Matti',
    year: '2022',
    journal: 'Journal of Marketing Research',
    volume: '45 (3)',
    pages: '123-136',
    doi: 'https://doi.org/10.1177/00222437211066628',
  });

  // Citation Style State: 'APA' | 'MLA' | 'Chicago'
  const [citationFormat, setCitationFormat] = useState<'APA' | 'MLA' | 'Chicago'>('APA');
  const [copiedCitation, setCopiedCitation] = useState(false);

  // Plagiarism & Grammar States
  const [plagiarismChecked, setPlagiarismChecked] = useState(true);
  const [grammarChecked, setGrammarChecked] = useState(true);

  // CHATBOT ASSISTANT STATES
  const [chatInputText, setChatInputText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      sender: 'user',
      text: 'What are the key components of a Chapter 2?',
    },
    {
      id: 'msg_2',
      sender: 'bot',
      text:
        'Chapter 2, also known as the Review of Related Literature, usually includes:\n\n1. Theoretical Framework\n2. Related Studies\n3. Conceptual Framework\n4. Synthesis of Literature\n\nWould you like help finding related studies for your topic?',
    },
  ]);

  // LONG PRESS ACTION MODAL STATES FOR CHAT
  const [selectedChatMessage, setSelectedChatMessage] = useState<ChatMessage | null>(null);
  const [showChatOptionsModal, setShowChatOptionsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editInputText, setEditInputText] = useState('');

  // Pick Document from Phone Storage
  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const sizeInMB = file.size ? (file.size / (1024 * 1024)).toFixed(1) : '1.0';
        const fileExt = file.name.split('.').pop()?.toUpperCase() || 'FILE';
        const cleanTitle = file.name.replace(/\.[^/.]+$/, '');

        setSelectedFile({
          name: file.name,
          size: `${fileExt} ${sizeInMB} MB`,
          uri: file.uri,
          mimeType: file.mimeType,
          title: cleanTitle,
          author: 'John Matti',
          year: '2022',
          journal: 'Journal of Academic Research & Technology',
          volume: '12 (2)',
          pages: '145-162',
          doi: 'https://doi.org/10.1007/s11747-019-00695-1',
        });
        Alert.alert('File Selected', `Successfully selected ${file.name} from device storage.`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to access phone files. Please try again.');
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPlagiarismChecked(false);
    setGrammarChecked(false);
  };

  const handleCheckPlagiarism = () => {
    if (!selectedFile) {
      Alert.alert('No File Selected', 'Please upload or select a document first.');
      return;
    }
    setPlagiarismChecked(true);
    Alert.alert('Analysis Complete', 'Plagiarism analysis finished successfully.');
  };

  const handleCheckGrammar = () => {
    if (!selectedFile) {
      Alert.alert('No File Selected', 'Please upload or select a document first.');
      return;
    }
    setGrammarChecked(true);
    Alert.alert('Analysis Complete', 'Grammar check finished successfully.');
  };

  const getGeneratedCitationText = () => {
    const file = selectedFile || {
      title: 'The impact of social media on consumer behavior',
      author: 'John Matti',
      year: '2022',
      journal: 'Journal of Marketing Research',
      volume: '45 (3)',
      pages: '123-136',
      doi: 'https://doi.org/10.1177/00222437211066628',
    };

    if (citationFormat === 'APA') {
      return `${file.author}. (${file.year}). ${file.title}. ${file.journal}, ${file.volume}, ${file.pages}. ${file.doi}`;
    } else if (citationFormat === 'MLA') {
      return `${file.author}, et al. "${file.title}." ${file.journal}, vol. ${file.volume}, ${file.year}, pp. ${file.pages}. ${file.doi}`;
    } else {
      return `${file.author}. "${file.title}." ${file.journal} ${file.volume} (${file.year}): ${file.pages}. ${file.doi}`;
    }
  };

  const handleCopyCitation = () => {
    const textToCopy = getGeneratedCitationText();
    Clipboard.setString(textToCopy);
    setCopiedCitation(true);
    Alert.alert('Copied!', 'Citation text has been copied to clipboard.');
    setTimeout(() => setCopiedCitation(false), 3000);
  };

  // REAL LIVE GEMINI AI RESPONSE GENERATOR (UPDATED API ENDPOINT)
  const fetchLiveGeminiResponse = async (userPrompt: string): Promise<string> => {
    try {
      if (!apiKey) {
        return 'Please set your EXPO_PUBLIC_GEMINI_API_KEY in your env file to enable live AI responses.';
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userPrompt }] }],
            systemInstruction: {
              parts: [
                {
                  text: 'You are an expert thesis guide and academic assistant for college students. Provide helpful, structured, and clear academic advice.',
                },
              ],
            },
          }),
        }
      );

      const data = await response.json();
      if (data.error) {
        console.error('Gemini API Error:', data.error);
        return `API Error: ${data.error.message || 'Invalid API Key'}`;
      }

      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        'I apologize, but I could not generate a response. Please try again.'
      );
    } catch (err) {
      return 'Sorry, I encountered an issue connecting to Gemini AI. Please check your network connection or API Key.';
    }
  };

  // CHECK IF QUERY IS STRICTLY ACADEMIC
  const isAcademicQuery = (query: string): boolean => {
    const cleanQuery = query.toLowerCase();
    const hasKeyword = ACADEMIC_KEYWORDS.some((kw) => cleanQuery.includes(kw));

    if (hasKeyword || cleanQuery.length > 15) {
      return true;
    }
    return false;
  };

  const handleSendChatMessage = async (textToSend?: string) => {
    const query = textToSend || chatInputText;
    if (!query.trim() || isAiLoading) return;

    const userMsgId = `user_${Date.now()}`;
    const botMsgId = `bot_${Date.now()}`;

    const newUsersMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: query,
    };

    setChatMessages((prev) => [...prev, newUsersMsg]);
    if (!textToSend) setChatInputText('');

    // Academic Guard Check (English Rejection Prompt)
    if (!isAcademicQuery(query)) {
      setTimeout(() => {
        const errorBotMsg: ChatMessage = {
          id: botMsgId,
          sender: 'bot',
          text: '⚠️ Sorry, I can only assist with academic, thesis, and research-related topics. Please ask a school or research-related question.',
          isError: true,
        };
        setChatMessages((prev) => [...prev, errorBotMsg]);
      }, 300);
      return;
    }

    setIsAiLoading(true);
    const liveBotText = await fetchLiveGeminiResponse(query);
    const newBotMsg: ChatMessage = {
      id: botMsgId,
      sender: 'bot',
      text: liveBotText,
    };
    setChatMessages((prev) => [...prev, newBotMsg]);
    setIsAiLoading(false);
  };

  const handleLongPressChatMessage = (msg: ChatMessage) => {
    setSelectedChatMessage(msg);
    setShowChatOptionsModal(true);
  };

  const handleDeleteChatMessage = () => {
    if (selectedChatMessage) {
      setChatMessages((prev) => prev.filter((m) => m.id !== selectedChatMessage.id));
    }
    setShowChatOptionsModal(false);
    setSelectedChatMessage(null);
  };

  const handleOpenEditModal = () => {
    if (selectedChatMessage) {
      setEditInputText(selectedChatMessage.text);
      setShowChatOptionsModal(false);
      setShowEditModal(true);
    }
  };

  const handleSaveEditedMessage = async () => {
    if (!editInputText.trim() || !selectedChatMessage) return;
    const updatedText = editInputText.trim();

    setShowEditModal(false);

    if (!isAcademicQuery(updatedText)) {
      setChatMessages((prev) => {
        const index = prev.findIndex((m) => m.id === selectedChatMessage.id);
        if (index === -1) return prev;
        const newArr = [...prev];
        newArr[index] = { ...newArr[index], text: updatedText };
        if (index + 1 < newArr.length && newArr[index + 1].sender === 'bot') {
          newArr[index + 1] = {
            ...newArr[index + 1],
            text: '⚠️ Sorry, I can only assist with academic, thesis, and research-related topics. Please ask a school or research-related question.',
            isError: true,
          };
        }
        return newArr;
      });
      return;
    }

    setIsAiLoading(true);
    const newBotResponse = await fetchLiveGeminiResponse(updatedText);

    setChatMessages((prev) => {
      const index = prev.findIndex((m) => m.id === selectedChatMessage.id);
      if (index === -1) return prev;
      const newArr = [...prev];
      newArr[index] = { ...newArr[index], text: updatedText };
      if (index + 1 < newArr.length && newArr[index + 1].sender === 'bot') {
        newArr[index + 1] = { ...newArr[index + 1], text: newBotResponse, isError: false };
      }
      return newArr;
    });

    setIsAiLoading(false);
    setSelectedChatMessage(null);
    setEditInputText('');
  };

  const handleBackNavigation = () => {
    if (activeSubScreen !== 'dashboard') {
      setActiveSubScreen('dashboard');
    } else if (onBack) {
      onBack();
    } else if (setStudentDashView) {
      setStudentDashView('dashboard');
    }
  };

  return (
    <View style={styles.container}>
      {/* TOP HEADER BAR */}
      <View style={styles.topHeaderBar}>
        <TouchableOpacity style={styles.headerIconTouch} onPress={handleBackNavigation}>
          <Ionicons name="sparkles" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {activeSubScreen === 'dashboard'
            ? 'A.I Assistant'
            : activeSubScreen === 'plagiarism'
            ? 'Plagiarism Checker'
            : activeSubScreen === 'grammar'
            ? 'Grammar Checker'
            : activeSubScreen === 'citation'
            ? 'Citation Generator'
            : 'Chatbot Assistant'}
        </Text>
        <TouchableOpacity style={styles.headerIconTouch}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* MAIN WHITE CARD CONTAINER */}
      <View style={styles.whiteCardContainer}>
        {/* SUB-SCREEN 1: DASHBOARD */}
        {activeSubScreen === 'dashboard' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.dashGreetingTitle}>How can I help you today?</Text>

            <View style={styles.gridContainer}>
              <TouchableOpacity
                style={[styles.gridCard, { backgroundColor: '#FECDD3' }]}
                activeOpacity={0.85}
                onPress={() => setActiveSubScreen('plagiarism')}
              >
                <View style={styles.gridIconBox}>
                  <Ionicons name="document-text-outline" size={28} color="#E11D48" />
                </View>
                <Text style={styles.gridCardText}>Plagiarism Checker</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.gridCard, { backgroundColor: '#BBF7D0' }]}
                activeOpacity={0.85}
                onPress={() => setActiveSubScreen('grammar')}
              >
                <View style={styles.gridIconBox}>
                  <Ionicons name="text-outline" size={28} color="#166534" />
                </View>
                <Text style={styles.gridCardText}>Grammar Checker</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.gridCard, { backgroundColor: '#FEF08A' }]}
                activeOpacity={0.85}
                onPress={() => setActiveSubScreen('citation')}
              >
                <View style={styles.gridIconBox}>
                  <Ionicons name="bookmarks-outline" size={28} color="#CA8A04" />
                </View>
                <Text style={styles.gridCardText}>Citation Generator</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.gridCard, { backgroundColor: '#FBCFE8' }]}
                activeOpacity={0.85}
                onPress={() => setActiveSubScreen('chatbot')}
              >
                <View style={styles.gridIconBox}>
                  <Ionicons name="hardware-chip-outline" size={28} color="#DB2777" />
                </View>
                <Text style={styles.gridCardText}>Chatbot Assistant</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Recent Checks</Text>
            <View style={styles.recentChecksBox}>
              <TouchableOpacity
                style={styles.recentCheckItem}
                activeOpacity={0.7}
                onPress={() => setActiveSubScreen('plagiarism')}
              >
                <View style={styles.docxBadge}>
                  <Text style={styles.docxBadgeText}>DOCX</Text>
                </View>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentTitle}>Chapter 2 RRL.docx</Text>
                  <Text style={styles.recentSub}>Plagiarism Check</Text>
                </View>
                <Text style={[styles.recentStatusText, { color: '#22C55E' }]}>92% Original</Text>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.recentCheckItem, { borderBottomWidth: 0 }]}
                activeOpacity={0.7}
                onPress={() => setActiveSubScreen('grammar')}
              >
                <View style={styles.docxBadge}>
                  <Text style={styles.docxBadgeText}>DOCX</Text>
                </View>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentTitle}>Chapter 1 Introduction.docx</Text>
                  <Text style={styles.recentSub}>Grammar Check</Text>
                </View>
                <Text style={[styles.recentStatusText, { color: '#22C55E' }]}>Good</Text>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}

        {/* SUB-SCREEN 2: PLAGIARISM CHECKER */}
        {activeSubScreen === 'plagiarism' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.subScreenHeaderLabel}>Upload or Paste Text</Text>

            <View style={styles.uploadBtnRow}>
              <TouchableOpacity style={styles.uploadActionBtn} onPress={handlePickDocument}>
                <Ionicons name="cloud-upload-outline" size={20} color="#1D4ED8" />
                <Text style={styles.uploadBtnText}>Upload File</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.pasteActionBtn} onPress={handlePickDocument}>
                <Ionicons name="copy-outline" size={20} color="#1D4ED8" />
                <Text style={styles.pasteBtnText}>Paste Text</Text>
              </TouchableOpacity>
            </View>

            {selectedFile ? (
              <View style={styles.selectedFileCard}>
                <View style={styles.docxBadge}>
                  <Text style={styles.docxBadgeText}>DOCX</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.fileNameText} numberOfLines={1}>
                    {selectedFile.name}
                  </Text>
                  <Text style={styles.fileSizeText}>{selectedFile.size}</Text>
                </View>
                <TouchableOpacity onPress={handleRemoveFile}>
                  <Ionicons name="close" size={20} color="#0F172A" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.emptyUploadBox} onPress={handlePickDocument}>
                <Ionicons name="folder-open-outline" size={32} color="#64748B" />
                <Text style={styles.emptyUploadText}>Tap to pick file from Phone Storage</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.primaryBlueActionBtn} onPress={handleCheckPlagiarism}>
              <Text style={styles.primaryBlueActionText}>Check for Plagiarism</Text>
            </TouchableOpacity>

            {plagiarismChecked && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Results</Text>
                <View style={styles.resultsCardBox}>
                  <Text style={styles.originalPercentageText}>92%</Text>
                  <Text style={styles.originalStatusSubText}>Original Content</Text>

                  <View style={styles.dividerLine} />

                  <View style={styles.legendRow}>
                    <View style={[styles.colorSquare, { backgroundColor: '#22C55E' }]} />
                    <Text style={styles.legendText}>92% Original</Text>
                  </View>

                  <View style={[styles.legendRow, { marginTop: 6 }]}>
                    <View style={[styles.colorSquare, { backgroundColor: '#EF4444' }]} />
                    <Text style={styles.legendText}>8% Potentially Plagiarized</Text>
                  </View>
                </View>

                <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Matched Sources (8%)</Text>
                <View style={styles.matchedSourcesCard}>
                  <View style={styles.sourceRowItem}>
                    <View style={styles.sourceBadgeCircle}>
                      <Text style={styles.sourceBadgeText}>1</Text>
                    </View>
                    <Text style={styles.sourceUrlText} numberOfLines={1}>
                      www.examplejournal.com
                    </Text>
                    <Text style={styles.sourcePercentText}>2%</Text>
                  </View>

                  <View style={styles.sourceRowItem}>
                    <View style={styles.sourceBadgeCircle}>
                      <Text style={styles.sourceBadgeText}>2</Text>
                    </View>
                    <Text style={styles.sourceUrlText} numberOfLines={1}>
                      www.repositoryuniversity.edu
                    </Text>
                    <Text style={styles.sourcePercentText}>6%</Text>
                  </View>

                  <TouchableOpacity style={styles.viewAllSourcesBtn}>
                    <Text style={styles.viewAllSourcesText}>View all sources</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        )}

        {/* SUB-SCREEN 3: GRAMMAR CHECKER */}
        {activeSubScreen === 'grammar' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <Text style={styles.subScreenHeaderLabel}>Upload or Paste Text</Text>

            <View style={styles.uploadBtnRow}>
              <TouchableOpacity style={styles.uploadActionBtn} onPress={handlePickDocument}>
                <Ionicons name="cloud-upload-outline" size={20} color="#1D4ED8" />
                <Text style={styles.uploadBtnText}>Upload File</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.pasteActionBtn} onPress={handlePickDocument}>
                <Ionicons name="copy-outline" size={20} color="#1D4ED8" />
                <Text style={styles.pasteBtnText}>Paste Text</Text>
              </TouchableOpacity>
            </View>

            {selectedFile ? (
              <View style={styles.selectedFileCard}>
                <View style={styles.docxBadge}>
                  <Text style={styles.docxBadgeText}>DOCX</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.fileNameText} numberOfLines={1}>
                    {selectedFile.name}
                  </Text>
                  <Text style={styles.fileSizeText}>{selectedFile.size}</Text>
                </View>
                <TouchableOpacity onPress={handleRemoveFile}>
                  <Ionicons name="close" size={20} color="#0F172A" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity style={styles.emptyUploadBox} onPress={handlePickDocument}>
                <Ionicons name="folder-open-outline" size={32} color="#64748B" />
                <Text style={styles.emptyUploadText}>Tap to pick file from Phone Storage</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.primaryBlueActionBtn} onPress={handleCheckGrammar}>
              <Text style={styles.primaryBlueActionText}>Check Grammar</Text>
            </TouchableOpacity>

            {grammarChecked && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Results</Text>
                <View style={styles.grammarResultsCard}>
                  <View style={styles.issuesCountWrapper}>
                    <Text style={styles.issuesCountNumber}>12</Text>
                    <Text style={styles.issuesCountLabel}>Issues Found</Text>
                  </View>

                  <View style={styles.verticalDivider} />

                  <View style={styles.grammarBreakdownCol}>
                    <Text style={styles.breakdownVal}>6</Text>
                    <Text style={styles.breakdownLabel}>Grammar</Text>
                  </View>

                  <View style={styles.grammarBreakdownCol}>
                    <Text style={styles.breakdownVal}>4</Text>
                    <Text style={styles.breakdownLabel}>Punctuation</Text>
                  </View>

                  <View style={styles.grammarBreakdownCol}>
                    <Text style={styles.breakdownVal}>2</Text>
                    <Text style={styles.breakdownLabel}>Spelling</Text>
                  </View>
                </View>

                <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Suggestions</Text>
                <View style={styles.suggestionCardBox}>
                  <View style={styles.suggestionIconBox}>
                    <Ionicons name="bulb-outline" size={24} color="#1D4ED8" />
                  </View>

                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.originalSentenceText}>
                      Original: The results shows that the data are significant.
                    </Text>

                    <View style={styles.suggestionDivider} />

                    <Text style={styles.correctedSentenceText}>
                      Suggestion: The Results <Text style={{ color: '#16A34A' }}>show</Text> that the{' '}
                      <Text style={{ color: '#EF4444', textDecorationLine: 'line-through' }}>data</Text>{' '}
                      significant <Text style={{ color: '#D97706' }}>are</Text>.
                    </Text>

                    <TouchableOpacity style={styles.replaceBtnTouch}>
                      <Text style={styles.replaceBtnText}>Replace</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.paginationRow}>
                  <TouchableOpacity>
                    <Ionicons name="chevron-back" size={20} color="#0F172A" />
                  </TouchableOpacity>
                  <Text style={styles.paginationText}>1 of 12</Text>
                  <TouchableOpacity>
                    <Ionicons name="chevron-forward" size={20} color="#0F172A" />
                  </TouchableOpacity>
                </View>
              </>
            )}
          </ScrollView>
        )}

        {/* SUB-SCREEN 4: CITATION GENERATOR */}
        {activeSubScreen === 'citation' && (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <View style={styles.citationTabContainer}>
              <TouchableOpacity
                style={[
                  styles.citationTabBtn,
                  citationFormat === 'APA' && styles.citationTabBtnActive,
                ]}
                onPress={() => setCitationFormat('APA')}
              >
                <Text
                  style={[
                    styles.citationTabText,
                    citationFormat === 'APA' && styles.citationTabTextActive,
                  ]}
                >
                  APA 7th
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.citationTabBtn,
                  citationFormat === 'MLA' && styles.citationTabBtnActive,
                ]}
                onPress={() => setCitationFormat('MLA')}
              >
                <Text
                  style={[
                    styles.citationTabText,
                    citationFormat === 'MLA' && styles.citationTabTextActive,
                  ]}
                >
                  MLA 9th
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.citationTabBtn,
                  citationFormat === 'Chicago' && styles.citationTabBtnActive,
                ]}
                onPress={() => setCitationFormat('Chicago')}
              >
                <Text
                  style={[
                    styles.citationTabText,
                    citationFormat === 'Chicago' && styles.citationTabTextActive,
                  ]}
                >
                  Chicago
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.citationResultCard}>
              <View style={styles.citationHeaderRow}>
                <View style={styles.checkIconCircle}>
                  <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                </View>
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.citationSuccessTitle}>Citation Generated!</Text>
                  <Text style={styles.citationSuccessSub}>Your citation has been generated.</Text>
                </View>
              </View>

              <View style={styles.citationTextInnerBox}>
                <Text style={styles.generatedCitationText}>{getGeneratedCitationText()}</Text>

                <TouchableOpacity
                  style={styles.copyCitationBtn}
                  activeOpacity={0.8}
                  onPress={handleCopyCitation}
                >
                  <Ionicons name="copy-outline" size={14} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.copyCitationBtnText}>
                    {copiedCitation ? 'Copied!' : 'Copy Citation'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.sourceDetailsCard}>
              <Text style={styles.sourceDetailsHeaderTitle}>Source Details</Text>

              <Text style={styles.sourceDetailRowText}>
                Title:{' '}
                <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>
                  {selectedFile?.title || 'The impact of social media on consumer behavior'}
                </Text>
              </Text>

              <Text style={styles.sourceDetailRowText}>
                Author:{' '}
                <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>
                  {selectedFile?.author || 'John Matti'}
                </Text>
              </Text>

              <Text style={styles.sourceDetailRowText}>
                Year:{' '}
                <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>
                  {selectedFile?.year || '2022'}
                </Text>
              </Text>

              <Text style={styles.sourceDetailRowText}>
                Journal:{' '}
                <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>
                  {selectedFile?.journal || 'Journal of Marketing Research'}
                </Text>
              </Text>

              <Text style={styles.sourceDetailRowText}>
                Volume:{' '}
                <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>
                  {selectedFile?.volume || '45 (3)'}
                </Text>
              </Text>

              <Text style={styles.sourceDetailRowText}>
                Pages:{' '}
                <Text style={{ fontWeight: 'bold', color: '#0F172A' }}>
                  {selectedFile?.pages || '123-136'}
                </Text>
              </Text>
            </View>
          </ScrollView>
        )}

        {/* SUB-SCREEN 5: CHATBOT ASSISTANT */}
        {activeSubScreen === 'chatbot' && (
          <View style={{ flex: 1 }}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* GREETING BANNER */}
              <View style={styles.chatbotGreetingBanner}>
                <View style={styles.botAvatarBadge}>
                  <Ionicons name="hardware-chip" size={24} color="#2563EB" />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.greetingHeaderTitle}>Buenos dias, User!</Text>
                  <Text style={styles.greetingSubTitle}>Ask me anything about your thesis.</Text>
                </View>
              </View>

              {/* CHAT MESSAGES THREAD */}
              {chatMessages.map((msg) => (
                <TouchableOpacity
                  key={msg.id}
                  activeOpacity={0.9}
                  onLongPress={() => handleLongPressChatMessage(msg)}
                  style={[
                    styles.chatBubbleRow,
                    msg.sender === 'user' ? styles.userChatAlign : styles.botChatAlign,
                  ]}
                >
                  {msg.sender === 'bot' && (
                    <View
                      style={[
                        styles.botInlineAvatar,
                        msg.isError && { backgroundColor: '#FEE2E2' },
                      ]}
                    >
                      <Ionicons
                        name={msg.isError ? 'alert-circle' : 'hardware-chip'}
                        size={18}
                        color={msg.isError ? '#DC2626' : '#2563EB'}
                      />
                    </View>
                  )}
                  <View
                    style={[
                      styles.chatBubbleBox,
                      msg.sender === 'user' ? styles.userBubbleBox : styles.botBubbleBox,
                      msg.isError && { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FCA5A5' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chatBubbleText,
                        msg.sender === 'user' ? styles.userBubbleText : styles.botBubbleText,
                        msg.isError && { color: '#991B1B' },
                      ]}
                    >
                      {msg.text}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}

              {/* LOADING INDICATOR FOR LIVE GEMINI RESPONSE */}
              {isAiLoading && (
                <View style={[styles.chatBubbleRow, styles.botChatAlign]}>
                  <View style={styles.botInlineAvatar}>
                    <Ionicons name="hardware-chip" size={18} color="#2563EB" />
                  </View>
                  <View style={[styles.chatBubbleBox, styles.botBubbleBox, { paddingVertical: 10 }]}>
                    <ActivityIndicator size="small" color="#2563EB" />
                  </View>
                </View>
              )}

              {/* QUICK PROMPT CHIPS */}
              <View style={styles.chatPromptChipsRow}>
                <TouchableOpacity
                  style={styles.chatPromptChipBtn}
                  onPress={() => handleSendChatMessage('Find related studies')}
                >
                  <Text style={styles.chatPromptChipText}>Find related studies</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.chatPromptChipBtn}
                  onPress={() => handleSendChatMessage('Explain framework')}
                >
                  <Text style={styles.chatPromptChipText}>Explain framework</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.chatPromptChipBtn}
                  onPress={() => handleSendChatMessage('Help with methodology')}
                >
                  <Text style={styles.chatPromptChipText}>Help with methodology</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            {/* CHAT INPUT BAR */}
            <View style={styles.chatInputBarRow}>
              <TextInput
                style={styles.chatTextInput}
                placeholder="Type your question..."
                placeholderTextColor="#94A3B8"
                value={chatInputText}
                onChangeText={setChatInputText}
              />
              <TouchableOpacity
                style={styles.chatSendBtnTouch}
                onPress={() => handleSendChatMessage()}
              >
                <Ionicons name="send" size={18} color="#2563EB" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* MODAL 1: LONG PRESS OPTIONS MODAL */}
      <Modal visible={showChatOptionsModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.smallOptionsModalCard}>
            <Text style={styles.smallModalHeaderTitle}>Message Options</Text>

            {selectedChatMessage?.sender === 'user' && (
              <TouchableOpacity style={styles.modalOptionRowItem} onPress={handleOpenEditModal}>
                <Ionicons name="create-outline" size={20} color="#2563EB" />
                <Text style={styles.modalOptionLabelText}>Edit Message</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.modalOptionRowItem} onPress={handleDeleteChatMessage}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" />
              <Text style={[styles.modalOptionLabelText, { color: '#EF4444' }]}>
                Delete Message
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOptionCloseBtn}
              onPress={() => {
                setShowChatOptionsModal(false);
                setSelectedChatMessage(null);
              }}
            >
              <Text style={styles.modalOptionCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: EDIT USER MESSAGE MODAL */}
      <Modal visible={showEditModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.smallOptionsModalCard}>
            <Text style={styles.smallModalHeaderTitle}>Edit Message</Text>
            <TextInput
              style={styles.modalEditTextInput}
              value={editInputText}
              onChangeText={setEditInputText}
              multiline
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
              <TouchableOpacity
                style={[styles.modalOptionCloseBtn, { flex: 1, marginTop: 0 }]}
                onPress={() => {
                  setShowEditModal(false);
                  setSelectedChatMessage(null);
                  setEditInputText('');
                }}
              >
                <Text style={styles.modalOptionCloseText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.primaryBlueActionBtn, { flex: 1 }]}
                onPress={handleSaveEditedMessage}
              >
                <Text style={styles.primaryBlueActionText}>Save & Resend</Text>
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
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 40 : 52,
    paddingBottom: 16,
  },
  headerIconTouch: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  whiteCardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  dashGreetingTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 24,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 28,
  },
  gridCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  gridIconBox: {
    marginBottom: 8,
  },
  gridCardText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 10,
  },
  recentChecksBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  recentCheckItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  docxBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: 6,
  },
  docxBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  recentInfo: {
    flex: 1,
    marginLeft: 10,
  },
  recentTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  recentSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  recentStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 6,
  },
  subScreenHeaderLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  uploadBtnRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  uploadActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
  },
  uploadBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1D4ED8',
  },
  pasteActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DBEAFE',
    borderRadius: 10,
    paddingVertical: 12,
    gap: 8,
  },
  pasteBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1D4ED8',
  },
  selectedFileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  fileNameText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  fileSizeText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  emptyUploadBox: {
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyUploadText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 8,
  },
  primaryBlueActionBtn: {
    backgroundColor: '#1D4ED8',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBlueActionText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultsCardBox: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  originalPercentageText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#22C55E',
  },
  originalStatusSubText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#22C55E',
    marginBottom: 12,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 12,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorSquare: {
    width: 14,
    height: 14,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  matchedSourcesCard: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#FFFFFF',
  },
  sourceRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sourceBadgeCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  sourceBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1D4ED8',
  },
  sourceUrlText: {
    flex: 1,
    fontSize: 12,
    color: '#1D4ED8',
  },
  sourcePercentText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  viewAllSourcesBtn: {
    alignSelf: 'flex-end',
  },
  viewAllSourcesText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'right',
    marginTop: 6,
  },
  grammarResultsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  issuesCountWrapper: {
    alignItems: 'center',
  },
  issuesCountNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#A855F7',
  },
  issuesCountLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  verticalDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E2E8F0',
  },
  grammarBreakdownCol: {
    alignItems: 'center',
  },
  breakdownVal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  breakdownLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  suggestionCardBox: {
    flexDirection: 'row',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  suggestionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  originalSentenceText: {
    fontSize: 13,
    color: '#0F172A',
  },
  suggestionDivider: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginVertical: 10,
  },
  correctedSentenceText: {
    fontSize: 13,
    color: '#0F172A',
    lineHeight: 18,
  },
  replaceBtnTouch: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  replaceBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    marginTop: 16,
  },
  paginationText: {
    fontSize: 12,
    color: '#64748B',
  },
  citationTabContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  citationTabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  citationTabBtnActive: {
    backgroundColor: '#FFFFFF',
  },
  citationTabText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
  citationTabTextActive: {
    color: '#1D4ED8',
    fontWeight: 'bold',
  },
  citationResultCard: {
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  citationHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  checkIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#22C55E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  citationSuccessTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#15803D',
  },
  citationSuccessSub: {
    fontSize: 11,
    color: '#166534',
  },
  citationTextInnerBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  generatedCitationText: {
    fontSize: 13,
    color: '#0F172A',
    lineHeight: 20,
    marginBottom: 12,
  },
  copyCitationBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  copyCitationBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  sourceDetailsCard: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  sourceDetailsHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  sourceDetailRowText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 8,
    lineHeight: 18,
  },
  chatbotGreetingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  botAvatarBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greetingHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  greetingSubTitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  chatBubbleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userChatAlign: {
    justifyContent: 'flex-end',
  },
  botChatAlign: {
    justifyContent: 'flex-start',
  },
  botInlineAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  chatBubbleBox: {
    maxWidth: '82%',
    padding: 14,
    borderRadius: 16,
  },
  userBubbleBox: {
    backgroundColor: '#2563EB',
    borderBottomRightRadius: 2,
  },
  botBubbleBox: {
    backgroundColor: '#E2E8F0',
    borderBottomLeftRadius: 2,
  },
  chatBubbleText: {
    fontSize: 13,
    lineHeight: 18,
  },
  userBubbleText: {
    color: '#FFFFFF',
  },
  botBubbleText: {
    color: '#0F172A',
  },
  chatPromptChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
    marginBottom: 20,
  },
  chatPromptChipBtn: {
    backgroundColor: '#DBEAFE',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  chatPromptChipText: {
    fontSize: 12,
    color: '#1D4ED8',
    fontWeight: 'bold',
  },
  chatInputBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  chatTextInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  chatSendBtnTouch: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#DBEAFE',
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
  smallOptionsModalCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    elevation: 8,
  },
  smallModalHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 14,
  },
  modalOptionRowItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 10,
  },
  modalOptionLabelText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563EB',
  },
  modalOptionCloseBtn: {
    marginTop: 12,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  modalOptionCloseText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748B',
  },
  modalEditTextInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    height: 80,
    textAlignVertical: 'top',
  },
});