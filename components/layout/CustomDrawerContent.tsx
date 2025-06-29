import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../ui/ThemeProvider';
import Colors from '@/constants/Colors';
import { useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

// Komponen untuk setiap item menu dengan gaya kustom
function CustomDrawerItem({ icon, label, to, colors, isFocused, onPress }: any) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.drawerItem, { backgroundColor: isFocused ? colors.primaryLight + '20' : 'transparent' }]}
        >
            <Feather name={icon} size={20} color={isFocused ? colors.tint : colors.tabIconDefault} />
            <Text style={[styles.drawerLabel, { color: isFocused ? colors.text : colors.tabIconDefault }]}>
                {label}
            </Text>
        </TouchableOpacity>
    );
}


export function CustomDrawerContent(props: any) {
  const { bottom, top } = useSafeAreaInsets();
  const { theme } = useTheme();
  const colors = Colors[theme];
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = [
      {
          icon: 'home' as const,
          label: 'Beranda',
          path: '/(tabs)',
      },
      {
          icon: 'clock' as const,
          label: 'Riwayat',
          path: '/(tabs)/historyScreen',
      },
      {
          icon: 'bell' as const,
          label: 'Notifikasi',
          path: '/(tabs)/notificationsScreen',
      },
      {
          icon: 'user' as const,
          label: 'Profil',
          path: '/(tabs)/profileScreen',
      },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.surface }}>
      {/* Header Drawer */}
      <LinearGradient
        colors={[colors.tint, colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.header, { paddingTop: top + 15 }]}
      >
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>A</Text>
        </View>
        <Text style={styles.headerTitle}>Azharangga Kusuma</Text>
        <Text style={styles.headerSubtitle}>azhar@example.com</Text>
      </LinearGradient>

      {/* Konten Menu */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ paddingTop: 10 }}
      >
        {menuItems.map((item) => (
            <CustomDrawerItem 
                key={item.path}
                icon={item.icon}
                label={item.label}
                isFocused={pathname === item.path || (item.path === '/(tabs)' && pathname.startsWith('/(tabs)'))}
                colors={colors}
                onPress={() => router.navigate(item.path)}
            />
        ))}

      </DrawerContentScrollView>

      {/* Footer Drawer */}
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
    paddingBottom: 25,
  },
  avatarContainer: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  avatarText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    borderRadius: 8,
    marginBottom: 5,
  },
  drawerLabel: {
    marginLeft: 20,
    fontSize: 15,
    fontWeight: '500',
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