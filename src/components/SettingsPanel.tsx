import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Settings, Bell, Volume2, Vibrate, Trash2 } from 'lucide-react-native';
import { scheduleNotifications } from '../utils/notifications';
import * as Notifications from 'expo-notifications';
import { colors, spacing, borderRadius, typography } from '../theme';

const SETTINGS_KEY = '@deepstack_settings';

interface AppSettings {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}

export const SettingsPanel: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({
    notificationsEnabled: true,
    soundEnabled: true,
    hapticsEnabled: true,
  });

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem(SETTINGS_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  React.useEffect(() => {
    loadSettings();
  }, []);

  const saveSettings = async (newSettings: AppSettings) => {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  const toggleNotifications = async (value: boolean) => {
    if (settings.hapticsEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const newSettings = { ...settings, notificationsEnabled: value };
    saveSettings(newSettings);

    if (value) {
      await scheduleNotifications();
    } else {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
  };

  const toggleSound = async (value: boolean) => {
    if (settings.hapticsEnabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    saveSettings({ ...settings, soundEnabled: value });
  };

  const toggleHaptics = async (value: boolean) => {
    if (value) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    saveSettings({ ...settings, hapticsEnabled: value });
  };

  const clearAllData = async () => {
    Alert.alert(
      'მონაცემების წაშლა',
      'ნამდვილად გსურთ ყველა მონაცემის წაშლა? ეს მოქმედება შეუქცევადია.',
      [
        { text: 'გაუქმება', style: 'cancel' },
        {
          text: 'წაშლა',
          style: 'destructive',
          onPress: async () => {
            if (settings.hapticsEnabled) {
              await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            }
            try {
              await AsyncStorage.clear();
              alert('ყველა მონაცემი წაიშალა! აპლიკაცია გადაიტვირთება.');
            } catch (error) {
              console.error('Error clearing data:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Settings color={colors.purple} size={24} />
        <Text style={styles.title}>პარამეტრები</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Bell color={colors.blue} size={20} />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>შეტყობინებები</Text>
              <Text style={styles.settingDescription}>განრიგის ალერტები</Text>
            </View>
          </View>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: colors.borderLight, true: '#00ff4180' }}
            thumbColor={settings.notificationsEnabled ? colors.primary : colors.textSecondary}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Volume2 color={colors.orange} size={20} />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>ხმა</Text>
              <Text style={styles.settingDescription}>შეტყობინების ხმა</Text>
            </View>
          </View>
          <Switch
            value={settings.soundEnabled}
            onValueChange={toggleSound}
            trackColor={{ false: colors.borderLight, true: '#ffa50080' }}
            thumbColor={settings.soundEnabled ? colors.orange : colors.textSecondary}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Vibrate color={colors.red} size={20} />
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>ვიბრაცია</Text>
              <Text style={styles.settingDescription}>ჰაპტიკური უკუკავშირი</Text>
            </View>
          </View>
          <Switch
            value={settings.hapticsEnabled}
            onValueChange={toggleHaptics}
            trackColor={{ false: colors.borderLight, true: '#ff6b6b80' }}
            thumbColor={settings.hapticsEnabled ? colors.red : colors.textSecondary}
          />
        </View>

        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.dangerButton}
          onPress={clearAllData}
          activeOpacity={0.7}
        >
          <Trash2 color={colors.danger} size={20} />
          <Text style={styles.dangerButtonText}>მონაცემების წაშლა</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: typography.fontFamily,
    fontSize: 20,
    color: colors.purple,
    marginLeft: 10,
  },
  content: {},
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceLight,
    borderRadius: borderRadius.lg,
    padding: 15,
    marginBottom: 10,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
  },
  settingLabel: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  settingDescription: {
    fontFamily: typography.fontFamily,
    fontSize: 11,
    color: colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 15,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.dangerBg,
    borderRadius: borderRadius.lg,
    padding: 15,
    borderWidth: 2,
    borderColor: colors.danger,
  },
  dangerButtonText: {
    fontFamily: typography.fontFamily,
    fontSize: 14,
    color: colors.danger,
    marginLeft: 10,
  },
});
