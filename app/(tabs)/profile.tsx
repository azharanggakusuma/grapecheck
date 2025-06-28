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
        <View style={[styles.avatarContainer, { backgroundColor: colors.surface }]}>
          <Text style={[styles.avatarText, { color: colors.tint }]}>A</Text>
        </View>

        <Text style={[styles.name, { color: colors.text }]}>Azharangga Kusuma</Text>
        <Text style={[styles.email, { color: colors.tabIconDefault }]}>azhar@example.com</Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]}>
            <Feather name="edit-2" size={18} color={colors.tint} />
            <Text style={[styles.actionText, { color: colors.tint }]}>Edit Profil</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]}>
            <Feather name="lock" size={18} color={colors.tint} />
            <Text style={[styles.actionText, { color: colors.tint }]}>Ganti Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.logoutButton, { borderColor: colors.error }]} onPress={() => console.log('Logout')}>
            <Feather name="log-out" size={18} color={colors.error} />
            <Text style={[styles.logoutText, { color: colors.error }]}>Keluar</Text>
          </TouchableOpacity>
        </View>
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
    paddingTop: 40,
    paddingBottom: 60,
  },
  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 3,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
  },
  email: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 24,
  },
  buttonGroup: {
    width: '100%',
    gap: 14,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    gap: 10,
    elevation: 1,
  },
  actionText: {
    fontSize: 15,
    fontWeight: '600',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.2,
    justifyContent: 'center',
    marginTop: 16,
    gap: 10,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
