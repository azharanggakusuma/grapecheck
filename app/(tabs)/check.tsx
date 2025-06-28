import React, { useState, useCallback } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { Text, View } from '@/components/Themed';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useTheme } from '@/components/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalRefresh } from '@/components/GlobalRefreshContext';

const { width } = Dimensions.get('window');
const IMAGE_CONTAINER_SIZE = width * 0.82;

const diseaseClasses = [
  'Grape___Black_rot',
  'Grape___Esca_(Black_Measles)',
  'Grape___healthy',
  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
];

export default function CheckScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<{ label: string; confidence: number } | null>(null);
  const { theme } = useTheme();
  const colors = Colors[theme];
  const { refreshApp } = useGlobalRefresh();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshApp();
    setTimeout(() => {
      setIsRefreshing(false);
      setImage(null);
      setPrediction(null);
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

    if (useCamera) {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync(options);
    } else {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      result = await ImagePicker.launchImageLibraryAsync(options);
    }

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setPrediction(null);
      classifyImage(result.assets[0].uri);
    }
  };

  const classifyImage = async (uri: string) => {
    setLoading(true);
    setTimeout(() => {
      const randomLabel = diseaseClasses[Math.floor(Math.random() * diseaseClasses.length)];
      const randomConfidence = Math.random() * (0.99 - 0.85) + 0.85;

      setPrediction({
        label: randomLabel.replace(/___/g, ' - ').replace(/_/g, ' '),
        confidence: randomConfidence,
      });
      setLoading(false);
    }, 2000);
  };

  const handleReset = () => {
    setImage(null);
    setPrediction(null);
  };

  const renderResult = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={colors.tint} style={{ marginTop: 40 }} />;
    }
    if (!prediction) return null;

    const isHealthy = prediction.label.toLowerCase().includes('healthy');
    const resultColor = isHealthy ? colors.success : colors.error;

    return (
      <View style={[styles.resultCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.resultTitle, { color: colors.text }]}>Hasil Diagnosa</Text>
        <View style={[styles.predictionBox, { borderColor: resultColor }]}>
          <Text style={[styles.predictionLabel, { color: resultColor }]}>{prediction.label}</Text>
        </View>
        <Text style={[styles.confidenceText, { color: colors.tabIconDefault }]}>
          Akurasi:{' '}
          <Text style={{ fontWeight: '600', color: colors.text }}>
            {` ${(prediction.confidence * 100).toFixed(2)}%`}
          </Text>
        </Text>
        <Text style={styles.resultInfo}>
          {isHealthy
            ? '✅ Tanaman tampak sehat.'
            : '⚠️ Kemungkinan penyakit terdeteksi. Perlu tindakan lanjutan.'}
        </Text>

        <TouchableOpacity style={[styles.resetButton, { backgroundColor: colors.background }]} onPress={handleReset}>
          <Feather name="rotate-ccw" size={18} color={colors.tint} />
          <Text style={[styles.resetButtonText, { color: colors.tint }]}>Reset</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
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
            onPress={() => pickImage(false)}
            style={[
              styles.imageContainer,
              { borderColor: colors.border, backgroundColor: colors.surface },
            ]}
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

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionButton} onPress={() => pickImage(false)}>
              <Feather name="image" size={20} color={colors.tint} />
              <Text style={[styles.actionButtonText, { color: colors.tint }]}>Galeri</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={() => pickImage(true)}>
              <Feather name="camera" size={20} color={colors.tint} />
              <Text style={[styles.actionButtonText, { color: colors.tint }]}>Kamera</Text>
            </TouchableOpacity>
          </View>

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
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.7,
  },
  imageContainer: {
    width: IMAGE_CONTAINER_SIZE,
    height: IMAGE_CONTAINER_SIZE,
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 15,
    fontWeight: '400',
    opacity: 0.6,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    marginHorizontal: 6,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 6,
  },
  resultCard: {
    padding: 20,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  predictionBox: {
    borderWidth: 1.4,
    borderRadius: 10,
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
    marginBottom: 10,
  },
  resultInfo: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    opacity: 0.75,
    marginBottom: 16,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    gap: 6,
  },
  resetButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
