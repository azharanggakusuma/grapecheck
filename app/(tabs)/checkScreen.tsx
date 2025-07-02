import React, { useState, useRef, useEffect } from "react";
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
  Text as RNText,
} from "react-native";
import { Text, View } from "@/components/ui/Themed";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useTheme } from "@/components/ui/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Progress from "react-native-progress";
import * as Haptics from "expo-haptics";
import Markdown from "react-native-markdown-display";
import { CLASSIFY_URL } from "@/constants/api";
import { staticChatResponses } from "@/constants/staticChatData";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- DATA (Tidak ada perubahan) ---
const diseaseDetails = {
    Busuk: {
        title: "Black Rot (Busuk Hitam)",
        description: staticChatResponses["apa itu penyakit black rot busuk hitam"],
        symptoms: "Gejalanya adalah:\n- **Daun:** Bercak coklat kecil yang membesar dengan titik-titik hitam di tengahnya.\n- **Buah:** Bercak keputihan yang cepat membesar, berubah menjadi coklat, lalu hitam, dan akhirnya buah mengerut seperti kismis.",
        recommendation: "1.  **Sanitasi:** Buang dan musnahkan semua bagian tanaman yang terinfeksi untuk mengurangi sumber spora.\n2.  **Sirkulasi Udara:** Lakukan pemangkasan untuk meningkatkan aliran udara di sekitar tajuk tanaman.\n3.  **Fungisida:** Aplikasikan fungisida yang direkomendasikan secara preventif, terutama sebelum dan selama musim hujan."
    },
    Esca: {
        title: "Esca (Penyakit Kayu)",
        description: staticChatResponses["penyakit esca"],
        symptoms: "Gejala Esca bervariasi, termasuk:\n- Munculnya corak **'garis harimau'** (tiger stripes) pada daun, yaitu area kuning atau merah di antara tulang daun.\n- Pada kasus akut, sebagian atau seluruh tanaman bisa layu dan mati mendadak (apaloplexy).",
        recommendation: "Penyakit ini sulit ditangani. Fokus pada pencegahan:\n- Jaga kesehatan tanaman secara umum.\n- Lakukan praktik pemangkasan yang baik untuk menghindari luka besar.\n- Pertimbangkan penggunaan produk pelindung luka pangkas."
    },
    Hawar: {
        title: "Downy Mildew (Hawar)",
        description: staticChatResponses["penyakit hawar downy mildew"],
        symptoms: "Gejala utama hawar adalah:\n- **Atas Daun:** Muncul bercak tembus cahaya berwarna kuning atau kemerahan seperti noda minyak (oil spots).\n- **Bawah Daun:** Pada area bercak, akan muncul spora jamur berwarna putih seperti kapas halus, terutama di pagi hari yang lembab.",
        recommendation: staticChatResponses["penanganan cara mengatasi hawar"]
    }
};

// --- UI SUB-COMPONENTS (Tidak ada perubahan) ---

const ActionButton = ({ icon, title, subtitle, onPress, colors, isPrimary }: any) => (
  <TouchableOpacity
    style={[
        styles.actionButton,
        isPrimary
            ? { backgroundColor: colors.tint }
            : { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }
    ]}
    onPress={onPress}
  >
    <Feather
        name={icon}
        size={24}
        color={isPrimary ? '#FFFFFF' : colors.tint}
        style={styles.actionIcon}
    />
    <View style={{ backgroundColor: 'transparent', flex: 1 }}>
      <Text style={[styles.actionTitle, { color: isPrimary ? '#FFFFFF' : colors.text }]}>{title}</Text>
      <Text style={[styles.actionSubtitle, { color: isPrimary ? 'rgba(255,255,255,0.8)' : colors.tabIconDefault }]}>{subtitle}</Text>
    </View>
    <Feather name="chevron-right" size={22} color={isPrimary ? '#FFFFFF' : colors.tabIconDefault} />
  </TouchableOpacity>
);

