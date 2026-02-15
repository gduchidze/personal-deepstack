import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DaySchedule } from '../types';
import { getCurrentTime, getDayOfWeek } from '../utils/dateUtils';

interface Props {
  scheduleData: DaySchedule[];
}

export const CurrentActivityBlock: React.FC<Props> = ({ scheduleData }) => {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [currentActivity, setCurrentActivity] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      const time = getCurrentTime();
      setCurrentTime(time);
      findCurrentActivity(time);
    }, 1000);

    return () => clearInterval(interval);
  }, [scheduleData]);

  const findCurrentActivity = (time: string) => {
    const dayOfWeek = getDayOfWeek();
    const currentMinutes = parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);

    for (let i = 0; i < scheduleData.length; i++) {
      const scheduleTime = scheduleData[i].time;
      const scheduleMinutes = parseInt(scheduleTime.split(':')[0]) * 60 + parseInt(scheduleTime.split(':')[1]);

      const nextScheduleMinutes = i < scheduleData.length - 1
        ? parseInt(scheduleData[i + 1].time.split(':')[0]) * 60 + parseInt(scheduleData[i + 1].time.split(':')[1])
        : 24 * 60;

      if (currentMinutes >= scheduleMinutes && currentMinutes < nextScheduleMinutes) {
        const activity = scheduleData[i][dayOfWeek as keyof DaySchedule] as string;
        setCurrentActivity(activity || 'თავისუფალი დრო');
        break;
      }
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a1a1a', '#000000', '#1a1a1a']}
        style={styles.gradient}
      >
        <View style={styles.glowBorder}>
          <Text style={styles.timeText}>{currentTime}</Text>
          <Text style={styles.activityText}>{currentActivity}</Text>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  gradient: {
    borderRadius: 15,
    padding: 3,
  },
  glowBorder: {
    backgroundColor: '#000000',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#00ff41',
    shadowColor: '#00ff41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  timeText: {
    fontFamily: 'monospace',
    fontSize: 32,
    color: '#00ff41',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 2,
  },
  activityText: {
    fontFamily: 'monospace',
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
  },
});
