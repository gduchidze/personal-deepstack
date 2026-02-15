import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DaySchedule } from '../types';
import { getCurrentTime, getDayOfWeek } from '../utils/dateUtils';
import { GlassMorphCard } from './GlassMorphCard';
import { Clock } from 'lucide-react-native';
import * as Animatable from 'react-native-animatable';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  scheduleData: DaySchedule[];
}

export const EnhancedCurrentActivity: React.FC<Props> = ({ scheduleData }) => {
  const [currentTime, setCurrentTime] = useState(getCurrentTime());
  const [currentActivity, setCurrentActivity] = useState<string>('');
  const pulse = useSharedValue(1);

  useEffect(() => {
    const interval = setInterval(() => {
      const time = getCurrentTime();
      setCurrentTime(time);
      findCurrentActivity(time);
    }, 1000);

    // Pulse animation
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000 }),
        withTiming(1, { duration: 1000 })
      ),
      -1,
      false
    );

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

  const pulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: pulse.value }],
    };
  });

  return (
    <Animatable.View animation="fadeInUp" duration={800} style={styles.container}>
      <GlassMorphCard glowColor="#00ff41" style={styles.card}>
        <View style={styles.header}>
          <Animated.View style={[styles.iconContainer, pulseStyle]}>
            <Clock color="#00ff41" size={28} />
          </Animated.View>
          <Text style={styles.label}>ამჟამინდელი აქტივობა</Text>
        </View>

        <LinearGradient
          colors={['#0a1a0a', '#001a0a', '#0a1a0a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.glowBorder}
        >
          <Animatable.Text
            animation="pulse"
            iterationCount="infinite"
            duration={2000}
            style={styles.timeText}
          >
            {currentTime}
          </Animatable.Text>

          <View style={styles.activityContainer}>
            <Text style={styles.activityText}>{currentActivity}</Text>
          </View>
        </LinearGradient>

        {/* Decorative Elements */}
        <View style={styles.decorativeContainer}>
          {[...Array(20)].map((_, i) => (
            <Animatable.View
              key={i}
              animation="fadeIn"
              delay={i * 100}
              style={[
                styles.decorativeDot,
                {
                  left: `${(i * 5) % 100}%`,
                  top: i % 2 === 0 ? 0 : '100%',
                },
              ]}
            />
          ))}
        </View>
      </GlassMorphCard>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
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
    backgroundColor: 'rgba(0, 255, 65, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#00ff41',
    shadowColor: '#00ff41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  label: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  glowBorder: {
    borderRadius: 15,
    padding: 25,
    borderWidth: 2,
    borderColor: '#00ff41',
    shadowColor: '#00ff41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
  },
  timeText: {
    fontFamily: 'monospace',
    fontSize: 42,
    color: '#00ff41',
    textAlign: 'center',
    marginBottom: 15,
    letterSpacing: 4,
    fontWeight: 'bold',
    textShadowColor: '#00ff41',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  activityContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(0, 255, 65, 0.3)',
  },
  activityText: {
    fontFamily: 'monospace',
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 26,
  },
  decorativeContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  decorativeDot: {
    position: 'absolute',
    width: 2,
    height: 2,
    borderRadius: 1,
    backgroundColor: '#00ff41',
    opacity: 0.3,
  },
});
