// constants/Colors.ts

const primary = '#00AA13'; // Hijau utama (konsisten)
const primaryLight = '#4ADE80'; // Hijau muda vibrant
const text = '#111827'; // Abu gelap untuk teks
const textSecondary = '#6B7280'; // Abu sekunder
const backgroundLight = '#F9FAFB'; // Background terang
const backgroundDark = '#0A0A0A'; // Hitam netral untuk background dark mode
const surfaceLight = '#FFFFFF'; // Putih bersih
const surfaceDark = '#121212'; // Permukaan gelap solid
const success = '#10B981'; // Hijau sukses
const warning = '#F59E0B'; // Kuning peringatan
const error = '#EF4444'; // Merah error
const border = '#E5E7EB'; // Border terang
const borderDark = '#2A2A2A'; // Border gelap netral

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
    text: '#FAFAFA', // Putih terang
    background: backgroundDark, // Lebih gelap dari sebelumnya
    tint: primaryLight,
    primaryLight: primaryLight,
    surface: surfaceDark,
    success: success,
    warning: warning,
    error: error,
    border: borderDark,
    tabBar: surfaceDark,
    tabIconDefault: '#9CA3AF', // Abu terang
    tabIconSelected: primaryLight,
    confidenceBar: '#064E3B',
    blurTint: 'rgba(10, 10, 10, 0.85)', // Matching backgroundDark
  },
};
