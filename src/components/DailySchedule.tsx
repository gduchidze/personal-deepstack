import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Clock, ChevronRight } from 'lucide-react-native';
import { DaySchedule } from '../types';
import { getDayOfWeek, getDayOfWeekGeorgian, getCurrentTime } from '../utils/dateUtils';
import { colors, spacing, borderRadius, typography } from '../theme';

interface Props {
  scheduleData: DaySchedule[];
}

export const DailySchedule: React.FC<Props> = ({ scheduleData }) => {
  const [currentMinutes, setCurrentMinutes] = useState(0);
  const dayOfWeek = getDayOfWeek();
  const dayOfWeekGeorgian = getDayOfWeekGeorgian();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentMinutes(now.getHours() * 60 + now.getMinutes());
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const isCurrentSlot = (index: number): boolean => {
    const scheduleTime = scheduleData[index].time;
    const scheduleMinutes = parseInt(scheduleTime.split(':')[0]) * 60 + parseInt(scheduleTime.split(':')[1]);
    const nextMinutes = index < scheduleData.length - 1
      ? parseInt(scheduleData[index + 1].time.split(':')[0]) * 60 + parseInt(scheduleData[index + 1].time.split(':')[1])
      : 24 * 60;
    return currentMinutes >= scheduleMinutes && currentMinutes < nextMinutes;
  };

  const isPastSlot = (index: number): boolean => {
    const nextMinutes = index < scheduleData.length - 1
      ? parseInt(scheduleData[index + 1].time.split(':')[0]) * 60 + parseInt(scheduleData[index + 1].time.split(':')[1])
      : 24 * 60;
    return currentMinutes >= nextMinutes;
  };

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

          const isCurrent = isCurrentSlot(index);
          const isPast = isPastSlot(index);

          return (
            <View
              key={index}
              style={[
                styles.scheduleItem,
                isCurrent && styles.scheduleItemActive,
                isPast && styles.scheduleItemPast,
              ]}
            >
              {isCurrent && <ChevronRight color={colors.primary} size={16} style={styles.activeIndicator} />}
              <Text style={[
                styles.timeText,
                isCurrent && styles.timeTextActive,
                isPast && styles.timeTextPast,
              ]}>
                {item.time.substring(0, 5)}
              </Text>
              <View style={[
                styles.activityContainer,
                isCurrent && styles.activityContainerActive,
              ]}>
                <Text style={[
                  styles.activityText,
                  isPast && styles.activityTextPast,
                ]}>
                  {activity}
                </Text>
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
  scheduleItemActive: {
    borderBottomColor: colors.primary,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    paddingLeft: 8,
  },
  scheduleItemPast: {
    opacity: 0.4,
  },
  activeIndicator: {
    marginRight: 4,
  },
  timeText: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    color: colors.primary,
    width: 60,
  },
  timeTextActive: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  timeTextPast: {
    color: colors.textDark,
  },
  activityContainer: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.md,
    padding: 10,
    marginLeft: 10,
  },
  activityContainerActive: {
    backgroundColor: colors.primaryBg,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  activityText: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    color: colors.textPrimary,
  },
  activityTextPast: {
    color: colors.textDark,
  },
});
