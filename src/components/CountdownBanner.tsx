import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Rocket, Calendar, Zap } from 'lucide-react-native';
import { isProgramActive, getDaysUntilStart, getDaysIntoProgram, TOTAL_WEEKS, getCurrentWeek } from '../utils/dateUtils';
import { colors, spacing, borderRadius, typography } from '../theme';

export const CountdownBanner: React.FC = () => {
  const [, setTick] = useState(0);

  // Update every minute
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

  const programActive = isProgramActive();
  const daysUntilStart = getDaysUntilStart();
  const daysIntoProgram = getDaysIntoProgram();
  const currentWeek = getCurrentWeek();
  const totalDays = TOTAL_WEEKS * 7;

  if (!programActive) {
    return (
      <View style={[styles.container, styles.containerCountdown]}>
        <View style={styles.iconRow}>
          <Rocket color={colors.blue} size={28} />
        </View>
        <Text style={styles.countdownTitle}>პროგრამა იწყება</Text>
        <View style={styles.countdownNumber}>
          <Text style={styles.bigNumber}>{daysUntilStart}</Text>
          <Text style={styles.bigLabel}>დღეში</Text>
        </View>
        <Text style={styles.subtitle}>მოემზადე 65-კვირიანი გამოწვევისთვის</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoPill}>
            <Calendar color={colors.textSecondary} size={14} />
            <Text style={styles.infoText}>65 კვირა</Text>
          </View>
          <View style={styles.infoPill}>
            <Zap color={colors.textSecondary} size={14} />
            <Text style={styles.infoText}>{totalDays} დღე</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, styles.containerActive]}>
      <View style={styles.activeRow}>
        <Zap color={colors.primary} size={22} />
        <Text style={styles.activeTitle}>პროტოკოლი აქტიურია</Text>
      </View>
      <View style={styles.activeStats}>
        <View style={styles.activeStat}>
          <Text style={styles.activeValue}>{daysIntoProgram}</Text>
          <Text style={styles.activeLabel}>დღე</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.activeStat}>
          <Text style={styles.activeValue}>{currentWeek}</Text>
          <Text style={styles.activeLabel}>კვირა</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.activeStat}>
          <Text style={styles.activeValue}>{totalDays - daysIntoProgram}</Text>
          <Text style={styles.activeLabel}>დარჩა</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.xxl,
    padding: spacing.xxl,
    marginVertical: spacing.card,
    borderWidth: 1,
    alignItems: 'center',
  },
  containerCountdown: {
    backgroundColor: 'rgba(0, 191, 255, 0.05)',
    borderColor: 'rgba(0, 191, 255, 0.2)',
  },
  containerActive: {
    backgroundColor: colors.primaryBg,
    borderColor: colors.primaryBorder,
  },
  iconRow: {
    marginBottom: 10,
  },
  countdownTitle: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    color: colors.blue,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  countdownNumber: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 10,
  },
  bigNumber: {
    fontFamily: typography.fontFamily,
    fontSize: 52,
    color: colors.blue,
    fontWeight: 'bold',
    textShadowColor: colors.blue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  bigLabel: {
    fontFamily: typography.fontFamily,
    fontSize: 18,
    color: colors.blue,
  },
  subtitle: {
    fontFamily: typography.fontFamily,
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 191, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  infoText: {
    fontFamily: typography.fontFamily,
    fontSize: 12,
    color: colors.textSecondary,
  },
  activeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 15,
  },
  activeTitle: {
    fontFamily: typography.fontFamily,
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  activeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  activeStat: {
    alignItems: 'center',
  },
  activeValue: {
    fontFamily: typography.fontFamily,
    fontSize: 28,
    color: colors.primary,
    fontWeight: 'bold',
  },
  activeLabel: {
    fontFamily: typography.fontFamily,
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: colors.primaryBorder,
  },
});
