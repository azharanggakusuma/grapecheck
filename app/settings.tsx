import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { useTheme } from '@/components/ui/ThemeProvider';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Komponen untuk header setiap seksi
const SectionHeader = ({ title, colors }: { title: string, colors: any }) => (
  <Text style={[styles.sectionHeader, { color: colors.tabIconDefault }]}>{title}</Text>
);

// Komponen untuk setiap item pengaturan
const SettingsItem = ({ icon, label, value, onPress, colors, children }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.itemContainer, { backgroundColor: colors.surface }]}
    disabled={!onPress && !children}
  >
    <Feather name={icon} size={20} color={colors.tint} style={styles.itemIcon} />
    <Text style={[styles.itemLabel, { color: colors.text }]}>{label}</Text>
    <View style={styles.itemValueContainer}>
      {children ? children : (
        <Text style={[styles.itemValue, { color: colors.tabIconDefault }]}>{value}</Text>
      )}
      {onPress && <Feather name="chevron-right" size={20} color={colors.tabIconDefault} />}
    </View>
  </TouchableOpacity>
);

export default function SettingsScreen() {
  const { theme, toggleTheme } = useTheme();
  const colors = Colors[theme];
  const isDarkMode = theme === 'dark';

  const showComingSoonAlert = () => Alert.alert('Segera Hadir', 'Fitur ini sedang dalam pengembangan.');

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Pengaturan</Text>/}
        
        <SectionHeader title="Tampilan" colors={colors} />
        <View style={styles.section}>
          <SettingsItem icon="moon" label="Mode Gelap" colors={colors}>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.tint }}
              thumbColor={isDarkMode ? colors.surface : '#f4f3f4'}
            />
          </SettingsItem>
        </View>

        <SectionHeader title="Notifikasi" colors={colors} />
        <View style={styles.section}>
          <SettingsItem icon="bell" label="Notifikasi" value="Aktif" onPress={showComingSoonAlert} colors={colors} />
          <SettingsItem icon="mail" label="Langganan Email" value="Nonaktif" onPress={showComingSoonAlert} colors={colors} />
        </View>

        <SectionHeader title="Tentang" colors={colors} />
        <View style={styles.section}>
          <SettingsItem icon="info" label="Versi Aplikasi" value="1.0.0" colors={colors} />
          <SettingsItem icon="shield" label="Kebijakan Privasi" onPress={showComingSoonAlert} colors={colors} />
          <SettingsItem icon="file-text" label="Syarat & Ketentuan" onPress={showComingSoonAlert} colors={colors} />
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
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 20,
    marginLeft: 5,
  },
  section: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    overflow: 'hidden', // Untuk memastikan item di dalamnya mengikuti bentuk border radius
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent', // Default transparan
  },
  itemIcon: {
    marginRight: 15,
    width: 24,
    textAlign: 'center',
  },
  itemLabel: {
    flex: 1,
    fontSize: 16,
  },
  itemValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'transparent',
  },
  itemValue: {
    fontSize: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    marginTop: 10,
  },
});