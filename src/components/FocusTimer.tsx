import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Timer, Play, Pause, RotateCcw, Coffee } from 'lucide-react-native';
import { FocusSession } from '../types';
import { formatDate } from '../utils/dateUtils';
import { colors, spacing, borderRadius, typography } from '../theme';

const SESSIONS_KEY = '@deepstack_focus_sessions';

const MODES = [
  { label: 'Deep Work', duration: 50, break: 10, color: colors.primary },
  { label: 'DSA Sprint', duration: 25, break: 5, color: colors.orange },
  { label: 'Review', duration: 15, break: 3, color: colors.blue },
] as const;

export const FocusTimer: React.FC = () => {
  const [modeIndex, setModeIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(MODES[0].duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [todaySessions, setTodaySessions] = useState(0);
  const [todayMinutes, setTodayMinutes] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const mode = MODES[modeIndex];

  useEffect(() => {
    loadTodayStats();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isBreak]);

  const loadTodayStats = async () => {
    try {
      const stored = await AsyncStorage.getItem(SESSIONS_KEY);
      const sessions: FocusSession[] = stored ? JSON.parse(stored) : [];
      const today = formatDate(new Date());
      const todaysSessions = sessions.filter(s => s.date === today);
      setTodaySessions(todaysSessions.length);
      setTodayMinutes(todaysSessions.reduce((sum, s) => sum + s.duration, 0));
    } catch (error) {
      console.error('Error loading focus sessions:', error);
    }
  };

  const handleTimerComplete = async () => {
    setIsRunning(false);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    if (!isBreak) {
      // Save completed session
      const session: FocusSession = {
        id: Date.now().toString(),
        date: formatDate(new Date()),
        duration: mode.duration,
        targetDuration: mode.duration,
        type: modeIndex === 0 ? 'deep_work' : modeIndex === 1 ? 'dsa' : 'theory',
        timestamp: Date.now(),
      };

      try {
        const stored = await AsyncStorage.getItem(SESSIONS_KEY);
        const sessions: FocusSession[] = stored ? JSON.parse(stored) : [];
        sessions.push(session);
        await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
        setTodaySessions(prev => prev + 1);
        setTodayMinutes(prev => prev + mode.duration);
      } catch (error) {
        console.error('Error saving focus session:', error);
      }

      // Start break
      setIsBreak(true);
      setSecondsLeft(mode.break * 60);
    } else {
      // Break is over, reset
      setIsBreak(false);
      setSecondsLeft(mode.duration * 60);
    }
  };

  const toggleTimer = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!isRunning) {
      startTimeRef.current = Date.now();
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsRunning(false);
    setIsBreak(false);
    setSecondsLeft(mode.duration * 60);
  };

  const switchMode = async (index: number) => {
    if (isRunning) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setModeIndex(index);
    setIsBreak(false);
    setSecondsLeft(MODES[index].duration * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const totalSeconds = isBreak ? mode.break * 60 : mode.duration * 60;
  const progress = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isBreak ? (
          <Coffee color={colors.blue} size={24} />
        ) : (
          <Timer color={mode.color} size={24} />
        )}
        <Text style={[styles.title, { color: isBreak ? colors.blue : mode.color }]}>
          {isBreak ? 'შესვენება' : 'ფოკუს ტაიმერი'}
        </Text>
      </View>

      {/* Mode Selector */}
      <View style={styles.modeSelector}>
        {MODES.map((m, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.modeButton,
              modeIndex === i && { borderColor: m.color, backgroundColor: `${m.color}15` },
            ]}
            onPress={() => switchMode(i)}
            activeOpacity={0.7}
            disabled={isRunning}
          >
            <Text style={[
              styles.modeText,
              modeIndex === i && { color: m.color },
            ]}>
              {m.label}
            </Text>
            <Text style={[
              styles.modeDuration,
              modeIndex === i && { color: m.color },
            ]}>
              {m.duration}წთ
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Timer Display */}
      <View style={styles.timerContainer}>
        <View style={styles.progressRing}>
          <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: isBreak ? colors.blue : mode.color }]} />
        </View>
        <Text style={[styles.timerText, { color: isBreak ? colors.blue : mode.color }]}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.resetButton}
          onPress={resetTimer}
          activeOpacity={0.7}
        >
          <RotateCcw color={colors.textSecondary} size={22} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.playButton, { backgroundColor: isBreak ? colors.blue : mode.color }]}
          onPress={toggleTimer}
          activeOpacity={0.7}
        >
          {isRunning ? (
            <Pause color="#000" size={28} />
          ) : (
            <Play color="#000" size={28} />
          )}
        </TouchableOpacity>

        <View style={styles.statsBox}>
          <Text style={styles.statsValue}>{todaySessions}</Text>
          <Text style={styles.statsLabel}>სესია</Text>
        </View>
      </View>

      {/* Today's Stats */}
      <View style={styles.todayStats}>
        <Text style={styles.todayText}>
          დღეს: {todayMinutes} წუთი ფოკუსი
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.xxl,
    marginVertical: spacing.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontFamily: typography.fontFamily,
    fontSize: 20,
    marginLeft: 10,
  },
  modeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.borderLight,
    backgroundColor: colors.surfaceLight,
  },
  modeText: {
    fontFamily: typography.fontFamily,
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: 'bold',
  },
  modeDuration: {
    fontFamily: typography.fontFamily,
    fontSize: 10,
    color: colors.textDark,
    marginTop: 2,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  progressRing: {
    width: '100%',
    height: 6,
    backgroundColor: colors.surfaceLighter,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 15,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  timerText: {
    fontFamily: typography.fontFamily,
    fontSize: 56,
    fontWeight: 'bold',
    letterSpacing: 4,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 15,
  },
  resetButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surfaceLighter,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  statsBox: {
    width: 48,
    alignItems: 'center',
  },
  statsValue: {
    fontFamily: typography.fontFamily,
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
  statsLabel: {
    fontFamily: typography.fontFamily,
    fontSize: 10,
    color: colors.textSecondary,
  },
  todayStats: {
    alignItems: 'center',
    padding: 10,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
  },
  todayText: {
    fontFamily: typography.fontFamily,
    fontSize: 12,
    color: colors.textSecondary,
  },
});
