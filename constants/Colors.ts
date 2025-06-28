// constants/Colors.ts

const primary = '#10B981'; // Emerald 500
const primaryLight = '#6EE7B7'; // Emerald 300
const textLight = '#1F2937'; // Gray 800
const textDark = '#F9FAFB'; // Gray 50
const backgroundLight = '#F9FAFB'; // Gray 50
const backgroundDark = '#111827'; // Gray 900
const surfaceLight = '#FFFFFF';
const surfaceDark = '#1F2937'; // Gray 800
const success = '#22C55E'; // Green 500
const warning = '#F59E0B'; // Amber 500
const error = '#EF4444'; // Red 500
const borderLight = '#E5E7EB'; // Gray 200
const borderDark = '#374151'; // Gray 700
const tabIconDefaultLight = '#6B7280'; // Gray 500
const tabIconDefaultDark = '#9CA3AF'; // Gray 400
const confidenceBarLight = '#D1FAE5'; // Green 100
const confidenceBarDark = '#374151'; // Gray 700

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
    cardGradientStart: '#FFFFFF',
    cardGradientEnd: '#F9FAFB',
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
    cardGradientStart: '#374151', // Gray 700
    cardGradientEnd: '#1F2937',   // Gray 800
  },
};