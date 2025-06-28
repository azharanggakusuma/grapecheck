import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Alert,
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
const IMAGE_CONTAINER_SIZE = width * 0.82;

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
        if (useCamera) {
          const perm = await ImagePicker.requestCameraPermissionsAsync();
          if (perm.status !== 'granted') {
              Alert.alert('Izin Diperlukan', 'Anda perlu memberikan izin kamera.');
              return;
          }
          result = await ImagePicker.launchCameraAsync(options);
        } else {
          const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
           if (perm.status !== 'granted') {
              Alert.alert('Izin Diperlukan', 'Anda perlu memberikan izin galeri.');
              return;
          }
          result = await ImagePicker.launchImageLibraryAsync(options);
        }
    
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
        throw new Error(data.error || 'Gagal klasifikasi.');
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
    setLoading(false);
  };

  // --- FUNGSI RENDER UTAMA ---
  const renderResult = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={colors.tint} style={{ marginTop: 40 }} />;
    }
    if (error) {
      return renderErrorCard(error);
    }
    if (!prediction) return null;

    // --- LOGIKA BARU: TANGANI JIKA PREDIKSI ADALAH 'NEGATIVE' ---
    if (prediction.label.toLowerCase() === 'negative') {
      return renderRejectionCard();
    }

    // Jika bukan 'Negative', tampilkan hasil diagnosa seperti biasa
    return renderDiagnosisCard(prediction);
  };

  // --- KARTU UNTUK GAMBAR DITOLAK ---
  const renderRejectionCard = () => (
    <View style={[styles.resultCard, { backgroundColor: colors.surface, shadowColor: colors.text + '20' }]}>
        <Feather name="x-circle" size={40} color={colors.error} />
        <Text style={[styles.resultTitle, { color: colors.error, marginTop: 12 }]}>Gambar Ditolak</Text>
        <Text style={[styles.resultInfo, { color: colors.text }]}>
          Gambar yang diunggah sepertinya bukan daun anggur. Silakan coba lagi dengan gambar yang sesuai.
        </Text>
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: colors.tint }]}
          onPress={handleReset}
        >
          <Feather name="rotate-ccw" size={18} color={'#FFFFFF'} />
          <Text style={[styles.resetButtonText, { color: '#FFFFFF' }]}>Coba Gambar Lain</Text>
        </TouchableOpacity>
    </View>
  );
  
  // --- KARTU UNTUK HASIL DIAGNOSA ---
  const renderDiagnosisCard = (pred: { label: string; confidence: number }) => {
    const isHealthy = pred.label.toLowerCase().includes('sehat');
    const resultColor = isHealthy ? colors.success : colors.error;

    return (
      <View style={[styles.resultCard, { backgroundColor: colors.surface, shadowColor: colors.text + '20' }]}>
        <Text style={[styles.resultTitle, { color: colors.text }]}>Hasil Diagnosa</Text>
        <View style={[styles.predictionBox, { borderColor: resultColor, backgroundColor: colors.background }]}>
          <Text style={[styles.predictionLabel, { color: resultColor }]}>{pred.label}</Text>
        </View>
        <Text style={[styles.confidenceText, { color: colors.tabIconDefault }]}>
          Akurasi:{' '}
          <Text style={{ fontWeight: '600', color: colors.text }}>
            {` ${(pred.confidence * 100).toFixed(2)}%`}
          </Text>
        </Text>
        <Text style={[styles.resultInfo, { color: colors.text }]}>
          {isHealthy
            ? '✅ Tanaman tampak sehat. Tetap lakukan pemantauan rutin.'
            : '⚠️ Terdeteksi kemungkinan penyakit. Cek halaman informasi untuk penanganan.'}
        </Text>
        <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: colors.background, borderColor: colors.border }]}
          onPress={handleReset}
        >
          <Feather name="rotate-ccw" size={18} color={colors.tint} />
          <Text style={[styles.resetButtonText, { color: colors.tint }]}>Reset</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  // --- KARTU UNTUK ERROR ---
  const renderErrorCard = (errorMessage: string) => (
    <View style={[styles.resultCard, { backgroundColor: colors.surface, shadowColor: colors.text + '20' }]}>
      <Feather name="alert-triangle" size={40} color={colors.error} />
      <Text style={[styles.resultTitle, { color: colors.error, marginTop: 12 }]}>Terjadi Kesalahan</Text>
      <Text style={[styles.resultInfo, { color: colors.text }]}>{errorMessage}</Text>
      <TouchableOpacity
          style={[styles.resetButton, { backgroundColor: colors.tint }]}
          onPress={handleReset}
      >
          <Feather name="rotate-ccw" size={18} color={'#FFFFFF'} />
          <Text style={[styles.resetButtonText, { color: '#FFFFFF' }]}>Coba Lagi</Text>
      </TouchableOpacity>
    </View>
  );


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
          <Text style={[styles.heading, { color: colors.text }]}>Deteksi Penyakit Daun Anggur</Text>
          <Text style={[styles.subtext, { color: colors.tabIconDefault }]}>
            Unggah gambar daun untuk mendeteksi kemungkinan penyakit.
          </Text>

          <TouchableOpacity
            onPress={() => !loading && pickImage(false)} // Nonaktifkan saat loading
            style={[ styles.imageContainer, { borderColor: colors.border, backgroundColor: colors.surface } ]}
          >
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Feather name="upload-cloud" size={36} color={colors.tabIconDefault} />
                <Text style={[styles.placeholderText, { color: colors.tabIconDefault }]}>
                  Ketuk untuk unggah gambar
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {!prediction && !loading && !error && (
              <View style={styles.buttonRow}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]} onPress={() => pickImage(false)}>
                  <Feather name="image" size={20} color={colors.tint} />
                  <Text style={[styles.actionButtonText, { color: colors.tint }]}>Galeri</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.surface }]} onPress={() => pickImage(true)}>
                  <Feather name="camera" size={20} color={colors.tint} />
                  <Text style={[styles.actionButtonText, { color: colors.tint }]}>Kamera</Text>
                </TouchableOpacity>
              </View>
          )}

          {renderResult()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    width: IMAGE_CONTAINER_SIZE,
    height: IMAGE_CONTAINER_SIZE,
    borderRadius: 20,
    borderWidth: 1.4,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    opacity: 0.6,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
    marginBottom: 28,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    gap: 10,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  resultCard: {
    padding: 22,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    marginTop: 20,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 18,
    textAlign: 'center',
  },
  predictionBox: {
    borderWidth: 1.4,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 14,
    width: '100%',
  },
  predictionLabel: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  confidenceText: {
    fontSize: 15,
    marginBottom: 8,
    textAlign: 'center',
  },
  resultInfo: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.75,
    marginBottom: 20,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});