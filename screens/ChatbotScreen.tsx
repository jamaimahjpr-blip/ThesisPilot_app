import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  isError?: boolean;
}

// Academic Keywords list for topic validation
const ACADEMIC_KEYWORDS = [
  'thesis', 'research', 'chapter', 'methodology', 'literature', 'rrl', 'citation',
  'apa', 'mla', 'chicago', 'abstract', 'introduction', 'conclusion', 'defense',
  'proposal', 'study', 'variables', 'data', 'analysis', 'survey', 'questionnaire',
  'academic', 'grammar', 'proofread', 'title', 'statement of the problem', 'sop',
  'reference', 'bibliography', 'qualitative', 'quantitative', 'scope', 'delimitation',
  'framework', 'hypothesis', 'sample', 'population', 'statistical', 'school', 'university'
];

const SUGGESTED_PROMPTS = [
  'Paano isulat ang Chapter 1?',
  'Paano mag-format ng APA 7th Edition?',
  'Tulungan mo ako sa Statement of the Problem',
  'Ano ang pagkakaiba ng Qualitative at Quantitative?',
];

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Kamusta! Ako ang iyong ThesisPilot Academic Assistant. Paano kita matutulungan sa iyong thesis o pananaliksik ngayon?',
      sender: 'bot',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  // Strict Academic Topic Validator
  const isAcademicQuery = (query: string): boolean => {
    const cleanQuery = query.toLowerCase();
    const hasKeyword = ACADEMIC_KEYWORDS.some((kw) => cleanQuery.includes(kw));

    if (hasKeyword || cleanQuery.length > 25) {
      return true;
    }
    return false;
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      // Reject non-academic queries with error prompt
      if (!isAcademicQuery(text)) {
        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: '⚠️ Paumanhin! Nakadisenyo lamang ako para tumulong sa mga akademikong paksa, thesis, at pananaliksik. Mangyaring magtanong ng kaugnay sa iyong pag-aaral.',
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isError: true,
        };
        setMessages((prev) => [...prev, errorMsg]);
      } else {
        // Generate Academic Assistant Response
        let botReplyText = 'Salamat sa iyong katanungan kaugnay sa akademikong pananaliksik! ';
        const lower = text.toLowerCase();

        if (lower.includes('chapter 1') || lower.includes('introduction')) {
          botReplyText += 'Ang Chapter 1 (Introduction) ay binubuo ng: Background of the Study, Statement of the Problem, Significance of the Study, at Scope and Delimitation.';
        } else if (lower.includes('apa') || lower.includes('citation')) {
          botReplyText += 'Sa APA 7th Edition, ang format ng in-text citation ay (Apelyido ng Awtor, Taon). Halimbawa: (Smith, 2024).';
        } else if (lower.includes('qualitative') || lower.includes('quantitative')) {
          botReplyText += 'Ang Qualitative Research ay nakatuon sa mga karanasan at salita (interviews, observations), habang ang Quantitative ay nakatuon sa mga numero at estatistika.';
        } else {
          botReplyText += 'Maaari mo pang linawin ang iyong tanong para mabigyan kita ng mas detalyadong gabay sa iyong thesis draft.';
        }

        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          text: botReplyText,
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      }
      setIsTyping(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.botAvatarHeader}>
          <Ionicons name="school" size={22} color="#FFFFFF" />
        </View>
        <View>
          <Text style={styles.headerTitle}>Academic Assistant AI</Text>
          <Text style={styles.headerSub}>Strictly for Thesis & Research Topics</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chatContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageBubble,
                item.sender === 'user' ? styles.userBubble : styles.botBubble,
                item.isError && styles.errorBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  item.sender === 'user' ? styles.userText : styles.botText,
                  item.isError && styles.errorText,
                ]}
              >
                {item.text}
              </Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          )}
        />

        {isTyping && (
          <View style={styles.typingBox}>
            <Text style={styles.typingText}>Sinusuri ang akademikong tanong...</Text>
          </View>
        )}

        <View style={styles.promptsContainer}>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={SUGGESTED_PROMPTS}
            keyExtractor={(_, idx) => idx.toString()}
            contentContainerStyle={{ gap: 8 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.promptChip}
                onPress={() => handleSendMessage(item)}
              >
                <Ionicons name="sparkles-outline" size={14} color="#1E58A8" style={{ marginRight: 4 }} />
                <Text style={styles.promptText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Magtanong tungkol sa iyong thesis/research..."
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            disabled={!inputText.trim()}
            onPress={() => handleSendMessage()}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#1E58A8',
    elevation: 3,
  },
  botAvatarHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerSub: {
    color: '#93C5FD',
    fontSize: 12,
  },
  chatContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#1E58A8',
    borderBottomRightRadius: 2,
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  errorBubble: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  botText: {
    color: '#0F172A',
  },
  errorText: {
    color: '#991B1B',
  },
  timestamp: {
    fontSize: 10,
    color: '#94A3B8',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  typingBox: {
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  typingText: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
  },
  promptsContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  promptChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  promptText: {
    color: '#1E58A8',
    fontSize: 12,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  input: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    maxHeight: 100,
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#1E58A8',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#94A3B8',
  },
});