import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, ScrollView, Platform, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useTheme } from '@/components/ThemeContext';
import { View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

// Komponen Kartu Fitur dengan Animasi
const FeatureCard = ({ icon, title, description, colors, index }: { icon: any, title: string, description: string, colors: any, index: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: index * 150, // Animasi muncul satu per satu
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, index]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <View style={[styles.featureCard, { backgroundColor: colors.surface }]}>
        <View style={[styles.featureIconContainer, { backgroundColor: colors.primaryLight + '20' }]}>
          <Feather name={icon} size={24} color={colors.tint} />
        </View>
        <View style={styles.featureTextContainer}>
          <Text style={[styles.featureTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.featureDescription, { color: colors.tabIconDefault }]}>{description}</Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const router = useRouter();
  
  const gradientColors = theme === 'dark' 
    ? ['#00880C', '#1A4D2E'] 
    : ['#00880C', '#22C55E'];

  const features = [
    { icon: "cpu", title: "Akurasi Tinggi", description: "Didukung model AI canggih untuk hasil presisi." },
    { icon: "zap", title: "Deteksi Cepat", description: "Dapatkan hasil klasifikasi dalam hitungan detik." },
    { icon: "clock", title: "Riwayat Lengkap", description: "Simpan dan lihat kembali semua hasil pengecekan." },
  ];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container}>

        {/* Header Ilustratif */}
        <LinearGradient
          colors={gradientColors}
          style={styles.header}
        >
          {/* Pola Latar Belakang Halus */}
          <View style={styles.headerPattern} />
          <Feather name="bar-chart-2" size={60} color="rgba(255, 255, 255, 0.3)" style={styles.headerIcon} />
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
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              index={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              colors={colors}
            />
          ))}
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
  headerPattern: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    // Pola dot bisa ditambahkan di sini jika diperlukan
  },
  headerIcon: {
    position: 'absolute',
    right: -15,
    top: 30,
    transform: [{ rotate: '-15deg' }],
  },
  title: {
    fontSize: 32,
    fontWeight: '800', // Dibuat lebih tebal
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    maxWidth: '85%',
    fontWeight: '400',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 18,
    marginHorizontal: 20,
    marginTop: -40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)'
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '600', // Sedikit lebih tipis dari bold
    marginLeft: 12,
  },
  featuresSection: {
    marginTop: 35,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 15,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.07)',
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  featureDescription: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
});