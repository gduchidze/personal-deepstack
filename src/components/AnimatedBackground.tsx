import React, { useEffect } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

export const AnimatedBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 20000,
        easing: Easing.linear,
      }),
      -1,
      false
    );

    scale.value = withRepeat(
      withTiming(1.2, {
        duration: 8000,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { scale: scale.value },
      ],
    };
  });

  return (
    <>
      {/* Animated Gradient Background */}
      <AnimatedLinearGradient
        colors={['#000000', '#0a1a0a', '#001a1a', '#0a0a1a', '#000000']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.background, animatedStyle]}
      />

      {/* Static Base */}
      <LinearGradient
        colors={['#00000000', '#000000dd', '#000000']}
        style={styles.overlay}
      />

      {/* Content */}
      {children}
    </>
  );
};

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    width: width * 2,
    height: height * 2,
    top: -height / 2,
    left: -width / 2,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
