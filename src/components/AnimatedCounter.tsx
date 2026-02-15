import React, { useEffect } from 'react';
import { Text, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withSpring,
} from 'react-native-reanimated';

const AnimatedText = Animated.createAnimatedComponent(Text);

interface Props {
  value: number;
  style?: TextStyle;
  duration?: number;
}

export const AnimatedCounter: React.FC<Props> = ({ value, style, duration = 1000 }) => {
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withSpring(value, {
      damping: 15,
      stiffness: 100,
    });
  }, [value]);

  const animatedProps = useAnimatedProps(() => {
    return {
      text: Math.round(animatedValue.value).toString(),
    };
  });

  return (
    <AnimatedText
      style={style}
      animatedProps={animatedProps as any}
    />
  );
};
