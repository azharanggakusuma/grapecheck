// constants/Colors.ts

const primary = '#00880C';
const primaryLight = '#A3E6A5';
const textLight = '#1D2A32';
const textDark = '#F0F2F5';
const backgroundLight = '#F9FAFB';
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
const confidenceBarLight = '#D1FAE5';
const confidenceBarDark = '#374151';

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
    confidenceBar: confidenceBarLight,
    blurTint: 'rgba(255, 255, 255, 0.7)',
    // --- TAMBAHAN BARU ---
    cardGradientStart: '#FFFFFF',
    cardGradientEnd: '#F9FAFB',
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
    confidenceBar: confidenceBarDark,
    blurTint: 'rgba(20, 20, 20, 0.7)',
    // --- TAMBAHAN BARU ---
    cardGradientStart: '#1E1E1E',
    cardGradientEnd: '#242424',
    // --------------------
  },
};