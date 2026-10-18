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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SplashScreenProps, LoginScreenProps, RoleSelectScreenProps } from '../types';
import {
  signUpWithOTP,
  verifyEmailOTP,
  sendLoginOTP,
  loginWithPassword,
  signUpWithEmail,
  checkUserSession,
  checkEmailVerified,
  signInWithGoogle,
} from '../services/auth';

// 1. SPLASH SCREEN
export function SplashScreenComponent({ onGoogleSignUp, onGoogleLogin }: SplashScreenProps) {
  const [loading, setLoading] = useState(false);

  const handleGoogleAuth = async (customCallback?: () => void) => {
    try {
      setLoading(true);
      await signInWithGoogle();
      if (customCallback) customCallback();
    } catch (error: any) {
      Alert.alert('Google Auth Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.splashScrollContent} bounces={false}>
      <View style={styles.centerBrand}>
        <Ionicons name="school" size={90} color="#FFFFFF" />
        <Text style={styles.appTitle}>ThesisPilot</Text>
      </View>

      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.googleBtn}
          activeOpacity={0.85}
          disabled={loading}
          onPress={() => handleGoogleAuth(onGoogleSignUp)}
        >
          {loading ? (
            <ActivityIndicator color="#1E58A8" />
          ) : (
            <>
              <Ionicons name="logo-google" size={20} color="#4285F4" />
              <Text style={styles.btnText}>Sign up with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={styles.googleBtn}
          activeOpacity={0.85}
          disabled={loading}
          onPress={() => handleGoogleAuth(onGoogleLogin)}
        >
          {loading ? (
            <ActivityIndicator color="#1E58A8" />
          ) : (
            <>
              <Ionicons name="logo-google" size={20} color="#4285F4" />
              <Text style={styles.btnText}>Login with Google</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// 2. LOGIN SCREEN
export function LoginScreenComponent({
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  showPassword,
  setShowPassword,
  onBack,
  onLoginSubmit,
  onForgotPassword,
}: LoginScreenProps) {
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'verify'>('request');

  const handleStandardLogin = async () => {
    if (!loginEmail.trim() || !loginPassword.trim()) {
      Alert.alert('Error', 'Mangyaring ilagay ang iyong email at password.');
      return;
    }
    try {
      setLoading(true);
      await loginWithPassword(loginEmail.trim(), loginPassword);
      if (onLoginSubmit) onLoginSubmit();
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendResetOTP = async () => {
    if (!forgotEmail.trim()) {
      Alert.alert('Error', 'Ilagay ang iyong email address.');
      return;
    }
    try {
      setLoading(true);
      await sendLoginOTP(forgotEmail.trim());
      Alert.alert('OTP Sent', `Ipinadala ang password reset OTP sa ${forgotEmail}.`);
      setForgotStep('verify');
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyResetOTP = async () => {
    if (!resetOtp || resetOtp.length < 6) {
      Alert.alert('Error', 'Ilagay ang kumpletong 6-digit OTP code.');
      return;
    }
    try {
      setLoading(true);
      await verifyEmailOTP(forgotEmail.trim(), resetOtp, '', 'student');
      Alert.alert('Success', 'Matagumpay na na-verify ang iyong account!');
      setShowForgotModal(false);
      setForgotStep('request');
      setResetOtp('');
      setNewPassword('');
    } catch (error: any) {
      Alert.alert('Reset Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.loginScrollContent} showsVerticalScrollIndicator={false}>
      <TouchableOpacity style={styles.backToSplashBtn} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.loginWelcomeTitle}>Welcome</Text>
      <Text style={styles.loginWelcomeSub}>to Thesis platform</Text>

      <View style={styles.loginCard}>
        <Text style={styles.loginFieldLabel}>Email</Text>
        <TextInput
          style={styles.loginInput}
          placeholder="Email"
          placeholderTextColor="#94A3B8"
          value={loginEmail}
          onChangeText={setLoginEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={[styles.loginFieldLabel, { marginTop: 16 }]}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Password"
            placeholderTextColor="#94A3B8"
            secureTextEntry={!showPassword}
            value={loginPassword}
            onChangeText={setLoginPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye' : 'eye-outline'}
              size={20}
              color="#64748B"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginSubmitBtn}
          activeOpacity={0.85}
          onPress={handleStandardLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginSubmitText}>Login</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.forgotBtn}
          onPress={() => {
            setForgotEmail(loginEmail);
            setShowForgotModal(true);
          }}
        >
          <Text style={styles.forgotBtnText}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showForgotModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Forgot Password</Text>
            {forgotStep === 'request' ? (
              <>
                <Text style={styles.modalSub}>
                  Ilagay ang iyong email upang makatanggap ng OTP code.
                </Text>
                <TextInput
                  style={[styles.loginInput, { marginBottom: 16 }]}
                  placeholder="Email"
                  placeholderTextColor="#94A3B8"
                  value={forgotEmail}
                  onChangeText={setForgotEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.continueBtnBlue}
                  onPress={handleSendResetOTP}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.continueBtnTextWhite}>Send Reset OTP</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.modalSub}>
                  Ilagay ang 6-digit OTP code at ang iyong bagong password.
                </Text>
                <TextInput
                  style={styles.otpInput}
                  placeholder="000000"
                  placeholderTextColor="#94A3B8"
                  keyboardType="number-pad"
                  maxLength={6}
                  value={resetOtp}
                  onChangeText={setResetOtp}
                />
                <TextInput
                  style={[styles.loginInput, { marginBottom: 16 }]}
                  placeholder="New Password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
                <TouchableOpacity
                  style={styles.continueBtnBlue}
                  onPress={handleVerifyResetOTP}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.continueBtnTextWhite}>Update Password</Text>
                  )}
                </TouchableOpacity>
              </>
            )}
            <TouchableOpacity
              style={[styles.forgotBtn, { marginTop: 12 }]}
              onPress={() => {
                setShowForgotModal(false);
                setForgotStep('request');
              }}
            >
              <Text style={styles.forgotBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

// 3. FIRST TIME / ROLE SELECT SCREEN
export function RoleSelectScreenComponent({
  selectedRole,
  setSelectedRole,
  onContinue,
}: RoleSelectScreenProps) {
  const [userEmail, setUserEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignUpSubmit = async () => {
    if (!userEmail.trim() || !fullName.trim()) {
      Alert.alert('Error', 'Mangyaring punan ang Full Name at Email.');
      return;
    }
    if (!selectedRole) {
      Alert.alert('Error', 'Pumili muna ng iyong role (Student / Educator).');
      return;
    }
    try {
      setLoading(true);
      await signUpWithEmail(userEmail, fullName, selectedRole);
      Alert.alert(
        'Confirmation Link Sent',
        `Nagpadala kami ng email confirmation link sa ${userEmail}. Paki-check ang iyong inbox!`
      );
      setShowConfirmationModal(true);
    } catch (error: any) {
      Alert.alert('Registration Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckConfirmation = async () => {
    try {
      setLoading(true);
      const isVerified = await checkEmailVerified(userEmail);
      if (isVerified) {
        Alert.alert('Verified!', 'Matagumpay na na-verify ang iyong account.');
        setShowConfirmationModal(false);
        if (onContinue) onContinue();
      } else {
        Alert.alert(
          'Email Not Confirmed',
          'Hindi pa na-co-confirm ang iyong email address. Paki-buksan ang iyong Gmail at i-pindot ang "Confirm email address" link bago mag-Proceed.'
        );
      }
    } catch (error: any) {
      Alert.alert('Verification Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.roleScrollContainer} showsVerticalScrollIndicator={false}>
      <Text style={styles.roleTitle}>First time?</Text>
      <Text style={styles.roleSub}>
        {selectedRole === 'student'
          ? 'Manage your thesis, track your progress, \nand get AI-powered assistance.'
          : selectedRole === 'educator'
          ? 'Manage thesis groups, monitor student\nprogress, and provide feedback.'
          : "Let's get started by choosing your role."}
      </Text>

      <View style={styles.roleCard}>
        <View style={styles.roleButtonsRow}>
          <TouchableOpacity
            style={[
              styles.roleButton,
              selectedRole === 'student' && styles.roleButtonActiveStudent,
            ]}
            activeOpacity={0.85}
            onPress={() => setSelectedRole('student')}
          >
            {selectedRole === 'student' && (
              <View style={styles.checkBadge}>
                <Ionicons name="checkmark-circle" size={22} color="#1E58A8" />
              </View>
            )}
            <Ionicons name="school" size={48} color="#FFFFFF" />
            <Text style={styles.roleButtonText}>I'm a student</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.roleButton,
              selectedRole === 'educator' && styles.roleButtonActiveEducator,
            ]}
            activeOpacity={0.85}
            onPress={() => setSelectedRole('educator')}
          >
            {selectedRole === 'educator' && (
              <View style={styles.checkBadge}>
                <Ionicons name="checkmark-circle" size={22} color="#1E58A8" />
              </View>
            )}
            <Ionicons name="person" size={48} color="#FFFFFF" />
            <Text style={styles.roleButtonText}>I'm an educator</Text>
          </TouchableOpacity>
        </View>

        {selectedRole === 'student' && (
          <View style={styles.studentDetailsContainer}>
            <Text style={styles.loginFieldLabel}>Full Name</Text>
            <TextInput
              style={[styles.loginInput, { marginBottom: 12 }]}
              placeholder="Juan Dela Cruz"
              placeholderTextColor="#94A3B8"
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.loginFieldLabel}>Email Address</Text>
            <TextInput
              style={[styles.loginInput, { marginBottom: 16 }]}
              placeholder="student@university.edu.ph"
              placeholderTextColor="#94A3B8"
              value={userEmail}
              onChangeText={setUserEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.permissionsCard}>
              <Text style={styles.permTitle}>You will be able to:</Text>
              <Text style={styles.permBullet}>
                • Use the app for its intended purpose for students
              </Text>
              <Text style={styles.permBullet}>• Access ThesisPilot workspace</Text>
              <Text style={styles.permBullet}>• Evaluate Peers</Text>
            </View>

            <Text style={styles.cautionText}>
              Please proceed cautiously as changing roles will be subject to approval.
            </Text>

            <TouchableOpacity
              style={styles.continueBtnBlue}
              activeOpacity={0.85}
              onPress={handleSignUpSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.continueBtnTextWhite}>Continue</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {selectedRole === 'educator' && (
          <View style={styles.studentDetailsContainer}>
            <Text style={styles.loginFieldLabel}>Full Name</Text>
            <TextInput
              style={[styles.loginInput, { marginBottom: 12 }]}
              placeholder="Prof. Maria Santos"
              placeholderTextColor="#94A3B8"
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.loginFieldLabel}>Email Address</Text>
            <TextInput
              style={[styles.loginInput, { marginBottom: 16 }]}
              placeholder="educator@university.edu.ph"
              placeholderTextColor="#94A3B8"
              value={userEmail}
              onChangeText={setUserEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.permissionsCard}>
              <Text style={styles.permTitle}>You will be able to:</Text>
              <Text style={styles.permBullet}>
                • Create thesis groups & invite students
              </Text>
              <Text style={styles.permBullet}>
                • Evaluate & grade students' work
              </Text>
              <Text style={styles.permBullet}>
                • Set events, deadlines, and requirements
              </Text>
            </View>

            <Text style={styles.cautionText}>
              Please proceed cautiously as changing roles will be subject to approval.
            </Text>

            <TouchableOpacity
              style={styles.continueBtnBlue}
              activeOpacity={0.85}
              onPress={handleSignUpSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.continueBtnTextWhite}>Continue</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Modal visible={showConfirmationModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons
              name="mail-unread"
              size={60}
              color="#1E58A8"
              style={{ alignSelf: 'center', marginBottom: 12 }}
            />
            <Text style={styles.modalTitle}>Check Your Email</Text>
            <Text style={styles.modalSub}>
              Nagpadala kami ng confirmation link sa{' '}
              <Text style={{ fontWeight: 'bold' }}>{userEmail}</Text>. I-tap ang
              "Sign in" o "Confirm email address" link sa email para makapag-proceed.
            </Text>

            <TouchableOpacity
              style={styles.continueBtnBlue}
              onPress={handleCheckConfirmation}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.continueBtnTextWhite}>Confirm / Proceed</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.forgotBtn, { marginTop: 12 }]}
              onPress={() => setShowConfirmationModal(false)}
            >
              <Text style={styles.forgotBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

export async function sendDeleteAccountOTP(email: string) {
  return await sendLoginOTP(email);
}

const styles = StyleSheet.create({
  splashScrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
    backgroundColor: '#1E58A8',
  },
  centerBrand: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 16,
  },
  bottomSection: {
    width: '100%',
  },
  googleBtn: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
  },
  btnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 12,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dividerText: {
    color: '#FFFFFF',
    marginHorizontal: 12,
    fontSize: 14,
  },
  loginScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: '#1E58A8',
  },
  backToSplashBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
  },
  loginWelcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  loginWelcomeSub: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 24,
  },
  loginCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
  },
  loginFieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  loginInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#000000',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#000000',
  },
  loginSubmitBtn: {
    backgroundColor: '#1E58A8',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  loginSubmitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  forgotBtn: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotBtnText: {
    color: '#1E58A8',
    fontSize: 14,
    fontWeight: '500',
  },
  roleScrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 40,
    backgroundColor: '#1E58A8',
  },
  roleTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  roleSub: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
    lineHeight: 20,
  },
  roleCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
  },
  roleButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    backgroundColor: '#94A3B8',
    borderRadius: 16,
    paddingVertical: 24,
    alignItems: 'center',
    position: 'relative',
  },
  roleButtonActiveStudent: {
    backgroundColor: '#1E58A8',
  },
  roleButtonActiveEducator: {
    backgroundColor: '#1E58A8',
  },
  checkBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  roleButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 12,
  },
  studentDetailsContainer: {
    marginTop: 20,
  },
  permissionsCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  permTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  permBullet: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 4,
  },
  cautionText: {
    fontSize: 11,
    color: '#64748B',
    textAlign: 'center',
    marginVertical: 14,
  },
  continueBtnBlue: {
    backgroundColor: '#1E58A8',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  continueBtnTextWhite: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSub: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  otpInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingVertical: 12,
    fontSize: 22,
    letterSpacing: 6,
    textAlign: 'center',
    marginBottom: 20,
  },
});