import React, { useEffect, useRef, useState } from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { View, StyleSheet, Animated, TouchableOpacity, Text } from 'react-native';
import { CustomHeader } from '@/components/CustomHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Komponen TabBarIcon tidak berubah
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

// Komponen CustomTabBar tidak berubah
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

  const getIcon = (routeName: string): React.ComponentProps<typeof Feather>['name'] => {
    switch (routeName) {
      case 'index': return 'home';
      case 'check': return 'camera';
      case 'history': return 'clock';
      case 'notifications': return 'bell';
      case 'profile': return 'user';
      default: return 'home';
    }
  }

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
               height: 32,
               borderRadius: 16,
               backgroundColor: colors.primaryLight + '33',
               transform: [{ translateX }],
               opacity: pillOpacity,
             }
           ]}
         />
      )}

      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const isCenterButton = route.name === centerRouteName;
        
        const label = options.title !== undefined
          ? options.title
          : route.name;

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
                <View style={[styles.centerButtonWrapper, { backgroundColor: colors.surface, shadowColor: '#000' }]}>
                  <LinearGradient
                    colors={['#22C55E', '#00880C']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.centerButtonGradient}
                  >
                    <Feather name={getIcon(route.name)} size={28} color="#FFFFFF" />
                  </LinearGradient>
                </View>
              </Animated.View>
            ) : (
              <>
                <TabBarIcon
                  name={getIcon(route.name)}
                  color={isFocused ? colors.tint : colors.tabIconDefault}
                  focused={isFocused}
                />
                <Text style={[styles.labelText, { color: isFocused ? colors.tint : colors.tabIconDefault }]}>
                  {label}
                </Text>
              </>
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
    zIndex: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
  },
  slidingPill: {
    position: 'absolute',
    // --- PERUBAHAN: Dinaikkan sedikit ---
    top: 8, 
  },
  centerButtonWrapper: {
    transform: [{ translateY: -40 }], 
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
  },
  centerButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelText: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: '600',
  },
});