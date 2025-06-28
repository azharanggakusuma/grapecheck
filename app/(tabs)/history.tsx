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

  // Ganti dengan data asli nantinya
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
      <View style={[styles.iconCircle, { backgroundColor: colors.surface }]}>
        <Feather name="clock" size={36} color={colors.tabIconDefault} />
      </View>
      <Text style={[styles.emptyText, { color: colors.text }]}>Belum ada riwayat</Text>
      <Text style={[styles.subText, { color: colors.tabIconDefault }]}>
        Hasil klasifikasi yang Anda lakukan akan tampil di sini.
      </Text>
    </View>
  );

  const renderItem = ({ item }: { item: typeof historyData[0] }) => (
    <View style={[styles.itemContainer, { backgroundColor: colors.surface }]}>
      <Feather name="activity" size={20} color={colors.tint} style={{ marginRight: 10 }} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.itemLabel, { color: colors.text }]}>{item.label}</Text>
        <Text style={[styles.itemDate, { color: colors.tabIconDefault }]}>{item.date}</Text>
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
        <Text style={[styles.title, { color: colors.text }]}>Riwayat Pengecekan</Text>
        <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
          Tarik ke bawah untuk menyegarkan halaman
        </Text>

        {historyData.length === 0 ? (
          renderEmpty()
        ) : (
          <FlatList
            data={historyData}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingTop: 10 }}
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
    paddingHorizontal: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
  },
  subText: {
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.7,
    maxWidth: 260,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
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
