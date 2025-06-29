// constants/Colors.ts

const primary = '#00AA13'; // Hijau utama Gojek
const primaryLight = '#4ADE80'; // Hijau muda vibrant
const text = '#111827'; // Teks gelap (untuk light)
const textSecondary = '#6B7280'; // Abu sekunder
const backgroundLight = '#F9FAFB'; // Light mode
const backgroundDark = '#121212'; // Abu sangat gelap, netral, nyaman di mata
const surfaceLight = '#FFFFFF'; // Putih
const surfaceDark = '#1C1C1E'; // Seperti iOS dark card
const success = '#10B981'; // Hijau sukses
const warning = '#F59E0B'; // Kuning
const error = '#EF4444'; // Merah
const border = '#E5E7EB'; // Light mode
const borderDark = '#2D2D2D'; // Border dark mode lembut

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
    confidenceBar: '#D1FAE5',
    blurTint: 'rgba(249, 250, 251, 0.85)',
  },
  dark: {
    text: '#EDEDED', // Abu terang, nyaman dibaca
    background: backgroundDark, // Abu gelap netral
    tint: primaryLight,
    primaryLight: primaryLight,
    surface: surfaceDark, // Permukaan lebih terang sedikit dari background
    success: success,
    warning: warning,
    error: error,
    border: borderDark,
    tabBar: surfaceDark,
    tabIconDefault: '#A1A1AA', // Abu terang
    tabIconSelected: primaryLight,
    confidenceBar: '#064E3B',
    blurTint: 'rgba(18, 18, 18, 0.85)',
  },
};
