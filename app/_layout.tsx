// File: app/_layout.tsx

import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { CustomThemeProvider } from '@/components/ui/ThemeProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GlobalRefreshProvider, useGlobalRefresh } from '@/components/contexts/GlobalRefreshContext';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const { refreshKey } = useGlobalRefresh();
  
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return <RootLayoutNav key={refreshKey} />;
}

function RootLayoutNav() {
  return (
    // Konfigurasi Drawer sebagai layout utama
    <Drawer screenOptions={{
        swipeEnabled: true,
    }}>
      {/* Tampilkan grup (tabs) sebagai satu layar di dalam Drawer */}
      <Drawer.Screen 
          name="(tabs)" 
          options={{ 
              // --- PERUBAHAN PENTING ---
              // Sembunyikan header yang dibuat oleh Drawer untuk grup (tabs)
              headerShown: false, 
              drawerLabel: 'Beranda',
              title: 'GrapeCheck',
          }} 
      />
    </Drawer>
  );
}

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