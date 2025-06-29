import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { CustomThemeProvider } from '@/components/ui/ThemeProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GlobalRefreshProvider, useGlobalRefresh } from '@/components/GlobalRefreshContext';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

function RootLayout() {
  // Gunakan refreshKey untuk me-render ulang komponen ini saat refreshApp dipanggil
  const { refreshKey } = useGlobalRefresh();
  
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  // Tambahkan `key` prop yang akan berubah untuk me-mount ulang komponen
  return <RootLayoutNav key={refreshKey} />;
}

function RootLayoutNav() {
  return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
  );
}

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