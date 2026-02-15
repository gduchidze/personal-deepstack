import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { CheckCircle, Circle, Flame } from 'lucide-react-native';
import { ActivityLog } from '../types';
import { formatDate, isProgramActive } from '../utils/dateUtils';
import { getStreak } from '../utils/streakCalculator';
import { colors, spacing, borderRadius, typography } from '../theme';

const LOGS_KEY = '@deepstack_logs';

interface Props {
  refreshKey?: number;
  onDataChange?: () => void;
}

export const QuickDayLog: React.FC<Props> = ({ refreshKey, onDataChange }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [todayCompleted, setTodayCompleted] = useState(false);

  useEffect(() => {
    loadLogs();
  }, [refreshKey]);

  const loadLogs = async () => {
    try {
      const stored = await AsyncStorage.getItem(LOGS_KEY);
      if (stored) {
        const parsedLogs = JSON.parse(stored);
        setLogs(parsedLogs);
        const today = formatDate(new Date());
        const todayLog = parsedLogs.find((log: ActivityLog) => log.date === today);
        setTodayCompleted(todayLog?.completed || false);
      }
    } catch (error) {
      console.error('Error loading logs:', error);
    }
  };

  const handleToggle = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    const today = formatDate(new Date());
    const newLog: ActivityLog = {
      date: today,
      activity: 'დღევანდელი პროტოკოლი',
      completed: !todayCompleted,
      timestamp: Date.now(),
    };

    try {
      const existingLogs = logs.filter((log) => log.date !== today);
      const updatedLogs = [...existingLogs, newLog];
      await AsyncStorage.setItem(LOGS_KEY, JSON.stringify(updatedLogs));
      setLogs(updatedLogs);
      setTodayCompleted(!todayCompleted);
      onDataChange?.();
    } catch (error) {
      console.error('Error saving log:', error);
    }
  };

  const streak = getStreak(logs);
  const programActive = isProgramActive();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.streakSection}>
          <Flame color={colors.orange} size={22} />
          <Text style={styles.streakCount}>{streak}</Text>
          <Text style={styles.streakLabel}>დღე ზედიზედ</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            todayCompleted && styles.buttonCompleted,
            !programActive && styles.buttonDisabled,
          ]}
          onPress={handleToggle}
          activeOpacity={0.7}
          disabled={!programActive}
        >
          {todayCompleted ? (
            <CheckCircle color={colors.primary} size={22} />
          ) : (
            <Circle color={programActive ? colors.textSecondary : colors.textDark} size={22} />
          )}
          <Text style={[
            styles.buttonText,
            todayCompleted && styles.buttonTextCompleted,
            !programActive && styles.buttonTextDisabled,
          ]}>
            {!programActive ? 'ხვალიდან იწყება' : todayCompleted ? 'დასრულებულია' : 'მონიშნე დღე'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xxl,
    padding: spacing.xl,
    marginVertical: spacing.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  streakSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  streakCount: {
    fontFamily: typography.fontFamily,
    fontSize: 28,
    color: colors.orange,
    fontWeight: 'bold',
  },
  streakLabel: {
    fontFamily: typography.fontFamily,
    fontSize: 12,
    color: colors.textSecondary,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLighter,
    borderRadius: borderRadius.lg,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: colors.borderLight,
    gap: 8,
  },
  buttonCompleted: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    color: colors.textPrimary,
  },
  buttonTextCompleted: {
    color: colors.primary,
  },
  buttonTextDisabled: {
    color: colors.textDark,
  },
});
