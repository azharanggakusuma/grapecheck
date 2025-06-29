import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Alert } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../ui/ThemeProvider';
import Colors from '@/constants/Colors';
import { useRouter, usePathname } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';

// Komponen untuk setiap item menu dengan gaya yang lebih baik
function CustomDrawerItem({ icon, label, isFocused, colors, onPress }: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.drawerItem,
        isFocused ? { backgroundColor: colors.tint + '20' } : {}
      ]}
    >
      <View style={[
        styles.iconContainer,
        isFocused ? { backgroundColor: colors.tint } : { backgroundColor: colors.surface }
      ]}>
        <Feather name={icon} size={20} color={isFocused ? '#FFFFFF' : colors.tabIconDefault} />
      </View>
      <Text style={[styles.drawerLabel, { color: isFocused ? colors.tint : colors.text }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// Komponen pemisah
const DrawerSeparator = ({ colors }: { colors: any }) => (
  <View style={[styles.separator, { backgroundColor: colors.border + '80' }]} />
);

export function CustomDrawerContent(props: any) {
  const { bottom, top } = useSafeAreaInsets();
  const { theme, toggleTheme } = useTheme();
  const colors = Colors[theme];
  const router = useRouter();
  const pathname = usePathname();

  // Fungsi untuk menangani navigasi
  const handleNavigate = (path: string) => {
    router.navigate(path);
    props.navigation.closeDrawer();
  };
  
  // Fungsi untuk berbagi aplikasi
  const handleShareApp = async () => {
    try {
      await Share.share({
        message: 'Ayo cek kesehatan daun anggurmu dengan GrapeCheck! Unduh sekarang di [Link App Store/Play Store]',
      });
    } catch (error: any) {
      Alert.alert('Error', 'Gagal membagikan aplikasi.');
    }
  };

  // --- PERUBAHAN: Menu Beranda dikembalikan ---
  const mainMenuItems = [
    { icon: 'home' as const, label: 'Beranda', path: '/(tabs)' },
  ];

  const secondaryMenuItems = [
    { icon: 'settings' as const, label: 'Pengaturan', path: '/settings' },
    { icon: 'share-2' as const, label: 'Bagikan Aplikasi', action: handleShareApp },
    { icon: 'help-circle' as const, label: 'Bantuan', action: () => Linking.openURL('https://github.com/azharanggakusuma/grapecheck') },
  ];
  
  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header Drawer */}
      <LinearGradient
        colors={theme === 'dark' ? ['#00880C', '#00AA13'] : [colors.primaryLight, colors.tint]}
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
        contentContainerStyle={{ paddingTop: 10, backgroundColor: colors.background }}
      >
        {/* Menu Utama */}
        {mainMenuItems.map((item) => (
          <CustomDrawerItem 
            key={item.label}
            icon={item.icon}
            label={item.label}
            // Logika isFocused: aktif jika path adalah /(tabs)
            isFocused={pathname === item.path} 
            colors={colors}
            onPress={() => handleNavigate(item.path)}
          />
        ))}

        <DrawerSeparator colors={colors} />

        {/* Menu Sekunder */}
        {secondaryMenuItems.map((item) => (
          <CustomDrawerItem 
            key={item.label}
            icon={item.icon}
            label={item.label}
            isFocused={item.path ? pathname === item.path : false}
            colors={colors}
            onPress={() => item.action ? item.action() : handleNavigate(item.path!)}
          />
        ))}

        <DrawerSeparator colors={colors} />
        
        {/* Toggle Tema */}
        <TouchableOpacity onPress={toggleTheme} style={styles.drawerItem}>
          <View style={[styles.iconContainer, { backgroundColor: colors.surface }]}>
            <Feather name={theme === 'dark' ? 'sun' : 'moon'} size={20} color={colors.tabIconDefault} />
          </View>
          <Text style={[styles.drawerLabel, { color: colors.text }]}>
            Mode {theme === 'dark' ? 'Terang' : 'Gelap'}
          </Text>
        </TouchableOpacity>
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

// Styles tidak berubah
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
      paddingVertical: 12,
      paddingHorizontal: 20,
      marginHorizontal: 10,
      borderRadius: 12,
      marginBottom: 5,
    },
    iconContainer: {
      width: 36,
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    drawerLabel: {
      marginLeft: 15,
      fontSize: 16,
      fontWeight: '600',
    },
    separator: {
      height: 1,
      marginVertical: 10,
      marginHorizontal: 20,
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