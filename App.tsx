import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  StatusBar,
  SafeAreaView,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { parseXLSXData } from './src/utils/dataParser';
import { setupNotifications, scheduleNotifications } from './src/utils/notifications';
import { EnhancedCurrentActivity } from './src/components/EnhancedCurrentActivity';
import { RoadmapTracker } from './src/components/RoadmapTracker';
import { ProgressLogger } from './src/components/ProgressLogger';
import { DailySchedule } from './src/components/DailySchedule';
import { AchievementBadges } from './src/components/AchievementBadges';
import { WeeklyGoals } from './src/components/WeeklyGoals';
import { EnhancedStatsPanel } from './src/components/EnhancedStatsPanel';
import { SettingsPanel } from './src/components/SettingsPanel';
import { ArticlesViewer } from './src/components/ArticlesViewer';
import { QuickDayLog } from './src/components/QuickDayLog';
import { CountdownBanner } from './src/components/CountdownBanner';
import { FocusTimer } from './src/components/FocusTimer';
import { DailyNotes } from './src/components/DailyNotes';
import { DaySchedule, RoadmapWeek } from './src/types';
import { Terminal, Home, BarChart3, BookOpen, Settings, X, Timer } from 'lucide-react-native';
import { colors, spacing, borderRadius, typography } from './src/theme';

type TabType = 'home' | 'stats' | 'focus' | 'articles';

export default function App() {
  const [scheduleData, setScheduleData] = useState<DaySchedule[]>([]);
  const [weekData, setWeekData] = useState<RoadmapWeek[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      const notifPermission = await setupNotifications();
      if (notifPermission) {
        await scheduleNotifications();
      }

      const data = await parseXLSXData(require('./assets/AI_Engineer_15Month_Roadmap.xlsx'));
      setScheduleData(data.scheduleData);
      setWeekData(data.weekData);
    } catch (error) {
      console.error('Initialization error:', error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await parseXLSXData(require('./assets/AI_Engineer_15Month_Roadmap.xlsx'));
      setScheduleData(data.scheduleData);
      setWeekData(data.weekData);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Refresh error:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    // Trigger data refresh when switching tabs so components reload
    setRefreshKey(prev => prev + 1);
  };

  const handleDataChange = () => {
    // When data changes in one component, trigger refresh in others
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor={colors.background} />
        <LinearGradient colors={[colors.background, colors.surface]} style={styles.loadingGradient}>
          <Terminal color={colors.primary} size={48} />
          <Text style={styles.loadingText}>DeepStack იტვირთება...</Text>
          <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
        </LinearGradient>
      </SafeAreaView>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <>
            <CountdownBanner />
            <EnhancedCurrentActivity scheduleData={scheduleData} />
            <QuickDayLog refreshKey={refreshKey} onDataChange={handleDataChange} />
            <WeeklyGoals refreshKey={refreshKey} />
            <RoadmapTracker weekData={weekData} />
          </>
        );
      case 'stats':
        return (
          <>
            <EnhancedStatsPanel refreshKey={refreshKey} />
            <ProgressLogger refreshKey={refreshKey} onDataChange={handleDataChange} />
            <AchievementBadges refreshKey={refreshKey} />
            <DailySchedule scheduleData={scheduleData} />
          </>
        );
      case 'focus':
        return (
          <>
            <FocusTimer />
            <DailyNotes refreshKey={refreshKey} />
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
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <LinearGradient colors={[colors.background, colors.surface]} style={styles.backgroundGradient}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Terminal color={colors.primary} size={28} />
              <Text style={styles.headerTitle}>DEEPSTACK</Text>
            </View>
            <TouchableOpacity
              onPress={() => setSettingsVisible(true)}
              activeOpacity={0.7}
              style={styles.settingsButton}
            >
              <Settings color={colors.textSecondary} size={22} />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerSubtitle}>
            AI Engineer 15-Month Protocol
          </Text>

          {/* Content */}
          {renderContent()}

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Built with precision & discipline</Text>
            <Text style={styles.footerVersion}>v5.0.0 | DeepStack Protocol Engine</Text>
          </View>
        </ScrollView>

        {/* Bottom Tab Bar */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabChange('home')}
            activeOpacity={0.7}
          >
            <Home color={activeTab === 'home' ? colors.primary : colors.textSecondary} size={22} />
            <Text style={[styles.tabText, activeTab === 'home' && styles.tabTextActive]}>
              მთავარი
            </Text>
            {activeTab === 'home' && <View style={styles.tabIndicator} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabChange('stats')}
            activeOpacity={0.7}
          >
            <BarChart3 color={activeTab === 'stats' ? colors.blue : colors.textSecondary} size={22} />
            <Text style={[styles.tabText, activeTab === 'stats' && styles.tabTextActiveBlue]}>
              სტატისტიკა
            </Text>
            {activeTab === 'stats' && <View style={[styles.tabIndicator, styles.tabIndicatorBlue]} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabChange('focus')}
            activeOpacity={0.7}
          >
            <Timer color={activeTab === 'focus' ? colors.orange : colors.textSecondary} size={22} />
            <Text style={[styles.tabText, activeTab === 'focus' && styles.tabTextActiveOrange]}>
              ფოკუსი
            </Text>
            {activeTab === 'focus' && <View style={[styles.tabIndicator, styles.tabIndicatorOrange]} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => handleTabChange('articles')}
            activeOpacity={0.7}
          >
            <BookOpen color={activeTab === 'articles' ? colors.purple : colors.textSecondary} size={22} />
            <Text style={[styles.tabText, activeTab === 'articles' && styles.tabTextActivePurple]}>
              სტატიები
            </Text>
            {activeTab === 'articles' && <View style={[styles.tabIndicator, styles.tabIndicatorPurple]} />}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Settings Modal */}
      <Modal
        visible={settingsVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>პარამეტრები</Text>
              <TouchableOpacity
                onPress={() => setSettingsVisible(false)}
                activeOpacity={0.7}
              >
                <X color={colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>
            <SettingsPanel />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const TAB_BAR_HEIGHT = 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: typography.fontFamily,
    fontSize: 18,
    color: colors.primary,
    marginTop: 20,
  },
  backgroundGradient: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: TAB_BAR_HEIGHT + 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 5,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: typography.fontFamily,
    fontSize: 28,
    color: colors.primary,
    marginLeft: 12,
    letterSpacing: 4,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 8,
  },
  headerSubtitle: {
    fontFamily: typography.fontFamily,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: 2,
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'center',
  },
  footerText: {
    fontFamily: typography.fontFamily,
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 5,
  },
  footerVersion: {
    fontFamily: typography.fontFamily,
    fontSize: 10,
    color: colors.textDark,
  },
  // Bottom Tab Bar
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT,
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingBottom: 15,
    paddingTop: 10,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  tabText: {
    fontFamily: typography.fontFamily,
    fontSize: 10,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
  },
  tabTextActiveBlue: {
    color: colors.blue,
  },
  tabTextActiveOrange: {
    color: colors.orange,
  },
  tabTextActivePurple: {
    color: colors.purple,
  },
  tabIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginTop: 2,
  },
  tabIndicatorBlue: {
    backgroundColor: colors.blue,
  },
  tabIndicatorOrange: {
    backgroundColor: colors.orange,
  },
  tabIndicatorPurple: {
    backgroundColor: colors.purple,
  },
  // Settings Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: borderRadius.round,
    borderTopRightRadius: borderRadius.round,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontFamily: typography.fontFamily,
    fontSize: 20,
    color: colors.textPrimary,
    fontWeight: 'bold',
  },
});
