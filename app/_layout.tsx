import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { CustomThemeProvider } from '@/components/ThemeContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

SplashScreen.preventAutoHideAsync();

function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
  );
}

// Bungkus aplikasi dengan SafeAreaProvider dan provider tema kustom
export default function AppWrapper() {
  return (
    <SafeAreaProvider>
      <CustomThemeProvider>
        <RootLayout />
      </CustomThemeProvider>
    </SafeAreaProvider>
  );
}