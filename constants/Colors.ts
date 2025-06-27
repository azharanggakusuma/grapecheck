// Warna utama untuk aksen, bisa tetap ungu anggur atau warna lain yang lebih netral
const primaryAccent = '#6a3d9a'; 
const softGray = '#f0f0f0'; // Latar belakang yang sangat terang
const mediumGray = '#8e8e93';
const darkGray = '#3a3a3c';

export default {
  light: {
    text: '#000',
    background: '#f9f9f9', // Latar belakang yang sangat bersih
    tint: primaryAccent,
    tabBar: 'transparent', // Tab bar transparan
    tabIconDefault: mediumGray,
    tabIconSelected: primaryAccent,
  },
  dark: {
    text: '#fff',
    background: '#000', // Latar belakang hitam pekat untuk kontras maksimal
    tint: '#fff',
    tabBar: 'transparent', // Tab bar transparan
    tabIconDefault: '#777',
    tabIconSelected: '#fff',
  },
};