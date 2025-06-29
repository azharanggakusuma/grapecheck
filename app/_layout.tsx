import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { CustomThemeProvider } from '@/components/ui/ThemeProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GlobalRefreshProvider, useGlobalRefresh } from '@/components/contexts/GlobalRefreshContext';
// --- PERUBAHAN: Impor komponen drawer kustom ---
import { CustomDrawerContent } from '@/components/layout/CustomDrawerContent';

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
    <Drawer
      // --- PERUBAHAN: Gunakan komponen kustom untuk merender konten drawer ---
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        swipeEnabled: true,
      }}
    >
      <Drawer.Screen 
        name="(tabs)" 
        options={{ 
            headerShown: false,
            drawerLabel: 'Beranda',
            title: 'GrapeCheck',
        }} 
      />
      {/* --- PERUBAHAN: Tambahkan halaman baru ke drawer --- */}
      <Drawer.Screen
        name="settings"
        options={{
            drawerLabel: 'Pengaturan',
            title: 'Pengaturan',
            headerShown: true, // Halaman ini akan punya header sendiri
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