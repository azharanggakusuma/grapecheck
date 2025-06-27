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
        {/* Kontainer Kiri: Tombol kembali atau tombol menu */}
        <View style={[styles.sideContainer, { alignItems: 'flex-start' }]}>
          {navigation.canGoBack() ? (
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
              <Feather name="arrow-left" size={24} color={headerTintColor} />
            </TouchableOpacity>
          ) : (
            // --- AWAL PERUBAHAN ---
            // Isi dengan tombol menu untuk menyeimbangkan tampilan
            <TouchableOpacity style={styles.button} onPress={() => { /* Aksi menu bisa ditambahkan di sini nanti */ }}>
              <Feather name="menu" size={24} color={headerTintColor} />
            </TouchableOpacity>
            // --- AKHIR PERUBAHAN ---
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
    paddingHorizontal: 10,
  },
  sideContainer: {
    width: 50,
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
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
  button: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
});