import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/components/ui/ThemeProvider';
import Colors from '@/constants/Colors';

export default function SettingsScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>Halaman Pengaturan</Text>
        <Text style={[styles.subtitle, { color: colors.tabIconDefault }]}>
          Opsi dan preferensi aplikasi akan ada di sini.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
      fontSize: 20,
      fontWeight: 'bold',
  },
  subtitle: {
      marginTop: 8,
      fontSize: 14,
  }
});