import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../ui/ThemeProvider';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';

export function CustomDrawerContent(props: any) {
  const { bottom, top } = useSafeAreaInsets();
  const { theme } = useTheme();
  const colors = Colors[theme];

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Bagian Atas Drawer (Header) */}
      <View style={[styles.header, { paddingTop: top + 10, backgroundColor: colors.background }]}>
        <View style={[styles.avatarContainer, { backgroundColor: colors.tint + '20' }]}>
            {/* Ganti dengan gambar profil jika ada */}
            <Text style={[styles.avatarText, { color: colors.tint }]}>A</Text>
        </View>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Azharangga Kusuma</Text>
        <Text style={[styles.headerSubtitle, { color: colors.tabIconDefault }]}>
            azhar@example.com
        </Text>
      </View>

      {/* Konten Utama (Daftar Halaman) */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: colors.surface, paddingTop: 10 }}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      {/* Bagian Bawah Drawer (Footer) */}
      <View style={[styles.footer, { paddingBottom: bottom + 15, borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.footerButton}>
          <Feather name="log-out" size={20} color={colors.tabIconDefault} />
          <Text style={[styles.footerText, { color: colors.text }]}>Keluar</Text>
        </TouchableOpacity>
        <Text style={[styles.versionText, { color: colors.tabIconDefault }]}>
          Versi 1.0.0
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 15,
    borderTopWidth: 1,
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerText: {
    marginLeft: 15,
    fontSize: 15,
    fontWeight: '500',
  },
  versionText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.6,
  }
});