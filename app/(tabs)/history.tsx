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

  const historyData: { id: string; label: string; date: string }[] = [];

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshApp();
    setTimeout(() => setIsRefreshing(false), 1000);
  }, [refreshApp]);

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <RNView style={[styles.emptyIconWrapper, { backgroundColor: colors.surface + 'AA' }]}>
        <Feather name="clock" size={36} color="#A0A0A0" />
      </RNView>
      <Text style={[styles.emptyText, { color: colors.text }]}>Tidak Ada Riwayat</Text>
      <Text style={[styles.subText, { color: colors.tabIconDefault }]}>
        Riwayat analisis Anda akan muncul di sini setelah melakukan unggahan.
      </Text>
    </View>
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
            contentContainerStyle={{ marginTop: 16 }}
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
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
    opacity: 0.75,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
    paddingHorizontal: 20,
  },
  emptyIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  subText: {
    fontSize: 13,
    textAlign: 'center',
    opacity: 0.65,
    maxWidth: 280,
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
