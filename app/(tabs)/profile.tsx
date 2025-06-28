import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/components/ThemeContext';
import Colors from '@/constants/Colors';
import { useGlobalRefresh } from '@/components/GlobalRefreshContext';
import { Feather } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const { refreshApp } = useGlobalRefresh();
  const [isRefreshing, setIsRefreshing] = useState(false);

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
        <View style={[styles.avatarContainer, {
          borderColor: colors.tint,
          shadowColor: colors.tint + '40',
        }]}>
          <Text style={[styles.avatarText, { color: colors.tint }]}>A</Text>
        </View>

        <Text style={[styles.name, { color: colors.text }]}>Azharangga Kusuma</Text>
        <Text style={[styles.email, { color: colors.tabIconDefault }]}>azhar@example.com</Text>

        <View style={[styles.divider, { backgroundColor: colors.border + '40' }]} />

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]}>
            <Feather name="edit-2" size={18} color={colors.tint} />
            <Text style={[styles.actionText, { color: colors.tint }]}>Edit Profil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]}>
            <Feather name="lock" size={18} color={colors.tint} />
            <Text style={[styles.actionText, { color: colors.tint }]}>Ganti Password</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border + '40' }]} />

        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: colors.error + 'AA', backgroundColor: colors.error + '10' }]}
          onPress={() => console.log('Logout')}
        >
          <Feather name="log-out" size={18} color={colors.error} />
          <Text style={[styles.logoutText, { color: colors.error }]}>Keluar</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 80,
  },
  avatarContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    backgroundColor: '#ffffff10',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
  avatarText: {
    fontSize: 38,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 6,
  },
  email: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 28,
  },
  divider: {
    width: '100%',
    height: 1,
    marginVertical: 24,
  },
  buttonGroup: {
    width: '100%',
    gap: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    elevation: 1,
    gap: 12,
    shadowColor: '#00000005',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1.5,
    marginTop: 20,
    gap: 12,
    width: '100%',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
