import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EducatorDashboardScreen from '../screens/EducatorDashboardScreen';
import StudentDashboardScreen from '../screens/StudentDashboardScreen';
import {
  ActivityLogItem,
  ChapterItem,
  FeedbackItem,
  NoteItem,
  NotificationItem,
  ReferenceItem,
  TaskItem,
  ThesisProject,
} from '../types';

// Accounts list imitating actual Google accounts stored on phone
const ACCOUNTS_ON_PHONE = [
  {
    name: 'JAMAIMAH JANNA RAMIREZ',
    email: 'qjjramirez@tip.edu.ph',
    avatarLetter: 'J',
    avatarBg: '#E91E63',
  },
  {
    name: 'Jamaimah JPR',
    email: 'jamaimahjpr@gmail.com',
    avatarLetter: 'J',
    avatarBg: '#8D6E63',
  },
  {
    name: 'Jamaimah Janna',
    email: 'jamaimahjanna@gmail.com',
    avatarLetter: 'J',
    avatarBg: '#795548',
  },
  {
    name: 'OSA QC',
    email: 'osaqctip@gmail.com',
    avatarLetter: 'O',
    avatarBg: '#455A64',
  },
  {
    name: 'Janna Ramirez',
    email: 'ramirezjanna326@gmail.com',
    avatarLetter: 'J',
    avatarBg: '#37474F',
  },
];

