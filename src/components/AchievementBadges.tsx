import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Award, Zap, Target, Trophy, Star, Flame } from 'lucide-react-native';
import { ActivityLog } from '../types';

const LOGS_KEY = '@deepstack_logs';

interface Badge {
  id: string;
  icon: any;
  title: string;
  description: string;
  color: string;
  unlocked: boolean;
  requirement: (logs: ActivityLog[]) => boolean;
}

export const AchievementBadges: React.FC = () => {
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    checkBadges();
  }, []);

  const checkBadges = async () => {
    try {
      const stored = await AsyncStorage.getItem(LOGS_KEY);
      const logs: ActivityLog[] = stored ? JSON.parse(stored) : [];

      const allBadges: Badge[] = [
        {
          id: 'first_step',
          icon: Star,
          title: 'პირველი ნაბიჯი',
          description: 'დაალოგე პირველი დღე',
          color: '#ffd700',
          unlocked: false,
          requirement: (logs) => logs.filter(l => l.completed).length >= 1,
        },
        {
          id: 'week_warrior',
          icon: Zap,
          title: 'კვირის მეომარი',
          description: '7 დღე ზედიზედ',
          color: '#00ff41',
          unlocked: false,
          requirement: (logs) => getStreak(logs) >= 7,
        },
        {
          id: 'month_master',
          icon: Trophy,
          title: 'თვის ოსტატი',
          description: '30 დღე ზედიზედ',
          color: '#ff6b6b',
          unlocked: false,
          requirement: (logs) => getStreak(logs) >= 30,
        },
        {
          id: 'dedicated',
          icon: Flame,
          title: 'მიძღვნილი',
          description: '50 დღე შესრულებული',
          color: '#ff4500',
          unlocked: false,
          requirement: (logs) => logs.filter(l => l.completed).length >= 50,
        },
        {
          id: 'century',
          icon: Award,
          title: 'სტო დღე',
          description: '100 დღე შესრულებული',
          color: '#00bfff',
          unlocked: false,
          requirement: (logs) => logs.filter(l => l.completed).length >= 100,
        },
        {
          id: 'perfect_month',
          icon: Target,
          title: 'სრულყოფილი თვე',
          description: 'ბოლო 30 დღე 100%',
          color: '#9b59b6',
          unlocked: false,
          requirement: (logs) => {
            const last30Days = getLast30DaysCompletion(logs);
            return last30Days === 30;
          },
        },
      ];

      const unlockedBadges = allBadges.map(badge => ({
        ...badge,
        unlocked: badge.requirement(logs),
      }));

      setBadges(unlockedBadges);
    } catch (error) {
      console.error('Error checking badges:', error);
    }
  };

  const getStreak = (logs: ActivityLog[]): number => {
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

  const getLast30DaysCompletion = (logs: ActivityLog[]): number => {
    const last30Days = Array.from({ length: 30 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return date.toISOString().split('T')[0];
    });

    return last30Days.filter(date => {
      const log = logs.find(l => l.date === date);
      return log?.completed;
    }).length;
  };

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Award color="#ffd700" size={24} />
        <Text style={styles.title}>მიღწევები ({unlockedCount}/{badges.length})</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.badgeScroll}>
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <View
              key={badge.id}
              style={[
                styles.badge,
                badge.unlocked && styles.badgeUnlocked,
                { borderColor: badge.unlocked ? badge.color : '#333' },
              ]}
            >
              <View style={[
                styles.iconContainer,
                { backgroundColor: badge.unlocked ? `${badge.color}20` : '#1a1a1a' }
              ]}>
                <Icon
                  color={badge.unlocked ? badge.color : '#555'}
                  size={32}
                />
              </View>
              <Text style={[
                styles.badgeTitle,
                { color: badge.unlocked ? '#ffffff' : '#555' }
              ]}>
                {badge.title}
              </Text>
              <Text style={styles.badgeDescription}>
                {badge.description}
              </Text>
            </View>
          );
        })}
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
    marginBottom: 15,
  },
  title: {
    fontFamily: 'monospace',
    fontSize: 20,
    color: '#ffd700',
    marginLeft: 10,
  },
  badgeScroll: {
    marginHorizontal: -5,
  },
  badge: {
    width: 120,
    backgroundColor: '#0f0f0f',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 2,
  },
  badgeUnlocked: {
    shadowColor: '#00ff41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  badgeTitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  badgeDescription: {
    fontFamily: 'monospace',
    fontSize: 9,
    color: '#888',
    textAlign: 'center',
  },
});
