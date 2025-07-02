// app/(tabs)/checkScreen.tsx

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Alert,
  Animated,
  Platform,
  UIManager,
  LayoutAnimation,
  Easing,
} from "react-native";
import { Text, View } from "@/components/ui/Themed";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useTheme } from "@/components/ui/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import * as Progress from "react-native-progress";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Markdown from "react-native-markdown-display";
import { CLASSIFY_URL } from "@/constants/api";
import { staticChatResponses } from "@/constants/staticChatData";

const { width } = Dimensions.get("window");
const IMAGE_SIZE = width * 0.85;

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- DATA & UTILITIES ---

const diseaseDetails = {
  // ... (data diseaseDetails tetap sama)
  Busuk: {
    description: staticChatResponses["apa itu penyakit black rot busuk hitam"],
    symptoms:
      "Gejalanya adalah:\n- **Daun:** Bercak coklat kecil yang membesar dengan titik-titik hitam di tengahnya.\n- **Buah:** Bercak keputihan yang cepat membesar, berubah menjadi coklat, lalu hitam, dan akhirnya buah mengerut seperti kismis.",
    recommendation:
      "1.  **Sanitasi:** Buang dan musnahkan semua bagian tanaman yang terinfeksi untuk mengurangi sumber spora.\n2.  **Sirkulasi Udara:** Lakukan pemangkasan untuk meningkatkan aliran udara di sekitar tajuk tanaman.\n3.  **Fungisida:** Aplikasikan fungisida yang direkomendasikan secara preventif, terutama sebelum dan selama musim hujan.",
  },
  Esca: {
    description: staticChatResponses["penyakit esca"],
    symptoms:
      "Gejala Esca bervariasi, termasuk:\n- Munculnya corak **'garis harimau'** (tiger stripes) pada daun, yaitu area kuning atau merah di antara tulang daun.\n- Pada kasus akut, sebagian atau seluruh tanaman bisa layu dan mati mendadak (apaloplexy).",
    recommendation:
      "Penyakit ini sulit ditangani. Fokus pada pencegahan:\n- Jaga kesehatan tanaman secara umum.\n- Lakukan praktik pemangkasan yang baik untuk menghindari luka besar.\n- Pertimbangkan penggunaan produk pelindung luka pangkas.",
  },
  Hawar: {
    description: staticChatResponses["penyakit hawar downy mildew"],
    symptoms:
      "Gejala utama hawar adalah:\n- **Atas Daun:** Muncul bercak tembus cahaya berwarna kuning atau kemerahan seperti noda minyak (oil spots).\n- **Bawah Daun:** Pada area bercak, akan muncul spora jamur berwarna putih seperti kapas halus, terutama di pagi hari yang lembab.",
    recommendation: staticChatResponses["penanganan cara mengatasi hawar"],
  },
};


// --- UI COMPONENTS ---

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const LoadingOverlay = ({ visible, colors }: any) => {
  // ... (Komponen LoadingOverlay tetap sama)
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.overlayContainer, { opacity: anim }]}>
      <BlurView intensity={Platform.OS === "ios" ? 25 : 80} tint={colors.blurTint} style={StyleSheet.absoluteFill} />
      <Progress.CircleSnail color={colors.tint} size={60} thickness={4} />
      <Text style={[styles.loadingText, { color: colors.text }]}>Menganalisis...</Text>
    </Animated.View>
  );
};

