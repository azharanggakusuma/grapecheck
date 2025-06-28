// constants/Colors.ts

const primary = '#00AA13'; // Hijau Gojek
const primaryLight = '#4ADE80'; // Hijau muda (green-400)
const textLight = '#1F2937'; // Abu gelap (gray-800)
const textDark = '#F9FAFB'; // Abu terang (gray-50)
const backgroundLight = '#F3F4F6'; // Abu muda (gray-100)
const backgroundDark = '#111827'; // Abu sangat gelap (gray-900)
const surfaceLight = '#FFFFFF'; // Putih
const surfaceDark = '#1F2937'; // Abu gelap
const success = '#10B981'; // Emerald-500
const warning = '#FACC15'; // Yellow-400
const error = '#EF4444'; // Red-500
const borderLight = '#E5E7EB'; // Abu border
const borderDark = '#374151'; // Abu border gelap
const tabIconDefaultLight = '#9CA3AF'; // Abu icon
const tabIconDefaultDark = '#6B7280'; // Abu icon gelap
const confidenceBarLight = '#D1FAE5'; // Emerald-100
const confidenceBarDark = '#064E3B'; // Emerald-900

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
    blurTint: 'rgba(243, 244, 246, 0.85)',
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
    confidenceBar: confidenceBarDark,
    blurTint: 'rgba(17, 24, 39, 0.85)',
    cardGradientStart: surfaceDark,
    cardGradientEnd: '#1F2937',
  },
};
