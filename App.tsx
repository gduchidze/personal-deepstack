import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { parseXLSXData } from './src/utils/dataParser';
import { setupNotifications, scheduleNotifications } from './src/utils/notifications';
import { CurrentActivityBlock } from './src/components/CurrentActivityBlock';
import { EnhancedCurrentActivity } from './src/components/EnhancedCurrentActivity';
import { RoadmapTracker } from './src/components/RoadmapTracker';
import { ProgressLogger } from './src/components/ProgressLogger';
import { DailySchedule } from './src/components/DailySchedule';
import { AchievementBadges } from './src/components/AchievementBadges';
import { WeeklyGoals } from './src/components/WeeklyGoals';
import { StatsPanel } from './src/components/StatsPanel';
import { EnhancedStatsPanel } from './src/components/EnhancedStatsPanel';
import { SettingsPanel } from './src/components/SettingsPanel';
import { ArticlesViewer } from './src/components/ArticlesViewer';
import { AnimatedBackground } from './src/components/AnimatedBackground';
import { ParticleField } from './src/components/ParticleField';
import { GlassMorphCard } from './src/components/GlassMorphCard';
import { DaySchedule, RoadmapWeek } from './src/types';
import { Terminal, Home, BarChart3, BookOpen } from 'lucide-react-native';
import * as Animatable from 'react-native-animatable';

type TabType = 'home' | 'stats' | 'articles';

export default function App() {
  const [scheduleData, setScheduleData] = useState<DaySchedule[]>([]);
  const [weekData, setWeekData] = useState<RoadmapWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('home');

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Setup notifications
      const notifPermission = await setupNotifications();
      if (notifPermission) {
        await scheduleNotifications();
      }

      // Load XLSX data
      const data = await parseXLSXData(require('./assets/AI_Engineer_15Month_Roadmap.xlsx'));
      setScheduleData(data.scheduleData);
      setWeekData(data.weekData);
    } catch (error) {
      console.error('Initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <LinearGradient colors={['#000000', '#0a0a0a']} style={styles.loadingGradient}>
          <Terminal color="#00ff41" size={48} />
          <Text style={styles.loadingText}>DeepStack იტვირთება...</Text>
          <ActivityIndicator size="large" color="#00ff41" style={{ marginTop: 20 }} />
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <EnhancedCurrentActivity scheduleData={scheduleData} />
            <RoadmapTracker weekData={weekData} />
            <AchievementBadges />
            <WeeklyGoals />
            <ProgressLogger />
            <DailySchedule scheduleData={scheduleData} />
          </>
        );
      case 'stats':
        return (
          <>
            <EnhancedStatsPanel />
            <AchievementBadges />
            <ProgressLogger />
          </>
        );
      case 'articles':
        return <ArticlesViewer />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <AnimatedBackground>
        <ParticleField />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animatable.View animation="fadeInDown" duration={1000} style={styles.header}>
            <Terminal color="#00ff41" size={32} />
            <Text style={styles.headerTitle}>DEEPSTACK</Text>
          </Animatable.View>
          <Animatable.Text animation="fadeIn" delay={500} style={styles.headerSubtitle}>
            AI Engineer 15-Month Protocol
          </Animatable.Text>

          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'home' && styles.tabActive]}
              onPress={() => setActiveTab('home')}
              activeOpacity={0.7}
            >
              <Home color={activeTab === 'home' ? '#00ff41' : '#888'} size={20} />
              <Text style={[styles.tabText, activeTab === 'home' && styles.tabTextActive]}>
                მთავარი
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'stats' && styles.tabActive]}
              onPress={() => setActiveTab('stats')}
              activeOpacity={0.7}
            >
              <BarChart3 color={activeTab === 'stats' ? '#00bfff' : '#888'} size={20} />
              <Text style={[styles.tabText, activeTab === 'stats' && styles.tabTextActive]}>
                სტატისტიკა
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tab, activeTab === 'articles' && styles.tabActive]}
              onPress={() => setActiveTab('articles')}
              activeOpacity={0.7}
            >
              <BookOpen color={activeTab === 'articles' ? '#ffa500' : '#888'} size={20} />
              <Text style={[styles.tabText, activeTab === 'articles' && styles.tabTextActive]}>
                სტატიები
              </Text>
            </TouchableOpacity>
          </View>

          {/* Content */}
          {renderContent()}

          {/* Settings (shown on all tabs) */}
          {activeTab === 'home' && <SettingsPanel />}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>⚡ Built with precision & discipline</Text>
            <Text style={styles.footerVersion}>v3.0.0 | DeepStack Protocol Engine</Text>
          </View>
        </ScrollView>
      </AnimatedBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: 'monospace',
    fontSize: 18,
    color: '#00ff41',
    marginTop: 20,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 5,
  },
  headerTitle: {
    fontFamily: 'monospace',
    fontSize: 28,
    color: '#00ff41',
    marginLeft: 12,
    letterSpacing: 4,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#0a0a0a',
    borderRadius: 12,
    padding: 5,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#0f0f0f',
  },
  tabText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#888',
  },
  tabTextActive: {
    color: '#ffffff',
  },
  comingSoon: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  comingSoonText: {
    fontFamily: 'monospace',
    fontSize: 24,
    color: '#00bfff',
    marginTop: 20,
  },
  comingSoonSubtext: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#888',
    marginTop: 10,
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#1a1a1a',
    alignItems: 'center',
  },
  footerText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  footerVersion: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#444',
  },
});
