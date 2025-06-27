import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  LayoutChangeEvent,
  RefreshControl, // 1. Impor RefreshControl
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useTheme } from "@/components/ThemeContext";
import { View as DefaultView } from '@/components/Themed';
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from 'expo-haptics';
import { useGlobalRefresh } from "@/components/GlobalRefreshContext"; // Impor hook global refresh

// Komponen FeatureCard (tidak ada perubahan)
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
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <DefaultView
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
        <DefaultView style={styles.featureTextContainer}>
          <Text style={[styles.featureTitle, { color: colors.text }]}>{title}</Text>
          <Text
            style={[styles.featureDescription, { color: colors.tabIconDefault }]}
          >
            {description}
          </Text>
        </DefaultView>
      </DefaultView>
    </Animated.View>
  );
};

// Komponen AnimatedHeader (tidak ada perubahan)
const AnimatedHeader = ({ scrollY, threshold, onThemeToggle }: {
  scrollY: Animated.Value,
  threshold: number,
  onThemeToggle: () => void
}) => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const insets = useSafeAreaInsets();
  const headerHeight = 60 + insets.top;

  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [threshold, threshold + 30],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const solidContentOpacity = scrollY.interpolate({
    inputRange: [threshold + 10, threshold + 40],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });
  
  const transparentContentOpacity = scrollY.interpolate({
    inputRange: [threshold, threshold + 20],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const shadowOpacity = scrollY.interpolate({
    inputRange: [threshold, threshold + 50],
    outputRange: [0, theme === 'dark' ? 0.2 : 0.05],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.headerContainer, { height: headerHeight, paddingTop: insets.top }]}>
      <Animated.View style={[
        StyleSheet.absoluteFillObject,
        { backgroundColor: colors.background, opacity: headerBackgroundOpacity },
        styles.headerShadow,
        { shadowOpacity: shadowOpacity }
      ]}/>

      <DefaultView style={styles.headerContent}>
        <Animated.View style={[styles.headerIcons, { opacity: transparentContentOpacity }]}>
          <Feather name="menu" size={24} color="#FFFFFF" />
          <Text style={styles.headerLogoText}>GrapeCheck</Text>
          <TouchableOpacity onPress={onThemeToggle}>
            <Feather name={theme === 'light' ? 'moon' : 'sun'} size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.headerIcons, { opacity: solidContentOpacity }]}>
          <Feather name="menu" size={24} color={colors.text} />
          <Text style={[styles.headerLogoText, { color: colors.text }]}>GrapeCheck</Text>
          <TouchableOpacity onPress={onThemeToggle}>
            <Feather name={theme === 'light' ? 'moon' : 'sun'} size={24} color={colors.text} />
          </TouchableOpacity>
        </Animated.View>
      </DefaultView>
    </Animated.View>
  )
}

