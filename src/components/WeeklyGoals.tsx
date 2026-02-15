import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { CheckSquare, Square, BookOpen, Code2, Brain } from 'lucide-react-native';
import { getCurrentWeek } from '../utils/dateUtils';

interface Goal {
  id: string;
  title: string;
  category: 'theory' | 'practice' | 'dsa';
  completed: boolean;
}

const GOALS_KEY = '@deepstack_weekly_goals';

export const WeeklyGoals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const currentWeek = getCurrentWeek();

  useEffect(() => {
    loadGoals();
  }, [currentWeek]);

  const loadGoals = async () => {
    try {
      const stored = await AsyncStorage.getItem(`${GOALS_KEY}_week_${currentWeek}`);
      if (stored) {
        setGoals(JSON.parse(stored));
      } else {
        // Initialize default goals for the week
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
        return <BookOpen color="#00bfff" size={16} />;
      case 'practice':
        return <Code2 color="#ff6b6b" size={16} />;
      case 'dsa':
        return <Brain color="#ffa500" size={16} />;
      default:
        return <Square color="#888" size={16} />;
    }
  };

  const completionPercentage = getCompletionPercentage();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CheckSquare color="#00ff41" size={24} />
        <Text style={styles.title}>კვირის მიზნები - კვირა {currentWeek}</Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${completionPercentage}%` }]} />
        <Text style={styles.progressText}>{completionPercentage}% შესრულებული</Text>
      </View>

      <View style={styles.goalsList}>
        {goals.map((goal) => (
          <TouchableOpacity
            key={goal.id}
            style={[styles.goalItem, goal.completed && styles.goalItemCompleted]}
            onPress={() => toggleGoal(goal.id)}
            activeOpacity={0.7}
          >
            <View style={styles.goalIcon}>
              {goal.completed ? (
                <CheckSquare color="#00ff41" size={20} />
              ) : (
                <Square color="#888" size={20} />
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
    fontSize: 18,
    color: '#00ff41',
    marginLeft: 10,
  },
  progressBar: {
    height: 30,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    justifyContent: 'center',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#00ff41',
    opacity: 0.3,
  },
  progressText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
    zIndex: 1,
  },
  goalsList: {
    gap: 10,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f0f0f',
    borderRadius: 10,
    padding: 15,
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  goalItemCompleted: {
    borderColor: '#00ff41',
    backgroundColor: '#0a2a0a',
  },
  goalIcon: {
    marginRight: 12,
  },
  goalContent: {
    flex: 1,
  },
  goalTitle: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#ffffff',
  },
  goalTitleCompleted: {
    color: '#888',
    textDecorationLine: 'line-through',
  },
  categoryIcon: {
    marginLeft: 10,
  },
});
