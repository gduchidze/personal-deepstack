import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DaySchedule } from '../types';
import { getCurrentTime, getDayOfWeek, isProgramActive } from '../utils/dateUtils';
import { GlassMorphCard } from './GlassMorphCard';
import { Clock } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography } from '../theme';

interface Props {
  scheduleData: DaySchedule[];
}

export const EnhancedCurrentActivity: React.FC<Props> = ({ scheduleData }) => {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [currentActivity, setCurrentActivity] = useState<string>('');
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      const time = getCurrentTime();
      setCurrentTime(time);
      findCurrentActivity(time);
    }, 1000);

    // Pulse animation using built-in Animated API
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => {
      clearInterval(interval);
      pulse.stop();
    };
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

  const programActive = isProgramActive();

  return (
    <View style={styles.container}>
      <GlassMorphCard glowColor={colors.primary} style={styles.card}>
        <View style={styles.header}>
          <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
            <Clock color={colors.primary} size={28} />
          </Animated.View>
          <Text style={styles.label}>ამჟამინდელი აქტივობა</Text>
        </View>

        <LinearGradient
          colors={['#0a1a0a', '#001a0a', '#0a1a0a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.glowBorder}
        >
          <Text style={styles.timeText}>{currentTime}</Text>

          <View style={styles.activityContainer}>
            <Text style={styles.activityText}>
              {!programActive ? 'პროგრამა ხვალ იწყება' : currentActivity || 'თავისუფალი დრო'}
            </Text>
          </View>
        </LinearGradient>
      </GlassMorphCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.card,
  },
  card: {},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primaryDim,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  label: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  glowBorder: {
    borderRadius: borderRadius.xxl,
    padding: 25,
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  timeText: {
    fontFamily: typography.fontFamily,
    fontSize: 42,
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 4,
    fontWeight: 'bold',
    textShadowColor: colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  activityContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: borderRadius.lg,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },
  activityText: {
    fontFamily: typography.fontFamily,
    fontSize: 18,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 26,
  },
});
