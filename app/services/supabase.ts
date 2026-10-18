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
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpaHBkcm1sYmZtdHVqaGJldm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODU1MjYsImV4cCI6MjA1NTk2MTUyNn0';

// Safe key cleanup to prevent "Cannot read property 'split' of undefined"
const cleanKey = (key?: string) => {
  if (!key) return '';
  const parts = key.split('.');
  if (parts.length >= 3) {
    return `${parts[0]}.${parts[1]}.${parts[2].split('.')[0]}`;
  }
  return key;
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