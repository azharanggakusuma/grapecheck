const primaryAccent = '#8A2BE2'; // Biru Ungu yang lebih cerah
const textLight = '#121212'; // Hitam yang lebih lembut
const textDark = '#E5E5E5'; // Putih yang tidak terlalu silau
const backgroundLight = '#F7F7F7';
const backgroundDark = '#121212';
const tabIconDefaultLight = '#A9A9A9';
const tabIconDefaultDark = '#777';

export default {
  light: {
    text: textLight,
    background: backgroundLight,
    tint: primaryAccent,
    tabBar: '#FFFFFF', // Latar belakang TabBar putih solid
    tabIconDefault: tabIconDefaultLight,
    tabIconSelected: primaryAccent,
  },
  dark: {
    text: textDark,
    background: backgroundDark,
    tint: '#FFFFFF', // Tint putih untuk mode gelap
    tabBar: '#1C1C1E', // Latar belakang TabBar gelap
    tabIconDefault: tabIconDefaultDark,
    tabIconSelected: '#FFFFFF', // Ikon terpilih putih
  },
};