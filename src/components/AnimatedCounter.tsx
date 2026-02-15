import React, { useEffect, useRef, useState } from 'react';
import { Text, TextStyle, Animated } from 'react-native';

interface Props {
  value: number;
  style?: TextStyle;
  duration?: number;
}

export const AnimatedCounter: React.FC<Props> = ({ value, style, duration = 800 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const prevValue = useRef(0);

  useEffect(() => {
    const from = prevValue.current;
    prevValue.current = value;

    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration,
      useNativeDriver: false,
    }).start();

    const listener = animatedValue.addListener(({ value: progress }) => {
      setDisplayValue(Math.round(from + (value - from) * progress));
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [value]);

  return (
    <Text style={style}>{displayValue}</Text>
  );
};
