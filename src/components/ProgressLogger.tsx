import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { CheckCircle, Circle, TrendingUp } from 'lucide-react-native';
import { ActivityLog } from '../types';
import { formatDate } from '../utils/dateUtils';
import { getStreak } from '../utils/streakCalculator';
import { colors, spacing, borderRadius, typography } from '../theme';

const LOGS_KEY = '@deepstack_logs';

interface Props {
  refreshKey?: number;
  onDataChange?: () => void;
}

export const ProgressLogger: React.FC<Props> = ({ refreshKey, onDataChange }) => {
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

  const handleLogProgress = async () => {
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TrendingUp color={colors.orange} size={24} />
        <Text style={styles.title}>პროგრესის ტრეკერი</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{streak}</Text>
          <Text style={styles.statLabel}>დღე ზედიზედ</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{logs.filter((l) => l.completed).length}</Text>
          <Text style={styles.statLabel}>სულ შესრულებული</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.logButton, todayCompleted && styles.logButtonCompleted]}
        onPress={handleLogProgress}
        activeOpacity={0.7}
      >
        {todayCompleted ? (
          <CheckCircle color={colors.primary} size={24} />
        ) : (
          <Circle color={colors.textSecondary} size={24} />
        )}
        <Text style={styles.logButtonText}>
          {todayCompleted ? 'დღე დასრულებულია' : 'მონიშნე როგორც დასრულებული'}
        </Text>
      </TouchableOpacity>

      <ScrollView style={styles.heatmapContainer} horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.heatmap}>
          {Array.from({ length: 30 }).map((_, index) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - index));
            const dateStr = formatDate(date);
            const log = logs.find((l) => l.date === dateStr);
            const isToday = index === 29;

            return (
              <View
                key={index}
                style={[
                  styles.heatmapCell,
                  log?.completed && styles.heatmapCellCompleted,
                  isToday && styles.heatmapCellToday,
                ]}
              />
            );
          })}
        </View>
      </ScrollView>
      <Text style={styles.heatmapLabel}>ბოლო 30 დღე</Text>
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
    marginBottom: 20,
  },
  title: {
    fontFamily: typography.fontFamily,
    fontSize: 20,
    color: colors.orange,
    marginLeft: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: typography.fontFamily,
    fontSize: 32,
    color: colors.primary,
  },
  statLabel: {
    fontFamily: typography.fontFamily,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 5,
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLighter,
    borderRadius: borderRadius.lg,
    padding: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: colors.borderLight,
  },
  logButtonCompleted: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  logButtonText: {
    fontFamily: typography.fontFamily,
    fontSize: 16,
    color: colors.textPrimary,
    marginLeft: 10,
  },
  heatmapContainer: {
    maxHeight: 80,
  },
  heatmap: {
    flexDirection: 'row',
    gap: 5,
  },
  heatmapCell: {
    width: 30,
    height: 30,
    backgroundColor: colors.surfaceLighter,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  heatmapCellCompleted: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  heatmapCellToday: {
    borderColor: colors.orange,
    borderWidth: 2,
  },
  heatmapLabel: {
    fontFamily: typography.fontFamily,
    fontSize: 10,
    color: colors.textDark,
    textAlign: 'center',
    marginTop: 8,
  },
});
