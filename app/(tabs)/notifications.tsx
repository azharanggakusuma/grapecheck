import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  Animated,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/components/ThemeContext';
import Colors from '@/constants/Colors';
import { useGlobalRefresh } from '@/components/GlobalRefreshContext';
import { Feather } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const { refreshApp } = useGlobalRefresh();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshApp();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, [refreshApp]);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.tint}
            colors={[colors.tint]}
          />
        }
      >
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ translateY }],
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <View style={[styles.iconWrapper, { backgroundColor: colors.surface + '80' }]}>
            <Feather name="bell-off" size={40} color="#A0A0A0" />
          </View>
          <Text style={[styles.title, { color: colors.text }]}>Tidak Ada Notifikasi</Text>
          <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
            Anda akan melihat pembaruan terbaru di sini.
          </Text>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    maxWidth: 260,
  },
});
