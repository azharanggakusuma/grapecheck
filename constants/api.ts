// constants/api.ts

/**
 * Berisi semua konstanta yang berhubungan dengan API dan koneksi ke backend.
 */

// --- Alamat IP Server ---
// Ganti dengan alamat IP lokal atau alamat server production Anda
const IP_ADDRESS = "192.168.114.61"; 

// --- URL Endpoint ---
export const API_BASE_URL = `http://${IP_ADDRESS}:5000`;
export const CLASSIFY_URL = `${API_BASE_URL}/classify`;
export const CHAT_URL = `${API_BASE_URL}/chat`;
export const CHAT_RESET_URL = `${API_BASE_URL}/chat/reset`; // URL Baru