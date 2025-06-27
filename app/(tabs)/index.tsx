import { StyleSheet, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useTheme } from '@/components/ThemeContext';
import { View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

// Komponen untuk setiap kartu fitur
const FeatureCard = ({ icon, title, description, colors }: { icon: any, title: string, description: string, colors: any }) => (
  <View style={[styles.featureCard, { backgroundColor: colors.surface }]}>
    <Feather name={icon} size={24} color={colors.tint} style={{ marginBottom: 12 }} />
    <Text style={[styles.featureTitle, { color: colors.text }]}>{title}</Text>
    <Text style={[styles.featureDescription, { color: colors.tabIconDefault }]}>{description}</Text>
  </View>
);

export default function HomeScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const router = useRouter();
  
  const gradientColors = theme === 'dark' 
    ? ['#00880C', '#1A4D2E'] 
    : ['#00880C', '#22C55E'];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Header Ilustratif */}
        <LinearGradient
          colors={gradientColors}
          style={styles.header}
        >
          <Feather name="bar-chart-2" size={60} color="rgba(255, 255, 255, 0.5)" style={styles.headerIcon} />
          <Text style={styles.title}>GrapeCheck</Text>
          <Text style={styles.subtitle}>
            Solusi cerdas untuk kesehatan kebun anggur Anda.
          </Text>
        </LinearGradient>

        {/* Tombol Aksi Utama */}
        <TouchableOpacity 
          style={[styles.ctaButton, { backgroundColor: colors.surface }]} 
          onPress={() => router.push('/(tabs)/check')}
        >
          <Feather name="camera" size={24} color={colors.tint} />
          <Text style={[styles.ctaText, { color: colors.tint }]}>Mulai Pengecekan Baru</Text>
        </TouchableOpacity>

        {/* Bagian Fitur Unggulan */}
        <View style={styles.featuresSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Fitur Unggulan</Text>
          <FeatureCard 
            icon="cpu" 
            title="Akurasi Tinggi" 
            description="Didukung model AI canggih untuk hasil yang presisi."
            colors={colors}
          />
          <FeatureCard 
            icon="zap" 
            title="Deteksi Cepat" 
            description="Dapatkan hasil klasifikasi penyakit dalam hitungan detik."
            colors={colors}
          />
          <FeatureCard 
            icon="clock" 
            title="Riwayat Lengkap" 
            description="Simpan dan lihat kembali semua hasil pengecekan Anda."
            colors={colors}
          />
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
    paddingBottom: 40,
  },
  header: {
    paddingHorizontal: 25,
    paddingTop: 40,
    paddingBottom: 70,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: 'hidden',
    position: 'relative',
  },
  headerIcon: {
    position: 'absolute',
    right: -20,
    top: 20,
    transform: [{ rotate: '-15deg' }],
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    maxWidth: '80%',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 18,
    marginHorizontal: 20,
    marginTop: -40, // Membuat tombol menjorok ke atas header
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    borderWidth: Platform.OS === 'android' ? 1 : 0,
    borderColor: 'rgba(0,0,0,0.05)'
  },
  ctaText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  featuresSection: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  featureCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 15,
    marginTop: 6,
    lineHeight: 22,
  },
});