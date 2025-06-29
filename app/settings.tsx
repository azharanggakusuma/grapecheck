import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
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
  <TouchableOpacity onPress={onPress} style={[styles.itemContainer, { backgroundColor: colors.surface }]}>
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

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Pengaturan</Text>

        <SectionHeader title="Tampilan" colors={colors} />
        <SettingsItem icon="moon" label="Mode Gelap" colors={colors}>
          <Switch
            value={isDarkMode}
            onValueChange={toggleTheme}
            trackColor={{ false: colors.border, true: colors.tint }}
            thumbColor={isDarkMode ? colors.surface : colors.background}
          />
        </SettingsItem>

        <SectionHeader title="Notifikasi" colors={colors} />
        <SettingsItem icon="bell" label="Notifikasi" value="Aktif" onPress={() => {}} colors={colors} />
        <SettingsItem icon="mail" label="Langganan Email" value="Nonaktif" onPress={() => {}} colors={colors} />

        <SectionHeader title="Tentang" colors={colors} />
        <SettingsItem icon="info" label="Versi Aplikasi" value="1.0.0" colors={colors} />
        <SettingsItem icon="shield" label="Kebijakan Privasi" onPress={() => {}} colors={colors} />
        <SettingsItem icon="file-text" label="Syarat & Ketentuan" onPress={() => {}} colors={colors} />
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    marginTop: 10,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 10,
    marginTop: 20,
    marginLeft: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  itemIcon: {
    marginRight: 15,
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
});