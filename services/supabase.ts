import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const rawUrl =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  'https://wihpdrmlbfmtujhbevmg.supabase.co';

const rawKey =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpaHBkcm1sYmZtdHVqaGJldm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5OTI2MDIsImV4cCI6MjEwNzU2ODYwMn0._WqYGk-gEeeYos7aF6XCBDqY3wSoV6gqcteBGkTw8Ts';

// Safe key cleanup without returning empty string or causing undefined splits
const cleanKey = (key?: string) => {
  if (!key) return '';
  return key.trim();
};

export const SUPABASE_URL = (rawUrl || '').trim();
export const SUPABASE_ANON_KEY = cleanKey(rawKey);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});