const InitialView = ({ onPickImage, colors }: any) => (
  <View style={styles.fullWidth}>
    <Feather name="shield" size={60} color={colors.tint} style={{ marginBottom: 20 }}/>
    <Text style={[styles.heading, { color: colors.text }]}>Mulai Analisis</Text>
    <Text style={[styles.subtext, { color: colors.tabIconDefault }]}>
      Unggah atau ambil gambar daun anggur untuk dideteksi.
    </Text>
    <ActionButton
      icon="image"
      title="Unggah dari Galeri"
      subtitle="Pilih gambar dari perangkat"
      onPress={() => onPickImage(false)}
      colors={colors}
      isPrimary={true}
    />
    <ActionButton
      icon="camera"
      title="Buka Kamera"
      subtitle="Ambil gambar secara langsung"
      onPress={() => onPickImage(true)}
      colors={colors}
      isPrimary={false}
    />
  </View>
);

const ShimmerLoading = ({ colors }: any) => {
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(shimmerAnim, {
                toValue: 1,
                duration: 1500,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();
    }, []);

    const translateX = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-width, width],
    });

    return (
        <View style={styles.loadingContainer}>
            <Text style={[styles.loadingText, { color: colors.text }]}>Menganalisis Gambar...</Text>
            <View style={[styles.shimmerWrapper, { backgroundColor: colors.surface }]}>
                <Animated.View style={{ ...StyleSheet.absoluteFillObject, transform: [{ translateX }] }}>
                    <LinearGradient
                        colors={[`${colors.surface}00`, `${colors.tint}40`, `${colors.surface}00`]}
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={styles.shimmerGradient}
                    />
                </Animated.View>
            </View>
             <Text style={[styles.loadingSubText, { color: colors.tabIconDefault }]}>
                Mohon tunggu sebentar.
            </Text>
        </View>
    );
};


