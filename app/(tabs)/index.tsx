import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useTheme } from "@/components/ThemeContext";
import { View } from "@/components/Themed";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

// --- BARU: Komponen untuk kartu fitur dengan desain yang lebih baik ---
const FeatureCard = ({
  icon,
  title,
  description,
  colors,
  index,
}: {
  icon: any;
  title: string;
  description: string;
  colors: any;
  index: number;
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: index * 150,
      useNativeDriver: true,
    }).start();

    Animated.spring(slideAnim, {
      toValue: 0,
      speed: 10,
      bounciness: 5,
      delay: index * 150,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, slideAnim, index]);

  return (
    <Animated.View
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
    >
      <View
        style={[
          styles.featureCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.tabIconDefault + "20",
          },
        ]}
      >
        <LinearGradient
          colors={[colors.tint + "1A", colors.tint + "05"]}
          style={styles.featureIconContainer}
        >
          <Feather name={icon} size={24} color={colors.tint} />
        </LinearGradient>
        <View style={styles.featureTextContainer}>
          <Text style={[styles.featureTitle, { color: colors.text }]}>
            {title}
          </Text>
          <Text
            style={[
              styles.featureDescription,
              { color: colors.tabIconDefault },
            ]}
          >
            {description}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // --- BARU: Gradient yang lebih menarik untuk header ---
  const gradientColors =
    theme === "dark" ? ["#00640A", "#1A4D2E"] : ["#00990E", "#22C55E"];

  // --- BARU: Gradient untuk tombol utama ---
  const buttonGradient = ["#22C55E", "#00880C"];

  const features = [
    {
      icon: "cpu",
      title: "Akurasi Tinggi",
      description: "Didukung model AI canggih untuk hasil presisi.",
    },
    {
      icon: "zap",
      title: "Deteksi Cepat",
      description: "Dapatkan hasil klasifikasi dalam hitungan detik.",
    },
    {
      icon: "clock",
      title: "Riwayat Lengkap",
      description: "Simpan dan lihat kembali semua hasil pengecekan.",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }} // Padding bawah agar konten terakhir tidak terpotong
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* --- BARU: Header dengan gradient dan bentuk melengkung --- */}
        <LinearGradient
          colors={gradientColors}
          style={[
            styles.header,
            { paddingTop: insets.top + 100, paddingBottom: insets.bottom + 80 },
          ]} // Disesuaikan untuk Safe Area
        >
          {/* --- BARU: Dekorasi lingkaran untuk efek visual --- */}
          <View style={[styles.circle, styles.circle1]} />
          <View style={[styles.circle, styles.circle2]} />
          <View style={[styles.circle, styles.circle3]} />

          <Text style={styles.title}>Klasifikasi Daun Anggur</Text>
          <Text style={styles.subtitle}>
            Deteksi dini penyakit daun anggur melalui analisis gambar untuk
            mendukung kesehatan tanaman Anda.
          </Text>
        </LinearGradient>

        {/* --- BARU: Konten utama dengan latar belakang yang pas dengan header --- */}
        <View
          style={[
            styles.featuresSection,
            { backgroundColor: colors.background },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Fitur Unggulan
          </Text>
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

      {/* --- BARU: Posisi tombol CTA disesuaikan agar lebih baik --- */}
      <View style={[styles.ctaButtonContainer, { bottom: insets.bottom + 5 }]}>
        <TouchableOpacity
          style={styles.ctaButtonShadow}
          onPress={() => router.push("/(tabs)/check")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaButton}
          >
            <Feather name="camera" size={24} color="#FFFFFF" />
            <Text style={styles.ctaText}>Mulai Pengecekan Baru</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- BARU: Stylesheet yang telah diperbarui secara signifikan ---
const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 25,
    paddingBottom: 90, // Memberi ruang untuk lengkungan dan tombol
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 50, // Membuat lengkungan di bawah
    borderBottomRightRadius: 50,
    overflow: "hidden", // Penting untuk efek lingkaran
  },
  circle: {
    position: "absolute",
    borderRadius: 100,
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    aspectRatio: 1,
  },
  circle1: { width: 200, right: -50, top: -30 },
  circle2: { width: 150, left: -40, bottom: -60 },
  circle3: { width: 80, right: 80, bottom: -20 },
 
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 15,
    color: "rgba(255,255,255,0.92)",
    marginTop: 12,
    lineHeight: 22,
  },

  ctaButtonContainer: {
    position: "absolute",
    left: 20,
    right: 20,
  },
  ctaButtonShadow: {
    borderRadius: 20,
    shadowColor: "#005508",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 12,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
    color: "#FFFFFF",
  },
  featuresSection: {
    paddingTop: 40,
    paddingHorizontal: 20,
    marginTop: -40, // Konten naik ke atas menutupi bagian bawah header
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  featureTextContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: "600",
  },
  featureDescription: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
  },
});
