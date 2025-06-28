// constants/Colors.ts

const primary = '#00880C'; // Hijau Gojek
const primaryLight = '#A3E6A5';
const textLight = '#1D2A32';
const textDark = '#F0F2F5';
const backgroundLight = '#F9FAFB'; // Sedikit abu-abu untuk kontras
const backgroundDark = '#121212';
const surfaceLight = '#FFFFFF';
const surfaceDark = '#1E1E1E';
const success = '#2ECC71';
const warning = '#F39C12';
const error = '#E74C3C';
const borderLight = '#E5E7EB';
const borderDark = '#2C2C2E';
const tabIconDefaultLight = '#8A94A6';
const tabIconDefaultDark = '#6E7A8A';

// --- TAMBAHKAN INI ---
const confidenceBarLight = '#D1FAE5'; // Latar belakang bar untuk tema terang
const confidenceBarDark = '#374151'; // Latar belakang bar untuk tema gelap
// --------------------

export default {
  light: {
    text: textLight,
    background: backgroundLight,
    tint: primary,
    primaryLight: primaryLight,
    surface: surfaceLight,
    success: success,
    warning: warning,
    error: error,
    border: borderLight,
    tabBar: surfaceLight,
    tabIconDefault: tabIconDefaultLight,
    tabIconSelected: primary,
    // --- TAMBAHKAN INI ---
    confidenceBar: confidenceBarLight,
    // --------------------
  },
  dark: {
    text: textDark,
    background: backgroundDark,
    tint: primaryLight,
    primaryLight: primaryLight,
    surface: surfaceDark,
    success: success,
    warning: warning,
    error: error,
    border: borderDark,
    tabBar: surfaceDark,
    tabIconDefault: tabIconDefaultDark,
    tabIconSelected: primaryLight,
    // --- TAMBAHKAN INI ---
    confidenceBar: confidenceBarDark,
    // --------------------
  },
};