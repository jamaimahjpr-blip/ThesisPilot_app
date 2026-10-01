// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Gawing null muna para sa Login Screen dumiretso pagbukas ng app
  const [user, setUser] = useState(null);

  // New states for Google OAuth token management
  const [googleTokens, setGoogleTokens] = useState(null);

  // Initialize Google Sign-In SDK configuration
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: 'YOUR GOOGLE CLIENT ID.apps.googleusercontent.com', // Replace with your Web Client ID from GCP
      scopes: [
        'https://www.googleapis.com/auth/documents',                // Google Docs
        'https://www.googleapis.com/auth/drive.file',               // Google Drive
        'https://www.googleapis.com/auth/calendar.events',          // Google Calendar
        'https://www.googleapis.com/auth/classroom.courses.readonly',// Google Classroom
        'https://www.googleapis.com/auth/presentations',            // Google Slides
        'https://www.googleapis.com/auth/spreadsheets'              // Google Sheets
      ],
    });
  }, []);

  // Existing Login function
  const login = (email, password, role = 'student') => {
    setUser({
      name: 'Jamaimah',
      email,
      role: role.toLowerCase(), // 'student' o 'educator'
      group: 'BSCS Thesis Group 1'
    });
  };

  // Existing Signup function
  const signup = (name, email, password, role = 'student') => {
    setUser({
      name: name || 'Jamaimah',
      email,
      role: role.toLowerCase(),
      group: 'BSCS Thesis Group 1'
    });
  };

  // New Google Sign-In function
  const signInWithGoogle = async (role = 'student') => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const tokens = await GoogleSignin.getTokens();
      setGoogleTokens(tokens.accessToken);
      setUser({
        name: userInfo.user.name || 'Jamaimah',
        email: userInfo.user.email,
        role: role.toLowerCase(),
        group: 'BSCS Thesis Group 1',
        photo: userInfo.user.photo
      });
    } catch (error) {
      console.error("Google Sign-In Error:", error);
    }
  };

  // Existing Switch Role function
  const switchRole = (newRole) => {
    setUser((prev) => (prev ? { ...prev, role: newRole.toLowerCase() } : null));
  };

  // Updated Logout function (also handles Google Sign-Out if signed in)
  const logout = async () => {
    try {
      if (googleTokens) {
        await GoogleSignin.signOut();
        setGoogleTokens(null);
      }
    } catch (error) {
      console.error("Google Sign-Out Error:", error);
    }
    setUser(null); // Babalik nang kusa sa Login Screen
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        googleTokens,
        login,
        signup,
        signInWithGoogle,
        switchRole,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};