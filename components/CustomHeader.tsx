import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import Colors from '@/constants/Colors';
import { getHeaderTitle } from '@react-navigation/elements';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function CustomHeader(props: any) {
  const { navigation, route, options } = props;
  const { theme, toggleTheme } = useTheme();
  const colors = Colors[theme];
  const { top } = useSafeAreaInsets();
  
  const title = getHeaderTitle(options, route.name);

  const isTransparent = options.headerTransparent === true;
  const headerTintColor = isTransparent ? '#FFFFFF' : colors.text;

  // Cek apakah judul halaman ada atau tidak. Jika tidak, kita akan menampilkan logo.
  const isLogo = !title;
  const displayTitle = title || 'GrapeCheck';

  return (
    <View style={{ 
      backgroundColor: isTransparent ? 'transparent' : colors.background 
    }}>
      <View style={[
        styles.headerContainer,
        {
          paddingTop: top,
          height: 60 + top,
          ...(!isTransparent && {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: theme === 'dark' ? 0.1 : 0.04,
            shadowRadius: 5,
            elevation: 4,
          })
        }
      ]}>
        {/* Kontainer Kiri: Hanya untuk tombol kembali */}
        <View style={styles.sideContainer}>
          {navigation.canGoBack() && (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
              <Feather name="arrow-left" size={24} color={headerTintColor} />
            </TouchableOpacity>
          )}
        </View>

        {/* Kontainer Tengah: Untuk Judul Halaman atau Logo */}
        <View style={styles.centerContainer}>
           <Text 
            style={[
              isLogo ? styles.logoText : styles.titleText, 
              { color: headerTintColor }
            ]}
            numberOfLines={1}
          >
            {displayTitle}
          </Text>
        </View>
        
        {/* Kontainer Kanan: Untuk tombol ganti tema */}
        <View style={[styles.sideContainer, { alignItems: 'flex-end' }]}>
          <TouchableOpacity onPress={toggleTheme} style={styles.button}>
            <Feather name={theme === 'light' ? 'moon' : 'sun'} size={24} color={headerTintColor} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  // --- AWAL PERUBAHAN STYLE ---
  sideContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 2,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoText: {
    fontSize: 22,
    fontWeight: '700',
  },
  // --- AKHIR PERUBAHAN STYLE ---
  button: {
    padding: 5,
  },
});