import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

interface DefensePreparationScreenProps {
  setStudentDashView?: (view: any) => void;
  setIsMenuOpen?: (open: boolean) => void;
  onBackPress?: () => void;
}

interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export default function DefensePreparationScreen({
  setStudentDashView,
  setIsMenuOpen,
  onBackPress,
}: DefensePreparationScreenProps) {
  // Target Defense Date: Nov 20, 2026 10:00 AM
  const targetDate = new Date('2026-11-20T10:00:00');

  // Countdown State
  const [timeLeft, setTimeLeft] = useState({
    days: 90,
    hours: 12,
    minutes: 45,
    seconds: 30,
  });

  // Dynamic Countdown Timer Effect
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Checklist Items State matching the UI reference
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', title: 'Finalize thesis manuscript', completed: true },
    { id: '2', title: 'Prepare PowerPoint slides', completed: true },
    { id: '3', title: 'Print hardbound copies for panelists', completed: true },
    { id: '4', title: 'Conduct mock defense session', completed: false },
    { id: '5', title: 'Verify system demo & local environment', completed: true },
    { id: '6', title: 'Prepare defense outfit / attire', completed: false },
    { id: '7', title: 'Assign speaking parts for members', completed: false },
    { id: '8', title: 'Review Chapter 1 to 5 Q&A defense prep', completed: false },
  ]);

  // Toggle Checkbox Handler
  const handleToggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Completed items count and progress calculation
  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const progressPercent =
    totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* TOP HEADER BAR */}
      <View style={styles.topHeader}>
        <TouchableOpacity
          style={styles.headerIconBtn}
          onPress={() => {
            if (setIsMenuOpen) {
              setIsMenuOpen(true);
            } else if (onBackPress) {
              onBackPress();
            }
          }}
        >
          <Ionicons name="menu-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Defense Preparation</Text>
        </View>
        <TouchableOpacity style={styles.headerIconBtn}>
          <Ionicons name="ellipsis-vertical" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* MAIN WHITE CARD CONTAINER */}
      <View style={styles.whiteCardContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingVertical: 18,
            paddingBottom: 40,
          }}
        >
          {/* YOUR DEFENSE CARD */}
          <View style={styles.cardBordered}>
            <Text style={styles.cardTitleHeader}>Your Defense</Text>

            {/* DATE & TIME ROW */}
            <View style={styles.dateTimeRow}>
              <View style={styles.dateTimeItem}>
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color="#1E58A8"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.dateText}>Nov 20, 2026</Text>
              </View>
              <View style={styles.dateTimeItem}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color="#64748B"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.timeText}>10:00 AM</Text>
              </View>
            </View>

            {/* COUNTDOWN BOXES */}
            <View style={styles.countdownRow}>
              <View style={styles.countdownBox}>
                <Text style={styles.countdownNumber}>
                  {String(timeLeft.days).padStart(2, '0')}
                </Text>
                <Text style={styles.countdownLabel}>Days</Text>
              </View>
              <View style={styles.countdownBox}>
                <Text style={styles.countdownNumber}>
                  {String(timeLeft.hours).padStart(2, '0')}
                </Text>
                <Text style={styles.countdownLabel}>Hours</Text>
              </View>
              <View style={styles.countdownBox}>
                <Text style={styles.countdownNumber}>
                  {String(timeLeft.minutes).padStart(2, '0')}
                </Text>
                <Text style={styles.countdownLabel}>Minutes</Text>
              </View>
              <View style={styles.countdownBox}>
                <Text style={styles.countdownNumber}>
                  {String(timeLeft.seconds).padStart(2, '0')}
                </Text>
                <Text style={styles.countdownLabel}>Seconds</Text>
              </View>
            </View>
          </View>

          {/* CHECKLIST CARD */}
          <View style={[styles.cardBordered, { marginTop: 16 }]}>
            <View style={styles.checklistHeaderRow}>
              <Text style={styles.cardTitleHeader}>Checklist</Text>
              <Text style={styles.fractionCounterText}>
                {completedCount}/{totalCount}
              </Text>
            </View>

            {/* PROGRESS BAR TRACK */}
            <View style={styles.progressBarTrack}>
              <View
                style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
              />
            </View>

            {/* CHECKLIST ITEMS */}
            <View style={styles.checklistItemsContainer}>
              {checklist.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.checkItemRow}
                  activeOpacity={0.7}
                  onPress={() => handleToggleCheck(item.id)}
                >
                  {item.completed ? (
                    <Ionicons name="checkbox" size={20} color="#1E58A8" />
                  ) : (
                    <Ionicons name="square-outline" size={20} color="#94A3B8" />
                  )}
                  <Text
                    style={[
                      styles.checkItemTitle,
                      item.completed && styles.checkItemCompletedText,
                    ]}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* DECORATIVE AI AVATAR BADGE AT BOTTOM LEFT */}
          <View style={styles.aiAvatarWrapper}>
            <View style={styles.aiAvatarCircle}>
              <MaterialCommunityIcons name="robot" size={28} color="#FFFFFF" />
              <MaterialCommunityIcons
                name="sparkles"
                size={14}
                color="#FFFFFF"
                style={styles.sparkleIconPosition}
              />
            </View>
            <View style={styles.bubbleDot1} />
            <View style={styles.bubbleDot2} />
            <View style={styles.bubbleDot3} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E58A8',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 48,
    paddingBottom: 16,
  },
  headerIconBtn: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  whiteCardContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  cardBordered: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  cardTitleHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 16,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E58A8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  timeText: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  countdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  countdownBox: {
    flex: 1,
    backgroundColor: '#BFDBFE',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdownNumber: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1E58A8',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  countdownLabel: {
    fontSize: 10,
    color: '#0F172A',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  checklistHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fractionCounterText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: '#DBEAFE',
    borderRadius: 4,
    marginVertical: 12,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1E58A8',
    borderRadius: 4,
  },
  checklistItemsContainer: {
    gap: 12,
    marginTop: 6,
  },
  checkItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  checkItemTitle: {
    fontSize: 12,
    color: '#0F172A',
    marginLeft: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  checkItemCompletedText: {
    color: '#0F172A',
  },
  aiAvatarWrapper: {
    marginTop: 30,
    width: 80,
    height: 80,
    position: 'relative',
  },
  aiAvatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  sparkleIconPosition: {
    position: 'absolute',
    top: 6,
    right: 8,
  },
  bubbleDot1: {
    position: 'absolute',
    top: -2,
    right: 18,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
  },
  bubbleDot2: {
    position: 'absolute',
    bottom: 22,
    right: 10,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2563EB',
  },
  bubbleDot3: {
    position: 'absolute',
    bottom: 8,
    right: 22,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
});