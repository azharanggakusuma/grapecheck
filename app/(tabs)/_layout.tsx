import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { Animated, View, StyleSheet } from 'react-native';

function TabBarIcon({ name, color, focused }: {
  name: React.ComponentProps<typeof Feather>['name'];
  color: string;
  focused: boolean;
}) {
  const lineAnimation = React.useRef(new Animated.Value(focused ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(lineAnimation, {
      toValue: focused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [focused]);

  const lineWidth = lineAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '60%'],
  });

  return (
    <View style={styles.iconContainer}>
      <Feather size={24} name={name} color={color} />
      <Animated.View style={[styles.indicator, { width: lineWidth, backgroundColor: color }]} />
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getIconName = (routeName: string): React.ComponentProps<typeof Feather>['name'] => {
    switch (routeName) {
      case 'index':
        return 'home';
      case 'check':
        return 'camera';
      case 'history':
        return 'clock';
      case 'notifications':
        return 'bell';
      case 'profile':
        return 'user';
      default:
        return 'home';
    }
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          elevation: 0,
          height: 80,
        },
        tabBarShowLabel: false,
        tabBarIcon: ({ color, focused }) => (
          <TabBarIcon name={getIconName(route.name)} color={color} focused={focused} />
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'GrapeCheck' }} />
      <Tabs.Screen name="check" options={{ title: 'Cek Kualitas' }} />
      <Tabs.Screen name="history" options={{ title: 'Riwayat' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Notifikasi' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  indicator: {
    height: 2,
    marginTop: 6,
    borderRadius: 2,
  },
});