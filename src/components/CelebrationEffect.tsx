import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import * as Haptics from 'expo-haptics';

interface Props {
  trigger: boolean;
  onComplete?: () => void;
}

export const CelebrationEffect: React.FC<Props> = ({ trigger, onComplete }) => {
  const confettiRef = useRef<any>(null);

  useEffect(() => {
    if (trigger && confettiRef.current) {
      // Trigger haptic celebration
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Fire confetti
      confettiRef.current?.start();

      // Complete after animation
      setTimeout(() => {
        onComplete?.();
      }, 3000);
    }
  }, [trigger]);

  if (!trigger) return null;

  return (
    <View style={styles.container} pointerEvents="none">
      <ConfettiCannon
        ref={confettiRef}
        count={200}
        origin={{ x: -10, y: 0 }}
        autoStart={false}
        fadeOut
        explosionSpeed={350}
        fallSpeed={2500}
        colors={['#00ff41', '#00bfff', '#ffa500', '#ff6b6b', '#9b59b6']}
      />
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
    zIndex: 9999,
  },
});
