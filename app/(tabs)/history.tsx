import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  FlatList,
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

  // Contoh data riwayat (kosong)
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
      <Feather name="clock" size={64} color={colors.tabIconDefault} />
      <Text style={[styles.emptyText, { color: colors.text }]}>Belum ada riwayat</Text>
      <Text style={[styles.subText, { color: colors.tabIconDefault }]}>
        Hasil klasifikasi yang Anda lakukan akan tampil di sini.
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: typeof historyData[0] }) => (
    <View style={[styles.itemContainer, { backgroundColor: colors.surface }]}>
      <Text style={[styles.itemLabel, { color: colors.text }]}>{item.label}</Text>
      <Text style={[styles.itemDate, { color: colors.tabIconDefault }]}>{item.date}</Text>
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
        <Text style={[styles.title, { color: colors.text }]}>Riwayat Pengecekan</Text>
        <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
          Tarik ke bawah untuk menyegarkan halaman.
        </Text>

        {historyData.length === 0 ? (
          renderEmpty()
        ) : (
          <FlatList
            data={historyData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ marginTop: 20 }}
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
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 4,
  },
  subText: {
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.7,
    maxWidth: 260,
  },
  itemContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  itemLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemDate: {
    fontSize: 13,
    marginTop: 4,
  },
});
