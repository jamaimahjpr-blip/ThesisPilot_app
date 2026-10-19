export interface SplashScreenProps {
  onGoogleSignUp: () => void;
  onGoogleLogin: () => void;
}

export interface LoginScreenProps {
  loginEmail: string;
  setLoginEmail: (email: string) => void;
  loginPassword: string;
  setLoginPassword: (password: string) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
  onBack: () => void;
  onLoginSubmit: () => void;
  onForgotPassword: () => void;
}

export interface RoleSelectScreenProps {
  selectedRole: 'student' | 'educator' | null;
  setSelectedRole: (role: 'student' | 'educator') => void;
  onContinue: () => void;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  category: string;
  isUnread: boolean;
  type: string;
}

export interface ChapterItem {
  id: string;
  number: number;
  title: string;
  progress: number;
  fileName?: string;
  submittedAt?: string;
  status: string;
}

export interface ThesisProject {
  id: string;
  title: string;
  description: string;
  adviser: string;
  adviserEmail: string;
  status: string;
  startDate: string;
  targetDefense: string;
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
  date: string;
  isStarred: boolean;
}

export interface ActivityLogItem {
  id: string;
  actor: string;
  actionText: string;
  targetText: string;
  timeAgo: string;
  category: string;
  type: string;
}

export interface TaskItem {
  id: string;
  title: string;
  chapter: string;
  dueDate: string;
  category: string;
  completed: boolean;
  timeSlot?: string;
  personName?: string;
  isGoogleMeeting?: boolean;
}

export interface FeedbackItem {
  id: string;
  adviserName: string;
  date: string;
  rating: string;
  comment: string;
  chapterTag?: string;
  statusTag?: string;
  replies?: any[];
}

export interface ReferenceItem {
  id: string;
  title: string;
  authors: string;
  source: string;
  type: string;
  citationStyle: string;
  scholarUrl: string;
}