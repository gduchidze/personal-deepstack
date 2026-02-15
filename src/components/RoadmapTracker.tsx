import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RoadmapWeek } from '../types';
import { getCurrentWeek, getProgress } from '../utils/dateUtils';
import { Target, BookOpen, Code } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

interface Props {
  weekData: RoadmapWeek[];
}

export const RoadmapTracker: React.FC<Props> = ({ weekData }) => {
  const currentWeek = getCurrentWeek();
  const progress = getProgress(currentWeek);

  const currentWeekData = weekData.filter(
    (item) => item.week === `Week ${currentWeek}`
  );

  const todaysTopic = currentWeekData.length > 0 ? currentWeekData[0].topic : 'არ არის მონაცემები';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Target color={colors.primary} size={24} />
        <Text style={styles.title}>როუდმაპი - კვირა {currentWeek}/65</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <LinearGradient
            colors={[colors.primary, '#00cc33']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressBarFill, { width: `${progress}%` }]}
          />
        </View>
        <Text style={styles.progressText}>{progress.toFixed(1)}% დასრულებული</Text>
      </View>

      {/* Today's Topic */}
      <View style={styles.topicContainer}>
        <View style={styles.topicHeader}>
          <BookOpen color={colors.blue} size={20} />
          <Text style={styles.topicTitle}>დღევანდელი დავალება</Text>
        </View>
        <Text style={styles.topicText}>{todaysTopic}</Text>
      </View>

      {/* Week Details */}
      <ScrollView style={styles.weekDetails} showsVerticalScrollIndicator={false}>
        {currentWeekData.map((item, index) => (
          <View key={index} style={styles.weekItem}>
            <View style={styles.weekItemHeader}>
              <Code color={colors.red} size={16} />
              <Text style={styles.weekItemDay}>{item.day} - {item.timeBlock}</Text>
            </View>
            <Text style={styles.weekItemTopic}>{item.topic}</Text>
            {item.dsaPractice && item.dsaPractice !== '—' && (
              <Text style={styles.weekItemDSA}>DSA: {item.dsaPractice}</Text>
            )}
          </View>
        ))}
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
    marginBottom: 20,
  },
  title: {
    fontFamily: typography.fontFamily,
    fontSize: 20,
    color: colors.primary,
    marginLeft: 10,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: colors.surfaceLighter,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  topicContainer: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: colors.blue,
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  topicTitle: {
    fontFamily: typography.fontFamily,
    fontSize: 16,
    color: colors.blue,
    marginLeft: 8,
  },
  topicText: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
  weekDetails: {
    maxHeight: 250,
  },
  weekItem: {
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: colors.red,
  },
  weekItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  weekItemDay: {
    fontFamily: typography.fontFamily,
    fontSize: 12,
    color: colors.red,
    marginLeft: 6,
  },
  weekItemTopic: {
    fontFamily: typography.fontFamily,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 5,
  },
  weekItemDSA: {
    fontFamily: typography.fontFamily,
    fontSize: 11,
    color: colors.textSecondary,
  },
});
