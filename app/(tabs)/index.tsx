import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Animated,
  LayoutChangeEvent,
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useTheme } from "@/components/ThemeContext";
import { View as DefaultView } from "@/components/Themed";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useGlobalRefresh } from "@/components/GlobalRefreshContext";

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
          colors={[`${colors.tint}1A`, `${colors.tint}05`] as [string, string]}
          style={styles.featureIconContainer}
        >
          <Feather name={icon} size={24} color={colors.tint} />
        </LinearGradient>
        <DefaultView style={styles.featureTextContainer}>
          <Text style={[styles.featureTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.featureDescription, { color: colors.tabIconDefault }]}>
            {description}
          </Text>
        </DefaultView>
      </DefaultView>
    </Animated.View>
  );
};

const AnimatedHeader = ({
  scrollY,
  threshold,
  onThemeToggle,
}: {
  scrollY: Animated.Value;
  threshold: number;
  onThemeToggle: () => void;
}) => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const insets = useSafeAreaInsets();
  const headerHeight = 60 + insets.top;

  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [threshold, threshold + 30],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const solidContentOpacity = scrollY.interpolate({
    inputRange: [threshold + 10, threshold + 40],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const transparentContentOpacity = scrollY.interpolate({
    inputRange: [threshold, threshold + 20],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const shadowOpacity = scrollY.interpolate({
    inputRange: [threshold, threshold + 50],
    outputRange: [0, theme === "dark" ? 0.2 : 0.05],
    extrapolate: "clamp",
  });

  return (
    <Animated.View style={[styles.headerContainer, { height: headerHeight, paddingTop: insets.top }]}>
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: colors.background, opacity: headerBackgroundOpacity },
          styles.headerShadow,
          { shadowOpacity: shadowOpacity },
        ]}
      />
      <DefaultView style={styles.headerContent}>
        <Animated.View style={[styles.headerIcons, { opacity: transparentContentOpacity }]}>
          <Feather name="menu" size={24} color="#FFFFFF" />
          <Text style={styles.headerLogoText}>GrapeCheck</Text>
          <TouchableOpacity onPress={onThemeToggle}>
            <Feather name={theme === "light" ? "moon" : "sun"} size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.headerIcons, { opacity: solidContentOpacity }]}>
          <Feather name="menu" size={24} color={colors.text} />
          <Text style={[styles.headerLogoText, { color: colors.text }]}>GrapeCheck</Text>
          <TouchableOpacity onPress={onThemeToggle}>
            <Feather name={theme === "light" ? "moon" : "sun"} size={24} color={colors.text} />
          </TouchableOpacity>
        </Animated.View>
      </DefaultView>
    </Animated.View>
  );
};

export default function HomeScreen() {
  const { theme, toggleTheme } = useTheme();
  const colors = Colors[theme];
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { refreshApp } = useGlobalRefresh();

  const scrollY = useRef(new Animated.Value(0)).current;
  const [scrollThreshold, setScrollThreshold] = useState(300);

  const ctaButtonScale = useRef(new Animated.Value(1)).current;
  const ctaIconScale = useRef(new Animated.Value(1)).current;

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshApp();
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

  const handleScroll = Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
    useNativeDriver: true,
  });

  const gradientColors = theme === 'dark' ? ['#00640A', colors.background] : [colors.tint, '#00990E'];
  const buttonGradient = theme === 'dark' ? [colors.primaryLight, colors.tint] : [colors.primaryLight, colors.tint];

  const features = [
    {
      icon: "cpu",
      title: "Presisi Tinggi",
      description: "Didukung oleh model Deep Learning untuk klasifikasi yang lebih akurat.",
    },
    {
      icon: "zap",
      title: "Proses Kilat",
      description: "Analisis cepat dan efisien dalam hitungan detik.",
    },
    {
      icon: "clock",
      title: "Riwayat Analisis",
      description: "Akses mudah semua hasil klasifikasi yang pernah dilakukan.",
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
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={[colors.tint]}
            tintColor={colors.tint}
          />
        }
      >
        <LinearGradient
          colors={gradientColors as [string, string]}
          style={[styles.header, { paddingTop: insets.top + 100, paddingBottom: insets.bottom + 60 }]}
        >
          <Animated.View style={[styles.blob, styles.blob1]} />
          <Animated.View style={[styles.blob, styles.blob2]} />
          <Animated.View style={[styles.blob, styles.blob3]} />

          <Text style={styles.title} onLayout={onTitleLayout}>
            Deteksi Penyakit Daun Anggur
          </Text>
          <Text style={styles.subtitle}>
            Identifikasi penyakit pada daun anggur secara dini melalui analisis gambar berbasis
            kecerdasan buatan.
          </Text>

          <Animated.View style={[styles.inlineCTAWrapper, { transform: [{ scale: ctaButtonScale }] }]}>
            <TouchableOpacity
              style={styles.ctaButtonShadow}
              onPress={handleCtaPress}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={1}
            >
              <LinearGradient
                colors={buttonGradient as [string, string]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.inlineCTAButton}
              >
                <Animated.View style={{ transform: [{ scale: ctaIconScale }] }}>
                  <Feather name="camera" size={24} color="#FFFFFF" />
                </Animated.View>
                <Text style={styles.inlineCTAButtonText}>Analisis Sekarang</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </LinearGradient>

        <DefaultView style={[styles.featuresSection, { backgroundColor: colors.background }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Keunggulan Aplikasi</Text>
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

      <AnimatedHeader scrollY={scrollY} threshold={scrollThreshold} onThemeToggle={toggleTheme} />
    </DefaultView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
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
    backgroundColor: "transparent",
  },
  headerIcons: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 20,
    right: 20,
    bottom: 0,
  },
  headerLogoText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 25,
    paddingBottom: 60,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: "visible",
  },
  blob: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.07)",
    borderRadius: 9999,
    opacity: 0.5,
    transform: [{ rotate: "15deg" }],
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  blob1: { width: 250, height: 250, top: -80, right: -60 },
  blob2: { width: 160, height: 160, bottom: -50, left: -50 },
  blob3: { width: 100, height: 100, bottom: 0, right: 80 },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 40,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.95)",
    marginTop: 10,
    marginBottom: 14,
    lineHeight: 26,
    fontWeight: "400",
    letterSpacing: 0.2,
    maxWidth: 320,
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
    borderColor: "rgba(255, 255, 255, 0.25)",
  },
  inlineCTAButtonText: {
    fontSize: 16.5,
    fontWeight: "700",
    marginLeft: 12,
    color: "#fff",
    letterSpacing: 0.3,
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
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 18,
    letterSpacing: 0.3,
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
    fontSize: 16.5,
    fontWeight: "600",
    lineHeight: 22,
  },
  featureDescription: {
    fontSize: 14,
    marginTop: 4,
    lineHeight: 20,
    letterSpacing: 0.2,
  },
});
