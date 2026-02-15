import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Award, Zap, Target, Trophy, Star, Flame } from 'lucide-react-native';
import { ActivityLog } from '../types';
import { getStreak, getLast30DaysCompletion } from '../utils/streakCalculator';
import { colors, spacing, borderRadius, typography } from '../theme';

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
          color: colors.gold,
          unlocked: false,
          requirement: (logs) => logs.filter(l => l.completed).length >= 1,
        },
        {
          id: 'week_warrior',
          icon: Zap,
          title: 'კვირის მეომარი',
          description: '7 დღე ზედიზედ',
          color: colors.primary,
          unlocked: false,
          requirement: (logs) => getStreak(logs) >= 7,
        },
        {
          id: 'month_master',
          icon: Trophy,
          title: 'თვის ოსტატი',
          description: '30 დღე ზედიზედ',
          color: colors.red,
          unlocked: false,
          requirement: (logs) => getStreak(logs) >= 30,
        },
        {
          id: 'dedicated',
          icon: Flame,
          title: 'მიძღვნილი',
          description: '50 დღე შესრულებული',
          color: colors.fireOrange,
          unlocked: false,
          requirement: (logs) => logs.filter(l => l.completed).length >= 50,
        },
        {
          id: 'century',
          icon: Award,
          title: 'სტო დღე',
          description: '100 დღე შესრულებული',
          color: colors.blue,
          unlocked: false,
          requirement: (logs) => logs.filter(l => l.completed).length >= 100,
        },
        {
          id: 'perfect_month',
          icon: Target,
          title: 'სრულყოფილი თვე',
          description: 'ბოლო 30 დღე 100%',
          color: colors.purple,
          unlocked: false,
          requirement: (logs) => getLast30DaysCompletion(logs) === 30,
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

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Award color={colors.gold} size={24} />
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
                { borderColor: badge.unlocked ? badge.color : colors.borderLight },
              ]}
            >
              <View style={[
                styles.iconContainer,
                { backgroundColor: badge.unlocked ? `${badge.color}20` : colors.surfaceLighter }
              ]}>
                <Icon
                  color={badge.unlocked ? badge.color : '#555'}
                  size={32}
                />
              </View>
              <Text style={[
                styles.badgeTitle,
                { color: badge.unlocked ? colors.textPrimary : '#555' }
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
    color: colors.gold,
    marginLeft: 10,
  },
  badgeScroll: {
    marginHorizontal: -5,
  },
  badge: {
    width: 120,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.xl,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    borderWidth: 2,
  },
  badgeUnlocked: {
    shadowColor: colors.primary,
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
    fontFamily: typography.fontFamily,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  badgeDescription: {
    fontFamily: typography.fontFamily,
    fontSize: 9,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
