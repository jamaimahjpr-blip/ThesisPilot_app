import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';

// Import Types from inside app/ folder
import {
  SplashScreenProps,
  NotificationItem,
  ChapterItem,
  ThesisProject,
  NoteItem,
  ActivityLogItem,
  TaskItem,
  FeedbackItem,
  ReferenceItem,
} from '../types';

// Import Screen Components from inside app/screens/ folder
import * as AuthModule from '../screens/AuthScreen';
import StudentDashboardScreen from '../screens/StudentDashboardScreen';
import EducatorDashboardScreen from '../screens/EducatorDashboardScreen';

// Resolve individual components safely whether default or named exports
const SplashScreen =
  AuthModule.SplashScreenComponent ||
  (AuthModule as any).SplashScreen ||
  (AuthModule as any).default;
const LoginScreen =
  AuthModule.LoginScreenComponent || (AuthModule as any).LoginScreen;
const RoleSelectScreen =
  AuthModule.RoleSelectScreenComponent || (AuthModule as any).RoleSelectScreen;

export default function MainApp(props: SplashScreenProps) {
  // Global Navigation & User Flow States
  const [currentScreen, setCurrentScreen] = useState<
    'splash' | 'login' | 'roleSelect' | 'studentDashboard' | 'educatorDashboard'
  >('splash');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'student' | 'educator' | null>('student');

  // Educator Dashboard Sub-Views State
  const [educatorDashView, setEducatorDashView] = useState<'dashboard' | 'chat' | 'profile'>('dashboard');

  // Student Dashboard Sub-Views State
  const [studentDashView, setStudentDashView] = useState<
    | 'main'
    | 'roadmap'
    | 'deadlines'
    | 'activity'
    | 'fileInspect'
    | 'workspace'
    | 'tasks'
    | 'feedback'
    | 'references'
    | 'meetings'
    | 'chat'
    | 'ai'
    | 'peer'
    | 'defense'
    | 'settings'
    | 'help'
    | 'notifications'
    | 'fileRepo'
  >('main');

  // Dynamic Data States
  const [thesisProjectsList, setThesisProjectsList] = useState<ThesisProject[]>([
    {
      id: 'proj-1',
      title: 'The Impact of AI on Student Learning Outcomes',
      description:
        'This study explores the impact of Artificial Intelligence (AI) tools on the academic performance and learning experience of college students.',
      adviser: 'Dr. Elizzette Joy Mationg',
      adviserEmail: 'ejmationg@tip.edu.ph',
      status: 'In Progress',
      startDate: 'July 31, 2026',
      targetDefense: 'August 01, 2026',
    },
    {
      id: 'proj-2',
      title: 'Smart Campus IoT Infrastructure for Energy Management',
      description:
        'An empirical investigation on IoT sensors deployed across campus facilities to reduce electricity consumption and optimize HVAC systems.',
      adviser: 'Dr. Leonard Hofstadter',
      adviserEmail: 'lhofstadter@tip.edu.ph',
      status: 'Proposed',
      startDate: 'September 10, 2026',
      targetDefense: 'December 15, 2026',
    },
  ]);

  const [selectedThesis, setSelectedThesis] = useState<ThesisProject>(thesisProjectsList[0]);

  const [chaptersList, setChaptersList] = useState<ChapterItem[]>([
    {
      id: 'ch-1',
      number: 1,
      title: 'Introduction',
      progress: 100,
      fileName: 'Chapter1 Final.pdf',
      submittedAt: 'Feb 10, 2026',
      status: 'Approved',
    },
    {
      id: 'ch-2',
      number: 2,
      title: 'Literature Review',
      progress: 100,
      fileName: 'Chapter2 Literature Review v2.pdf',
      submittedAt: 'Mar 05, 2026',
      status: 'Approved',
    },
    {
      id: 'ch-3',
      number: 3,
      title: 'Methodology',
      progress: 40,
      fileName: 'Chapter3 Draft.pdf',
      submittedAt: 'Apr 20, 2026',
      status: 'In Progress',
    },
    {
      id: 'ch-4',
      number: 4,
      title: 'Results',
      progress: 0,
      status: 'Not Started',
    },
    {
      id: 'ch-5',
      number: 5,
      title: 'Conclusion',
      progress: 0,
      status: 'Not Started',
    },
  ]);

  const [notesList, setNotesList] = useState<NoteItem[]>([
    {
      id: 'note-1',
      title: 'Research Problem Ideas',
      content:
        'Some initial ideas for the research problem and background context regarding AI implementation.',
      date: 'May 10, 2026 10:30 AM',
      isStarred: true,
    },
    {
      id: 'note-2',
      title: 'Interview Question',
      content:
        'Questions to ask during the interview with participants and educators regarding thesis tools.',
      date: 'May 8, 2026 2:15 PM',
      isStarred: false,
    },
  ]);

  const [tasksList, setTasksList] = useState<TaskItem[]>([
    {
      id: 'tsk-0',
      title: 'Adviser Consultation',
      chapter: 'General',
      dueDate: '2026-05-19',
      category: 'In Progress',
      completed: false,
      timeSlot: '10:00 AM - 11:00 AM',
      personName: 'Dr. Elizzette Joy Mationg',
      isGoogleMeeting: true,
    },
    {
      id: 'tsk-1',
      title: 'Continue writing Chapter 3',
      chapter: 'Chapter 3',
      dueDate: '2026-05-19',
      category: 'In Progress',
      completed: false,
      timeSlot: '1:00 PM - 3:00 PM',
    },
  ]);

  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([
    {
      id: 'fb-1',
      adviserName: 'Dr. Elizzette Joy Mationg',
      date: 'May 15, 2026 10:30 AM',
      rating: '4.5/5',
      comment:
        'Great progress! The literature review is comprehensive. Please improve the synthesis of related studies.',
      chapterTag: 'Chapter 2 Literature Review',
      statusTag: 'Reviewed',
      replies: [],
    },
  ]);

  const [referencesList, setReferencesList] = useState<ReferenceItem[]>([
    {
      id: 'ref-1',
      title: 'The Impact of Artificial Intelligence on Education',
      authors: 'Johnson, R., & Smith, T.',
      source: 'Journal of Educational Technology, 45(2), 123-145.',
      type: 'Journal',
      citationStyle: 'APA',
      scholarUrl: 'https://scholar.google.com',
    },
  ]);

  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Adviser Feedback',
      description: 'Dr. Mationg reviewed your Chapter 2.',
      time: '47m ago',
      category: 'Today',
      isUnread: true,
      type: 'adviser',
    },
  ]);

  const [activityLogsList, setActivityLogsList] = useState<ActivityLogItem[]>([
    {
      id: 'act-1',
      actor: 'Dr. Elizzette',
      actionText: 'commented on',
      targetText: 'Chapter 2 Literature Review',
      timeAgo: '12 hours ago',
      category: 'Today',
      type: 'comment',
    },
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E58A8" translucent={false} />
      {currentScreen === 'splash' && SplashScreen ? (
        <SplashScreen
          onGoogleSignUp={() => setCurrentScreen('roleSelect')}
          onGoogleLogin={() => setCurrentScreen('login')}
        />
      ) : currentScreen === 'login' && LoginScreen ? (
        <LoginScreen
          loginEmail={loginEmail}
          setLoginEmail={setLoginEmail}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onBack={() => setCurrentScreen('splash')}
          onLoginSubmit={() => setCurrentScreen('roleSelect')}
          onForgotPassword={() => {}}
        />
      ) : currentScreen === 'roleSelect' && RoleSelectScreen ? (
        <RoleSelectScreen
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          onContinue={() => {
            if (selectedRole === 'student') {
              setCurrentScreen('studentDashboard');
            } else {
              setCurrentScreen('educatorDashboard');
            }
          }}
        />
      ) : currentScreen === 'studentDashboard' ? (
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
          onLogout={() => setCurrentScreen('splash')}
        />
      ) : (
        <EducatorDashboardScreen
          onSwitchRole={() => setCurrentScreen('roleSelect')}
          setEducatorDashView={setEducatorDashView}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E58A8',
    flex: 1,
  },
});