const AccordionSection = ({ title, content, colors }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
    Animated.timing(anim, {
      toValue: !isExpanded ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const arrowRotation = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  const markdownStyle = {
    body: { color: colors.tabIconDefault, fontSize: 14, lineHeight: 24 },
    strong: { color: colors.text, fontWeight: 'bold' },
    bullet_list_icon: { color: colors.tint, marginRight: 8 },
    ordered_list_icon: { color: colors.tint, fontWeight: 'bold', marginRight: 8 },
  };

  return (
    <View style={[styles.accordionContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <TouchableOpacity onPress={handlePress} style={styles.accordionHeader}>
        <Text style={[styles.accordionTitle, { color: colors.text }]}>{title}</Text>
        <Animated.View style={{ transform: [{ rotate: arrowRotation }] }}>
          <Feather name="chevron-right" size={22} color={colors.tabIconDefault} />
        </Animated.View>
      </TouchableOpacity>
      {isExpanded && (
        <View style={styles.accordionContent}>
          <Markdown style={markdownStyle}>{content}</Markdown>
        </View>
      )}
    </View>
  );
};


const ResultView = ({ image, prediction, onReset, colors }: any) => {
  if (!prediction) return null;

  const isNegative = prediction.label.toLowerCase() === 'negative';
  const isHealthy = !isNegative && prediction.label.toLowerCase().includes("sehat");
  const confidencePercentage = (prediction.confidence * 100).toFixed(1);

  const statusConfig = {
    negative: { title: "Gambar Tidak Dikenali", subtitle: "Gagal mengidentifikasi daun", icon: "x-circle", color: colors.warning, details: null },
    healthy: { title: "Daun Anggur Sehat", subtitle: "Tidak ada penyakit terdeteksi", icon: "check-circle", color: colors.success, details: null },
    disease: {
      title: diseaseDetails[prediction.label as keyof typeof diseaseDetails]?.title || prediction.label,
      subtitle: "Penyakit Terdeteksi",
      icon: "alert-circle", color: colors.error,
      details: diseaseDetails[prediction.label as keyof typeof diseaseDetails]
    },
  };

  const { title, subtitle, icon, color, details } = statusConfig[isNegative ? "negative" : isHealthy ? "healthy" : "disease"];

  return (
    <View style={styles.fullWidth}>
      <Text style={[styles.heading, { color: colors.text, marginBottom: 16 }]}>Hasil Analisis</Text>
      <View style={[styles.imageResultContainer, { shadowColor: colors.text+'30' }]}>
        <Image source={{ uri: image }} style={styles.image} />
      </View>

      <View style={[styles.resultCard, { backgroundColor: colors.surface, shadowColor: colors.text+'30' }]}>
        <View style={styles.resultHeader}>
          <Feather name={icon} size={24} color={color} />
          <View style={{backgroundColor: 'transparent', flex: 1}}>
            <Text style={[styles.resultTitle, { color: color }]}>{title}</Text>
            <Text style={[styles.resultSubtitle, { color: colors.tabIconDefault}]}>{subtitle}</Text>
          </View>
        </View>
        <View style={styles.confidenceWrapper}>
          <Text style={[styles.confidenceLabel, { color: colors.tabIconDefault }]}>Tingkat Keyakinan</Text>
          <Text style={[styles.confidenceValue, { color: colors.text }]}>{confidencePercentage}%</Text>
        </View>
        <Progress.Bar progress={prediction.confidence} width={null} color={color} unfilledColor={colors.border} borderWidth={0} height={8} style={styles.progressBar} />
      </View>

      {details && (
        <View style={styles.detailsContainer}>
          <AccordionSection title="Deskripsi Penyakit" content={details.description} colors={colors} />
          <AccordionSection title="Gejala Umum" content={details.symptoms} colors={colors} />
          <AccordionSection title="Rekomendasi Penanganan" content={details.recommendation} colors={colors} />
        </View>
      )}

      <TouchableOpacity onPress={onReset} style={[styles.actionButton, { backgroundColor: colors.tint, marginTop: 16 }]}>
        <Feather name="refresh-cw" size={24} color="#FFFFFF" style={styles.actionIcon} />
        <Text style={[styles.actionTitle, { color: "#FFFFFF", flex: 1 }]}>Analisis Gambar Lain</Text>
      </TouchableOpacity>
    </View>
  );
}
  
const ErrorCard = ({ message, onRetry, colors }: any) => (
  <View style={[styles.errorCard, { backgroundColor: colors.error + "20" }]}>
    <Feather name="alert-triangle" size={24} color={colors.error} />
    <View style={{flex: 1, backgroundColor: 'transparent'}}>
        <Text style={[styles.errorText, { color: colors.error }]}>Terjadi Kesalahan</Text>
        <Text style={[styles.errorSubText, { color: colors.error+'99' }]}>{message}</Text>
    </View>
    <TouchableOpacity onPress={onRetry}>
      <Text style={[styles.retryText, { color: colors.tint }]}>Coba Lagi</Text>
    </TouchableOpacity>
  </View>
);


// --- MAIN SCREEN COMPONENT (Logika tidak berubah, struktur render diperbaiki) ---
const CheckScreen: React.FC = () => {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const scrollViewRef = useRef<ScrollView>(null);
  
    const { theme } = useTheme();
    const colors = Colors[theme];
    
    const pickImage = async (useCamera: boolean) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        handleReset();

        const options: ImagePicker.ImagePickerOptions = {
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        };

        try {
            const permission = useCamera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permission.status !== "granted") {
                Alert.alert("Izin Diperlukan", `Anda perlu memberikan izin untuk mengakses ${useCamera ? "kamera" : "galeri"}.`);
                return;
            }
            const result = useCamera ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
            if (result.canceled) return;
            
            const asset = result.assets[0];
            setImage(asset.uri);
            classifyImage(asset.uri);
        } catch (e) {
            setError("Gagal membuka gambar. Pastikan format gambar didukung.");
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

        const fakeDelay = new Promise(resolve => setTimeout(resolve, 2000));
        const apiCall = fetch(CLASSIFY_URL, { method: "POST", body: formData, headers: { "Content-Type": "multipart/form-data" } });

        try {
            const [response] = await Promise.all([apiCall, fakeDelay]);
            if (response.ok) {
                const data = await response.json();
                setPrediction(data);
            } else {
                 const data = await response.json();
                throw new Error(data.error || "Gagal melakukan klasifikasi.");
            }
        } catch (e: any) {
             setError(e.message || "Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
        } finally {
            setLoading(false);
        }
    };
  
    const handleReset = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setImage(null); setPrediction(null); setError(null);
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    };
  
    const handleRetry = () => image ? classifyImage(image) : handleReset();

    useEffect(() => {
        if (prediction || error) {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }
    }, [prediction, error]);
    
    // Perubahan utama ada di sini
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ScrollView
                ref={scrollViewRef}
                contentContainerStyle={styles.scrollContainer} // Gunakan flexGrow untuk membuatnya bisa di-scroll saat konten panjang
                alwaysBounceVertical={false}
                showsVerticalScrollIndicator={false}
            >
                {loading && (
                    <View style={styles.centerContainer}>
                        <ShimmerLoading colors={colors} />
                    </View>
                )}

                {!loading && !image && (
                    <View style={styles.centerContainer}>
                        <InitialView onPickImage={pickImage} colors={colors} />
                    </View>
                )}

                {!loading && image && prediction && (
                    <View style={styles.container}>
                        <ResultView image={image} prediction={prediction} onReset={handleReset} colors={colors} />
                    </View>
                )}
                
                {!loading && error && (
                    <View style={styles.centerContainer}>
                        <ErrorCard message={error} onRetry={handleRetry} colors={colors} />
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

export default CheckScreen;


// --- STYLES (Perbaikan) ---
const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    fullWidth: { width: '100%', alignItems: 'center' },
    // Container untuk scroll view, memastikan bisa di-scroll jika konten melebihi layar
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center', // Tetap di tengah jika konten pendek
    },
    // Container untuk konten yang tidak perlu di-scroll (hasil analisis)
    container: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    // Container khusus untuk konten yang harus selalu di tengah (tampilan awal, loading, error)
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        minHeight: height * 0.7, // Memastikan container ini punya tinggi yg cukup untuk centering
    },
    heading: { fontSize: 26, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
    subtext: { fontSize: 16, textAlign: 'center', marginBottom: 40, lineHeight: 24, maxWidth: '90%' },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 18,
      paddingHorizontal: 20,
      borderRadius: 16,
      width: '100%',
      marginBottom: 16,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 5,
    },
    actionIcon: { marginRight: 18 },
    actionTitle: { fontSize: 16, fontWeight: '600' },
    actionSubtitle: { fontSize: 13, marginTop: 2 },
    imageResultContainer: {
      width: width * 0.85,
      height: width * 0.85,
      borderRadius: 24,
      marginBottom: 24,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 15,
      elevation: 10,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.05)'
    },
    image: { width: '100%', height: '100%', borderRadius: 24 },
    resultCard: {
      padding: 20,
      borderRadius: 20,
      width: '100%',
      marginBottom: 16,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.05,
      shadowRadius: 12,
      elevation: 5,
    },
    resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'transparent' },
    resultTitle: { fontSize: 18, fontWeight: 'bold' },
    resultSubtitle: { fontSize: 14, marginTop: 2 },
    confidenceWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 8, backgroundColor: "transparent" },
    confidenceLabel: { fontSize: 14, fontWeight: "500" },
    confidenceValue: { fontSize: 14, fontWeight: "bold" },
    progressBar: { borderRadius: 6, width: "100%" },
    detailsContainer: { width: '100%', gap: 12, marginBottom: 4 },
    accordionContainer: {
      borderRadius: 16,
      width: '100%',
      borderWidth: 1,
      overflow: 'hidden',
    },
    accordionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      backgroundColor: 'transparent',
    },
    accordionTitle: { fontSize: 16, fontWeight: '600' },
    accordionContent: {
      paddingHorizontal: 16,
      paddingBottom: 16,
      backgroundColor: 'transparent',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        width: '100%'
    },
    loadingText: {
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginBottom: 16,
    },
    loadingSubText: {
        fontSize: 14,
        marginTop: 12,
    },
    shimmerWrapper: {
        width: '80%',
        height: 10,
        borderRadius: 5,
        overflow: 'hidden',
    },
    shimmerGradient: {
        width: '100%',
        height: '100%',
    },
    errorCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 16,
      borderRadius: 16,
      padding: 16,
      width: "100%",
    },
    errorText: { fontSize: 16, fontWeight: "bold" },
    errorSubText: { flex: 1, fontSize: 14, marginTop: 2, lineHeight: 20 },
    retryText: { fontSize: 14, fontWeight: "bold" },
});