import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from './context/AuthContext';

// AUTH PAGES
import LoginScreen from './pages/auth/Login';
import SignupScreen from './pages/auth/Signup';
import ForgotPasswordScreen from './pages/auth/ForgotPassword';

// STUDENT PAGES
import StudentDashboard from './pages/student/StudentDashboard';
import ThesisWorkspace from './pages/student/ThesisWorkspace';
import TaskScreen from './pages/student/TaskScreen';
import ReferenceScreen from './pages/student/Reference';
import PeerAssessmentScreen from './pages/student/PeerAssessment';
import DefensePrepScreen from './pages/student/DefensePrep';

// SHARED PAGES
import ChatScreen from './pages/shared/Chat';
import AIAssistantScreen from './pages/shared/AIMain';
import MeetingsScreen from './pages/shared/Meetings';
import ProfileScreen from './pages/shared/Profile';
import SettingsScreen from './pages/shared/Settings';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user == null ? (
        // KAPAG HINDI PA LOGGED IN (Dito na lalabas ang Login at Signup!)
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      ) : (
        // KAPAG LOGGED IN NA
        <>
          <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
          <Stack.Screen name="ThesisWorkspace" component={ThesisWorkspace} />
          <Stack.Screen name="TaskScreen" component={TaskScreen} />
          <Stack.Screen name="Reference" component={ReferenceScreen} />
          <Stack.Screen name="PeerAssessment" component={PeerAssessmentScreen} />
          <Stack.Screen name="DefensePrep" component={DefensePrepScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="AIMain" component={AIAssistantScreen} />
          <Stack.Screen name="Meetings" component={MeetingsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}