import { Drawer } from 'expo-router/drawer';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { CustomThemeProvider } from '@/components/ui/ThemeProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GlobalRefreshProvider, useGlobalRefresh } from '@/components/contexts/GlobalRefreshContext';
import { CustomDrawerContent } from '@/components/layout/CustomDrawerContent';
import { useTheme } from '@/components/ui/ThemeProvider';
import Colors from '@/constants/Colors';

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
  const { theme } = useTheme();
  const colors = Colors[theme];

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        swipeEnabled: true,
        headerTintColor: colors.text, 
      }}
    >
      <Drawer.Screen 
        name="(tabs)" 
        options={{ 
            headerShown: false,
            title: 'GrapeCheck',
        }} 
      />
      <Drawer.Screen
        name="settings"
        options={{
            title: 'Pengaturan',
            headerShown: true, 
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