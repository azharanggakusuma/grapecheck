import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Text, View } from '@/components/Themed';
import * as ImagePicker from 'expo-image-picker';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useTheme } from '@/components/ThemeContext';

// Placeholder untuk kelas penyakit
const diseaseClasses = ['Grape___Black_rot', 'Grape___Esca_(Black_Measles)', 'Grape___healthy', 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)'];

export default function CheckScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);
  const { theme } = useTheme();
  const colors = Colors[theme];

  const pickImage = async (useCamera: boolean) => {
    let result;
    if (useCamera) {
      await ImagePicker.requestCameraPermissionsAsync();
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      await ImagePicker.requestMediaLibraryPermissionsAsync();
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setPrediction(null); // Reset prediksi saat gambar baru dipilih
      // Di sini Anda akan memanggil fungsi untuk klasifikasi
      classifyImage(result.assets[0].uri);
    }
  };

  // --- FUNGSI KLASIFIKASI (PLACEHOLDER) ---
  // Anda perlu mengimplementasikan logika ini menggunakan model MobileNetV2 Anda
  // (misalnya dengan TensorFlow.js Lite)
  const classifyImage = async (uri: string) => {
    setLoading(true);
    // Simulasi proses klasifikasi
    setTimeout(() => {
      const randomPrediction = diseaseClasses[Math.floor(Math.random() * diseaseClasses.length)];
      setPrediction(randomPrediction.replace(/_/g, ' '));
      setLoading(false);
    }, 2000); // Tunda 2 detik untuk simulasi
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Klasifikasi Penyakit Daun Anggur</Text>
        <Text style={[styles.subtitle, { color: Colors.light.tabIconDefault }]}>
          Unggah gambar daun anggur untuk dideteksi
        </Text>

        <View style={[styles.imageContainer, { borderColor: colors.tint }]}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Feather name="image" size={50} color={Colors.light.tabIconDefault} />
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.tint }]} onPress={() => pickImage(false)}>
            <Feather name="folder" size={20} color="#fff" />
            <Text style={styles.buttonText}>Pilih dari Galeri</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { backgroundColor: colors.tint }]} onPress={() => pickImage(true)}>
            <Feather name="camera" size={20} color="#fff" />
            <Text style={styles.buttonText}>Ambil Foto</Text>
          </TouchableOpacity>
        </View>

        {loading && <ActivityIndicator size="large" color={colors.tint} style={{ marginTop: 20 }} />}

        {prediction && !loading && (
          <View style={[styles.resultContainer, { backgroundColor: colors.tabBar }]}>
            <Text style={[styles.resultTitle, { color: colors.text }]}>Hasil Prediksi:</Text>
            <Text style={[styles.resultText, { color: colors.tint, fontWeight: 'bold' }]}>{prediction}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  imageContainer: {
    width: 300,
    height: 300,
    borderRadius: 15,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 30,
    padding: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  resultTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  resultText: {
    fontSize: 20,
  },
});