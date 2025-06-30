import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from './ThemeProvider';
import Colors from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';

interface SkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}

/**
 * Komponen untuk menampilkan placeholder loading dengan animasi shimmer yang halus.
 */
const Skeleton: React.FC<SkeletonProps> = ({ width, height, borderRadius = 8, style }) => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 1200, // Durasi sedikit lebih lambat untuk efek yang lebih halus
        useNativeDriver: false,
      })
    ).start();
  }, [animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-350, 350], // Bergerak lebih jauh untuk memastikan gradien menyapu seluruh komponen
  });

  // Warna yang lebih subtil untuk gradien shimmer
  const gradientColors =
    theme === 'dark'
      ? ['transparent', 'rgba(255, 255, 255, 0.05)', 'transparent']
      : ['transparent', 'rgba(0, 0, 0, 0.05)', 'transparent'];

  return (
    <View style={[
        styles.container, 
        { 
            width, 
            height, 
            borderRadius, 
            backgroundColor: colors.border 
        }, 
        style
    ]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            transform: [{ translateX: translateX }],
          },
        ]}
      >
        <LinearGradient
          style={{ flex: 1 }}
          colors={gradientColors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
});

export default Skeleton;