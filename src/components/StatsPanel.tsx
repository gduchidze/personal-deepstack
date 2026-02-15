import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BarChart3, Calendar, Zap, TrendingUp } from 'lucide-react-native';
import { ActivityLog } from '../types';
import { getCurrentWeek, getDaysIntoProgram } from '../utils/dateUtils';
import { CircularProgress } from './CircularProgress';

const LOGS_KEY = '@deepstack_logs';

export const StatsPanel: React.FC = () => {
  const [stats, setStats] = useState({
    totalDays: 0,
    completedDays: 0,
    currentStreak: 0,
    longestStreak: 0,
    weekCompletion: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const stored = await AsyncStorage.getItem(LOGS_KEY);
      const logs: ActivityLog[] = stored ? JSON.parse(stored) : [];

      const totalDays = getDaysIntoProgram();
      const completedDays = logs.filter(l => l.completed).length;
      const currentStreak = calculateStreak(logs);
      const longestStreak = calculateLongestStreak(logs);
      const weekCompletion = calculateWeekCompletion(logs);

      setStats({
        totalDays,
        completedDays,
        currentStreak,
        longestStreak,
        weekCompletion,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const calculateStreak = (logs: ActivityLog[]): number => {
    const sortedLogs = [...logs]
      .filter(log => log.completed)
      .sort((a, b) => b.timestamp - a.timestamp);

    let streak = 0;
    let currentDate = new Date();

    for (const log of sortedLogs) {
      const logDate = new Date(log.date);
      const diffDays = Math.floor((currentDate.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === streak) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateLongestStreak = (logs: ActivityLog[]): number => {
    const sortedLogs = [...logs]
      .filter(log => log.completed)
      .sort((a, b) => a.timestamp - b.timestamp);

    let maxStreak = 0;
    let currentStreak = 0;
    let lastDate: Date | null = null;

    for (const log of sortedLogs) {
      const logDate = new Date(log.date);

      if (lastDate) {
        const diffDays = Math.floor((logDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          currentStreak++;
        } else {
          maxStreak = Math.max(maxStreak, currentStreak);
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      lastDate = logDate;
    }

    return Math.max(maxStreak, currentStreak);
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

  const completionRate = stats.totalDays > 0
    ? Math.round((stats.completedDays / stats.totalDays) * 100)
    : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BarChart3 color="#00bfff" size={24} />
        <Text style={styles.title}>სტატისტიკა</Text>
      </View>

      <View style={styles.circularContainer}>
        <CircularProgress
          progress={completionRate}
          size={100}
          strokeWidth={8}
          color="#00ff41"
          label="სულ"
        />
        <CircularProgress
          progress={stats.weekCompletion}
          size={100}
          strokeWidth={8}
          color="#00bfff"
          label="კვირა"
        />
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <View style={styles.statIcon}>
            <Calendar color="#ffa500" size={20} />
          </View>
          <Text style={styles.statValue}>{stats.totalDays}</Text>
          <Text style={styles.statLabel}>დღე პროგრამაში</Text>
        </View>

        <View style={styles.statBox}>
          <View style={styles.statIcon}>
            <Zap color="#00ff41" size={20} />
          </View>
          <Text style={styles.statValue}>{stats.currentStreak}</Text>
          <Text style={styles.statLabel}>მიმდინარე სერია</Text>
        </View>

        <View style={styles.statBox}>
          <View style={styles.statIcon}>
            <TrendingUp color="#ff6b6b" size={20} />
          </View>
          <Text style={styles.statValue}>{stats.longestStreak}</Text>
          <Text style={styles.statLabel}>უდიდესი სერია</Text>
        </View>

        <View style={styles.statBox}>
          <View style={styles.statIcon}>
            <BarChart3 color="#9b59b6" size={20} />
          </View>
          <Text style={styles.statValue}>{stats.completedDays}</Text>
          <Text style={styles.statLabel}>დასრულებული</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0a0a0a',
    borderRadius: 15,
    padding: 20,
    marginVertical: 15,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'monospace',
    fontSize: 20,
    color: '#00bfff',
    marginLeft: 10,
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
    backgroundColor: '#0f0f0f',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  statIcon: {
    marginBottom: 8,
  },
  statValue: {
    fontFamily: 'monospace',
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  statLabel: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#888',
    marginTop: 4,
    textAlign: 'center',
  },
});
