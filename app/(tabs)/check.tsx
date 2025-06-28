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

// --- PENTING: GANTI DENGAN ALAMAT IP KOMPUTER ANDA ---
const BACKEND_URL = 'http://192.168.123.61:5000/classify';
// ----------------------------------------------------

const { width } = Dimensions.get('window');
const IMAGE_SIZE = width * 0.8;

// Komponen Overlay Loading
const LoadingOverlay = ({ visible, colors }: { visible: boolean; colors: any }) => {
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.overlayContainer, { opacity: opacityAnim }]}>
      <BlurView intensity={Platform.OS === 'ios' ? 20 : 80} tint={colors.blurTint} style={StyleSheet.absoluteFill} />
      <Progress.CircleSnail color={colors.tint} size={60} thickness={4} />
      <Text style={[styles.loadingText, { color: colors.text }]}>Menganalisis...</Text>
    </Animated.View>
  );
};

// Kartu Hasil Klasifikasi
const ResultCard = ({ prediction, onReset, colors }: any) => {
  const slideAnim = useRef(new Animated.Value(50)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 40, friction: 7 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  if (!prediction) return null;

  const isNegative = prediction.label.toLowerCase() === 'negative';
  const isHealthy = !isNegative && prediction.label.toLowerCase().includes('sehat');
  const confidencePercentage = (prediction.confidence * 100).toFixed(1);

  const statusConfig = {
    negative: { title: 'Gambar Tidak Sesuai', desc: 'Pastikan gambar yang Anda unggah adalah daun anggur.', icon: 'x-circle', color: colors.warning },
    healthy: { title: 'Daun Anggur Sehat', desc: 'Tidak ada indikasi penyakit yang terdeteksi. Tetap jaga kesehatan tanaman Anda.', icon: 'check-circle', color: colors.success },
    disease: { title: prediction.label, desc: 'Penyakit terdeteksi. Lihat detail untuk informasi dan penanganan lebih lanjut.', icon: 'alert-circle', color: colors.error },
  };

  const currentStatus = isNegative ? 'negative' : (isHealthy ? 'healthy' : 'disease');
  const { title, desc, icon, color } = statusConfig[currentStatus];

  return (
    <Animated.View style={[styles.resultCard, { backgroundColor: colors.surface, opacity: opacityAnim, transform: [{ translateY: slideAnim }] }]}>
      <View style={[styles.resultHeader, { backgroundColor: 'transparent' }]}>
        <Feather name={icon} size={24} color={color} />
        <Text style={[styles.resultTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <View style={[styles.confidenceWrapper, { backgroundColor: 'transparent' }]}>
        <Text style={[styles.confidenceLabel, { color: colors.tabIconDefault }]}>Tingkat Keyakinan</Text>
        <Text style={[styles.confidenceValue, { color: color }]}>{confidencePercentage}%</Text>
      </View>
      <Progress.Bar progress={prediction.confidence} width={null} color={color} unfilledColor={colors.confidenceBar} borderWidth={0} height={8} style={styles.progressBar} />
      <Text style={[styles.resultInfo, { color: colors.tabIconDefault }]}>{desc}</Text>
      
      <View style={[styles.resultActions, { backgroundColor: 'transparent' }]}>
        {!isNegative && (
          <TouchableOpacity style={[styles.detailsButton, { backgroundColor: colors.tint }]} onPress={() => Alert.alert("Segera Hadir", "Fitur detail penanganan penyakit akan segera tersedia.")}>
            <Text style={styles.detailsButtonText}>Lihat Detail</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={[styles.resetButton, { backgroundColor: colors.border }]} onPress={onReset}>
          <Text style={[styles.resetButtonText, { color: colors.text }]}>Ulangi Analisis</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};


// Kartu Error
const ErrorCard = ({ message, onRetry, colors }: { message: string; onRetry: () => void, colors: any }) => {
  return (
    <View style={[styles.errorCard, { backgroundColor: colors.error + '20' }]}>
      <Feather name="alert-triangle" size={20} color={colors.error} />
      <Text style={[styles.errorText, { color: colors.error }]}>{message}</Text>
      <TouchableOpacity onPress={onRetry}>
        <Text style={[styles.retryText, { color: colors.tint }]}>Coba Lagi</Text>
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

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshApp();
    setTimeout(() => {
      setIsRefreshing(false);
      handleReset();
    }, 1000);
  }, [refreshApp]);

  const pickImage = async (useCamera: boolean) => {
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
        Alert.alert('Izin Diperlukan', `Anda perlu memberikan izin untuk mengakses ${useCamera ? 'kamera' : 'galeri'}.`);
        return;
      }
      
      const result = useCamera
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
      setError(e.message || 'Tidak dapat terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setPrediction(null);
    setError(null);
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={colors.tint} />}
      >
        <View style={styles.container}>
          <Text style={[styles.heading, { color: colors.text }]}>Klasifikasi Daun</Text>
          <Text style={[styles.subtext, { color: colors.tabIconDefault }]}>
            Unggah gambar daun anggur untuk mendeteksi kesehatannya.
          </Text>

          {prediction ? (
            <ResultCard prediction={prediction} onReset={handleReset} colors={colors} />
          ) : (
            <View style={{ width: '100%', alignItems: 'center' }}>
              <TouchableOpacity
                disabled={loading}
                onPress={() => pickImage(false)}
                style={[styles.imageContainer, { borderColor: colors.border, backgroundColor: colors.surface }]}
              >
                {image ? (
                  <Image source={{ uri: image }} style={styles.image} />
                ) : (
                  <View style={[styles.placeholderContainer, { backgroundColor: 'transparent' }]}>
                    <Feather name="image" size={40} color={colors.tabIconDefault} />
                    <Text style={[styles.placeholderText, { color: colors.tabIconDefault }]}>Pilih Gambar dari Galeri</Text>
                  </View>
                )}
                <LoadingOverlay visible={loading} colors={colors} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.cameraButton, { backgroundColor: colors.tint }]}
                onPress={() => pickImage(true)}
                disabled={loading}
              >
                <Feather name="camera" size={20} color="#FFFFFF" />
                <Text style={styles.cameraButtonText}>Gunakan Kamera</Text>
              </TouchableOpacity>

              {error && <ErrorCard message={error} onRetry={() => image ? classifyImage(image) : handleReset()} colors={colors} />}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContainer: { flexGrow: 1, justifyContent: 'center' },
  container: { alignItems: 'center', padding: 20 },
  heading: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  subtext: { fontSize: 16, textAlign: 'center', marginBottom: 30, lineHeight: 24, maxWidth: '90%' },
  imageContainer: { width: IMAGE_SIZE, height: IMAGE_SIZE, borderRadius: 24, borderWidth: 2, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', overflow: 'hidden', marginBottom: 20 },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholderContainer: { alignItems: 'center', gap: 12 },
  placeholderText: { fontSize: 16, fontWeight: '500' },
  cameraButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, paddingHorizontal: 24, borderRadius: 18, width: '100%', gap: 10 },
  cameraButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  overlayContainer: { justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, fontSize: 16, fontWeight: '600' },
  resultCard: { padding: 20, borderRadius: 24, width: '100%', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  resultHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  resultTitle: { fontSize: 22, fontWeight: 'bold' },
  confidenceWrapper: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8, backgroundColor: 'transparent' },
  confidenceLabel: { fontSize: 14, fontWeight: '500' },
  confidenceValue: { fontSize: 20, fontWeight: 'bold' },
  progressBar: { borderRadius: 4, marginBottom: 16 },
  resultInfo: { fontSize: 15, lineHeight: 22, marginBottom: 24 },
  resultActions: { gap: 12 },
  detailsButton: { alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16 },
  detailsButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  resetButton: { alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16 },
  resetButtonText: { fontSize: 16, fontWeight: 'bold' },
  errorCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 12, padding: 16, marginTop: 20, width: '100%' },
  errorText: { flex: 1, fontSize: 14, fontWeight: '600' },
  retryText: { fontSize: 14, fontWeight: 'bold' },
});