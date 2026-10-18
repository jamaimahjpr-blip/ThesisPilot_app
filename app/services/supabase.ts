import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';

// Binubuksan at pino-process ang OAuth session sa browser
WebBrowser.maybeCompleteAuthSession();

const SUPABASE_URL =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL ||
  process.env.EXPO_PUBLIC_SUPABASE_URL ||
  'https://wihpdrmlbfmtujhbevmg.supabase.co';

const SUPABASE_ANON_KEY =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpaHBkcm1sYmZtdHVqaGJldm1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODU1MjYsImV4cCI6MjA1NTk2MTUyNn0.sb_publishable_LbXslIwze95yfcf7srgrfQ_80RYf711';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});