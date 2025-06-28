// app/(tabs)/check.tsx

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  RefreshControl,
  Alert,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useTheme } from '@/components/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalRefresh } from '@/components/GlobalRefreshContext';
import { BlurView } from 'expo-blur';
import * as Progress from 'react-native-progress';
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient

// --- PENTING: GANTI DENGAN ALAMAT IP KOMPUTER ANDA ---
const BACKEND_URL = 'http://192.168.123.61:5000/classify';
// ----------------------------------------------------

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.85;

const AnimatedFeather = Animated.createAnimatedComponent(Feather);

// Komponen Overlay dengan efek Glassmorphism
const ImageOverlay = ({ loading, colors }: { loading: boolean; colors: any }) => {
  if (!loading) return null;
  return (
    <View style={styles.overlayContainer}>
      <BlurView intensity={Platform.OS === 'ios' ? 20 : 80} tint={colors.blurTint} style={StyleSheet.absoluteFill} />
      <Progress.Circle
        size={80}
        indeterminate
        color={colors.tint}
        borderWidth={4}
      />
      <Text style={[styles.loadingText, { color: colors.text }]}>Menganalisis Gambar...</Text>
    </View>
  );
};

const ResultCard = ({ prediction, onReset, colors }: any) => {
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, bounciness: 10 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  if (!prediction) return null;

  const isNegative = prediction.label.toLowerCase() === 'negative';
  const isHealthy = !isNegative && prediction.label.toLowerCase().includes('sehat');
  const confidencePercentage = prediction.confidence * 100;
  
  let status, title, description, icon, color, progressColor;

  if (isNegative) {
    status = 'Ditolak';
    title = 'Gambar Tidak Sesuai';
    description = 'Objek tidak terdeteksi sebagai daun anggur. Mohon unggah gambar yang benar.';
    icon = 'help-circle';
    color = colors.warning;
    progressColor = colors.warning;
  } else if (isHealthy) {
    status = 'Sehat';
    title = 'Tanaman Terdeteksi Sehat';
    description = 'Kondisi tanaman Anda sangat baik. Tetap jaga perawatannya!';
    icon = 'shield-check';
    color = colors.success;
    progressColor = colors.success;
  } else {
    status = 'Terdeteksi Penyakit';
    title = prediction.label;
    description = 'Tanaman Anda terindikasi memiliki penyakit. Segera periksa detail untuk penanganan.';
    icon = 'alert-triangle';
    color = colors.error;
    progressColor = colors.error;
  }

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
      <LinearGradient 
        colors={[colors.cardGradientStart, colors.cardGradientEnd]}
        style={[styles.resultCard, { borderColor: colors.border }]}
      >
        <View style={[styles.statusBadge, { backgroundColor: color + '20' }]}>
          <Feather name={icon} size={16} color={color} />
          <Text style={[styles.statusText, { color }]}>{status}</Text>
        </View>
        <Text style={[styles.resultTitle, { color: colors.text }]}>{title}</Text>
        <Progress.Circle
          size={100}
          progress={prediction.confidence}
          showsText
          formatText={() => `${confidencePercentage.toFixed(1)}%`}
          color={progressColor}
          unfilledColor={colors.confidenceBar}
          borderColor={'transparent'} // Background gradient will show through
          thickness={8}
          strokeCap="round"
          textStyle={{ color: colors.text, fontWeight: '700', fontSize: 18 }}
        />
        <Text style={[styles.resultInfo, { color: colors.tabIconDefault }]}>{description}</Text>
        <View style={styles.resultActions}>
          <TouchableOpacity style={[styles.resetButton, { borderColor: colors.border }]} onPress={onReset}>
            <Text style={[styles.resetButtonText, { color: colors.text }]}>Analisis Lain</Text>
          </TouchableOpacity>
          {!isNegative && (
            <TouchableOpacity style={[styles.detailsButton, { backgroundColor: colors.tint }]} onPress={() => Alert.alert("Segera Hadir", "Fitur detail penanganan penyakit akan segera tersedia.")}>
              <Text style={[styles.detailsButtonText]}>Lihat Penanganan</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const ErrorCard = ({ message, onRetry }: { message: string; onRetry: () => void }) => {
    const { theme } = useTheme();
    const colors = Colors[theme];
    return (
        <View style={[styles.errorCard, { backgroundColor: colors.error + '20', borderColor: colors.error }]}>
            <Feather name="alert-circle" size={24} color={colors.error} />
            <Text style={[styles.errorText, { color: colors.error }]}>{message}</Text>
            <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.error }]} onPress={onRetry}>
                <Text style={styles.retryButtonText}>Coba Lagi</Text>
            </TouchableOpacity>
        </View>
    );
};

