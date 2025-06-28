// app/(tabs)/check.tsx

import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useTheme } from '@/components/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalRefresh } from '@/components/GlobalRefreshContext';

// --- PENTING: GANTI DENGAN ALAMAT IP KOMPUTER ANDA ---
const BACKEND_URL = 'http://192.168.123.61:5000/classify';
// ----------------------------------------------------

const { width } = Dimensions.get('window');
const IMAGE_CONTAINER_SIZE = width * 0.85;

// Komponen Kartu Hasil yang Baru
const ResultCard = ({ prediction, onReset, colors }: any) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        bounciness: 5,
        speed: 12,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!prediction) return null;

  const isNegative = prediction.label.toLowerCase() === 'negative';
  if (isNegative) {
    return (
      <Animated.View style={[styles.resultCard, { backgroundColor: colors.surface, shadowColor: colors.text + '20', transform: [{ translateY: slideAnim }], opacity: fadeAnim }]}>
        <Feather name="alert-circle" size={40} color={colors.warning} />
        <Text style={[styles.resultTitle, { color: colors.warning, marginTop: 12 }]}>Gambar Tidak Sesuai</Text>
        <Text style={[styles.resultInfo, { color: colors.text }]}>
          Gambar yang Anda unggah sepertinya bukan daun anggur. Mohon gunakan gambar yang relevan untuk hasil terbaik.
        </Text>
        <TouchableOpacity style={[styles.resetButton, { backgroundColor: colors.tint }]} onPress={onReset}>
          <Feather name="rotate-ccw" size={18} color={'#FFFFFF'} />
          <Text style={[styles.resetButtonText, { color: '#FFFFFF' }]}>Coba Gambar Lain</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  const isHealthy = prediction.label.toLowerCase().includes('sehat');
  const resultColor = isHealthy ? colors.success : colors.error;
  const confidencePercentage = (prediction.confidence * 100).toFixed(2);

  return (
    <Animated.View style={[styles.resultCard, { backgroundColor: colors.surface, shadowColor: colors.text + '20', transform: [{ translateY: slideAnim }], opacity: fadeAnim }]}>
      <Feather name={isHealthy ? "shield-check" : "alert-triangle"} size={40} color={resultColor} />
      <Text style={[styles.resultTitle, { color: colors.text, marginTop: 12 }]}>Hasil Deteksi</Text>
      
      <View style={[styles.predictionBox, { borderColor: resultColor, backgroundColor: resultColor + '15' }]}>
        <Text style={[styles.predictionLabel, { color: resultColor }]}>{prediction.label}</Text>
      </View>

      <Text style={[styles.confidenceText, { color: colors.tabIconDefault, marginBottom: 5 }]}>Tingkat Keyakinan</Text>
      <View style={[styles.confidenceBarContainer, { backgroundColor: colors.confidenceBar }]}>
        <View style={[styles.confidenceBar, { width: `${confidencePercentage}%`, backgroundColor: resultColor }]} />
      </View>
      <Text style={[styles.confidencePercentage, { color: colors.text }]}>{confidencePercentage}%</Text>

      <Text style={[styles.resultInfo, { color: colors.text, marginTop: 15 }]}>
        {isHealthy
          ? 'Tanaman Anda dalam kondisi baik. Lanjutkan perawatan rutin untuk menjaganya tetap sehat.'
          : 'Terdeteksi potensi penyakit pada tanaman. Pelajari lebih lanjut untuk tindakan penanganan.'}
      </Text>

      <View style={styles.resultActions}>
        <TouchableOpacity style={[styles.resetButton, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={onReset}>
          <Feather name="rotate-ccw" size={18} color={colors.tint} />
          <Text style={[styles.resetButtonText, { color: colors.tint }]}>Ulangi</Text>
        </TouchableOpacity>
         <TouchableOpacity style={[styles.detailsButton, { backgroundColor: colors.tint }]} onPress={() => Alert.alert("Fitur Segera Hadir", "Halaman detail informasi penyakit akan segera tersedia.")}>
          <Text style={[styles.detailsButtonText, { color: '#FFFFFF' }]}>Lihat Detail</Text>
          <Feather name="arrow-right" size={18} color={'#FFFFFF'} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const ErrorCard = ({ message, onRetry }: { message: string, onRetry: () => void }) => {
  const { theme } = useTheme();
  const colors = Colors[theme];
  return (
    <View style={[styles.resultCard, { backgroundColor: colors.surface, shadowColor: colors.text + '20' }]}>
      <Feather name="wifi-off" size={40} color={colors.error} />
      <Text style={[styles.resultTitle, { color: colors.error, marginTop: 12 }]}>Gagal Terhubung</Text>
      <Text style={[styles.resultInfo, { color: colors.text }]}>{message}</Text>
      <TouchableOpacity style={[styles.resetButton, { backgroundColor: colors.tint }]} onPress={onRetry}>
        <Feather name="refresh-cw" size={18} color={'#FFFFFF'} />
        <Text style={[styles.resetButtonText, { color: '#FFFFFF' }]}>Coba Lagi</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function CheckScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<{ label: string; confidence: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const colors = Colors[theme];
  const { refreshApp } = useGlobalRefresh();
  const [isRefreshing, setIsRefreshing] = useState(false);

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

      if (permission.status !== 'granted') {
          Alert.alert('Izin Diperlukan', `Anda perlu memberikan izin ${useCamera ? 'kamera' : 'galeri'}.`);
          return;
      }
      
      result = useCamera
        ? await ImagePicker.launchCameraAsync(options)
        : await ImagePicker.launchImageLibraryAsync(options);
    
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
      const response = await fetch(BACKEND_URL, {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const data = await response.json();
      if (response.ok) {
        setPrediction(data);
      } else {
        throw new Error(data.error || 'Gagal melakukan klasifikasi.');
      }
    } catch (e: any) {
      setError(e.message || 'Tidak dapat terhubung ke server. Pastikan Anda terhubung ke jaringan yang sama.');
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
  
  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.tint} />
          <Text style={[styles.loadingText, { color: colors.tabIconDefault }]}>Menganalisis...</Text>
        </View>
      );
    }
    if (error) {
      return <ErrorCard message={error} onRetry={() => image ? classifyImage(image) : handleReset()} />;
    }
    if (prediction) {
      return <ResultCard prediction={prediction} onReset={handleReset} colors={colors}/>;
    }
    return null;
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={colors.tint}
            colors={[colors.tint]}
          />
        }
      >
        <View style={styles.container}>
          <Text style={[styles.heading, { color: colors.text }]}>Klasifikasi Daun Anggur</Text>
          <Text style={[styles.subtext, { color: colors.tabIconDefault }]}>
            Pilih gambar daun anggur untuk dideteksi menggunakan AI.
          </Text>

          <TouchableOpacity
            disabled={loading}
            onPress={() => pickImage(false)}
            style={[ styles.imageContainer, { borderColor: colors.border, backgroundColor: colors.surface } ]}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={[styles.placeholderContainer, { backgroundColor: 'transparent' }]}>
                <Feather name="image" size={48} color={colors.tabIconDefault} />
                <Text style={[styles.placeholderText, { color: colors.tabIconDefault }]}>
                  Pilih Gambar dari Galeri
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {!image && (
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]} onPress={() => pickImage(true)}>
                  <Feather name="camera" size={20} color={colors.tint} />
                  <Text style={[styles.actionButtonText, { color: colors.tint }]}>Buka Kamera</Text>
                </TouchableOpacity>
              </View>
          )}

          {renderContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingBottom: 40 },
  container: { alignItems: 'center', paddingHorizontal: 24, paddingTop: 32 },
  heading: { fontSize: 26, fontWeight: '800', marginBottom: 8, textAlign: 'center' },
  subtext: { fontSize: 15, textAlign: 'center', marginBottom: 28, color: '#6B7280', lineHeight: 22 },
  imageContainer: {
    width: IMAGE_CONTAINER_SIZE,
    height: IMAGE_CONTAINER_SIZE,
    borderRadius: 24,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholderContainer: { alignItems: 'center' },
  placeholderText: { marginTop: 12, fontSize: 16, fontWeight: '500', opacity: 0.7, textAlign: 'center' },
  buttonRow: { flexDirection: 'row', justifyContent: 'center', width: '100%', gap: 12, marginBottom: 28 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    gap: 10,
  },
  actionButtonText: { fontSize: 15, fontWeight: '600' },
  loadingContainer: { marginTop: 40, alignItems: 'center' },
  loadingText: { marginTop: 10, fontSize: 14 },
  resultCard: {
    padding: 22,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
    elevation: 5,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  resultTitle: { fontSize: 22, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  predictionBox: {
    borderWidth: 2,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginBottom: 16,
    width: '100%',
  },
  predictionLabel: { fontSize: 20, fontWeight: '800', textAlign: 'center' },
  confidenceText: { fontSize: 14, marginBottom: 8, textAlign: 'center', fontWeight: '500' },
  confidenceBarContainer: { width: '80%', height: 8, borderRadius: 4, overflow: 'hidden' },
  confidenceBar: { height: '100%', borderRadius: 4 },
  confidencePercentage: { fontSize: 13, marginTop: 6, fontWeight: '600' },
  resultInfo: { fontSize: 15, textAlign: 'center', lineHeight: 22, opacity: 0.8, marginBottom: 24 },
  resultActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 8,
  },
  resetButtonText: { fontSize: 15, fontWeight: '600' },
  detailsButton: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    gap: 8,
  },
  detailsButtonText: { fontSize: 15, fontWeight: '700' },
});