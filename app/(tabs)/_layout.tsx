import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { Animated, View } from 'react-native';

// Komponen Ikon Kustom dengan Indikator Garis
function TabBarIcon({ name, color, focused }: {
  name: React.ComponentProps<typeof Feather>['name'];
  color: string;
  focused: boolean;
}) {
  // Animasi untuk garis indikator
  const lineAnimation = React.useRef(new Animated.Value(0)).current;

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
    <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 10 }}>
      <Feather size={24} name={name} color={color} />
      <Animated.View
        style={{
          height: 2,
          width: lineWidth,
          backgroundColor: color,
          marginTop: 6,
          borderRadius: 2,
        }}
      />
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background, // Menyatu dengan background layar
          borderTopWidth: 0, // Menghilangkan garis batas atas
          elevation: 0, // Menghilangkan bayangan di Android
          height: 80,
        },
        tabBarShowLabel: false, // Hanya tampilkan ikon
        tabBarIcon: ({ color, focused }) => {
          let iconName: React.ComponentProps<typeof Feather>['name'] = 'home';
          if (route.name === 'index') {
            iconName = 'home';
          } else if (route.name === 'check') {
            iconName = 'camera';
          } else if (route.name === 'history') {
            iconName = 'clock';
          } else if (route.name === 'notifications') {
            iconName = 'bell';
          } else if (route.name === 'profile') {
            iconName = 'user';
          }
          return <TabBarIcon name={iconName} color={color} focused={focused} />;
        },
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="check" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="notifications" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}