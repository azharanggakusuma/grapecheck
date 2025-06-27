// constants/Colors.ts

const primary = '#6C63FF'; // Ungu yang lebih lembut dan modern
const primaryLight = '#A3A0FF';
const textLight = '#1D2A32';
const textDark = '#F0F2F5';
const backgroundLight = '#F4F7F9'; // Putih keabuan yang tidak silau
const backgroundDark = '#121212';
const surfaceLight = '#FFFFFF'; // Warna untuk card/komponen di atas background
const surfaceDark = '#1E1E1E';
const success = '#28A745'; // Warna hijau untuk status sehat
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