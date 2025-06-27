const primary = '#00880C'; // Warna hijau Gojek
const primaryLight = '#A3E6A5';
const textLight = '#1D2A32';
const textDark = '#F0F2F5';
const backgroundLight = '#FFFFFF';
const backgroundDark = '#121212';
const surfaceLight = '#FFFFFF';
const surfaceDark = '#1E1E1E';
const success = '#00880C';
const tabIconDefaultLight = '#8A94A6';
const tabIconDefaultDark = '#6E7A8A';

export default {
  light: {
    text: textLight,
    background: backgroundLight,
    tint: primary,
    primaryLight: primaryLight,
    surface: surfaceLight,
    success: success,
    tabBar: surfaceLight,
    tabIconDefault: tabIconDefaultLight,
    tabIconSelected: primary,
  },
  dark: {
    text: textDark,
    background: backgroundDark,
    tint: primaryLight,
    primaryLight: primaryLight,
    surface: surfaceDark,
    success: success,
    tabBar: surfaceDark,
    tabIconDefault: tabIconDefaultDark,
    tabIconSelected: primaryLight,
  },
};