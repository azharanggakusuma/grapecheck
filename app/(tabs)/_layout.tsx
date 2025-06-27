import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import { Feather } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';
import { CustomHeader } from '@/components/CustomHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- KUNCI PERUBAHAN: Desain Ulang TabBarIcon ---
// Menggunakan latar belakang berbentuk pil untuk tab yang aktif
function TabBarIcon({ name, color, focused }: {
  name: React.ComponentProps<typeof Feather>['name'];
  color: string;
  focused: boolean;
}) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.iconContainer, focused && { backgroundColor: colors.primaryLight + '33' }]}>
      <Feather size={24} name={name} color={color} />
    </View>
  );
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();

  const getIconName = (routeName: string): React.ComponentProps<typeof Feather>['name'] => {
    switch (routeName) {
      case 'index': return 'home';
      case 'check': return 'camera';
      case 'history': return 'clock';
      case 'notifications': return 'bell';
      case 'profile': return 'user';
      default: return 'home';
    }
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        // Menggunakan header kustom
        header: (props) => <CustomHeader {...props} />,
        
        // --- KUNCI PERUBAHAN: Header yang Lebih Bersih ---
        // Menghilangkan bayangan dan garis bawah dari header
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },

        tabBarActiveTintColor: colors.tabIconSelected,
        tabBarInactiveTintColor: colors.tabIconDefault,
        
        // --- KUNCI PERUBAHAN: Tab Bar yang Lebih Bersih ---
        // Menghilangkan garis atas dan menyesuaikan tinggi
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 0,
          elevation: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
        },
        tabBarShowLabel: false,
        tabBarIcon: ({ color, focused }) => (
          <TabBarIcon name={getIconName(route.name)} color={color} focused={focused} />
        ),
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Beranda' }} /> 
      <Tabs.Screen name="check" options={{ title: 'Klasifikasi' }} />
      <Tabs.Screen name="history" options={{ title: 'Riwayat' }} />
      <Tabs.Screen name="notifications" options={{ title: 'Notifikasi' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  // --- KUNCI PERUBAHAN: Gaya untuk ikon berbentuk pil ---
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 38,
    borderRadius: 30, // Membuat bentuk pil
  },
  // Gaya untuk indikator garis bawah dihapus karena tidak lagi digunakan
});