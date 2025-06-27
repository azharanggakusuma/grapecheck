import React, { useEffect, useRef, useState } from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { CustomHeader } from '@/components/CustomHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Komponen TabBarIcon tetap sama
function TabBarIcon({ name, color, focused }: {
  name: React.ComponentProps<typeof Feather>['name'];
  color: string;
  focused: boolean;
}) {
  const animValue = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: focused ? 1 : 0,
      useNativeDriver: true,
      bounciness: 10,
      speed: 12,
    }).start();
  }, [focused]);

  const iconStyle = {
    transform: [
      {
        scale: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        }),
      },
    ],
  };

  return (
    <Animated.View style={iconStyle}>
      <Feather size={24} name={name} color={color} />
    </Animated.View>
  );
}

// Komponen TabBar Kustom dengan penyesuaian ukuran pill
function CustomTabBar({ state, descriptors, navigation, insets }: any) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [tabLayouts, setTabLayouts] = useState<any[]>([]);
  
  const translateX = useRef(new Animated.Value(0)).current;
  
  // --- AWAL PERUBAHAN: Menentukan ukuran pill ---
  const PILL_WIDTH = 60; // Lebar pill yang lebih kecil
  const PILL_HEIGHT = 38; // Tinggi pill yang lebih kecil
  // --- AKHIR PERUBAHAN ---

  useEffect(() => {
    if (tabLayouts.length === state.routes.length) {
      const currentTabLayout = tabLayouts[state.index];
      if (currentTabLayout) {
        // --- PERUBAHAN: Kalkulasi untuk memusatkan pill ---
        const targetX = currentTabLayout.x + (currentTabLayout.width - PILL_WIDTH) / 2;
        Animated.spring(translateX, {
          toValue: targetX,
          useNativeDriver: true,
          bounciness: 8,
          speed: 14,
        }).start();
      }
    }
  }, [state.index, tabLayouts]);

  const handleLayout = (event: any, index: number) => {
    const { x, width, height } = event.nativeEvent.layout;
    setTabLayouts(prev => {
      const newLayouts = [...prev];
      newLayouts[index] = { x, width, height };
      return newLayouts;
    });
  };

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
    <View 
      style={[
        styles.tabBarContainer,
        { 
          height: 65 + insets.bottom, 
          paddingBottom: insets.bottom,
          backgroundColor: colors.surface,
          borderTopColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        }
      ]}
    >
      {tabLayouts.length > 0 && (
         <Animated.View 
           style={[
             styles.slidingPill,
             { 
               // --- PERUBAHAN: Gunakan konstanta untuk ukuran ---
               width: PILL_WIDTH,
               height: PILL_HEIGHT,
               backgroundColor: colors.primaryLight + '33',
               transform: [{ translateX }]
             }
           ]}
         />
      )}

      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabItem}
            onLayout={(event) => handleLayout(event, index)}
          >
            <TabBarIcon
              name={getIconName(route.name)}
              color={isFocused ? colors.tint : colors.tabIconDefault}
              focused={isFocused}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} insets={insets} />}
      screenOptions={{
        header: (props) => <CustomHeader {...props} />, 
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Beranda',
          headerTransparent: true, 
          headerTitle: '',
        }} 
      /> 
      <Tabs.Screen name="check" options={{ title: 'Klasifikasi' }} />
      <Tabs.Screen name="history" options={{ title: 'Riwayat' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Notifikasi' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -5 },
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // --- AWAL PERUBAHAN: Penyesuaian gaya pill ---
  slidingPill: {
    position: 'absolute',
    // (Tinggi total content area (55) - tinggi pill (38)) / 2 + paddingTop (10)
    top: (55 - 38) / 2 + 10, 
    // border-radius setengah dari tinggi agar bentuknya sempurna
    borderRadius: 19,
  },
  // --- AKHIR PERUBAHAN ---
});