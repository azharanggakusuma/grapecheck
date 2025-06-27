const primaryAccent = '#6a3d9a';
const textLight = '#000';
const textDark = '#fff';
const backgroundLight = '#f9f9f9';
const backgroundDark = '#000';
const tabIconDefaultLight = '#8e8e93';
const tabIconDefaultDark = '#777';

export default {
  light: {
    text: textLight,
    background: backgroundLight,
    tint: primaryAccent,
    tabBar: 'transparent',
    tabIconDefault: tabIconDefaultLight,
    tabIconSelected: primaryAccent,
  },
  dark: {
    text: textDark,
    background: backgroundDark,
    tint: textDark,
    tabBar: 'transparent',
    tabIconDefault: tabIconDefaultDark,
    tabIconSelected: textDark,
  },
};