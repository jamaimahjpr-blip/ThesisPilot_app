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