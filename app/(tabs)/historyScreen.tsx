import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
  Animated,
} from 'react-native';
import { Text, View } from '@/components/ui/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/components/ui/ThemeProvider';
import Colors from '@/constants/Colors';
import { useGlobalRefresh } from '@/components/contexts/GlobalRefreshContext';
import { Feather } from '@expo/vector-icons';

export default function HistoryScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const { refreshApp } = useGlobalRefresh();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const historyData: { id: string; label: string; date: string }[] = [];

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (historyData.length === 0) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [historyData.length]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshApp();
    setTimeout(() => setIsRefreshing(false), 1000);
  }, [refreshApp]);

  const renderEmpty = () => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        alignItems: 'center',
        marginTop: 60,
        paddingHorizontal: 20,
      }}
    >
      <View style={[styles.emptyIconWrapper, { backgroundColor: colors.surface + '80' }]}>
        <Feather name="clock" size={40} color="#A0A0A0" />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>Tidak Ada Riwayat</Text>
      <Text style={[styles.emptySubtitle, { color: colors.tabIconDefault }]}>
        Riwayat analisis Anda akan muncul di sini setelah melakukan unggahan.
      </Text>
    </Animated.View>
  );

  const renderItem = ({ item }: { item: typeof historyData[0] }) => (
    <View style={[styles.card, { backgroundColor: colors.surface, shadowColor: colors.tint + '40' }]}>
      <Feather name="activity" size={22} color="#A0A0A0" style={{ marginRight: 12 }} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{item.label}</Text>
        <Text style={[styles.cardDate, { color: colors.tabIconDefault }]}>{item.date}</Text>
      </View>
    </View>
  );

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
        <Text style={[styles.title, { color: colors.text }]}>Riwayat Analisis</Text>
        <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
          Lihat kembali hasil analisis Anda sebelumnya.
        </Text>

        {historyData.length === 0 ? (
          renderEmpty()
        ) : (
          <FlatList
            data={historyData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ marginTop: 24 }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 60,
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
    textAlign: 'left', // ✅ rata kiri
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 32,
    textAlign: 'left', // ✅ rata kiri
    opacity: 0.75,
  },
  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    maxWidth: 260,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  cardDate: {
    fontSize: 13,
    marginTop: 4,
  },
});
