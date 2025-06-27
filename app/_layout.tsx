import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { CustomThemeProvider } from '@/components/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// --- AWAL PERUBAHAN ---
import { GlobalRefreshProvider, useGlobalRefresh } from '@/components/GlobalRefreshContext';
// --- AKHIR PERUBAHAN ---

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

function RootLayout() {
  // --- AWAL PERUBAHAN ---
  // Gunakan refreshKey untuk me-render ulang komponen ini saat refreshApp dipanggil
  const { refreshKey } = useGlobalRefresh();
  // --- AKHIR PERUBAHAN ---

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  // --- AWAL PERUBAHAN ---
  // Tambahkan `key` prop yang akan berubah untuk me-mount ulang komponen
  return <RootLayoutNav key={refreshKey} />;
  // --- AKHIR PERUBAHAN ---
}

function RootLayoutNav() {
  return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
  );
}

// --- AWAL PERUBAHAN ---
// Bungkus aplikasi dengan semua provider yang diperlukan
export default function AppWrapper() {
  return (
    <SafeAreaProvider>
      <CustomThemeProvider>
        <GlobalRefreshProvider>
          <RootLayout />
        </GlobalRefreshProvider>
      </CustomThemeProvider>
    </SafeAreaProvider>
  );
}
// --- AKHIR PERUBAHAN ---