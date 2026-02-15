import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

const generateParticles = (count: number): Particle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * width,
    y: Math.random() * height,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 3000 + 2000,
    delay: Math.random() * 2000,
  }));
};

const ParticleComponent: React.FC<{ particle: Particle }> = ({ particle }) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(1, {
          duration: particle.duration / 2,
          easing: Easing.inOut(Easing.ease),
        }),
        -1,
        true
      )
    );

    translateY.value = withDelay(
      particle.delay,
      withRepeat(
        withTiming(-50, {
          duration: particle.duration,
          easing: Easing.linear,
        }),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value * 0.6,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          left: particle.x,
          top: particle.y,
          width: particle.size,
          height: particle.size,
        },
        animatedStyle,
      ]}
    />
  );
};

export const ParticleField: React.FC = () => {
  const particles = generateParticles(30);

  return (
    <View style={styles.container} pointerEvents="none">
      {particles.map((particle) => (
        <ParticleComponent key={particle.id} particle={particle} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  particle: {
    position: 'absolute',
    backgroundColor: '#00ff41',
    borderRadius: 100,
    shadowColor: '#00ff41',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});
