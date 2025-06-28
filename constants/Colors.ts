// constants/Colors.ts

const primary = '#2E7D32';
const primaryLight = '#A5D6A7';
const textLight = '#1C1C1E';
const textDark = '#F2F2F7';
const backgroundLight = '#F9FAFB';
const backgroundDark = '#111827';
const surfaceLight = '#FFFFFF';
const surfaceDark = '#1F2937';
const success = '#22C55E';
const warning = '#F59E0B';
;const error = '#EF4444';
const borderLight = '#E5E7EB';
const borderDark = '#374151';
const tabIconDefaultLight = '#8E8E93';
const tabIconDefaultDark = '#8E8E93';
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
    confidenceBar: confidenceBarDark,
    blurTint: 'rgba(30, 30, 30, 0.8)',
    cardGradientStart: surfaceDark,
    cardGradientEnd: '#2C2C2E',
  },
};