import { supabase } from './supabase';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// 1. SIGN UP WITH OTP
export const signUpWithOTP = async (
  email: string,
  fullName: string,
  role: string
) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email.trim(),
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
      shouldCreateUser: true,
    },
  });
  if (error) throw error;
  return data;
};

// 2. VERIFY OTP
export const verifyEmailOTP = async (
  email: string,
  token: string,
  fullName: string,
  role: string
) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email: email.trim(),
    token: token.trim(),
    type: 'email',
  });
  if (error) throw error;
  return data;
};

// 3. LOGIN OTP
export const sendLoginOTP = async (email: string) => {
  const { error } = await supabase.auth.signInWithOtp({
    email: email.trim(),
  });
  if (error) throw error;
};

// 4. LOGOUT
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// 5. STANDARD LOGIN WITH PASSWORD
export const loginWithPassword = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password,
  });
  if (error) throw error;
  return data;
};

// 6. SIGN UP WITH EMAIL CONFIRMATION LINK
export const signUpWithEmail = async (
  email: string,
  fullName: string,
  role: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password: 'TemporaryPassword123!',
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  });
  if (error) throw error;
  return data;
};

// 7. CHECK IF USER IS VERIFIED / GET CURRENT SESSION
export const checkUserSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) throw error;
  return session;
};

// 8. CHECK IF USER HAS CONFIRMED EMAIL LINK IN GMAIL
export const checkEmailVerified = async (email?: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (user && user.email_confirmed_at) {
    return true;
  }
  if (email) {
    const { data: signInData, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: 'TemporaryPassword123!',
    });
    if (error) {
      return false;
    }
    return !!signInData.user?.email_confirmed_at;
  }
  return false;
};

// 9. GOOGLE OAUTH SIGN IN / SIGN UP (PARA SA STANDALONE APK)
export const signInWithGoogle = async () => {
  const redirectUrl = Linking.createURL('/');

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: redirectUrl,
      skipBrowserRedirect: true,
    },
  });

  if (error) throw error;

  if (data?.url) {
    const result = await WebBrowser.openAuthSessionAsync(
      data.url,
      redirectUrl
    );

    if (result.type === 'success' && result.url) {
      const { queryParams } = Linking.parse(result.url);
      if (queryParams?.access_token && queryParams?.refresh_token) {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.setSession({
            access_token: queryParams.access_token as string,
            refresh_token: queryParams.refresh_token as string,
          });
        if (sessionError) throw sessionError;
        return sessionData;
      }
    }
  }
  return null;
};