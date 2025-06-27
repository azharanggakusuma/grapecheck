import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useTheme } from '@/components/ThemeContext';
import { View } from '@/components/Themed';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const { theme } = useTheme();
  const colors = Colors[theme];
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.subtitle, { color: colors.text }]}>Klasifikasi Penyakit Daun Anggur</Text>
        <Text style={[styles.description, { color: Colors.light.tabIconDefault }]}>
          Deteksi penyakit pada daun anggur menggunakan model CNN MobileNetV2 untuk hasil yang cepat dan akurat.
        </Text>
      </View>

      <TouchableOpacity style={[styles.ctaButton, { backgroundColor: colors.tint }]} onPress={() => router.push('/(tabs)/check')}>
        <Feather name="camera" size={20} color="#fff" />
        <Text style={styles.ctaText}>Mulai Klasifikasi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
    lineHeight: 44,
  },
  description: {
    fontSize: 18,
    lineHeight: 26,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  ctaText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});