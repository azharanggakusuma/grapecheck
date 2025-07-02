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
} from "react-native";
import { Text, View } from "@/components/ui/Themed";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useTheme } from "@/components/ui/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import * as Progress from "react-native-progress";
import * as Haptics from "expo-haptics";
import Markdown from "react-native-markdown-display";
import { CLASSIFY_URL } from "@/constants/api";
import { staticChatResponses } from "@/constants/staticChatData";

const { width } = Dimensions.get("window");

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// --- DATA ---
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


// --- UI SUB-COMPONENTS ---

const ActionButton = ({ icon, title, subtitle, onPress, colors }: any) => (
  <TouchableOpacity
    style={[styles.actionButton, { backgroundColor: colors.surface, shadowColor: colors.text + '20' }]}
    onPress={onPress}
  >
    <Feather name={icon} size={24} color={colors.tint} style={styles.actionIcon} />
    <View style={{ backgroundColor: 'transparent', flex: 1 }}>
      <Text style={[styles.actionTitle, { color: colors.text }]}>{title}</Text>
      <Text style={[styles.actionSubtitle, { color: colors.tabIconDefault }]}>{subtitle}</Text>
    </View>
    <Feather name="chevron-right" size={22} color={colors.tabIconDefault} />
  </TouchableOpacity>
);

const InitialView = ({ onPickImage, colors }: any) => (
  <Animated.View style={styles.fullWidth}>
    <Text style={[styles.heading, { color: colors.text }]}>Mulai Analisis</Text>
    <Text style={[styles.subtext, { color: colors.tabIconDefault }]}>
      Pilih sumber gambar untuk mendeteksi penyakit pada daun anggur Anda.
    </Text>
    <ActionButton
      icon="image"
      title="Unggah dari Galeri"
      subtitle="Pilih gambar dari perangkat Anda"
      onPress={() => onPickImage(false)}
      colors={colors}
    />
    <ActionButton
      icon="camera"
      title="Buka Kamera"
      subtitle="Ambil gambar secara langsung"
      onPress={() => onPickImage(true)}
      colors={colors}
    />
  </Animated.View>
);

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
      negative: { title: "Gambar Tidak Dikenali", icon: "x-circle", color: colors.warning, details: null },
      healthy: { title: "Daun Anggur Sehat", icon: "check-circle", color: colors.success, details: null },
      disease: {
        title: diseaseDetails[prediction.label as keyof typeof diseaseDetails]?.title || prediction.label,
        icon: "alert-circle", color: colors.error,
        details: diseaseDetails[prediction.label as keyof typeof diseaseDetails]
      },
    };
  
    const { title, icon, color, details } = statusConfig[isNegative ? "negative" : isHealthy ? "healthy" : "disease"];
  
    return (
      <Animated.View style={styles.fullWidth}>
        <Text style={[styles.heading, { color: colors.text, marginBottom: 16 }]}>Hasil Analisis</Text>
        <View style={[styles.imageResultContainer, { shadowColor: '#000' }]}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
  
        <View style={[styles.resultCard, { backgroundColor: colors.surface, shadowColor: '#000' }]}>
          <View style={styles.resultHeader}>
            <Feather name={icon} size={24} color={color} />
            <Text style={[styles.resultTitle, { color: color }]}>{title}</Text>
          </View>
          <View style={styles.confidenceWrapper}>
            <Text style={[styles.confidenceLabel, { color: colors.tabIconDefault }]}>Keyakinan Model</Text>
            <Text style={[styles.confidenceValue, { color: colors.text }]}>{confidencePercentage}%</Text>
          </View>
          <Progress.Bar progress={prediction.confidence} width={null} color={color} unfilledColor={colors.confidenceBar} borderWidth={0} height={6} style={styles.progressBar} />
        </View>
  
        {details && (
          <View style={styles.detailsContainer}>
            <AccordionSection title="Deskripsi Penyakit" content={details.description} colors={colors} />
            <AccordionSection title="Gejala Umum" content={details.symptoms} colors={colors} />
            <AccordionSection title="Rekomendasi Penanganan" content={details.recommendation} colors={colors} />
          </View>
        )}
  
        <TouchableOpacity onPress={onReset} style={[styles.actionButton, { backgroundColor: colors.surface, shadowColor: colors.text+'20' }]}>
          <Feather name="refresh-cw" size={24} color={colors.tint} style={styles.actionIcon} />
          <Text style={[styles.actionTitle, { color: colors.text, flex: 1 }]}>Analisis Gambar Lain</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }
  
  const LoadingOverlay = ({ visible, colors }: any) => {
    if (!visible) return null;
    return (
      <View style={[StyleSheet.absoluteFill, styles.overlayContainer, { backgroundColor: 'rgba(0,0,0,0.2)'}]}>
         <BlurView intensity={Platform.OS === "ios" ? 10 : 50} tint={colors.blurTint} style={StyleSheet.absoluteFill} />
         <Progress.CircleSnail color={colors.tint} size={60} thickness={5} />
         <Text style={[styles.loadingText, { color: colors.text }]}>Menganalisis...</Text>
      </View>
    )
  };
  
  const ErrorCard = ({ message, onRetry, colors }: any) => (
    <View style={[styles.errorCard, { backgroundColor: colors.error + "20" }]}>
      <Feather name="alert-triangle" size={20} color={colors.error} />
      <Text style={[styles.errorText, { color: colors.error }]}>{message}</Text>
      <TouchableOpacity onPress={onRetry}>
        <Text style={[styles.retryText, { color: colors.tint }]}>Coba Lagi</Text>
      </TouchableOpacity>
    </View>
  );

