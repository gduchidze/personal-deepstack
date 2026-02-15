import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Clock } from 'lucide-react-native';
import { DaySchedule } from '../types';
import { getDayOfWeek, getDayOfWeekGeorgian } from '../utils/dateUtils';

interface Props {
  scheduleData: DaySchedule[];
}

export const DailySchedule: React.FC<Props> = ({ scheduleData }) => {
  const dayOfWeek = getDayOfWeek();
  const dayOfWeekGeorgian = getDayOfWeekGeorgian();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Clock color="#ff6b6b" size={24} />
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
    color: '#ff6b6b',
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
    borderBottomColor: '#1a1a1a',
  },
  timeText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#00ff41',
    width: 60,
  },
  activityContainer: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    borderRadius: 8,
    padding: 10,
    marginLeft: 10,
  },
  activityText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#ffffff',
  },
});
