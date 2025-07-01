// constants/Colors.ts

const primary = '#42B549'; // Hijau utama, untuk tombol utama & highlight
const primaryLight = '#00AA13'; // Hijau muda, bisa digunakan untuk ikon aktif, efek visual, dsb.
const text = '#31353B'; // (Untuk light mode) Abu gelap netral, cocok untuk teks utama
const textSecondary = '#6C727C'; // (Untuk light mode) Abu sekunder, cocok untuk subtitle/deskripsi
const backgroundLight = '#F6F7F9'; // (Untuk light mode) Warna background terang utama

// === DARK MODE START ===
const backgroundDark = '#121212'; // Warna latar belakang utama di mode gelap
const surfaceDark = '#1C1C1E';     // Warna permukaan/kartu/kontainer
const textDark = '#EDEDED';       // Warna teks utama di mode gelap
const tabIconDefaultDark = '#A1A1AA'; // Ikon tab default (abu lembut)
const borderDark = '#2D2D2D';     // Warna border/pemisah halus untuk mode gelap
const blurTintDark = 'rgba(18, 18, 18, 0.85)'; // Efek blur
// === DARK MODE END ===

const surfaceLight = '#FFFFFF'; // (Untuk light mode) Kartu, permukaan terang
const success = '#10B981'; // Hijau sukses
const warning = '#F59E0B'; // Kuning peringatan
const error = '#D91F26'; // Merah untuk error
const border = '#E5E7E9'; // (Untuk light mode) Border terang

export default {
  light: {
    text: text, //
    background: backgroundLight, //
    tint: primary, //
    primaryLight: primaryLight, //
    surface: surfaceLight, //
    success: success, //
    warning: warning, //
    error: error, //
    info: textSecondary, 
    border: border, //
    tabBar: surfaceLight, //
    tabIconDefault: textSecondary, //
    tabIconSelected: primary, //
    confidenceBar: '#D1FAE5', //
    blurTint: 'rgba(249, 250, 251, 0.85)', //
  },
  dark: {
    text: textDark, //
    background: backgroundDark, //
    tint: primaryLight, //
    primaryLight: primaryLight, //
    surface: surfaceDark, //
    success: success, //
    warning: warning, //
    error: error, //
    info: tabIconDefaultDark, 
    border: borderDark, //
    tabBar: surfaceDark, //
    tabIconDefault: tabIconDefaultDark, //
    tabIconSelected: primaryLight, //
    confidenceBar: '#064E3B', //
    blurTint: blurTintDark, //
  },
};