// 1. EXACT GOOGLE DARK ACCOUNT CHOOSER MODAL
function GoogleDarkAccountChooserModal({
  visible,
  onClose,
  onSelectAccount,
  onAddAccount,
  onUseWithoutAccount,
}: {
  visible: boolean;
  onClose: () => void;
  onSelectAccount: (email: string) => void;
  onAddAccount: () => void;
  onUseWithoutAccount: () => void;
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={pickerStyles.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity activeOpacity={1} style={pickerStyles.cardContainer}>
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {ACCOUNTS_ON_PHONE.map((acc, idx) => (
              <TouchableOpacity
                key={idx}
                style={pickerStyles.accountRow}
                onPress={() => onSelectAccount(acc.email)}
              >
                <View style={[pickerStyles.avatarCircle, { backgroundColor: acc.avatarBg }]}>
                  <Text style={pickerStyles.avatarText}>{acc.avatarLetter}</Text>
                </View>
                <View style={pickerStyles.accountInfo}>
                  <Text style={pickerStyles.accountNameText}>{acc.name}</Text>
                  <Text style={pickerStyles.accountEmailText}>{acc.email}</Text>
                </View>
              </TouchableOpacity>
            ))}
            {/* Add Account Option */}
            <TouchableOpacity style={pickerStyles.actionRow} onPress={onAddAccount}>
              <View style={pickerStyles.actionIconWrapper}>
                <Ionicons name="add" size={24} color="#E2E8F0" />
              </View>
              <Text style={pickerStyles.actionText}>Add Account</Text>
            </TouchableOpacity>
            {/* Use without Google account Option */}
            <TouchableOpacity style={pickerStyles.actionRow} onPress={onUseWithoutAccount}>
              <View style={pickerStyles.iconCircleGrey}>
                <Ionicons name="person" size={20} color="#94A3B8" />
              </View>
              <Text style={pickerStyles.actionText}>Use without Google account</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

// 2. INLINE AUTH COMPONENTS
function InlineSplashScreen({
  onGoogleSignUp,
  onGoogleLogin,
}: {
  onGoogleSignUp: () => void;
  onGoogleLogin: () => void;
}) {
  return (
    <SafeAreaView style={authStyles.splashContainer}>
      <View style={authStyles.logoBox}>
        <Ionicons name="school" size={80} color="#FFFFFF" />
        <Text style={authStyles.splashTitle}>ThesisPilot</Text>
        <Text style={authStyles.splashSub}>
          Your complete thesis workspace & academic assistant
        </Text>
      </View>
      <View style={authStyles.splashBottomBtnGroup}>
        <TouchableOpacity style={authStyles.googleBtnWhite} onPress={onGoogleSignUp}>
          <Ionicons name="logo-google" size={20} color="#4285F4" style={{ marginRight: 10 }} />
          <Text style={authStyles.googleBtnTextDark}>Sign up with Google</Text>
        </TouchableOpacity>
        <View style={authStyles.dividerRow}>
          <View style={authStyles.dividerLine} />
          <Text style={authStyles.dividerText}>or</Text>
          <View style={authStyles.dividerLine} />
        </View>
        <TouchableOpacity style={authStyles.googleBtnWhite} onPress={onGoogleLogin}>
          <Ionicons name="logo-google" size={20} color="#4285F4" style={{ marginRight: 10 }} />
          <Text style={authStyles.googleBtnTextDark}>Login with Google</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function InlineLoginScreen({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  showPassword,
  setShowPassword,
  onBack,
  onLoginSubmit,
  onPickDeviceAccount,
  errorMessage,
}: any) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E58A8' }}>
      <ScrollView contentContainerStyle={authStyles.loginScrollContainer} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={authStyles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={authStyles.welcomeTitle}>Welcome</Text>
        <Text style={authStyles.welcomeSub}>to Thesis platform</Text>
        <View style={authStyles.loginCard}>
          {errorMessage ? (
            <View style={authStyles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={18} color="#DC2626" />
              <Text style={authStyles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}
          <TouchableOpacity style={authStyles.deviceEmailPickBtn} onPress={onPickDeviceAccount}>
            <Ionicons name="logo-google" size={18} color="#4285F4" style={{ marginRight: 8 }} />
            <Text style={authStyles.deviceEmailPickText}>Pumili mula sa Email sa Phone</Text>
          </TouchableOpacity>
          <Text style={authStyles.fieldLabel}>Email</Text>
          <TextInput
            style={authStyles.cardInput}
            placeholder="e.g. student@tip.edu.ph"
            placeholderTextColor="#A1A1AA"
            value={loginEmail}
            onChangeText={setLoginEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Text style={authStyles.fieldLabel}>Password</Text>
          <View style={authStyles.passwordInputWrapper}>
            <TextInput
              style={authStyles.cardInputFlex}
              placeholder="Enter password"
              placeholderTextColor="#A1A1AA"
              secureTextEntry={!showPassword}
              value={loginPassword}
              onChangeText={setLoginPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 4 }}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#64748B" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={authStyles.loginBlueBtn} onPress={onLoginSubmit}>
            <Text style={authStyles.loginBlueBtnText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginTop: 16, alignSelf: 'center' }}>
            <Text style={authStyles.forgotText}>Forgot your password?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function InlineRoleSelectScreen({
  selectedRole,
  setSelectedRole,
  onContinue,
  roleErrorMessage,
  loginEmail,
  onPickDeviceAccount,
}: any) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E58A8' }}>
      <ScrollView contentContainerStyle={authStyles.roleScrollContainer} showsVerticalScrollIndicator={false}>
        <Text style={authStyles.firstTimeTitle}>First time?</Text>
        <Text style={authStyles.firstTimeSub}>
          {selectedRole === 'educator'
            ? 'Manage thesis groups, monitor student progress, and provide feedback.'
            : selectedRole === 'student'
            ? 'Manage your thesis, track your progress, and get AI-powered assistance.'
            : "Let's get started by choosing your role."}
        </Text>
        <View style={authStyles.roleMainWhiteCard}>
          {roleErrorMessage ? (
            <View style={authStyles.errorContainer}>
              <Ionicons name="alert-circle-outline" size={18} color="#DC2626" />
              <Text style={authStyles.errorText}>{roleErrorMessage}</Text>
            </View>
          ) : null}
          {loginEmail ? (
            <View style={authStyles.selectedEmailBox}>
              <Ionicons name="mail" size={16} color="#1E58A8" style={{ marginRight: 6 }} />
              <Text style={authStyles.selectedEmailText} numberOfLines={1}>
                Gagamitin: {loginEmail}
              </Text>
              <TouchableOpacity onPress={onPickDeviceAccount} style={{ marginLeft: 'auto' }}>
                <Text style={authStyles.changeEmailText}>Baguhin</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={authStyles.deviceEmailPickBtn} onPress={onPickDeviceAccount}>
              <Ionicons name="logo-google" size={18} color="#4285F4" style={{ marginRight: 8 }} />
              <Text style={authStyles.deviceEmailPickText}>
                Pumili ng Email sa Phone para Mag-register
              </Text>
            </TouchableOpacity>
          )}
          <View style={authStyles.roleCardsGrid}>
            <TouchableOpacity
              style={[
                authStyles.squareRoleCard,
                selectedRole === 'student' && authStyles.squareRoleCardActive,
              ]}
              onPress={() => setSelectedRole('student')}
            >
              {selectedRole === 'student' && (
                <View style={authStyles.blueCheckCircle}>
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                </View>
              )}
              <Ionicons name="school" size={44} color={selectedRole === 'student' ? '#1E58A8' : '#A1A1AA'} />
              <Text
                style={[
                  authStyles.roleBtnLabel,
                  selectedRole === 'student' && authStyles.roleBtnLabelActive,
                ]}
              >
                I'm a student
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                authStyles.squareRoleCard,
                selectedRole === 'educator' && authStyles.squareRoleCardActive,
              ]}
              onPress={() => setSelectedRole('educator')}
            >
              {selectedRole === 'educator' && (
                <View style={authStyles.blueCheckCircle}>
                  <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                </View>
              )}
              <Ionicons name="person" size={44} color={selectedRole === 'educator' ? '#1E58A8' : '#A1A1AA'} />
              <Text
                style={[
                  authStyles.roleBtnLabel,
                  selectedRole === 'educator' && authStyles.roleBtnLabelActive,
                ]}
              >
                I'm an educator
              </Text>
            </TouchableOpacity>
          </View>
          {selectedRole && (
            <View style={authStyles.capabilitiesBox}>
              <Text style={authStyles.capHeader}>You will be able to:</Text>
              {selectedRole === 'student' ? (
                <>
                  <Text style={authStyles.capBullet}>• Use the app for its intended purpose for students</Text>
                  <Text style={authStyles.capBullet}>• Access ThesisPilot workspace & chapters</Text>
                  <Text style={authStyles.capBullet}>• Evaluate Peers & track deadlines</Text>
                </>
              ) : (
                <>
                  <Text style={authStyles.capBullet}>• Create thesis groups & invite students</Text>
                  <Text style={authStyles.capBullet}>• Evaluate & grade students' work</Text>
                  <Text style={authStyles.capBullet}>• Set events, deadlines, and requirements</Text>
                </>
              )}
            </View>
          )}
          <Text style={authStyles.disclaimerText}>
            Please proceed cautiously as changing roles will be subject to approval.
          </Text>
          <TouchableOpacity
            style={[
              authStyles.continueBlueBtn,
              !selectedRole && { backgroundColor: '#93C5FD' },
            ]}
            disabled={!selectedRole}
            onPress={onContinue}
          >
            <Text style={authStyles.continueBlueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// 3. MAIN APP ROUTER & GLOBAL STATE
export default function MainApp() {
  const [currentScreen, setCurrentScreen] = useState<
    'splash' | 'login' | 'roleSelect' | 'studentDashboard' | 'educatorDashboard'
  >('splash');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'educator' | null>('student');
  const [errorMessage, setErrorMessage] = useState('');
  const [roleErrorMessage, setRoleErrorMessage] = useState('');
  const [showPickerModal, setShowPickerModal] = useState(false);

  // Registered Users Registry
  const [registeredUsers, setRegisteredUsers] = useState<
    Record<string, { role: 'student' | 'educator'; pass: string }>
  >({
    'qjjramirez@tip.edu.ph': { role: 'student', pass: 'student123' },
    'student@tip.edu.ph': { role: 'student', pass: 'student123' },
    'educator@tip.edu.ph': { role: 'educator', pass: 'educator123' },
  });

  const [studentDashView, setStudentDashView] = useState<any>('main');
  const [educatorDashView, setEducatorDashView] = useState<'dashboard' | 'chat' | 'profile' | 'repository'>('dashboard');

  const [thesisProjectsList] = useState<ThesisProject[]>([
    {
      id: 'proj-1',
      title: 'The Impact of AI on Student Learning Outcomes',
      description: 'This study explores the impact of AI tools on college students.',
      adviser: 'Dr. Elizzette Joy Mationg',
      adviserEmail: 'ejmationg@tip.edu.ph',
      status: 'In Progress',
      startDate: 'July 31, 2026',
      targetDefense: 'August 01, 2026',
    },
  ]);

  const [selectedThesis, setSelectedThesis] = useState<ThesisProject>(thesisProjectsList[0]);

  const [chaptersList, setChaptersList] = useState<ChapterItem[]>([
    { id: 'ch-1', number: 1, title: 'Introduction', progress: 100, fileName: 'Chapter1_Final.pdf', status: 'Approved' },
    { id: 'ch-2', number: 2, title: 'Literature Review', progress: 100, fileName: 'Chapter2_v2.pdf', status: 'Approved' },
    { id: 'ch-3', number: 3, title: 'Methodology', progress: 40, fileName: 'Chapter3_Draft.pdf', status: 'In Progress' },
    { id: 'ch-4', number: 4, title: 'Results & Discussion', progress: 0, status: 'Not Started' },
    { id: 'ch-5', number: 5, title: 'Conclusion', progress: 0, status: 'Not Started' },
  ]);

  const [notesList, setNotesList] = useState<NoteItem[]>([
    { id: 'note-1', title: 'Research Ideas', content: 'AI tools for analysis', date: 'May 10, 2026', isStarred: true },
  ]);
  const [tasksList, setTasksList] = useState<TaskItem[]>([
    { id: 'tsk-0', title: 'Adviser Consultation', chapter: 'General', dueDate: '2026-05-19', category: 'In Progress', completed: false },
  ]);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([
    { id: 'fb-1', adviserName: 'Dr. Elizzette Joy Mationg', date: 'May 15, 2026', rating: '4.5/5', comment: 'Great progress in Chapter 2!' },
  ]);
  const [referencesList, setReferencesList] = useState<ReferenceItem[]>([
    { id: 'ref-1', title: 'AI in Education', authors: 'Johnson et al.', source: 'Journal 2025', type: 'Journal', citationStyle: 'APA', scholarUrl: 'https://scholar.google.com' },
  ]);
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>([
    { id: 'n1', title: 'Feedback Added', description: 'Dr. Mationg left feedback', time: '1h ago', category: 'Today', isUnread: true, type: 'adviser' },
  ]);
  const [activityLogsList, setActivityLogsList] = useState<ActivityLogItem[]>([
    { id: 'act-1', actor: 'Dr. Elizzette', actionText: 'reviewed', targetText: 'Chapter 2', timeAgo: '12 hours ago', category: 'Today', type: 'comment' },
  ]);

  const overallProgress = Math.round(
    chaptersList.reduce((acc, c) => acc + c.progress, 0) / (chaptersList.length || 1)
  );

  // Find account details from list
  const matchedAccount = ACCOUNTS_ON_PHONE.find(
    (acc) => acc.email.toLowerCase() === loginEmail.trim().toLowerCase()
  );

  const handleSelectAccountFromDevice = (selectedEmail: string) => {
    setShowPickerModal(false);
    if (!selectedEmail) return;
    setLoginEmail(selectedEmail);
    const cleanEmail = selectedEmail.trim().toLowerCase();

    if (registeredUsers[cleanEmail]) {
      setSelectedRole(registeredUsers[cleanEmail].role);
    }
    setCurrentScreen('roleSelect');
  };

  const handleAddAccountPrompt = () => {
    setShowPickerModal(false);
    Alert.prompt('Add Account', 'Enter new Google Email address:', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Add',
        onPress: (typedEmail) => {
          if (typedEmail) handleSelectAccountFromDevice(typedEmail);
        },
      },
    ], 'plain-text');
  };

  const handleUseWithoutGoogleAccount = () => {
    setShowPickerModal(false);
    setLoginEmail('');
    setCurrentScreen('login');
  };

  const handleLoginSubmit = () => {
    setErrorMessage('');
    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    if (!cleanEmail && !cleanPass) {
      setErrorMessage('Kailangang ilagay ang Email at Password.');
      return;
    }
    if (!cleanEmail) {
      setErrorMessage('Kailangang ilagay ang iyong Email.');
      return;
    }
    if (!cleanPass) {
      setErrorMessage('Kailangang ilagay ang iyong Password.');
      return;
    }

    const existingUser = registeredUsers[cleanEmail];
    if (existingUser) {
      if (existingUser.pass !== cleanPass) {
        setErrorMessage('Mali ang Password. Pakisubukang muli.');
        return;
      }
      if (existingUser.role === 'student') {
        setCurrentScreen('studentDashboard');
      } else if (existingUser.role === 'educator') {
        setCurrentScreen('educatorDashboard');
      }
    } else {
      setCurrentScreen('roleSelect');
    }
  };

  const handleRoleContinue = () => {
    const cleanEmail = loginEmail.trim().toLowerCase();
    setRoleErrorMessage('');

    if (!cleanEmail) {
      setRoleErrorMessage('Pumili muna ng Email mula sa iyong phone o i-type ito.');
      return;
    }
    if (!selectedRole) {
      setRoleErrorMessage('Pumili muna ng iyong papel (Student o Educator).');
      return;
    }

    if (cleanEmail && registeredUsers[cleanEmail]) {
      const existingRole = registeredUsers[cleanEmail].role;
      if (existingRole === 'student' && selectedRole === 'educator') {
        setRoleErrorMessage(
          'Ang email na ito ay nakarehistro bilang Student. Hindi ito pwedeng gamitin para sa Educator.'
        );
        return;
      }
      if (existingRole === 'educator' && selectedRole === 'student') {
        setRoleErrorMessage(
          'Ang email na ito ay nakarehistro bilang Educator. Hindi ito pwedeng gamitin para sa Student.'
        );
        return;
      }
    }

    if (cleanEmail) {
      setRegisteredUsers((prev) => ({
        ...prev,
        [cleanEmail]: {
          role: selectedRole,
          pass: loginPassword || '123456',
        },
      }));

      if (selectedRole === 'student') {
        setCurrentScreen('studentDashboard');
      } else {
        setCurrentScreen('educatorDashboard');
      }
    }
  };

  const handleLogout = () => {
    setRoleErrorMessage('');
    setCurrentScreen('roleSelect');
  };

  const currentDynamicName = matchedAccount
    ? matchedAccount.name
    : loginEmail
    ? loginEmail.split('@')[0]
    : 'Educator User';

  const currentDynamicEmail = loginEmail || 'educator@domain.com';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E58A8" translucent={false} />

      <GoogleDarkAccountChooserModal
        visible={showPickerModal}
        onClose={() => setShowPickerModal(false)}
        onSelectAccount={handleSelectAccountFromDevice}
        onAddAccount={handleAddAccountPrompt}
        onUseWithoutAccount={handleUseWithoutGoogleAccount}
      />

      {currentScreen === 'splash' && (
        <InlineSplashScreen
          onGoogleSignUp={() => {
            setRoleErrorMessage('');
            setShowPickerModal(true);
          }}
          onGoogleLogin={() => {
            setErrorMessage('');
            setShowPickerModal(true);
          }}
        />
      )}

      {currentScreen === 'login' && (
        <InlineLoginScreen
          loginEmail={loginEmail}
          setLoginEmail={setLoginEmail}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          errorMessage={errorMessage}
          onBack={() => setCurrentScreen('splash')}
          onLoginSubmit={handleLoginSubmit}
          onPickDeviceAccount={() => setShowPickerModal(true)}
        />
      )}

      {currentScreen === 'roleSelect' && (
        <InlineRoleSelectScreen
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          roleErrorMessage={roleErrorMessage}
          loginEmail={loginEmail}
          onContinue={handleRoleContinue}
          onPickDeviceAccount={() => setShowPickerModal(true)}
        />
      )}

      {currentScreen === 'studentDashboard' && (
        <View style={{ flex: 1 }}>
          <StudentDashboardScreen
            studentDashView={studentDashView}
            setStudentDashView={setStudentDashView}
            selectedThesis={selectedThesis}
            setSelectedThesis={setSelectedThesis}
            thesisProjectsList={thesisProjectsList}
            chaptersList={chaptersList}
            setChaptersList={setChaptersList}
            notesList={notesList}
            setNotesList={setNotesList}
            tasksList={tasksList}
            setTasksList={setTasksList}
            feedbackList={feedbackList}
            setFeedbackList={setFeedbackList}
            referencesList={referencesList}
            setReferencesList={setReferencesList}
            notificationsList={notificationsList}
            setNotificationsList={setNotificationsList}
            activityLogsList={activityLogsList}
            onLogout={handleLogout}
            userName={currentDynamicName}
            userEmail={currentDynamicEmail}
            userData={{
              fullName: currentDynamicName,
              email: currentDynamicEmail,
              role: 'Student',
            }}
          />
        </View>
      )}

      {/* EDUCATOR MAIN VIEW - CLEAN WITHOUT DUPLICATE BOTTOM BAR */}
      {currentScreen === 'educatorDashboard' && (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
          <EducatorDashboardScreen
            onSwitchRole={handleLogout}
            setEducatorDashView={setEducatorDashView}
            overallProgress={overallProgress}
            chaptersList={chaptersList}
            educatorName={currentDynamicName}
            educatorEmail={currentDynamicEmail}
            userData={{
              fullName: currentDynamicName,
              email: currentDynamicEmail,
              role: 'Educator',
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E58A8',
    flex: 1,
  },
});

const pickerStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cardContainer: {
    width: '100%',
    backgroundColor: '#232D38',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    maxHeight: '80%',
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  accountInfo: {
    flex: 1,
  },
  accountNameText: {
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: 'bold',
  },
  accountEmailText: {
    color: '#94A3B8',
    fontSize: 13,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  actionIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconCircleGrey: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#475569',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionText: {
    color: '#E2E8F0',
    fontSize: 15,
    fontWeight: '500',
  },
});

const authStyles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#1E58A8',
    paddingHorizontal: 24,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  logoBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 12,
  },
  splashSub: {
    fontSize: 13,
    color: '#E0F2FE',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 16,
  },
  splashBottomBtnGroup: {
    width: '100%',
    paddingBottom: 20,
    gap: 12,
  },
  googleBtnWhite: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  googleBtnTextDark: {
    color: '#1E293B',
    fontWeight: 'bold',
    fontSize: 15,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dividerText: {
    color: '#FFFFFF',
    paddingHorizontal: 12,
    fontSize: 12,
  },
  loginScrollContainer: {
    flexGrow: 1,
    backgroundColor: '#1E58A8',
    padding: 24,
  },
  backBtn: {
    marginTop: 8,
    marginBottom: 20,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  welcomeSub: {
    fontSize: 14,
    color: '#E0F2FE',
    marginBottom: 28,
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    elevation: 4,
  },
  deviceEmailPickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 12,
  },
  deviceEmailPickText: {
    color: '#1E58A8',
    fontSize: 13,
    fontWeight: 'bold',
  },
  selectedEmailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 14,
  },
  selectedEmailText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
    flex: 1,
  },
  changeEmailText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1E58A8',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    gap: 6,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 6,
    marginTop: 8,
  },
  cardInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    height: 46,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  passwordInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 46,
  },
  cardInputFlex: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  loginBlueBtn: {
    backgroundColor: '#1E58A8',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  loginBlueBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  forgotText: {
    color: '#1E58A8',
    fontWeight: '600',
    fontSize: 13,
  },
  roleScrollContainer: {
    flexGrow: 1,
    backgroundColor: '#1E58A8',
    padding: 20,
  },
  firstTimeTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
  },
  firstTimeSub: {
    fontSize: 13,
    color: '#E0F2FE',
    marginTop: 4,
    marginBottom: 20,
    lineHeight: 18,
  },
  roleMainWhiteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    marginBottom: 20,
  },
  roleCardsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  squareRoleCard: {
    flex: 1,
    height: 120,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  squareRoleCardActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2,
    borderColor: '#1E58A8',
  },
  blueCheckCircle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#1E58A8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleBtnLabel: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
  },
  roleBtnLabelActive: {
    color: '#1E58A8',
    fontWeight: 'bold',
  },
  capabilitiesBox: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  capHeader: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 6,
  },
  capBullet: {
    fontSize: 12,
    color: '#334155',
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  continueBlueBtn: {
    backgroundColor: '#1E58A8',
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueBlueBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});