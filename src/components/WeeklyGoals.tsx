import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { CheckSquare, Square, BookOpen, Code2, Brain } from 'lucide-react-native';
import { getCurrentWeek, isProgramActive } from '../utils/dateUtils';
import { colors, spacing, borderRadius, typography } from '../theme';

interface Goal {
  id: string;
  title: string;
  category: 'theory' | 'practice' | 'dsa';
  completed: boolean;
}

const GOALS_KEY = '@deepstack_weekly_goals';

interface Props {
  refreshKey?: number;
}

export const WeeklyGoals: React.FC<Props> = ({ refreshKey }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const currentWeek = getCurrentWeek();

  useEffect(() => {
    loadGoals();
  }, [currentWeek, refreshKey]);

  const loadGoals = async () => {
    if (currentWeek === 0) {
      const defaultGoals: Goal[] = [
        { id: '1', title: 'კარპათის ვიდეო ნახე', category: 'theory', completed: false },
        { id: '2', title: '3+ პრაქტიკული ამოცანა', category: 'practice', completed: false },
        { id: '3', title: '5+ DSA პრობლემა', category: 'dsa', completed: false },
        { id: '4', title: 'კვირის პროექტი დაასრულე', category: 'practice', completed: false },
        { id: '5', title: 'თეორიული მასალა გადაიხედე', category: 'theory', completed: false },
      ];
      setGoals(defaultGoals);
      return;
    }

    try {
      const stored = await AsyncStorage.getItem(`${GOALS_KEY}_week_${currentWeek}`);
      if (stored) {
        setGoals(JSON.parse(stored));
      } else {
        const defaultGoals: Goal[] = [
          { id: '1', title: 'კარპათის ვიდეო ნახე', category: 'theory', completed: false },
          { id: '2', title: '3+ პრაქტიკული ამოცანა', category: 'practice', completed: false },
          { id: '3', title: '5+ DSA პრობლემა', category: 'dsa', completed: false },
          { id: '4', title: 'კვირის პროექტი დაასრულე', category: 'practice', completed: false },
          { id: '5', title: 'თეორიული მასალა გადაიხედე', category: 'theory', completed: false },
        ];
        setGoals(defaultGoals);
        await AsyncStorage.setItem(`${GOALS_KEY}_week_${currentWeek}`, JSON.stringify(defaultGoals));
      }
    } catch (error) {
      console.error('Error loading goals:', error);
    }
  };

  const toggleGoal = async (goalId: string) => {
    if (currentWeek === 0) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const updatedGoals = goals.map(goal =>
      goal.id === goalId ? { ...goal, completed: !goal.completed } : goal
    );

    setGoals(updatedGoals);

    try {
      await AsyncStorage.setItem(`${GOALS_KEY}_week_${currentWeek}`, JSON.stringify(updatedGoals));
    } catch (error) {
      console.error('Error saving goals:', error);
    }
  };

  const getCompletionPercentage = (): number => {
    if (goals.length === 0) return 0;
    return Math.round((goals.filter(g => g.completed).length / goals.length) * 100);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'theory':
        return <BookOpen color={colors.blue} size={16} />;
      case 'practice':
        return <Code2 color={colors.red} size={16} />;
      case 'dsa':
        return <Brain color={colors.orange} size={16} />;
      default:
        return <Square color={colors.textSecondary} size={16} />;
    }
  };

  const completionPercentage = getCompletionPercentage();
  const programActive = isProgramActive();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CheckSquare color={colors.primary} size={24} />
        <Text style={styles.title}>
          {currentWeek === 0 ? 'კვირის მიზნები - მალე იწყება' : `კვირის მიზნები - კვირა ${currentWeek}`}
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
        <Text style={styles.progressText}>{completionPercentage}% შესრულებული</Text>
      </View>

      <View style={styles.goalsList}>
        {goals.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[
              styles.goalItem,
              goal.completed && styles.goalItemCompleted,
              !programActive && styles.goalItemDisabled,
            ]}
            onPress={() => toggleGoal(goal.id)}
            activeOpacity={0.7}
            disabled={!programActive}
          >
            <View style={styles.goalIcon}>
              {goal.completed ? (
                <CheckSquare color={colors.primary} size={20} />
              ) : (
                <Square color={programActive ? colors.textSecondary : colors.textDark} size={20} />
              )}
            </View>
            <View style={styles.goalContent}>
              <Text style={[styles.goalTitle, goal.completed && styles.goalTitleCompleted]}>
                {goal.title}
              </Text>
            </View>
            <View style={styles.categoryIcon}>
              {getCategoryIcon(goal.category)}
            </View>
          </TouchableOpacity>
        ))}
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
    fontSize: 18,
    color: colors.primary,
    marginLeft: 10,
  },
  progressBar: {
    height: 30,
    backgroundColor: colors.surfaceLighter,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    marginBottom: 20,
    justifyContent: 'center',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: colors.primary,
    opacity: 0.3,
  },
  progressText: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    color: colors.textPrimary,
    textAlign: 'center',
    zIndex: 1,
  },
  goalsList: {
    gap: 10,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    padding: 15,
    borderWidth: 2,
    borderColor: colors.border,
  },
  goalItemCompleted: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  goalItemDisabled: {
    opacity: 0.5,
  },
  goalIcon: {
    marginRight: 12,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    color: colors.textPrimary,
  },
  goalTitleCompleted: {
    color: colors.textSecondary,
    textDecorationLine: 'line-through',
  },
  categoryIcon: {
    marginLeft: 10,
  },
});
