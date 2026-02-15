import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { CheckCircle, Circle, TrendingUp } from 'lucide-react-native';
import { ActivityLog } from '../types';
import { formatDate } from '../utils/dateUtils';

const LOGS_KEY = '@deepstack_logs';

export const ProgressLogger: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [todayCompleted, setTodayCompleted] = useState(false);

  useEffect(() => {
    loadLogs();
  }, []);

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
    } catch (error) {
      console.error('Error saving log:', error);
    }
  };

  const getStreak = (): number => {
    const sortedLogs = [...logs]
      .filter((log) => log.completed)
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TrendingUp color="#ffa500" size={24} />
        <Text style={styles.title}>პროგრესის ტრეკერი</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{getStreak()}</Text>
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
          <CheckCircle color="#00ff41" size={24} />
        ) : (
          <Circle color="#888" size={24} />
        )}
        <Text style={styles.logButtonText}>
          {todayCompleted ? 'დღე დასრულებულია ✓' : 'მონიშნე როგორც დასრულებული'}
        </Text>
      </TouchableOpacity>

      <ScrollView style={styles.heatmapContainer} horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.heatmap}>
          {Array.from({ length: 30 }).map((_, index) => {
            const date = new Date();
            date.setDate(date.getDate() - (29 - index));
            const dateStr = formatDate(date);
            const log = logs.find((l) => l.date === dateStr);

            return (
              <View
                key={index}
                style={[
                  styles.heatmapCell,
                  log?.completed && styles.heatmapCellCompleted,
                ]}
              />
            );
          })}
        </View>
      </ScrollView>
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
    color: '#ffa500',
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
    fontFamily: 'monospace',
    fontSize: 32,
    color: '#00ff41',
  },
  statLabel: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  logButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#333',
  },
  logButtonCompleted: {
    borderColor: '#00ff41',
    backgroundColor: '#0a2a0a',
  },
  logButtonText: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#ffffff',
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
    backgroundColor: '#1a1a1a',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#333',
  },
  heatmapCellCompleted: {
    backgroundColor: '#00ff41',
    borderColor: '#00ff41',
  },
});
