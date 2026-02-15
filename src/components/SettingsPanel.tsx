import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { Settings, Bell, Volume2, Vibrate, Trash2 } from 'lucide-react-native';
import { scheduleNotifications } from '../utils/notifications';
import * as Notifications from 'expo-notifications';

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
  const [expanded, setExpanded] = useState(false);

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
    if (settings.hapticsEnabled) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }

    try {
      await AsyncStorage.clear();
      alert('ყველა მონაცემი წაიშალა! აპლიკაცია გადაიტვირთება.');
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => setExpanded(!expanded)}
        activeOpacity={0.7}
      >
        <Settings color="#9b59b6" size={24} />
        <Text style={styles.title}>პარამეტრები</Text>
        <Text style={styles.expandIcon}>{expanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.content}>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Bell color="#00bfff" size={20} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>შეტყობინებები</Text>
                <Text style={styles.settingDescription}>განრიგის ალერტები</Text>
              </View>
            </View>
            <Switch
              value={settings.notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#333', true: '#00ff4180' }}
              thumbColor={settings.notificationsEnabled ? '#00ff41' : '#888'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Volume2 color="#ffa500" size={20} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>ხმა</Text>
                <Text style={styles.settingDescription}>შეტყობინების ხმა</Text>
              </View>
            </View>
            <Switch
              value={settings.soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ false: '#333', true: '#ffa50080' }}
              thumbColor={settings.soundEnabled ? '#ffa500' : '#888'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Vibrate color="#ff6b6b" size={20} />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>ვიბრაცია</Text>
                <Text style={styles.settingDescription}>ჰაპტიკური უკუკავშირი</Text>
              </View>
            </View>
            <Switch
              value={settings.hapticsEnabled}
              onValueChange={toggleHaptics}
              trackColor={{ false: '#333', true: '#ff6b6b80' }}
              thumbColor={settings.hapticsEnabled ? '#ff6b6b' : '#888'}
            />
          </View>

          <View style={styles.divider} />

          <TouchableOpacity
            style={styles.dangerButton}
            onPress={clearAllData}
            activeOpacity={0.7}
          >
            <Trash2 color="#ff4444" size={20} />
            <Text style={styles.dangerButtonText}>მონაცემების წაშლა</Text>
          </TouchableOpacity>
        </View>
      )}
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
  },
  title: {
    fontFamily: 'monospace',
    fontSize: 20,
    color: '#9b59b6',
    marginLeft: 10,
    flex: 1,
  },
  expandIcon: {
    fontFamily: 'monospace',
    fontSize: 16,
    color: '#888',
  },
  content: {
    marginTop: 20,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f0f0f',
    borderRadius: 10,
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
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 2,
  },
  settingDescription: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#888',
  },
  divider: {
    height: 1,
    backgroundColor: '#1a1a1a',
    marginVertical: 15,
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2a0a0a',
    borderRadius: 10,
    padding: 15,
    borderWidth: 2,
    borderColor: '#ff4444',
  },
  dangerButtonText: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#ff4444',
    marginLeft: 10,
  },
});
