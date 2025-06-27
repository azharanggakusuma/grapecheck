import React, { useEffect, useRef } from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { View, StyleSheet, Animated } from 'react-native'; // 1. Import Animated
import { CustomHeader } from '@/components/CustomHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- KUNCI PERUBAHAN: Animasi ditambahkan ke TabBarIcon ---
function TabBarIcon({ name, color, focused }: {
  name: React.ComponentProps<typeof Feather>['name'];
  color: string;
  focused: boolean;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // 2. Setup nilai animasi dan referensi
  const animValue = useRef(new Animated.Value(focused ? 1 : 0)).current;

  // 3. Jalankan animasi ketika status 'focused' berubah
  useEffect(() => {
    Animated.spring(animValue, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
      bounciness: 10, // Menambahkan sedikit efek pantulan
      speed: 12,
    }).start();
  }, [focused]);

  // 4. Interpolasi nilai animasi untuk gaya yang berbeda
  const pillStyle = {
    opacity: animValue,
    transform: [{ scale: animValue }],
  };

  const iconStyle = {
    transform: [
      {
        scale: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.15], // Ikon membesar saat aktif
        }),
      },
    ],
  };

  return (
    <View style={styles.iconWrapper}>
      {/* Latar belakang pil yang dianimasikan */}
      <Animated.View style={[
        styles.pillBackground, 
        { backgroundColor: colors.primaryLight + '33' },
        pillStyle
      ]}/>
      {/* Ikon yang dianimasikan */}
      <Animated.View style={iconStyle}>
        <Feather size={24} name={name} color={color} />
      </Animated.View>
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const getIconName = (routeName: string): React.ComponentProps<typeof Feather>['name'] => {
    switch (routeName) {
      case 'index': return 'home';
      case 'check': return 'camera';
      case 'history': return 'clock';
      case 'notifications': return 'bell';
      case 'profile': return 'user';
      default: return 'home';
    }
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        header: (props) => <CustomHeader {...props} />,
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          elevation: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarShowLabel: false,
        tabBarIcon: ({ color, focused }) => (
          <TabBarIcon name={getIconName(route.name)} color={color} focused={focused} />
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Beranda' }} /> 
      <Tabs.Screen name="check" options={{ title: 'Klasifikasi' }} />
      <Tabs.Screen name="history" options={{ title: 'Riwayat' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Notifikasi' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // 5. Gaya baru untuk mendukung tata letak animasi
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 38,
  },
  pillBackground: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    borderRadius: 30,
  }
});