import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export interface TaskItemData {
  id: string;
  title: string;
  chapter: string;
  dueDate: string;
  status: 'Overdue' | 'In Progress' | 'To Do';
  completed?: boolean;
  time?: string;
  subText?: string;
  isMeeting?: boolean;
}

interface TasksScreenProps {
  tasksList?: TaskItemData[];
  setTasksList?: React.Dispatch<React.SetStateAction<TaskItemData[]>>;
  setStudentDashView?: (view: any) => void;
  setIsMenuOpen?: (open: boolean) => void;
}

export default function TasksScreen({
  tasksList: initialTasks,
  setTasksList: setParentTasksList,
  setStudentDashView,
  setIsMenuOpen,
}: TasksScreenProps) {
  // Navigation Tabs State Defaulted to 'Calendar'
  const [activeTab, setActiveTab] = useState<'My Tasks' | 'All Tasks' | 'Calendar'>('Calendar');

  // Search & Filter Bar Toggle States
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Dynamic Date, Month & Year State (Automatic from system Date)
  const [currentDateObj, setCurrentDateObj] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  // Automatically update and refresh time & date from System
  useEffect(() => {
    const today = new Date();
    setCurrentDateObj(today);
    setSelectedDay(today.getDate());
  }, []);

  // Format month and year display automatically
  const formattedMonthYear = currentDateObj.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });
  const fullMonthName = currentDateObj.toLocaleDateString('en-US', {
    month: 'long',
  });
  const currentYearNum = currentDateObj.getFullYear();

  // Helper functions for dynamic month navigation
  const handlePrevMonth = () => {
    const prevMonth = new Date(
      currentDateObj.getFullYear(),
      currentDateObj.getMonth() - 1,
      1
    );
    setCurrentDateObj(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(
      currentDateObj.getFullYear(),
      currentDateObj.getMonth() + 1,
      1
    );
    setCurrentDateObj(nextMonth);
  };

  const handleResetToToday = () => {
    const today = new Date();
    setCurrentDateObj(today);
    setSelectedDay(today.getDate());
  };

  // Dynamic Calculation for Calendar Days Grid
  const daysInCurrentMonth = new Date(
    currentDateObj.getFullYear(),
    currentDateObj.getMonth() + 1,
    0
  ).getDate();

  const startDayOfWeek = new Date(
    currentDateObj.getFullYear(),
    currentDateObj.getMonth(),
    1
  ).getDay(); // 0 Sun, 1 Mon, ..., 6 Sat

  const daysArray = Array.from({ length: daysInCurrentMonth }, (_, i) => i + 1);
  const emptyLeadingCells = Array.from({ length: startDayOfWeek }, (_, i) => i + 1);

  // Modal States for Add Task
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [taskTitleInput, setTaskTitleInput] = useState('');
  const [taskChapterInput, setTaskChapterInput] = useState('');
  const [taskDueDateInput, setTaskDueDateInput] = useState('');
  const [taskStatusInput, setTaskStatusInput] = useState<'Overdue' | 'In Progress' | 'To Do'>('To Do');

  // Local Default Initial Tasks matching UI
  const defaultTasks: TaskItemData[] = [
    {
      id: 't-1',
      title: 'Review the Literature Review',
      chapter: 'Chapter 2',
      dueDate: 'May 10',
      status: 'Overdue',
      completed: false,
    },
    {
      id: 't-2',
      title: 'Collect and Analyze Data',
      chapter: 'Chapter 3',
      dueDate: 'May 20',
      status: 'In Progress',
      completed: false,
    },
    {
      id: 't-3',
      title: 'Create Methodology Diagram',
      chapter: 'Chapter 3',
      dueDate: 'May 25',
      status: 'In Progress',
      completed: false,
    },
    {
      id: 't-4',
      title: 'Write Results and Discussion',
      chapter: 'Chapter 4',
      dueDate: 'Jun 10',
      status: 'To Do',
      completed: false,
    },
    {
      id: 't-5',
      title: 'Prepare Presentation Slides',
      chapter: 'Defense',
      dueDate: 'Nov 10',
      status: 'To Do',
      completed: false,
    },
  ];

  const [localTasksList, setLocalTasksList] = useState<TaskItemData[]>(defaultTasks);
  const tasks = initialTasks && initialTasks.length > 0 ? initialTasks : localTasksList;

  // Calendar Events Data for Selected Date
  const calendarDayItems = [
    {
      id: 'cal-1',
      title: 'Adviser Consultation',
      time: '10:00 AM - 11:00 AM',
      subText: 'Dr. Elizzette Joy Mationg',
      type: 'meeting',
      isGoogleMeet: true,
      colorDot: '#2563EB',
    },
    {
      id: 'cal-2',
      title: 'Continue writing Chapter 3',
      time: '1:00 PM - 3:00 PM',
      statusText: 'In Progress',
      type: 'task',
      colorDot: '#2563EB',
    },
    {
      id: 'cal-3',
      title: 'Collect survey responses',
      time: '10:00 AM - 11:00 AM',
      statusText: 'To Do',
      type: 'task',
      colorDot: '#2563EB',
    },
  ];

  // Days with Indicators Map
  const dateDotsMap: { [day: number]: string[] } = {
    3: ['#16A34A'],
    10: ['#D97706'],
    15: ['#2563EB'],
    19: ['#EF4444'],
    26: ['#2563EB', '#2563EB'],
  };

  // Toggle completion / status check
  const handleToggleTaskStatus = (id: string) => {
    const updateFn = (prev: TaskItemData[]) =>
      prev.map((t) => {
        if (t.id === id) {
          return {
            ...t,
            completed: !t.completed,
          };
        }
        return t;
      });

    if (setParentTasksList) {
      setParentTasksList(updateFn);
    } else {
      setLocalTasksList(updateFn);
    }
  };

  // Add Task Handler
  const handleAddTaskSubmit = () => {
    if (!taskTitleInput.trim()) {
      Alert.alert('Required', 'Please enter a title for the task.');
      return;
    }

    const newTaskObj: TaskItemData = {
      id: `task-${Date.now()}`,
      title: taskTitleInput.trim(),
      chapter: taskChapterInput.trim() || 'General',
      dueDate: taskDueDateInput.trim() || 'Soon',
      status: taskStatusInput,
      completed: false,
    };

    const updateFn = (prev: TaskItemData[]) => [newTaskObj, ...prev];

    if (setParentTasksList) {
      setParentTasksList(updateFn);
    } else {
      setLocalTasksList(updateFn);
    }

    setTaskTitleInput('');
    setTaskChapterInput('');
    setTaskDueDateInput('');
    setTaskStatusInput('To Do');
    setShowAddTaskModal(false);
    Alert.alert('Success', 'New task added successfully.');
  };

  // Search Filtered Tasks by Title or Chapter
  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.chapter.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCalendarItems = calendarDayItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.subText && item.subText.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const overdueTasks = filteredTasks.filter((t) => t.status === 'Overdue');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'In Progress');
  const toDoTasks = filteredTasks.filter((t) => t.status === 'To Do');

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF', position: 'relative' }}>
      {/* Header Top Title Bar */}
      <View style={styles.topHeaderBar}>
        <View style={styles.headerLeftRow}>
          <TouchableOpacity
            style={{ padding: 4 }}
            onPress={() => {
              if (setIsMenuOpen) {
                setIsMenuOpen(true);
              } else if (setStudentDashView) {
                setStudentDashView('main');
              }
            }}
          >
            <Ionicons name="menu-outline" size={26} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitleText}>Tasks</Text>
        </View>
        <View style={styles.headerRightIconsRow}>
          <TouchableOpacity
            style={{ padding: 6 }}
            onPress={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Ionicons name="search-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 6 }}>
            <Ionicons name="funnel-outline" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Dynamic Search Bar Toggle */}
      {isSearchOpen && (
        <View style={styles.searchBarContainer}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#64748B"
            style={{ marginRight: 8 }}
          />
          <TextInput
            style={styles.searchTextInput}
            placeholder="Search task title, schedule or adviser..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Segment Navigation Bar */}
      <View style={styles.tabSegmentRow}>
        <TouchableOpacity
          style={[styles.tabSegmentBtn, activeTab === 'My Tasks' && styles.tabSegmentActiveBtn]}
          onPress={() => setActiveTab('My Tasks')}
        >
          <Text
            style={[
              styles.tabSegmentText,
              activeTab === 'My Tasks' && styles.tabSegmentActiveText,
            ]}
          >
            My Tasks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabSegmentBtn, activeTab === 'All Tasks' && styles.tabSegmentActiveBtn]}
          onPress={() => setActiveTab('All Tasks')}
        >
          <Text
            style={[
              styles.tabSegmentText,
              activeTab === 'All Tasks' && styles.tabSegmentActiveText,
            ]}
          >
            All Tasks
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabSegmentBtn, activeTab === 'Calendar' && styles.tabSegmentActiveBtn]}
          onPress={() => setActiveTab('Calendar')}
        >
          <Text
            style={[
              styles.tabSegmentText,
              activeTab === 'Calendar' && styles.tabSegmentActiveText,
            ]}
          >
            Calendar
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tabUnderlineBar} />

      {/* Main Content Area */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {activeTab === 'Calendar' ? (
          <View>
            {/* Automatic Dynamic Month Header Navigation */}
            <View style={styles.monthHeaderRow}>
              <TouchableOpacity style={{ padding: 4 }} onPress={handlePrevMonth}>
                <Ionicons name="chevron-back" size={18} color="#94A3B8" />
              </TouchableOpacity>
              <Text style={styles.monthTitleText}>{formattedMonthYear}</Text>
              <TouchableOpacity style={{ padding: 4 }} onPress={handleNextMonth}>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Days of Week Header */}
            <View style={styles.weekDaysRow}>
              {['SAN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, idx) => (
                <Text key={idx} style={styles.weekDayText}>
                  {day}
                </Text>
              ))}
            </View>

            {/* Calendar Days Grid Calculated Dynamically */}
            <View style={styles.daysGrid}>
              {emptyLeadingCells.map((_, idx) => (
                <View key={`empty-${idx}`} style={styles.dayCellEmpty} />
              ))}
              {daysArray.map((dayNum) => {
                const isSelected = selectedDay === dayNum;
                const dots = dateDotsMap[dayNum];
                return (
                  <TouchableOpacity
                    key={dayNum}
                    style={styles.dayCellTouch}
                    onPress={() => setSelectedDay(dayNum)}
                  >
                    <View
                      style={[
                        styles.dayNumCircle,
                        isSelected && styles.dayNumCircleSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayNumText,
                          isSelected && styles.dayNumTextSelected,
                        ]}
                      >
                        {dayNum}
                      </Text>
                    </View>
                    <View style={styles.dotsRowContainer}>
                      {dots &&
                        dots.map((dotColor, dIdx) => (
                          <View
                            key={dIdx}
                            style={[styles.eventDot, { backgroundColor: dotColor }]}
                          />
                        ))}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.calendarDividerLine} />

            {/* Agenda Daily Details Section */}
            <View style={{ paddingHorizontal: 16, paddingTop: 10 }}>
              <View style={styles.agendaHeaderRow}>
                <Text style={styles.agendaDateTitle}>
                  {fullMonthName} {selectedDay}, {currentYearNum}
                </Text>
                <TouchableOpacity onPress={handleResetToToday}>
                  <Text style={styles.todayBtnText}>Today</Text>
                </TouchableOpacity>
              </View>

              {/* Scheduled Items List */}
              {filteredCalendarItems.length > 0 ? (
                filteredCalendarItems.map((item) => (
                  <View key={item.id} style={styles.agendaCardBox}>
                    <View style={styles.agendaCardLeftRow}>
                      <View style={styles.agendaBlueDot} />
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={styles.agendaTitleText}>{item.title}</Text>
                        <Text style={styles.agendaTimeText}>{item.time}</Text>
                        {item.subText && (
                          <Text style={styles.agendaSubText}>{item.subText}</Text>
                        )}
                      </View>
                      {item.isGoogleMeet ? (
                        <View style={styles.meetIconBox}>
                          <Ionicons name="videocam" size={20} color="#059669" />
                        </View>
                      ) : (
                        <Text style={styles.agendaStatusBadge}>{item.statusText}</Text>
                      )}
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyAgendaText}>
                  No scheduled tasks or meetings for this date.
                </Text>
              )}
            </View>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
            {/* OVERDUE SECTION */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitleText}>Overdue</Text>
              <TouchableOpacity
                style={styles.addTaskBlueBtn}
                activeOpacity={0.85}
                onPress={() => setShowAddTaskModal(true)}
              >
                <Ionicons name="add" size={18} color="#FFFFFF" />
                <Text style={styles.addTaskBtnText}>Add Task</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.taskOuterCardBox}>
              {overdueTasks.length > 0 ? (
                overdueTasks.map((t, idx) => (
                  <View key={t.id}>
                    {idx > 0 && <View style={styles.cardItemDividerLine} />}
                    <TouchableOpacity
                      style={styles.taskItemInnerRow}
                      activeOpacity={0.7}
                      onPress={() => handleToggleTaskStatus(t.id)}
                    >
                      <View style={styles.redCircleCheckBorder}>
                        {t.completed && <View style={styles.redCircleCheckFill} />}
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text
                          style={[
                            styles.taskItemTitleText,
                            t.completed && styles.taskCompletedStrikethrough,
                          ]}
                        >
                          {t.title}
                        </Text>
                        <Text style={styles.taskItemChapterSubText}>{t.chapter}</Text>
                      </View>
                      <Text style={styles.redDueDateText}>{t.dueDate}</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.emptySectionText}>No overdue tasks</Text>
              )}
            </View>

            {/* IN PROGRESS SECTION */}
            <Text style={styles.sectionTitleText}>In Progress</Text>
            <View style={styles.taskOuterCardBox}>
              {inProgressTasks.length > 0 ? (
                inProgressTasks.map((t, idx) => (
                  <View key={t.id}>
                    {idx > 0 && <View style={styles.cardItemDividerLine} />}
                    <TouchableOpacity
                      style={styles.taskItemInnerRow}
                      activeOpacity={0.7}
                      onPress={() => handleToggleTaskStatus(t.id)}
                    >
                      <View style={styles.blueCircleCheckBorder}>
                        {t.completed && <View style={styles.blueCircleCheckFill} />}
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text
                          style={[
                            styles.taskItemTitleText,
                            t.completed && styles.taskCompletedStrikethrough,
                          ]}
                        >
                          {t.title}
                        </Text>
                        <Text style={styles.taskItemChapterSubText}>{t.chapter}</Text>
                      </View>
                      <Text style={styles.blueDueDateText}>{t.dueDate}</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.emptySectionText}>No tasks in progress</Text>
              )}
            </View>

            {/* TO DO SECTION */}
            <Text style={styles.sectionTitleText}>To Do</Text>
            <View style={styles.taskOuterCardBox}>
              {toDoTasks.length > 0 ? (
                toDoTasks.map((t, idx) => (
                  <View key={t.id}>
                    {idx > 0 && <View style={styles.cardItemDividerLine} />}
                    <TouchableOpacity
                      style={styles.taskItemInnerRow}
                      activeOpacity={0.7}
                      onPress={() => handleToggleTaskStatus(t.id)}
                    >
                      <View style={styles.greyCircleCheckBorder}>
                        {t.completed && <View style={styles.greyCircleCheckFill} />}
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text
                          style={[
                            styles.taskItemTitleText,
                            t.completed && styles.taskCompletedStrikethrough,
                          ]}
                        >
                          {t.title}
                        </Text>
                        <Text style={styles.taskItemChapterSubText}>{t.chapter}</Text>
                      </View>
                      <Text style={styles.darkDueDateText}>{t.dueDate}</Text>
                    </TouchableOpacity>
                  </View>
                ))
              ) : (
                <Text style={styles.emptySectionText}>No tasks to do</Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>

      {/* ADD TASK MODAL */}
      <Modal visible={showAddTaskModal} transparent animationType="fade">
        <View style={styles.modalOverlayDark}>
          <View style={styles.modalWhiteCard}>
            <Text style={styles.modalHeaderTitle}>Add New Task</Text>
            <Text style={styles.inputLabelText}>Task Title</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="e.g., Write Chapter 4 Discussion"
              value={taskTitleInput}
              onChangeText={setTaskTitleInput}
            />
            <Text style={styles.inputLabelText}>Chapter / Section</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="e.g., Chapter 4 or Defense"
              value={taskChapterInput}
              onChangeText={setTaskChapterInput}
            />
            <Text style={styles.inputLabelText}>Due Date</Text>
            <TextInput
              style={styles.modalTextInput}
              placeholder="e.g., Jun 15 or May 30"
              value={taskDueDateInput}
              onChangeText={setTaskDueDateInput}
            />
            <Text style={styles.inputLabelText}>Initial Category</Text>
            <View style={styles.categoryRadioGroup}>
              {(['To Do', 'In Progress', 'Overdue'] as const).map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.radioBtnChip,
                    taskStatusInput === cat && styles.radioBtnChipActive,
                  ]}
                  onPress={() => setTaskStatusInput(cat)}
                >
                  <Text
                    style={[
                      styles.radioBtnChipText,
                      taskStatusInput === cat && styles.radioBtnChipActiveText,
                    ]}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.cancelOutlineBtn}
                onPress={() => setShowAddTaskModal(false)}
              >
                <Text style={styles.cancelOutlineBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryBlueBtn} onPress={handleAddTaskSubmit}>
                <Text style={styles.primaryBlueBtnText}>Create Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  topHeaderBar: {
    backgroundColor: '#1E58A8',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 36 : 48,
    paddingBottom: 12,
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  headerRightIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  searchTextInput: {
    flex: 1,
    fontSize: 12,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tabSegmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    marginTop: 8,
  },
  tabSegmentBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  tabSegmentActiveBtn: {
    backgroundColor: '#BFDBFE',
  },
  tabSegmentText: {
    fontSize: 12,
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tabSegmentActiveText: {
    fontWeight: 'bold',
  },
  tabUnderlineBar: {
    height: 1,
    backgroundColor: '#CBD5E1',
    marginTop: 6,
    width: '100%',
  },
  monthHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  monthTitleText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  weekDayText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: 'bold',
    width: 36,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  dayCellEmpty: {
    width: '14.28%',
    height: 44,
  },
  dayCellTouch: {
    width: '14.28%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNumCircleSelected: {
    backgroundColor: '#EF4444',
  },
  dayNumText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  dayNumTextSelected: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  dotsRowContainer: {
    flexDirection: 'row',
    gap: 2,
    height: 4,
    marginTop: 2,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  calendarDividerLine: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  agendaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  agendaDateTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  todayBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2563EB',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  agendaCardBox: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    padding: 12,
    marginBottom: 10,
  },
  agendaCardLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agendaBlueDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
  agendaTitleText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  agendaTimeText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  agendaSubText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  meetIconBox: {
    padding: 4,
  },
  agendaStatusBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2563EB',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  emptyAgendaText: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
    paddingVertical: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 12,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  addTaskBlueBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E58A8',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  addTaskBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  taskOuterCardBox: {
    borderWidth: 1,
    borderColor: '#94A3B8',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
  },
  taskItemInnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  cardItemDividerLine: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 2,
  },
  redCircleCheckBorder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  redCircleCheckFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EF4444',
  },
  blueCircleCheckBorder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  blueCircleCheckFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  greyCircleCheckBorder: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#64748B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greyCircleCheckFill: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#64748B',
  },
  taskItemTitleText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  taskCompletedStrikethrough: {
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  taskItemChapterSubText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  redDueDateText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#EF4444',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  blueDueDateText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#2563EB',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  darkDueDateText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  emptySectionText: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
    paddingVertical: 6,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  modalOverlayDark: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalWhiteCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 8,
  },
  modalHeaderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  inputLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  modalTextInput: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  categoryRadioGroup: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  radioBtnChip: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  radioBtnChipActive: {
    backgroundColor: '#BFDBFE',
    borderColor: '#1E58A8',
  },
  radioBtnChipText: {
    fontSize: 10,
    color: '#475569',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  radioBtnChipActiveText: {
    fontWeight: 'bold',
    color: '#1E58A8',
  },
  modalActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  cancelOutlineBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  cancelOutlineBtnText: {
    color: '#475569',
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  primaryBlueBtn: {
    flex: 1,
    backgroundColor: '#1E58A8',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryBlueBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});