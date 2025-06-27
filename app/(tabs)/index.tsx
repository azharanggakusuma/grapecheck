import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    // SafeAreaView tidak lagi dibutuhkan di sini karena sudah ditangani oleh CustomHeader
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Hapus View header manual dari sini */}
      
      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: colors.text }]}>Analisis Kualitas Anggur dengan Mudah</Text>
        <Text style={[styles.description, { color: Colors.light.tabIconDefault }]}>
          Dapatkan hasil instan tentang kematangan dan kualitas anggur langsung dari kamera Anda.
        </Text>
      </View>

      <TouchableOpacity style={[styles.ctaButton, { backgroundColor: colors.tint }]}>
        <Feather name="camera" size={20} color="#fff" />
        <Text style={styles.ctaText}>Mulai Pengecekan</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // Hapus style safeArea
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 20,
    justifyContent: 'space-between', // Untuk mengatur posisi tombol
  },
  // Hapus style header
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 44,
  },
  description: {
    fontSize: 18,
    lineHeight: 26,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20, // Tambah margin bawah
  },
  ctaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});