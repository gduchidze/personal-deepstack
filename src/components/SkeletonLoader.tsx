import React, { useEffect } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface Props {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonLoader: React.FC<Props> = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}) => {
  const translateX = useSharedValue(-300);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(300, {
        duration: 1500,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
        },
        style,
      ]}
    >
      <AnimatedLinearGradient
        colors={['#1a1a1a', '#2a2a2a', '#1a1a1a']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, animatedStyle]}
      />
    </View>
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <SkeletonLoader width={60} height={60} borderRadius={30} />
        <View style={styles.cardInfo}>
          <SkeletonLoader width="80%" height={16} />
          <SkeletonLoader width="60%" height={12} style={{ marginTop: 8 }} />
        </View>
      </View>
      <SkeletonLoader width="100%" height={100} style={{ marginTop: 15 }} />
      <View style={styles.cardFooter}>
        <SkeletonLoader width="30%" height={14} />
        <SkeletonLoader width="30%" height={14} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
  },
  gradient: {
    width: 300,
    height: '100%',
  },
  card: {
    backgroundColor: '#0a0a0a',
    borderRadius: 15,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
});