export default function HomeScreen() {
  const { theme, toggleTheme } = useTheme();
  const colors = Colors[theme];
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { refreshApp } = useGlobalRefresh(); // 2. Dapatkan fungsi refresh global

  const scrollY = useRef(new Animated.Value(0)).current;
  const [scrollThreshold, setScrollThreshold] = useState(300);
  
  const ctaButtonScale = useRef(new Animated.Value(1)).current;
  const ctaIconScale = useRef(new Animated.Value(1)).current;

  // 3. State untuk mengontrol status loading dari RefreshControl
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 4. Fungsi yang akan dipanggil saat pull-to-refresh
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true); // Tampilkan indikator loading
    refreshApp(); // Panggil fungsi refresh global
    
    // Sembunyikan indikator loading setelah beberapa saat
    // Ini memberikan waktu bagi aplikasi untuk me-mount ulang
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, [refreshApp]);

  const handleCtaPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/(tabs)/check");
  };

  const handlePressIn = () => {
    Animated.spring(ctaButtonScale, {
      toValue: 0.96,
      useNativeDriver: true,
      bounciness: 10,
    }).start();
    Animated.spring(ctaIconScale, {
      toValue: 1.15,
      useNativeDriver: true,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(ctaButtonScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 60,
    }).start();
    Animated.spring(ctaIconScale, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 60,
    }).start();
  };

  const onTitleLayout = (event: LayoutChangeEvent) => {
    const { y } = event.nativeEvent.layout;
    const headerHeight = 60 + insets.top;
    setScrollThreshold(y - headerHeight - 10); 
  };
  
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: true }
  );

  const gradientColors =
    theme === "dark" ? ["#00640A", "#1A4D2E"] : ["#00990E", "#22C55E"];
  const buttonGradient =
    theme === "dark" ? ["#00B86B", "#007A47"] : ["#4ADE80", "#16A34A"];

  const features = [
    {
      icon: "cpu",
      title: "Akurasi Tinggi",
      description: "Didukung model Deep Learning untuk hasil presisi.",
    },
    {
      icon: "zap",
      title: "Deteksi Cepat",
      description: "Dapatkan hasil klasifikasi dalam hitungan detik.",
    },
    {
      icon: "clock",
      title: "Riwayat Lengkap",
      description: "Simpan dan lihat kembali semua hasil Analisis.",
    },
  ];

  return (
    <DefaultView style={{ flex: 1, backgroundColor: colors.background }}>
      <Animated.ScrollView
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        style={{ overflow: "visible" }}
        // 5. Tambahkan prop refreshControl
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.tint]} // Warna indikator loading
            tintColor={colors.tint} // Warna indikator loading untuk iOS
          />
        }
      >
        <LinearGradient
          colors={gradientColors}
          style={[
            styles.header,
            {
              paddingTop: insets.top + 100,
              paddingBottom: insets.bottom + 60,
            },
          ]}
        >
          <DefaultView style={[styles.circle, styles.circle1]} />
          <DefaultView style={[styles.circle, styles.circle2]} />
          <DefaultView style={[styles.circle, styles.circle3]} />

          <Text style={styles.title} onLayout={onTitleLayout}>
            Klasifikasi Daun Anggur
          </Text>
          <Text style={styles.subtitle}>
            Deteksi dini penyakit daun anggur melalui analisis gambar untuk
            mendukung kesehatan tanaman Anda.
          </Text>

          <Animated.View style={[ styles.inlineCTAWrapper, { transform: [{ scale: ctaButtonScale }] }]}>
            <TouchableOpacity
              style={styles.ctaButtonShadow}
              onPress={handleCtaPress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={1}
            >
              <LinearGradient
                colors={buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.inlineCTAButton}
              >
                <Animated.View style={{ transform: [{ scale: ctaIconScale }] }}>
                  <Feather name="camera" size={24} color="#FFFFFF" />
                </Animated.View>
                <Text style={styles.inlineCTAButtonText}>Mulai Analisis</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

        </LinearGradient>

        <DefaultView style={[styles.featuresSection, { backgroundColor: colors.background }]}>
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
        </DefaultView>
      </Animated.ScrollView>

      <AnimatedHeader 
        scrollY={scrollY}
        threshold={scrollThreshold}
        onThemeToggle={toggleTheme}
      />
    </DefaultView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 4,
  },
  headerContent: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
  headerIcons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 10,
    right: 10,
    bottom: 0,
  },
  headerLogoText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF'
  },
  header: {
    paddingHorizontal: 25,
    paddingBottom: 60,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: "visible",
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
    fontSize: 32,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 38,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.92)",
    marginTop: 10,
    marginBottom: 12,
    lineHeight: 24,
    fontWeight: "400",
  },
  inlineCTAWrapper: {
    marginTop: 20,
    alignSelf: "flex-start",
  },
  inlineCTAButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  inlineCTAButtonText: {
    fontSize: 17,
    fontWeight: "700",
    marginLeft: 12,
    color: "#fff",
  },
  ctaButtonShadow: {
    borderRadius: 30,
    shadowColor: "#166534",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  featuresSection: {
    paddingTop: 40,
    paddingHorizontal: 20,
    marginTop: -30,
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