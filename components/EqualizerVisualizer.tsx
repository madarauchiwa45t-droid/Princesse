import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const BAR_COUNT = 7;
const COLORS = ['#00ffea', '#0ff', '#6ee7ff', '#00c8ff', '#00ffea', '#0ff', '#7cf9ff'];

export default function EqualizerVisualizer() {
  const bars = useRef(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(Math.random() * 40 + 10))
  ).current;

  useEffect(() => {
    const animations = bars.map((bar, i) => {
      const randomDuration = () => 300 + Math.random() * 400 + i * 60;
      const randomHeight = () => Math.random() * 80 + 10;

      return Animated.loop(
        Animated.sequence([
          Animated.timing(bar, {
            toValue: randomHeight(),
            duration: randomDuration(),
            useNativeDriver: false,
          }),
          Animated.timing(bar, {
            toValue: randomHeight() * 0.3,
            duration: randomDuration(),
            useNativeDriver: false,
          }),
          Animated.timing(bar, {
            toValue: randomHeight(),
            duration: randomDuration(),
            useNativeDriver: false,
          }),
        ])
      );
    });

    animations.forEach(a => a.start());
    return () => animations.forEach(a => a.stop());
  }, []);

  return (
    <View style={styles.container}>
      {bars.map((bar, idx) => (
        <Animated.View
          key={idx}
          style={[
            styles.bar,
            {
              height: bar,
              backgroundColor: COLORS[idx % COLORS.length],
              shadowColor: COLORS[idx % COLORS.length],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
    height: 100,
    paddingVertical: 10,
  },
  bar: {
    width: 10,
    borderRadius: 5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
});
