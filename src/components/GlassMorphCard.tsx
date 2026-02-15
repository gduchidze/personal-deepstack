import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { colors, borderRadius } from '../theme';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  intensity?: number;
  glowColor?: string;
}

export const GlassMorphCard: React.FC<Props> = ({
  children,
  style,
  intensity = 20,
  glowColor = colors.primary,
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Glow Effect */}
      <View
        style={[
          styles.glow,
          {
            shadowColor: glowColor,
            backgroundColor: `${glowColor}10`,
          },
        ]}
      />

      {/* Glass Effect */}
      <BlurView intensity={intensity} style={styles.blur}>
        <LinearGradient
          colors={['rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.02)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {children}
        </LinearGradient>
      </BlurView>

      {/* Border Gradient */}
      <LinearGradient
        colors={[`${glowColor}60`, `${glowColor}20`, `${glowColor}60`]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.borderGradient}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    borderRadius: borderRadius.round,
    overflow: 'hidden',
  },
  glow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: borderRadius.full,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    zIndex: -1,
  },
  blur: {
    overflow: 'hidden',
    borderRadius: borderRadius.round,
  },
  gradient: {
    padding: 20,
  },
  borderGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: borderRadius.round,
    borderWidth: 1,
    borderColor: 'transparent',
  },
});