const ResultCard = ({ prediction, onReset, colors }: any) => {
  // ... (Komponen ResultCard tetap sama, atau bisa disempurnakan lebih lanjut)
  const [activeTab, setActiveTab] = useState("ringkasan");
  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 40,
        friction: 7,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleTabPress = (tabName: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(tabName);
  };

  if (!prediction) return null;

  const isNegative = prediction.label.toLowerCase() === "negative";
  const isHealthy =
    !isNegative && prediction.label.toLowerCase().includes("sehat");
  const confidencePercentage = (prediction.confidence * 100).toFixed(1);

  const statusConfig = {
    negative: {
      title: "Gambar Tidak Sesuai",
      desc: "Pastikan gambar yang Anda unggah adalah daun anggur.",
      icon: "x-circle",
      color: colors.warning,
      details: null,
    },
    healthy: {
      title: "Daun Anggur Sehat",
      desc: "Tidak ada indikasi penyakit yang terdeteksi. Tetap jaga kesehatan tanaman Anda.",
      icon: "check-circle",
      color: colors.success,
      details: null,
    },
    disease: {
      title: prediction.label,
      desc: "Penyakit terdeteksi. Silakan lihat detail di bawah untuk informasi dan penanganan.",
      icon: "alert-circle",
      color: colors.error,
      details: diseaseDetails[prediction.label as keyof typeof diseaseDetails],
    },
  };

  const { title, desc, icon, color, details } =
    statusConfig[
      isNegative ? "negative" : isHealthy ? "healthy" : "disease"
    ];

  const markdownStyle = {
    body: { color: colors.tabIconDefault, fontSize: 14, lineHeight: 22 },
    strong: { color: colors.text, fontWeight: 'bold' },
    bullet_list_icon: { color: colors.tint },
    ordered_list_icon: { color: colors.tint, fontWeight: 'bold' },
  };

  const tabs = [
    { key: "ringkasan", label: "Ringkasan", icon: "info" },
    { key: "gejala", label: "Gejala", icon: "bar-chart-2" },
    { key: "penanganan", label: "Penanganan", icon: "tool" },
  ];

  return (
    <Animated.View
      style={[
        styles.resultCard,
        {
          backgroundColor: colors.surface,
          opacity: opacityAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={[styles.resultHeader, { backgroundColor: "transparent" }]}>
        <Feather name={icon} size={28} color={color} />
        <Text style={[styles.resultTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <Text style={[styles.resultInfo, { color: colors.tabIconDefault }]}>
        {desc}
      </Text>

      {details && (
        <>
          <View style={[styles.tabContainer, { borderColor: colors.border }]}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => handleTabPress(tab.key)}
                style={[
                  styles.tabButton,
                  activeTab === tab.key && {
                    borderBottomColor: colors.tint,
                  },
                ]}
              >
                <Feather
                  name={tab.icon as any}
                  size={18}
                  color={
                    activeTab === tab.key ? colors.tint : colors.tabIconDefault
                  }
                />
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color:
                        activeTab === tab.key
                          ? colors.tint
                          : colors.tabIconDefault,
                    },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.tabContent}>
            {activeTab === "ringkasan" && (
              <Markdown style={markdownStyle}>{details.description}</Markdown>
            )}
            {activeTab === "gejala" && (
              <Markdown style={markdownStyle}>{details.symptoms}</Markdown>
            )}
            {activeTab === "penanganan" && (
              <Markdown style={markdownStyle}>{details.recommendation}</Markdown>
            )}
          </View>
        </>
      )}

      <View style={[styles.separator, { backgroundColor: colors.border }]} />

      <View style={{ backgroundColor: "transparent" }}>
        <View style={styles.confidenceWrapper}>
          <Text
            style={[styles.confidenceLabel, { color: colors.tabIconDefault }]}
          >
            Tingkat Keyakinan
          </Text>
          <Text style={[styles.confidenceValue, { color: color }]}>
            {confidencePercentage}%
          </Text>
        </View>
        <Progress.Bar
          progress={prediction.confidence}
          width={null}
          color={color}
          unfilledColor={colors.confidenceBar}
          borderWidth={0}
          height={8}
          style={styles.progressBar}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.resetButton,
          { backgroundColor: colors.border, marginTop: 24 },
        ]}
        onPress={onReset}
      >
        <Text style={[styles.resetButtonText, { color: colors.text }]}>
          Ulangi Analisis
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const ErrorCard = ({ message, onRetry, colors }: any) => {
  // ... (Komponen ErrorCard tetap sama)
  return (
    <View style={[styles.errorCard, { backgroundColor: colors.error + "20" }]}>
      <Feather name="alert-triangle" size={20} color={colors.error} />
      <Text style={[styles.errorText, { color: colors.error }]}>{message}</Text>
      <TouchableOpacity onPress={onRetry}>
        <Text style={[styles.retryText, { color: colors.tint }]}>
          Coba Lagi
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Komponen baru untuk tampilan awal sebelum gambar dipilih.
 */
const InitialView = ({ onPickImage, colors }: { onPickImage: (useCamera: boolean) => void, colors: any }) => {
  const breathAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(breathAnim, { toValue: 1.05, duration: 2000, useNativeDriver: true, easing: Easing.ease }),
        Animated.timing(breathAnim, { toValue: 1, duration: 2000, useNativeDriver: true, easing: Easing.ease })
      ])
    ).start();
  }, []);

  const buttonGradient = colors.theme === "dark"
      ? [colors.primaryLight, colors.tint]
      : [colors.primaryLight, colors.tint];

  return (
    <View style={{ width: "100%", alignItems: "center" }}>
      <Text style={[styles.heading, { color: colors.text }]}>Analisis Daun Anggur</Text>
      <Text style={[styles.subtext, { color: colors.tabIconDefault }]}>
        Unggah atau ambil gambar daun anggur untuk dideteksi oleh AI.
      </Text>
      <Animated.View style={{ transform: [{ scale: breathAnim }] }}>
        <TouchableOpacity
          onPress={() => onPickImage(false)}
          style={[styles.imageContainer, { borderColor: colors.border, backgroundColor: colors.surface }]}
        >
          <Feather name="upload-cloud" size={48} color={colors.tabIconDefault} />
          <Text style={[styles.placeholderText, { color: colors.tabIconDefault }]}>Ketuk untuk Memilih Gambar</Text>
          <Text style={[styles.placeholderSubtext, { color: colors.tabIconDefault }]}>atau gunakan kamera</Text>
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity style={styles.cameraButton} onPress={() => onPickImage(true)}>
        <LinearGradient colors={buttonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientButton}>
          <Feather name="camera" size={20} color="#FFFFFF" />
          <Text style={styles.cameraButtonText}>Ambil Gambar</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}


