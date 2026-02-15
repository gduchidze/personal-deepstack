import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Clock } from 'lucide-react-native';
import { DaySchedule } from '../types';
import { getDayOfWeek, getDayOfWeekGeorgian } from '../utils/dateUtils';
import { colors, spacing, borderRadius, typography } from '../theme';

interface Props {
  scheduleData: DaySchedule[];
}

export const DailySchedule: React.FC<Props> = ({ scheduleData }) => {
  const dayOfWeek = getDayOfWeek();
  const dayOfWeekGeorgian = getDayOfWeekGeorgian();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Clock color={colors.red} size={24} />
        <Text style={styles.title}>{dayOfWeekGeorgian} - განრიგი</Text>
      </View>

      <ScrollView style={styles.scheduleList} showsVerticalScrollIndicator={false}>
        {scheduleData.map((item, index) => {
          const activity = item[dayOfWeek as keyof DaySchedule] as string;
          if (!activity) return null;

          return (
            <View key={index} style={styles.scheduleItem}>
              <Text style={styles.timeText}>{item.time.substring(0, 5)}</Text>
              <View style={styles.activityContainer}>
                <Text style={styles.activityText}>{activity}</Text>
              </View>
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
    marginBottom: 20,
  },
  title: {
    fontFamily: typography.fontFamily,
    fontSize: 20,
    color: colors.red,
    marginLeft: 10,
  },
  scheduleList: {
    maxHeight: 400,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  timeText: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    color: colors.primary,
    width: 60,
  },
  activityContainer: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: 10,
    marginLeft: 10,
  },
  activityText: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    color: colors.textPrimary,
  },
});
