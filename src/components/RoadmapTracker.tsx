import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { RoadmapWeek } from '../types';
import { getCurrentWeek, getProgress } from '../utils/dateUtils';
import { Target, BookOpen, Code } from 'lucide-react-native';

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
        <Target color="#00ff41" size={24} />
        <Text style={styles.title}>როუდმაპი - კვირა {currentWeek}/65</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <LinearGradient
            colors={['#00ff41', '#00cc33']}
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
          <BookOpen color="#00bfff" size={20} />
          <Text style={styles.topicTitle}>დღევანდელი დავალება</Text>
        </View>
        <Text style={styles.topicText}>{todaysTopic}</Text>
      </View>

      {/* Week Details */}
      <ScrollView style={styles.weekDetails} showsVerticalScrollIndicator={false}>
        {currentWeekData.map((item, index) => (
          <View key={index} style={styles.weekItem}>
            <View style={styles.weekItemHeader}>
              <Code color="#ff6b6b" size={16} />
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
    color: '#00ff41',
    marginLeft: 10,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBarBackground: {
    height: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  topicContainer: {
    backgroundColor: '#0f0f0f',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#00bfff',
  },
  topicHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  topicTitle: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#00bfff',
    marginLeft: 8,
  },
  topicText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
  weekDetails: {
    maxHeight: 250,
  },
  weekItem: {
    backgroundColor: '#0f0f0f',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 3,
    borderLeftColor: '#ff6b6b',
  },
  weekItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  weekItemDay: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#ff6b6b',
    marginLeft: 6,
  },
  weekItemTopic: {
    fontFamily: 'monospace',
    fontSize: 13,
    color: '#ffffff',
    marginBottom: 5,
  },
  weekItemDSA: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#888',
  },
});
