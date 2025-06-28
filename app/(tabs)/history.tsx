import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
  View as RNView,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/components/ThemeContext';
import Colors from '@/constants/Colors';
import { useGlobalRefresh } from '@/components/GlobalRefreshContext';
import { Feather } from '@expo/vector-icons';

export default function HistoryScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const { refreshApp } = useGlobalRefresh();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulasi data riwayat (kosong untuk testing)
  const historyData: { id: string; label: string; date: string }[] = [];

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshApp();
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, [refreshApp]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <RNView style={[styles.emptyIconWrapper, { backgroundColor: colors.surface + '80' }]}>
        <Feather name="clock" size={40} color={colors.tabIconDefault} />
      </RNView>
      <Text style={[styles.emptyText, { color: colors.text }]}>Belum Ada Riwayat</Text>
      <Text style={[styles.subText, { color: colors.tabIconDefault }]}>
        Hasil analisis akan muncul di sini setelah Anda mengunggah gambar.
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: typeof historyData[0] }) => (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Feather name="activity" size={20} color={colors.tint} style={{ marginRight: 12 }} />
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
          Lihat hasil analisis sebelumnya di sini.
        </Text>

        {historyData.length === 0 ? (
          renderEmpty()
        ) : (
          <FlatList
            data={historyData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ marginTop: 10 }}
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
    padding: 20,
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    opacity: 0.8,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },
  subText: {
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.65,
    maxWidth: 260,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
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
