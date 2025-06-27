import React, { useEffect, useRef, useState } from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { View, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { CustomHeader } from '@/components/CustomHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- PERUBAHAN: Penyesuaian pada animasi skala ---
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
          // Ukuran ikon aktif dikurangi dari 1.2x menjadi 1.15x
          // agar perbedaannya tidak terlalu mencolok.
          outputRange: [1, 1.15], 
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

// Tidak ada perubahan pada sisa kode di bawah ini

function CustomTabBar({ state, descriptors, navigation, insets }: any) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const [tabLayouts, setTabLayouts] = useState<any[]>([]);
  
  const translateX = useRef(new Animated.Value(0)).current;
  const pillOpacity = useRef(new Animated.Value(1)).current;
  const centerButtonScale = useRef(new Animated.Value(1)).current;

  const centerRouteName = 'check';

  useEffect(() => {
    if (tabLayouts.length === state.routes.length) {
      const currentRoute = state.routes[state.index];
      const currentTabLayout = tabLayouts[state.index];

      if (currentTabLayout) {
        if (currentRoute.name === centerRouteName) {
          Animated.spring(pillOpacity, { toValue: 0, useNativeDriver: true }).start();
        } else {
          Animated.spring(pillOpacity, { toValue: 1, useNativeDriver: true }).start();
          const targetX = currentTabLayout.x + (currentTabLayout.width - 60) / 2;
          Animated.spring(translateX, {
            toValue: targetX,
            useNativeDriver: true,
            bounciness: 8,
            speed: 14,
          }).start();
        }
      }
    }
  }, [state.index, tabLayouts]);

  const handlePressIn = () => {
    Animated.spring(centerButtonScale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(centerButtonScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleLayout = (event: any, index: number) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts(prev => {
      const newLayouts = [...prev];
      newLayouts[index] = { x, width };
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
               width: 60,
               height: 38,
               opacity: pillOpacity,
               backgroundColor: colors.primaryLight + '33',
               transform: [{ translateX }]
             }
           ]}
         />
      )}

      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const isCenterButton = route.name === centerRouteName;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            onPressIn={isCenterButton ? handlePressIn : undefined}
            onPressOut={isCenterButton ? handlePressOut : undefined}
            style={styles.tabItem}
            onLayout={(event) => handleLayout(event, index)}
          >
            {isCenterButton ? (
              <Animated.View style={{ transform: [{ scale: centerButtonScale }] }}>
                  <View style={[styles.centerButton, { backgroundColor: colors.tint, shadowColor: colors.tint }]}>
                    <Feather name={getIconName(route.name)} size={24} color="#FFFFFF" />
                  </View>
              </Animated.View>
            ) : (
              <TabBarIcon
                name={getIconName(route.name)}
                color={isFocused ? colors.tint : colors.tabIconDefault}
                focused={isFocused}
              />
            )}
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
      <Tabs.Screen name="index" options={{ title: 'Beranda', headerTransparent: true, headerTitle: '' }} /> 
      <Tabs.Screen name="history" options={{ title: 'Riwayat' }} />
      <Tabs.Screen name="check" options={{ title: 'Klasifikasi' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Notifikasi' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  );
}


const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
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
  slidingPill: {
    position: 'absolute',
    top: (65 - 38) / 2,
    height: 38,
    borderRadius: 19,
  },
  centerButton: {
    transform: [{ translateY: -25 }], 
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowOpacity: 0.3,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 5 },
  },
});