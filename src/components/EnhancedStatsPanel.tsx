import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart3, Calendar, Zap, TrendingUp } from 'lucide-react-native';
import { ActivityLog } from '../types';
import { getDaysIntoProgram, isProgramActive, getDaysUntilStart } from '../utils/dateUtils';
import { getStreak, getLongestStreak } from '../utils/streakCalculator';
import { CircularProgress } from './CircularProgress';
import { GlassMorphCard } from './GlassMorphCard';
import { AnimatedCounter } from './AnimatedCounter';
import { colors, spacing, borderRadius, typography } from '../theme';

const LOGS_KEY = '@deepstack_logs';

interface Props {
  refreshKey?: number;
}

export const EnhancedStatsPanel: React.FC<Props> = ({ refreshKey }) => {
  const [stats, setStats] = useState({
    totalDays: 0,
    completedDays: 0,
    currentStreak: 0,
    longestStreak: 0,
    weekCompletion: 0,
  });

  useEffect(() => {
    loadStats();
  }, [refreshKey]);

  const loadStats = async () => {
    try {
      const stored = await AsyncStorage.getItem(LOGS_KEY);
      const logs: ActivityLog[] = stored ? JSON.parse(stored) : [];

      const totalDays = getDaysIntoProgram();
      const completedDays = logs.filter(l => l.completed).length;
      const currentStreak = getStreak(logs);
      const longestStreak_ = getLongestStreak(logs);
      const weekCompletion = calculateWeekCompletion(logs);

      setStats({
        totalDays,
        completedDays,
        currentStreak,
        longestStreak: longestStreak_,
        weekCompletion,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const calculateWeekCompletion = (logs: ActivityLog[]): number => {
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const completed = last7Days.filter(date => {
      const log = logs.find(l => l.date === date);
      return log?.completed;
    }).length;

    return Math.round((completed / 7) * 100);
  };

  const programActive = isProgramActive();
  const daysUntilStart = getDaysUntilStart();

  const completionRate = stats.totalDays > 0
    ? Math.round((stats.completedDays / stats.totalDays) * 100)
    : 0;

  return (
    <View style={styles.container}>
      <GlassMorphCard glowColor={colors.blue}>
        <View style={styles.header}>
          <BarChart3 color={colors.blue} size={24} />
          <Text style={styles.title}>სტატისტიკა</Text>
        </View>

        {!programActive && (
          <View style={styles.countdownBanner}>
            <Text style={styles.countdownText}>
              პროგრამა იწყება {daysUntilStart} დღეში
            </Text>
          </View>
        )}

        <View style={styles.circularContainer}>
          <CircularProgress
            progress={completionRate}
            size={110}
            strokeWidth={10}
            color={colors.primary}
            label="სულ"
          />
          <CircularProgress
            progress={stats.weekCompletion}
            size={110}
            strokeWidth={10}
            color={colors.blue}
            label="კვირა"
          />
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <View style={styles.statIcon}>
              <Calendar color={colors.orange} size={22} />
            </View>
            <AnimatedCounter value={stats.totalDays} style={styles.statValue} />
            <Text style={styles.statLabel}>დღე პროგრამაში</Text>
          </View>

          <View style={styles.statBox}>
            <View style={styles.statIcon}>
              <Zap color={colors.primary} size={22} />
            </View>
            <AnimatedCounter value={stats.currentStreak} style={styles.statValue} />
            <Text style={styles.statLabel}>მიმდინარე სერია</Text>
          </View>

          <View style={styles.statBox}>
            <View style={styles.statIcon}>
              <TrendingUp color={colors.red} size={22} />
            </View>
            <AnimatedCounter value={stats.longestStreak} style={styles.statValue} />
            <Text style={styles.statLabel}>უდიდესი სერია</Text>
          </View>

          <View style={styles.statBox}>
            <View style={styles.statIcon}>
              <BarChart3 color={colors.purple} size={22} />
            </View>
            <AnimatedCounter value={stats.completedDays} style={styles.statValue} />
            <Text style={styles.statLabel}>დასრულებული</Text>
          </View>
        </View>
      </GlassMorphCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: typography.fontFamily,
    fontSize: 20,
    color: colors.blue,
    marginLeft: 10,
    textShadowColor: colors.blue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  countdownBanner: {
    backgroundColor: 'rgba(0, 191, 255, 0.1)',
    borderRadius: borderRadius.lg,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(0, 191, 255, 0.3)',
    alignItems: 'center',
  },
  countdownText: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    color: colors.blue,
    fontWeight: 'bold',
  },
  circularContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statBox: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: 'rgba(15, 15, 15, 0.6)',
    borderRadius: borderRadius.xxl,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  statIcon: {
    marginBottom: 10,
    padding: 8,
    borderRadius: borderRadius.round,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  statValue: {
    fontFamily: typography.fontFamily,
    fontSize: 32,
    color: colors.textPrimary,
    fontWeight: 'bold',
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  statLabel: {
    fontFamily: typography.fontFamily,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: 'center',
  },
});
