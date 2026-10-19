import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export interface CalendarEvent {
  id: string;
  title: string;
  time: string;
  dateStr: string; // YYYY-MM-DD format
  scheduledBy: string;
  hasMeet?: boolean;
  meetLink?: string;
  dotColor?: string;
}

interface EducatorTaskManagementScreenProps {
  onBack: () => void;
  setEducatorDashView?: (view: 'dashboard' | 'chat' | 'profile') => void;
}

export default function EducatorTaskManagementScreen({
  onBack,
  setEducatorDashView,
}: EducatorTaskManagementScreenProps) {
  // Dynamic Current Date Setup
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [selectedDate, setSelectedDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );

  // Active Bottom Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'profile'>('dashboard');

  // Sample Events List
  const [eventsList, setEventsList] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: 'Adviser Consultation',
      time: '10:00 AM - 11:00 AM',
      dateStr: formatDateToYYYYMMDD(today),
      scheduledBy: 'Scheduled by you',
      hasMeet: true,
      meetLink: 'https://meet.google.com/abc-defg-hij',
      dotColor: '#2563EB',
    },
    {
      id: '2',
      title: 'Title Defense Review',
      time: '02:00 PM - 03:30 PM',
      dateStr: formatDateToYYYYMMDD(
        new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6)
      ),
      scheduledBy: 'Scheduled by Panel',
      hasMeet: true,
      meetLink: 'https://meet.google.com/xyz-uvwx-rst',
      dotColor: '#2563EB',
    },
  ]);

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Form Inputs
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventScheduledBy, setEventScheduledBy] = useState('Scheduled by you');
  const [includeMeet, setIncludeMeet] = useState(true);

  // Helper: Format Date to YYYY-MM-DD
  function formatDateToYYYYMMDD(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Helper: Format Date for Display (e.g., May 19, 2026)
  const formatDisplayDate = (d: Date): string => {
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });
  };

  // Calendar Calculation Helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const isToday = (dayNum: number) => {
    return (
      dayNum === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isSelected = (dayNum: number) => {
    return (
      dayNum === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  const hasEventOnDay = (dayNum: number) => {
    const targetDateStr = formatDateToYYYYMMDD(new Date(year, month, dayNum));
    return eventsList.some((e) => e.dateStr === targetDateStr);
  };

  // Add Event Handler
  const handleAddEvent = () => {
    if (!eventTitle.trim()) {
      Alert.alert('Required', 'Please enter event/reminder title.');
      return;
    }

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: eventTitle.trim(),
      time: eventTime.trim() || '09:00 AM - 10:00 AM',
      dateStr: formatDateToYYYYMMDD(selectedDate),
      scheduledBy: eventScheduledBy.trim() || 'Scheduled by you',
      hasMeet: includeMeet,
      meetLink: includeMeet ? 'https://meet.google.com/new-meet-link' : undefined,
      dotColor: '#2563EB',
    };

    setEventsList([...eventsList, newEvent]);
    setEventTitle('');
    setEventTime('');
    setShowAddModal(false);
    Alert.alert('Success', 'New event reminder created successfully.');
  };

  // Save Edit Handler
  const handleSaveEdit = () => {
    if (!selectedEvent || !eventTitle.trim()) return;

    setEventsList(
      eventsList.map((evt) =>
        evt.id === selectedEvent.id
          ? {
              ...evt,
              title: eventTitle.trim(),
              time: eventTime.trim() || evt.time,
              scheduledBy: eventScheduledBy.trim() || evt.scheduledBy,
              hasMeet: includeMeet,
            }
          : evt
      )
    );

    setSelectedEvent(null);
    setShowEditModal(false);
    Alert.alert('Updated', 'Event details saved successfully.');
  };

  // Delete Event Handler
  const handleDeleteEvent = (id: string) => {
    Alert.alert('Delete Event', 'Are you sure you want to delete this event?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          setEventsList(eventsList.filter((e) => e.id !== id));
          setShowEditModal(false);
          setSelectedEvent(null);
        },
      },
    ]);
  };

  const openGoogleMeet = (link?: string) => {
    if (!link) return;
    Linking.openURL(link).catch(() =>
      Alert.alert('Error', 'Could not open Google Meet link.')
    );
  };

  // Filter Events for the Currently Selected Date
  const selectedDateStr = formatDateToYYYYMMDD(selectedDate);
  const eventsForSelectedDate = eventsList.filter((e) => e.dateStr === selectedDateStr);
  const isSelectedDateToday = selectedDateStr === formatDateToYYYYMMDD(today);

  return (
    <View style={styles.container}>
      {/* TOP HEADER BAR */}
      <View style={styles.topHeaderBar}>
        <Text style={styles.headerTitle}>Calendar</Text>
        <View style={styles.headerRightRow}>
          <TouchableOpacity style={styles.headerIconTouch}>
            <Ionicons name="search-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconTouch}>
            <Ionicons name="funnel-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* MAIN WHITE CARD CONTAINER */}
      <View style={styles.whiteCardContainerGroup}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 90 }}
        >
          {/* CALENDAR MONTH HEADER */}
          <View style={styles.calendarHeaderRow}>
            <TouchableOpacity onPress={handlePrevMonth} style={styles.monthNavBtn}>
              <Ionicons name="chevron-back" size={18} color="#94A3B8" />
            </TouchableOpacity>
            <Text style={styles.monthTitleText}>
              {currentDate.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </Text>
            <TouchableOpacity onPress={handleNextMonth} style={styles.monthNavBtn}>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* DAYS OF WEEK ROW */}
          <View style={styles.daysOfWeekRow}>
            {['SAN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, idx) => (
              <Text key={idx} style={styles.dayOfWeekText}>
                {day}
              </Text>
            ))}
          </View>

          {/* CALENDAR GRID */}
          <View style={styles.calendarGridContainer}>
            {/* Empty slots for start offset */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.calendarCell} />
            ))}

            {/* Days of Month */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const selected = isSelected(dayNum);
              const todayFlag = isToday(dayNum);
              const hasEvents = hasEventOnDay(dayNum);

              return (
                <TouchableOpacity
                  key={`day-${dayNum}`}
                  style={styles.calendarCell}
                  activeOpacity={0.7}
                  onPress={() => setSelectedDate(new Date(year, month, dayNum))}
                >
                  <View
                    style={[
                      styles.dayNumberCircle,
                      selected && styles.selectedDayCircle,
                      !selected && todayFlag && styles.todayDayCircle,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayNumberText,
                        (selected || todayFlag) && styles.selectedDayNumberText,
                      ]}
                    >
                      {dayNum}
                    </Text>
                  </View>
                  {hasEvents && <View style={styles.eventDot} />}
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.dividerLine} />

          {/* EVENTS SECTION */}
          <View style={styles.eventsSectionHeaderRow}>
            <Text style={styles.eventsTitleText}>Events</Text>
            {/* + SIGN BUTTON BELOW CALENDAR TO ADD REMINDER */}
            <TouchableOpacity
              style={styles.addEventPlusBtn}
              activeOpacity={0.8}
              onPress={() => setShowAddModal(true)}
            >
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* SELECTED DATE DISPLAY */}
          <View style={styles.dateBannerRow}>
            <Text style={styles.dateBannerTitle}>{formatDisplayDate(selectedDate)}</Text>
            {isSelectedDateToday && <Text style={styles.todayLabelText}>Today</Text>}
          </View>

          {/* EVENTS LIST FOR SELECTED DATE */}
          {eventsForSelectedDate.length === 0 ? (
            <View style={styles.noEventsContainer}>
              <Text style={styles.noEventsText}>
                No scheduled meetings or reminders for this date.
              </Text>
            </View>
          ) : (
            eventsForSelectedDate.map((item) => (
              <View key={item.id} style={styles.eventCardItem}>
                {/* Dot Indicator */}
                <View style={styles.eventDotBlue} />

                {/* Details */}
                <View style={styles.eventInfoCol}>
                  <Text style={styles.eventCardTitle}>{item.title}</Text>
                  <Text style={styles.eventCardTime}>{item.time}</Text>
                  <Text style={styles.eventCardSub}>{item.scheduledBy}</Text>
                </View>

                {/* Meet Icon & Edit Action */}
                <View style={styles.eventActionsCol}>
                  {item.hasMeet && (
                    <TouchableOpacity onPress={() => openGoogleMeet(item.meetLink)}>
                      <Ionicons
                        name="videocam"
                        size={22}
                        color="#22C55E"
                        style={{ marginBottom: 8 }}
                      />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedEvent(item);
                      setEventTitle(item.title);
                      setEventTime(item.time);
                      setEventScheduledBy(item.scheduledBy);
                      setIncludeMeet(!!item.hasMeet);
                      setShowEditModal(true);
                    }}
                  >
                    <Ionicons name="pencil-outline" size={20} color="#1E58A8" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* LOWER NAVIGATOR */}
      <View style={styles.bottomTabContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
          onPress={onBack}
        >
          <Ionicons name="home" size={24} color="#1E58A8" />
          <Text style={[styles.tabLabelText, styles.activeTabLabel]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
          onPress={() => {
            if (setEducatorDashView) setEducatorDashView('chat');
          }}
        >
          <Ionicons name="chatbox-ellipses-outline" size={24} color="#64748B" />
          <Text style={styles.tabLabelText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          activeOpacity={0.7}
          onPress={() => {
            if (setEducatorDashView) setEducatorDashView('profile');
          }}
        >
          <Ionicons name="person-outline" size={24} color="#64748B" />
          <Text style={styles.tabLabelText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* ADD NEW EVENT / REMINDER MODAL */}
      <Modal visible={showAddModal} transparent animationType="slide">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Set New Event / Reminder</Text>
            <Text style={{ fontSize: 12, color: '#64748B', marginBottom: 12 }}>
              Date: <Text style={{ fontWeight: 'bold' }}>{formatDisplayDate(selectedDate)}</Text>
            </Text>

            <Text style={styles.inputLabel}>Event Title / Reminder</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder="e.g. Adviser Consultation / Chapter Draft Review"
              placeholderTextColor="#94A3B8"
              value={eventTitle}
              onChangeText={setEventTitle}
            />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Time Schedule</Text>
            <TextInput
              style={styles.textInputStyle}
              placeholder="e.g. 10:00 AM - 11:00 AM"
              placeholderTextColor="#94A3B8"
              value={eventTime}
              onChangeText={setEventTime}
            />

            <TouchableOpacity
              style={styles.checkboxRow}
              activeOpacity={0.8}
              onPress={() => setIncludeMeet(!includeMeet)}
            >
              <Ionicons
                name={includeMeet ? 'checkbox' : 'square-outline'}
                size={22}
                color="#1E58A8"
              />
              <Text style={styles.checkboxText}>
                Generate Google Meet consultation link
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.primaryBlueBtn} onPress={handleAddEvent}>
              <Text style={styles.primaryBlueBtnText}>Save Event</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelOutlineBtn}
              onPress={() => setShowAddModal(false)}
            >
              <Text style={styles.cancelOutlineBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* EDIT EVENT MODAL */}
      <Modal visible={showEditModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Edit Event / Reminder</Text>

            <Text style={styles.inputLabel}>Event Title</Text>
            <TextInput
              style={styles.textInputStyle}
              value={eventTitle}
              onChangeText={setEventTitle}
            />

            <Text style={[styles.inputLabel, { marginTop: 12 }]}>Time</Text>
            <TextInput
              style={styles.textInputStyle}
              value={eventTime}
              onChangeText={setEventTime}
            />

            <TouchableOpacity style={styles.primaryBlueBtn} onPress={handleSaveEdit}>
              <Text style={styles.primaryBlueBtnText}>Save Changes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dangerOutlineBtn}
              onPress={() => selectedEvent && handleDeleteEvent(selectedEvent.id)}
            >
              <Text style={styles.dangerOutlineBtnText}>Delete Event</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelOutlineBtn}
              onPress={() => setShowEditModal(false)}
            >
              <Text style={styles.cancelOutlineBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E58A8',
  },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 52,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerIconTouch: {
    padding: 4,
  },
  whiteCardContainerGroup: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  calendarHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  monthNavBtn: {
    padding: 6,
  },
  monthTitleText: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#334155',
  },
  daysOfWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  dayOfWeekText: {
    width: 40,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#94A3B8',
  },
  calendarGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  calendarCell: {
    width: '14.28%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  dayNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDayCircle: {
    backgroundColor: '#EA580C', // Orange circle badge for selected day matching screenshot
  },
  todayDayCircle: {
    backgroundColor: '#EA580C',
  },
  dayNumberText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  selectedDayNumberText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#2563EB',
    marginTop: 2,
  },
  dividerLine: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 14,
  },
  eventsSectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  eventsTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#000000',
  },
  addEventPlusBtn: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#007AFF', // Blue + sign button matching screenshot
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateBannerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateBannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#000000',
  },
  todayLabelText: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#1E58A8',
  },
  noEventsContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  noEventsText: {
    fontSize: 13,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  eventCardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
  },
  eventDotBlue: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
    marginRight: 12,
  },
  eventInfoCol: {
    flex: 1,
  },
  eventCardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#000000',
  },
  eventCardTime: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#64748B',
    marginTop: 2,
  },
  eventCardSub: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#94A3B8',
    marginTop: 2,
  },
  eventActionsCol: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 8,
  },
  bottomTabContainer: {
    flexDirection: 'row',
    height: 62,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: Platform.OS === 'ios' ? 12 : 4,
    paddingTop: 6,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabelText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
    fontWeight: '500',
  },
  activeTabLabel: {
    fontWeight: 'bold',
    color: '#1E58A8',
  },
  modalOverlayDark: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalWhiteCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 20,
    elevation: 8,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 6,
  },
  textInputStyle: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000000',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
  },
  checkboxText: {
    fontSize: 13,
    color: '#334155',
    marginLeft: 8,
  },
  primaryBlueBtn: {
    backgroundColor: '#1E58A8',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 18,
  },
  primaryBlueBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  dangerOutlineBtn: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#EF4444',
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  dangerOutlineBtnText: {
    color: '#EF4444',
    fontWeight: 'bold',
    fontSize: 13,
  },
  cancelOutlineBtn: {
    marginTop: 10,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  cancelOutlineBtnText: {
    color: '#475569',
    fontWeight: 'bold',
    fontSize: 14,
  },
});