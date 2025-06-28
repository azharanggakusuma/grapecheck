// constants/Colors.ts

const primary = '#00AA13'; // Warna hijau utama, tetap konsisten
const primaryLight = '#4ADE80'; // Hijau muda yang vibrant
const text = '#111827'; // Abu-abu sangat gelap untuk teks (kontras tinggi)
const textSecondary = '#6B7280'; // Abu-abu untuk teks sekunder
const backgroundLight = '#F9FAFB'; // Abu-abu sangat terang untuk background
const backgroundDark = '#111827'; // Abu-abu sangat gelap untuk background mode gelap
const surfaceLight = '#FFFFFF'; // Putih untuk permukaan kartu/kontainer
const surfaceDark = '#1F2937'; // Abu-abu gelap untuk permukaan di mode gelap
const success = '#10B981'; // Hijau untuk notifikasi sukses
const warning = '#F59E0B'; // Kuning untuk peringatan
const error = '#EF4444'; // Merah untuk kesalahan
const border = '#E5E7EB'; // Warna border terang
const borderDark = '#374151'; // Warna border gelap

export default {
  light: {
    text: text,
    background: backgroundLight,
    tint: primary,
    primaryLight: primaryLight,
    surface: surfaceLight,
    success: success,
    warning: warning,
    error: error,
    border: border,
    tabBar: surfaceLight,
    tabIconDefault: textSecondary,
    tabIconSelected: primary,
    confidenceBar: '#D1FAE5', // Varian terang dari warna sukses
    blurTint: 'rgba(249, 250, 251, 0.85)',
  },
  dark: {
    text: '#F9FAFB', // Putih keabuan untuk teks mode gelap
    background: backgroundDark,
    tint: primaryLight,
    primaryLight: primaryLight,
    surface: surfaceDark,
    success: success,
    warning: warning,
    error: error,
    border: borderDark,
    tabBar: surfaceDark,
    tabIconDefault: textSecondary,
    tabIconSelected: primaryLight,
    confidenceBar: '#064E3B', // Varian gelap dari warna sukses
    blurTint: 'rgba(17, 24, 39, 0.85)',
  },
};