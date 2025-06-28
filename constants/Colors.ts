// constants/Colors.ts

const primary = '#2E7D32'; // Warna hijau yang lebih dalam
const primaryLight = '#A5D6A7';
const textLight = '#1C1C1E';
const textDark = '#F2F2F7';
const backgroundLight = '#F0F2F5'; // Latar belakang sedikit lebih abu-abu
const backgroundDark = '#000000'; // Latar belakang hitam pekat
const surfaceLight = '#FFFFFF';
const surfaceDark = '#1C1C1E';
const success = '#34C759';
const warning = '#FF9500';
const error = '#FF3B30';
const borderLight = '#D1D1D6';
const borderDark = '#3A3A3C';
const tabIconDefaultLight = '#8E8E93';
const tabIconDefaultDark = '#8E8E93';

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
    confidenceBar: '#E8F5E9',
    blurTint: 'rgba(249, 249, 249, 0.8)',
    cardGradientStart: surfaceLight,
    cardGradientEnd: backgroundLight,
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
    confidenceBar: '#2C3B2E',
    blurTint: 'rgba(30, 30, 30, 0.8)',
    cardGradientStart: surfaceDark,
    cardGradientEnd: '#2C2C2E',
  },
};