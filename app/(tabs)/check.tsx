// app/(tabs)/check.tsx

import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { Text, View } from '@/components/Themed';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useTheme } from '@/components/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context'; // 1. Import SafeAreaView

const { width } = Dimensions.get('window');
const IMAGE_CONTAINER_SIZE = width * 0.8;

const diseaseClasses = ['Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___healthy', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)'];

export default function CheckScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<{label: string; confidence: number} | null>(null);
  const { theme } = useTheme();
  const colors = Colors[theme];

  const pickImage = async (useCamera: boolean) => {
    // ... (fungsi pickImage tetap sama)
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
    // ... (fungsi classifyImage tetap sama)
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

  const renderResult = () => {
    // ... (fungsi renderResult tetap sama)
    if (loading) {
      return <ActivityIndicator size="large" color={colors.tint} style={{ marginTop: 40 }} />;
    }
    if (!prediction) return null;
    const isHealthy = prediction.label.toLowerCase().includes('healthy');
    const resultColor = isHealthy ? colors.success : '#E74C3C';
    return (
      <View style={[styles.resultCard, { backgroundColor: colors.surface }]}>
        <Text style={[styles.resultTitle, { color: colors.text }]}>Hasil Klasifikasi</Text>
        <View style={[styles.predictionBox, { borderColor: resultColor }]}>
            <Text style={[styles.predictionLabel, { color: resultColor }]}>{prediction.label}</Text>
        </View>
        <Text style={[styles.confidenceText, { color: colors.tabIconDefault }]}>
            Tingkat Kepercayaan: 
            <Text style={{ fontWeight: 'bold', color: colors.text }}>
                {` ${(prediction.confidence * 100).toFixed(2)}%`}
            </Text>
        </Text>
        {isHealthy ? (
            <Text style={styles.resultInfo}>Daun anggur Anda dalam kondisi baik.</Text>
        ) : (
            <Text style={styles.resultInfo}>Terdeteksi potensi penyakit. Segera lakukan penanganan lebih lanjut.</Text>
        )}
      </View>
    );
  };

  return (
    // 2. Bungkus semua konten dengan SafeAreaView
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 3. Hapus backgroundColor dari View ini */}
        <View style={styles.container}>

          <TouchableOpacity onPress={() => pickImage(false)} style={[styles.imageContainer, { borderColor: colors.primaryLight, backgroundColor: colors.surface }]}>
            {image ? (
              <Image source={{ uri: image }} style={styles.image} />
            ) : (
              <View style={{ alignItems: 'center' }}>
                <Feather name="upload-cloud" size={40} color={colors.tabIconDefault} />
                <Text style={[styles.placeholderText, { color: colors.tabIconDefault }]}>Ketuk untuk mengunggah gambar</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.actionButton} onPress={() => pickImage(false)}>
                  <Feather name="folder-plus" size={24} color={colors.tint} />
                  <Text style={[styles.actionButtonText, {color: colors.tint}]}>Galeri</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => pickImage(true)}>
                  <Feather name="camera" size={24} color={colors.tint} />
                  <Text style={[styles.actionButtonText, {color: colors.tint}]}>Kamera</Text>
              </TouchableOpacity>
          </View>

          {renderResult()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // 4. Tambahkan style untuk SafeAreaView
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    // Hapus flex: 1 dari sini agar tidak konflik
    alignItems: 'center',
    padding: 20,
  },
  imageContainer: {
    width: IMAGE_CONTAINER_SIZE,
    height: IMAGE_CONTAINER_SIZE,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
    marginBottom: 20,
  },
  actionButton: {
      alignItems: 'center',
      padding: 10,
  },
  actionButtonText: {
      marginTop: 5,
      fontWeight: '600',
  },
  resultCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    width: '100%',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
  },
  predictionBox: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    width: '100%',
  },
  predictionLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confidenceText: {
      fontSize: 16,
      marginBottom: 15,
  },
  resultInfo: {
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 20,
      opacity: 0.7,
  }
});