// --- MAIN SCREEN COMPONENT ---

export default function CheckScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<{ label: string; confidence: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { theme } = useTheme();
  const colors = Colors[theme];

  const contentOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(contentOpacity, {
      toValue: image ? 1 : 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [image]);


  const pickImage = async (useCamera: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    handleReset(); // Reset state sebelum memilih gambar baru

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    };

    try {
      const permission = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permission.status !== "granted") {
        Alert.alert("Izin Diperlukan", `Anda perlu memberikan izin untuk mengakses ${useCamera ? "kamera" : "galeri"}.`);
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
        
      if (result.canceled) return;

      const asset = result.assets[0];
      setImage(asset.uri);
      classifyImage(asset.uri);

    } catch (e) {
      Alert.alert("Error", "Gagal membuka gambar.");
      console.error(e);
    }
  };

  const classifyImage = async (uri: string) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    const filename = uri.split("/").pop()!;
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    formData.append("file", { uri, name: filename, type } as any);

    try {
      const response = await fetch(CLASSIFY_URL, {
        method: "POST",
        body: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = await response.json();
      if (response.ok) {
        setPrediction(data);
      } else {
        throw new Error(data.error || "Gagal melakukan klasifikasi. Pastikan server berjalan.");
      }
    } catch (e: any) {
      setError(e.message || "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setImage(null);
    setPrediction(null);
    setError(null);
  };
  
  const handleRetry = () => {
    if (image) {
      classifyImage(image);
    } else {
      handleReset();
    }
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {!image && <InitialView onPickImage={pickImage} colors={colors} />}

          {image && (
            <Animated.View style={{ opacity: contentOpacity, width: '100%', alignItems: 'center' }}>
              <Text style={[styles.heading, { color: colors.text }]}>Hasil Analisis</Text>
              
              <View style={[styles.imageContainer, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                <Image source={{ uri: image }} style={styles.image} />
                <LoadingOverlay visible={loading} colors={colors} />
              </View>

              {error && <ErrorCard message={error} onRetry={handleRetry} colors={colors} />}
              
              {prediction && <ResultCard prediction={prediction} onReset={handleReset} colors={colors} />}

              {!prediction && !error && !loading && (
                 <TouchableOpacity
                  style={[styles.resetButton, { backgroundColor: colors.border, marginTop: 24, width: '100%' }]}
                  onPress={handleReset}
                >
                  <Text style={[styles.resetButtonText, { color: colors.text }]}>Batalkan & Ulangi</Text>
                </TouchableOpacity>
              )}
            </Animated.View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


// --- STYLES ---

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: "center", paddingVertical: 20 },
  container: { alignItems: "center", paddingHorizontal: 20 },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtext: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
    maxWidth: "90%",
  },
  imageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  placeholderContainer: {
    alignItems: "center",
    gap: 12,
    backgroundColor: "transparent",
  },
  placeholderText: { fontSize: 16, fontWeight: "600" },
  placeholderSubtext: { fontSize: 14, opacity: 0.7 },
  cameraButton: {
    width: "100%",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 16,
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    gap: 10,
  },
  cameraButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "bold" },
  overlayContainer: { justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.1)' },
  loadingText: { marginTop: 16, fontSize: 16, fontWeight: "600" },

  resultCard: {
    padding: 20,
    borderRadius: 24,
    width: "100%",
    marginTop: 24,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignItems: "stretch",
  },
  resultHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 4,
    backgroundColor: "transparent",
  },
  resultTitle: { fontSize: 24, fontWeight: "bold", flexShrink: 1 },
  confidenceWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
    backgroundColor: "transparent",
  },
  confidenceLabel: { fontSize: 14, fontWeight: "500" },
  confidenceValue: { fontSize: 20, fontWeight: "bold" },
  progressBar: { borderRadius: 4, width: "100%" },
  resultInfo: {
    fontSize: 15,
    lineHeight: 22,
    marginTop: 4,
    textAlign: "left",
    marginBottom: 16,
  },
  resetButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
  },
  resetButtonText: { fontSize: 16, fontWeight: "bold" },
  errorCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    width: "100%",
  },
  errorText: { flex: 1, fontSize: 14, fontWeight: "600" },
  retryText: { fontSize: 14, fontWeight: "bold" },
  separator: {
    height: 1,
    width: "100%",
    marginVertical: 20,
  },
  infoSectionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "transparent",
    marginTop: 20,
    gap: 12,
  },
  infoSectionTextContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  tabButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  tabContent: {
    minHeight: 150,
    backgroundColor: "transparent",
  },
});