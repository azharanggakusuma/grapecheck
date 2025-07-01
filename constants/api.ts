// constants/api.ts

/**
 * Berisi semua konstanta yang berhubungan dengan API dan koneksi ke backend.
 */

// --- Alamat IP Server ---
const IP_ADDRESS = "192.168.114.61"; // Pastikan IP ini sesuai dengan mesin Anda

export const CLASSIFY_URL = `http://${IP_ADDRESS}:5000/classify`;
export const CHAT_URL = `http://${IP_ADDRESS}:5000/chat`;