export default function CheckScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<{ label: string; confidence: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const colors = Colors[theme];
  const { refreshApp } = useGlobalRefresh();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const iconAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const sequence = Animated.sequence([
        Animated.timing(iconAnim, { toValue: 1.15, duration: 1500, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(iconAnim, { toValue: 1, duration: 1500, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
    ]);
    Animated.loop(sequence).start();
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshApp();
    setTimeout(() => {
      setIsRefreshing(false);
      handleReset();
    }, 1000);
  }, [refreshApp]);

  const pickImage = async (useCamera: boolean) => {
    let result;
    const options: ImagePicker.ImagePickerOptions = { mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1, 1], quality: 0.8, };

    try {
      const permission = useCamera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permission.status !== 'granted') {
          Alert.alert('Izin Diperlukan', `Anda perlu memberikan izin ${useCamera ? 'kamera' : 'galeri'}.`);
          return;
      }
      result = useCamera ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
    
      if (!result.canceled) {
        handleReset();
        setImage(result.assets[0].uri);
        classifyImage(result.assets[0].uri);
      }
    } catch (e) {
        Alert.alert('Error', 'Gagal membuka gambar.');
        console.error(e);
    }
  };

  const classifyImage = async (uri: string) => {
    setLoading(true);
    setError(null);
    const formData = new FormData();
    const filename = uri.split('/').pop()!;
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : `image`;
    formData.append('file', { uri, name: filename, type } as any);

    try {
      const response = await fetch(BACKEND_URL, { method: 'POST', body: formData, headers: { 'Content-Type': 'multipart/form-data' } });
      const data = await response.json();
      if (response.ok) setPrediction(data);
      else throw new Error(data.error || 'Gagal melakukan klasifikasi.');
    } catch (e: any) {
      setError(e.message || 'Tidak dapat terhubung ke server. Periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPrediction(null);
    setError(null);
    setLoading(false);
  };
  
  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} refreshControl={ <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colors.tint} colors={[colors.tint]} /> }>
        <View style={styles.container}>
          <Text style={[styles.heading, { color: colors.text }]}>Deteksi Cerdas</Text>
          <Text style={[styles.subtext, { color: colors.tabIconDefault }]}>Analisis kesehatan daun anggur Anda dengan sekali sentuh.</Text>

          <View style={[styles.imageWrapper, { shadowColor: colors.text + '25' }]}>
            <TouchableOpacity disabled={loading} onPress={() => pickImage(false)} style={[ styles.imageContainer, { borderColor: colors.border, backgroundColor: colors.surface } ]}>
              {image ? (
                <Image source={{ uri: image }} style={styles.image} />
              ) : (
                <View style={styles.placeholderContainer}>
                    <AnimatedFeather name="upload-cloud" size={48} color={colors.tabIconDefault} style={{transform: [{ scale: iconAnim }]}}/>
                    <Text style={[styles.placeholderText, { color: colors.tabIconDefault }]}>Ketuk untuk Memilih Gambar</Text>
                </View>
              )}
              <ImageOverlay loading={loading} colors={colors}/>
            </TouchableOpacity>
          </View>
          
          {!image && !loading && (
              <TouchableOpacity style={[styles.cameraButton, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => pickImage(true)}>
                <Feather name="camera" size={20} color={colors.text} />
                <Text style={[styles.actionButtonText, { color: colors.text }]}>Gunakan Kamera</Text>
              </TouchableOpacity>
          )}

          <View style={{marginTop: 20, width: '100%'}}>
            {error && !loading && <ErrorCard message={error} onRetry={() => image ? classifyImage(image) : handleReset()} />}
            {prediction && !loading && <ResultCard prediction={prediction} onReset={handleReset} colors={colors}/>}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    scrollContainer: { flexGrow: 1, paddingBottom: 40 },
    container: { alignItems: 'center', paddingHorizontal: 20, paddingTop: 32 },
    heading: { fontSize: 28, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
    subtext: { fontSize: 16, textAlign: 'center', marginBottom: 32, color: '#6B7280', lineHeight: 24, maxWidth: '90%'},
    imageWrapper: {
        borderRadius: 28,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 10,
    },
    imageContainer: {
        width: IMAGE_SIZE,
        height: IMAGE_SIZE,
        borderRadius: 28,
        borderWidth: 2,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    image: { width: '100%', height: '100%', resizeMode: 'cover' },
    placeholderContainer: { alignItems: 'center', backgroundColor: 'transparent' },
    placeholderText: { marginTop: 16, fontSize: 16, fontWeight: '600', opacity: 0.7 },
    overlayContainer: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: 'transparent' },
    loadingText: { marginTop: 16, fontSize: 16, fontWeight: '600' },
    cameraButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        borderWidth: 1,
        marginTop: 20,
        gap: 10,
    },
    actionButtonText: { fontSize: 16, fontWeight: '700' },
    resultCard: {
        padding: 20,
        borderRadius: 24,
        width: '100%',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        borderWidth: 1,
        minHeight: 300,
        backgroundColor: 'transparent', // Dibuat transparan agar gradien terlihat
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginBottom: 16,
        gap: 6,
        backgroundColor: 'transparent', // Latar belakang sudah diatur oleh parent
    },
    statusText: {
        fontSize: 13,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    resultTitle: { fontSize: 24, fontWeight: '800', marginBottom: 20, textAlign: 'center' },
    resultInfo: { fontSize: 15, textAlign: 'center', lineHeight: 22, color: '#6B7280', marginTop: 20, maxWidth: '90%'},
    resultActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 'auto',
        paddingTop: 20,
        gap: 12,
        backgroundColor: 'transparent'
    },
    resetButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 16,
        borderWidth: 1.5,
    },
    resetButtonText: { fontSize: 16, fontWeight: '700' },
    detailsButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 16,
    },
    detailsButtonText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
    // Gaya untuk ErrorCard
    errorCard: {
        borderRadius: 16,
        borderWidth: 1.5,
        padding: 20,
        alignItems: 'center',
        gap: 12
    },
    errorText: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center'
    },
    retryButton: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 12
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '700'
    }
});