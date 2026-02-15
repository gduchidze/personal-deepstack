import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface Props {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const VARIANTS = {
  primary: {
    colors: ['#00ff41', '#00cc33', '#00aa28'] as const,
    textColor: '#000000',
  },
  secondary: {
    colors: ['#00bfff', '#0099cc', '#007799'] as const,
    textColor: '#ffffff',
  },
  success: {
    colors: ['#00ff88', '#00cc66', '#00aa55'] as const,
    textColor: '#000000',
  },
  danger: {
    colors: ['#ff6b6b', '#ff4444', '#cc0000'] as const,
    textColor: '#ffffff',
  },
};

export const PremiumButton: React.FC<Props> = ({
  title,
  onPress,
  icon,
  variant = 'primary',
  style,
  textStyle,
  disabled = false,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const variantStyle = VARIANTS[variant];

  const handlePressIn = () => {
    Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePressOut = () => {
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Animated.View style={[styles.container, { transform: [{ scale }] }, style]}>
      <TouchableOpacity
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        activeOpacity={0.9}
        disabled={disabled}
      >
        <LinearGradient
          colors={disabled ? ['#333', '#222'] : [...variantStyle.colors]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {icon && <>{icon}</>}
          <Text
            style={[
              styles.text,
              { color: disabled ? '#666' : variantStyle.textColor },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </LinearGradient>

        {/* Shine Effect */}
        {!disabled && (
          <LinearGradient
            colors={['transparent', 'rgba(255, 255, 255, 0.3)', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.shine}
          />
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#00ff41',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 10,
  },
  text: {
    fontFamily: 'monospace',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  shine: {
    position: 'absolute',
    top: 0,
    left: -100,
    right: -100,
    height: '100%',
    opacity: 0.5,
  },
});