// --- MAIN SCREEN ---
export default function CheckScreen() {
    const [image, setImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
  
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
            Alert.alert("Error", "Gagal membuka gambar.");
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

        // --- PERUBAHAN: FAKE LOADING MINIMAL 3 DETIK ---
        const fakeDelay = new Promise(resolve => setTimeout(resolve, 3000));
        const apiCall = fetch(CLASSIFY_URL, { method: "POST", body: formData, headers: { "Content-Type": "multipart/form-data" } });

        try {
            const [response] = await Promise.all([apiCall, fakeDelay]);
            const data = await response.json();
            if (response.ok) {
                setPrediction(data);
            } else {
                throw new Error(data.error || "Gagal melakukan klasifikasi.");
            }
        } catch (e: any) {
            setError(e.message || "Tidak dapat terhubung ke server.");
        } finally {
            setLoading(false);
        }
    };
  
    const handleReset = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setImage(null); setPrediction(null); setError(null);
    };
  
    const handleRetry = () => image ? classifyImage(image) : handleReset();
    
    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.container}>
                    {!image && <InitialView onPickImage={pickImage} colors={colors} />}

                    {image && !loading && prediction && (
                        <ResultView image={image} prediction={prediction} onReset={handleReset} colors={colors} />
                    )}

                    {loading && image && (
                         <View style={styles.fullWidth}>
                            <View style={[styles.imageResultContainer, { shadowColor: '#000' }]}>
                                <Image source={{ uri: image }} style={styles.image} />
                                <LoadingOverlay visible={true} colors={colors} />
                            </View>
                            <Text style={[styles.heading, { color: colors.text, fontSize: 20 }]}>Menganalisis Gambar...</Text>
                         </View>
                    )}

                    {error && !loading && (
                         <View style={{width: '100%', marginTop: 20}}>
                            <ErrorCard message={error} onRetry={handleRetry} colors={colors} />
                         </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


// --- STYLES ---
const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    fullWidth: { width: '100%', alignItems: 'center' },
    scrollContainer: { flexGrow: 1, justifyContent: 'center', paddingVertical: 20 },
    container: { alignItems: 'center', paddingHorizontal: 20 },
    heading: { fontSize: 28, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
    subtext: { fontSize: 16, textAlign: 'center', marginBottom: 32, lineHeight: 24, maxWidth: '90%' },
    
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderRadius: 16,
      width: '100%',
      marginBottom: 16,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 5,
    },
    actionIcon: { marginRight: 16 },
    actionTitle: { fontSize: 16, fontWeight: '600' },
    actionSubtitle: { fontSize: 13, opacity: 0.7, marginTop: 2 },
  
    imageResultContainer: {
      width: width * 0.6,
      height: width * 0.6,
      borderRadius: 24,
      marginBottom: 24,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.15,
      shadowRadius: 15,
      elevation: 10,
      overflow: 'hidden',
    },
    image: { width: '100%', height: '100%', borderRadius: 24 },
  
    resultCard: {
      padding: 20,
      borderRadius: 20,
      width: '100%',
      marginBottom: 16,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 5,
    },
    resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: 'transparent' },
    resultTitle: { fontSize: 20, fontWeight: 'bold' },
    confidenceWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, marginBottom: 8, backgroundColor: "transparent" },
    confidenceLabel: { fontSize: 14, fontWeight: "500" },
    confidenceValue: { fontSize: 14, fontWeight: "bold" },
    progressBar: { borderRadius: 4, width: "100%" },
    
    detailsContainer: { width: '100%', gap: 12, marginBottom: 16 },
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
    
    overlayContainer: {
      position: 'absolute',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      height: '100%',
    },
    loadingText: { marginTop: 16, fontSize: 16, fontWeight: "600" },
    errorCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      borderRadius: 16,
      padding: 16,
      width: "100%",
    },
    errorText: { flex: 1, fontSize: 14, fontWeight: "600" },
    retryText: { fontSize: 14, fontWeight: "bold" },
  });