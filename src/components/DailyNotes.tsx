import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { FileText, Save, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { DailyNote } from '../types';
import { formatDate } from '../utils/dateUtils';
import { colors, spacing, borderRadius, typography } from '../theme';

const NOTES_KEY = '@deepstack_daily_notes';

interface Props {
  refreshKey?: number;
}

export const DailyNotes: React.FC<Props> = ({ refreshKey }) => {
  const [note, setNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<DailyNote[]>([]);
  const [viewDate, setViewDate] = useState(new Date());
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadNotes();
  }, [refreshKey]);

  useEffect(() => {
    const dateStr = formatDate(viewDate);
    const existing = savedNotes.find(n => n.date === dateStr);
    setNote(existing?.note || '');
    setSaved(false);
  }, [viewDate, savedNotes]);

  const loadNotes = async () => {
    try {
      const stored = await AsyncStorage.getItem(NOTES_KEY);
      if (stored) {
        setSavedNotes(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const saveNote = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const dateStr = formatDate(viewDate);
    const newNote: DailyNote = {
      date: dateStr,
      note: note.trim(),
      timestamp: Date.now(),
    };

    try {
      const existingNotes = savedNotes.filter(n => n.date !== dateStr);
      const updatedNotes = note.trim() ? [...existingNotes, newNote] : existingNotes;
      await AsyncStorage.setItem(NOTES_KEY, JSON.stringify(updatedNotes));
      setSavedNotes(updatedNotes);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving note:', error);
    }
  };

  const navigateDate = (days: number) => {
    const newDate = new Date(viewDate);
    newDate.setDate(newDate.getDate() + days);
    if (newDate <= new Date()) {
      setViewDate(newDate);
    }
  };

  const isToday = formatDate(viewDate) === formatDate(new Date());
  const dateStr = formatDate(viewDate);

  // Format date for display
  const displayDate = viewDate.toLocaleDateString('ka-GE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FileText color={colors.purple} size={24} />
        <Text style={styles.title}>დღის ჩანაწერი</Text>
      </View>

      {/* Date Navigation */}
      <View style={styles.dateNav}>
        <TouchableOpacity onPress={() => navigateDate(-1)} activeOpacity={0.7} style={styles.navButton}>
          <ChevronLeft color={colors.textSecondary} size={20} />
        </TouchableOpacity>
        <Text style={[styles.dateText, isToday && styles.dateTextToday]}>
          {isToday ? 'დღეს' : displayDate}
        </Text>
        <TouchableOpacity
          onPress={() => navigateDate(1)}
          activeOpacity={0.7}
          style={styles.navButton}
          disabled={isToday}
        >
          <ChevronRight color={isToday ? colors.textDark : colors.textSecondary} size={20} />
        </TouchableOpacity>
      </View>

      {/* Note Input */}
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        placeholder="რა ისწავლე დღეს? რა გამოწვევები შეხვდა?..."
        placeholderTextColor={colors.textDark}
        value={note}
        onChangeText={setNote}
        textAlignVertical="top"
      />

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, saved && styles.saveButtonSaved]}
        onPress={saveNote}
        activeOpacity={0.7}
      >
        <Save color={saved ? colors.primary : colors.textPrimary} size={18} />
        <Text style={[styles.saveText, saved && styles.saveTextSaved]}>
          {saved ? 'შენახულია' : 'შეინახე'}
        </Text>
      </TouchableOpacity>

      {/* Recent Notes Preview */}
      {savedNotes.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>ბოლო ჩანაწერები</Text>
          <ScrollView style={styles.recentList} showsVerticalScrollIndicator={false}>
            {savedNotes
              .sort((a, b) => b.timestamp - a.timestamp)
              .slice(0, 3)
              .filter(n => n.date !== dateStr)
              .map((n, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.recentItem}
                  onPress={() => setViewDate(new Date(n.date))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.recentDate}>{n.date}</Text>
                  <Text style={styles.recentNote} numberOfLines={1}>{n.note}</Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      )}
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
    marginBottom: 15,
  },
  title: {
    fontFamily: typography.fontFamily,
    fontSize: 20,
    color: colors.purple,
    marginLeft: 10,
  },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    gap: 15,
  },
  navButton: {
    padding: 8,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surfaceLighter,
  },
  dateText: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    color: colors.textSecondary,
    minWidth: 100,
    textAlign: 'center',
  },
  dateTextToday: {
    color: colors.purple,
    fontWeight: 'bold',
  },
  input: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    padding: 15,
    minHeight: 100,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceLighter,
    borderRadius: borderRadius.lg,
    padding: 12,
    borderWidth: 2,
    borderColor: colors.borderLight,
    gap: 8,
  },
  saveButtonSaved: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryBg,
  },
  saveText: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    color: colors.textPrimary,
  },
  saveTextSaved: {
    color: colors.primary,
  },
  recentSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  recentTitle: {
    fontFamily: typography.fontFamily,
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  recentList: {
    maxHeight: 120,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.sm,
    marginBottom: 6,
    gap: 10,
  },
  recentDate: {
    fontFamily: typography.fontFamily,
    fontSize: 11,
    color: colors.purple,
    width: 80,
  },
  recentNote: {
    fontFamily: typography.fontFamily,
    fontSize: 11,
    color: colors.textMuted,
    flex: 1,
  },
});
