import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface Props {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentage?: boolean;
  label?: string;
}

export const CircularProgress: React.FC<Props> = ({
  progress,
  size = 120,
  strokeWidth = 10,
  color = '#00ff41',
  backgroundColor = '#1a1a1a',
  showPercentage = true,
  label = '',
}) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;
  const [strokeDashoffset, setStrokeDashoffset] = React.useState(0);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    setStrokeDashoffset(circumference);

    animatedProgress.setValue(0);
    Animated.timing(animatedProgress, {
      toValue: progress,
      duration: 1500,
      useNativeDriver: false,
    }).start();

    const listener = animatedProgress.addListener(({ value }) => {
      const offset = circumference - (circumference * value) / 100;
      setStrokeDashoffset(offset);
    });

    return () => {
      animatedProgress.removeListener(listener);
    };
  }, [progress]);

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={styles.textContainer}>
        {showPercentage && (
          <Text style={[styles.percentageText, { color }]}>
            {Math.round(progress)}%
          </Text>
        )}
        {label && <Text style={styles.labelText}>{label}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontFamily: 'monospace',
    fontSize: 24,
    fontWeight: 'bold',
  },
  labelText: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#888',
    marginTop: 4,
  },
});
